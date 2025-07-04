"use server";

import { IntegrationType, Prisma } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { GitHubAccountInfo } from "@/types/integration";
import { App } from "@octokit/app";
import { linkGithubUserToOrganization } from "../market-service";
import { requireOrganization, requireUser } from "../user-context-service";

// GitHub App configuration
const APP_ID = process.env.GITHUB_APP_ID;
const PRIVATE_KEY = process.env.GITHUB_APP_PRIVATE_KEY;
const CLIENT_ID = process.env.GITHUB_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_APP_CLIENT_SECRET;

/**
 * Create GitHub App instance
 */
function createGitHubApp(): App {
  if (!APP_ID || !PRIVATE_KEY) {
    throw new Error("GitHub App ID and Private Key must be configured");
  }

  // Handle escaped newlines from environment variables if present
  const formattedPrivateKey = PRIVATE_KEY.includes("\\n")
    ? PRIVATE_KEY.replace(/\\n/g, "\n")
    : PRIVATE_KEY;

  return new App({
    appId: APP_ID,
    privateKey: formattedPrivateKey
  });
}

/**
 * Create authenticated Octokit instance for a specific installation
 */
async function createInstallationOctokit(installationId: string) {
  const app = createGitHubApp();
  return await app.getInstallationOctokit(parseInt(installationId, 10));
}

/**
 * Check if organization has a GitHub integration
 */
export async function hasGitHubIntegration(organizationId?: string): Promise<boolean> {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  const integration = await prisma.integration.findUnique({
    where: {
      organizationId_type: {
        organizationId: org.id,
        type: IntegrationType.GITHUB_APP
      }
    }
  });

  return !!integration && integration.active;
}

/**
 * Get GitHub integration for organization
 */
export async function getGitHubIntegration(organizationId?: string) {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  return prisma.integration.findUnique({
    where: {
      organizationId_type: {
        organizationId: org.id,
        type: IntegrationType.GITHUB_APP
      }
    },
    include: {
      installedByUser: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });
}

/**
 * Add GitHub App integration
 */
export async function addGitHubIntegration(
  installationId: string,
  permissions: Record<string, string>,
  repositories?: any[],
  accountInfo?: GitHubAccountInfo
): Promise<void> {
  const org = await requireOrganization();
  const user = await requireUser();

  await prisma.integration.upsert({
    where: {
      organizationId_type: {
        organizationId: org.id,
        type: IntegrationType.GITHUB_APP
      }
    },
    create: {
      organizationId: org.id,
      type: IntegrationType.GITHUB_APP,
      installationId,
      permissions,
      repositories: repositories || [],
      accountInfo: serializeAccountInfo(accountInfo),
      installedBy: user.id,
      active: true
    },
    update: {
      installationId,
      permissions,
      repositories: repositories || [],
      accountInfo: serializeAccountInfo(accountInfo),
      lastSyncedAt: new Date(),
      active: true
    }
  });
}

/**
 * Remove GitHub integration
 */
export async function removeGitHubIntegration(organizationId?: string): Promise<void> {
  const org = organizationId ? { id: organizationId } : await requireOrganization();

  await prisma.integration.deleteMany({
    where: {
      organizationId: org.id,
      type: IntegrationType.GITHUB_APP
    }
  });
}

/**
 * Validate GitHub integration by checking installation status with GitHub API
 */
export async function validateGitHubIntegration(organizationId?: string): Promise<{
  isValid: boolean;
  error?: string;
  installationData?: any;
}> {
  try {
    const integration = await getGitHubIntegration(organizationId);

    if (!integration) {
      return { isValid: false, error: "No GitHub integration found" };
    }

    if (!integration.active) {
      return { isValid: false, error: "GitHub integration is inactive" };
    }

    // If GitHub App is not configured, do basic validation
    if (!isGitHubAppConfigured()) {
      console.warn("GitHub App not configured - using basic validation");
      return { isValid: true };
    }

    // Create installation Octokit and test the connection
    const octokit = await createInstallationOctokit(integration.installationId);

    // Test the installation by getting installation info
    const { data: installation } = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: parseInt(integration.installationId, 10)
      }
    );

    // Update last synced time
    await prisma.integration.update({
      where: { id: integration.id },
      data: { lastSyncedAt: new Date() }
    });

    return {
      isValid: true,
      installationData: {
        id: installation.id,
        account: installation.account,
        permissions: installation.permissions,
        repositorySelection: installation.repository_selection
      }
    };
  } catch (error: any) {
    console.error("Error validating GitHub integration:", error);

    // If the installation was deleted/suspended, mark as inactive
    if (error.status === 404) {
      const integration = await getGitHubIntegration(organizationId);
      if (integration) {
        await prisma.integration.update({
          where: { id: integration.id },
          data: { active: false }
        });
      }
      return { isValid: false, error: "GitHub App installation not found or was removed" };
    }

    return {
      isValid: false,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}

/**
 * Get GitHub installation info from GitHub API
 */
export async function getGitHubInstallationInfo(organizationId?: string) {
  try {
    if (!isGitHubAppConfigured()) {
      throw new Error("GitHub App not configured");
    }

    const integration = await getGitHubIntegration(organizationId);
    if (!integration) {
      return null;
    }

    const octokit = await createInstallationOctokit(integration.installationId);

    // Get installation details
    const { data: installation } = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: parseInt(integration.installationId, 10)
      }
    );

    // Get accessible repositories
    const { data: repositories } = await octokit.request("GET /installation/repositories", {
      per_page: 100
    });

    return {
      installation: {
        id: installation.id,
        account: installation.account,
        permissions: installation.permissions,
        repositorySelection: installation.repository_selection,
        createdAt: installation.created_at,
        updatedAt: installation.updated_at
      },
      repositories: repositories.repositories,
      integration
    };
  } catch (error) {
    console.error("Error getting GitHub installation info:", error);
    return null;
  }
}

/**
 * Sync GitHub integration data with latest from GitHub API
 */
export async function syncGitHubIntegration(organizationId?: string): Promise<boolean> {
  try {
    if (!isGitHubAppConfigured()) {
      console.warn("GitHub App not configured - cannot sync");
      return false;
    }

    const info = await getGitHubInstallationInfo(organizationId);
    if (!info) {
      return false;
    }

    // Extract account info from installation
    const accountInfo = extractAccountInfo(info.installation.account);

    // Update stored integration data including account info
    await prisma.integration.update({
      where: { id: info.integration.id },
      data: {
        permissions: info.installation.permissions,
        repositories: info.repositories,
        accountInfo: serializeAccountInfo(accountInfo),
        lastSyncedAt: new Date(),
        active: true
      }
    });

    return true;
  } catch (error) {
    console.error("Error syncing GitHub integration:", error);
    return false;
  }
}

/**
 * Get GitHub account info for the installation
 */
export async function getGitHubAccountInfo(
  organizationId?: string
): Promise<GitHubAccountInfo | null> {
  try {
    const info = await getGitHubInstallationInfo(organizationId);
    if (!info) {
      return null;
    }

    const account = info.installation.account;
    if (!account) {
      console.warn("No account data in GitHub installation");
      return null;
    }

    return extractAccountInfo(account);
  } catch (error) {
    console.error("Error getting GitHub account info:", error);
    return null;
  }
}

/**
 * Get cached GitHub account info from database
 */
export async function getCachedGitHubAccountInfo(
  organizationId?: string
): Promise<GitHubAccountInfo | null> {
  try {
    const integration = await getGitHubIntegration(organizationId);
    if (!integration?.accountInfo) {
      return null;
    }

    // Use helper function to properly deserialize
    return deserializeAccountInfo(integration.accountInfo);
  } catch (error) {
    console.error("Error getting cached GitHub account info:", error);
    return null;
  }
}

/**
 * Generate GitHub App installation URL
 */
export async function getGitHubInstallationUrl(state?: string): Promise<string> {
  const appSlug = process.env.GITHUB_APP_SLUG || "your-github-app";
  const baseUrl = `https://github.com/apps/${appSlug}/installations/new`;

  if (state) {
    return `${baseUrl}?state=${encodeURIComponent(state)}`;
  }

  return baseUrl;
}

/**
 * Process GitHub App installation callback
 * Called when user completes GitHub App installation and is redirected back
 */
export async function processGitHubInstallationCallback(
  installationId: string,
  state?: string
): Promise<void> {
  if (!installationId) {
    throw new Error("Installation ID is required");
  }

  const org = await requireOrganization();
  const user = await requireUser();

  try {
    // If GitHub App is not configured, we can't fetch installation details
    // but we can still store the basic integration
    if (!isGitHubAppConfigured()) {
      console.warn("GitHub App not configured - storing basic integration only");
      await addGitHubIntegration(installationId, {}, []);
      return;
    }

    // Get installation details from GitHub API
    const octokit = await createInstallationOctokit(installationId);
    const { data: installation } = await octokit.request(
      "GET /app/installations/{installation_id}",
      {
        installation_id: parseInt(installationId, 10)
      }
    );

    // Get accessible repositories
    const { data: repositories } = await octokit.request("GET /installation/repositories", {
      per_page: 100
    });

    // Extract account info from installation
    const accountInfo = extractAccountInfo(installation.account);

    // Store the integration with full details including account info
    await addGitHubIntegration(
      installationId,
      installation.permissions || {},
      repositories.repositories || [],
      accountInfo
    );

    // Link the GitHub account to the organization via the external API
    if (accountInfo.id && accountInfo.type) {
      try {
        const linkingSuccess = await linkGithubUserToOrganization(
          accountInfo.id,
          accountInfo.type as "User" | "Organization"
        );

        if (linkingSuccess) {
          console.log(
            `Successfully linked GitHub ${accountInfo.type} ${accountInfo.login} to organization ${org.id}`
          );
        } else {
          console.warn(
            `Failed to link GitHub ${accountInfo.type} ${accountInfo.login} to organization ${org.id} via external API`
          );
        }
      } catch (error) {
        console.error(`Error linking GitHub account to external API:`, error);
        // Don't throw - the GitHub integration should still work even if external linking fails
      }
    } else {
      console.warn("Missing GitHub account ID or type - skipping external API linking");
    }

    console.log(`GitHub App installation processed successfully for org ${org.id}`);
  } catch (error) {
    console.error("Error processing GitHub installation callback:", error);

    // Still try to store basic integration even if API calls fail
    try {
      await addGitHubIntegration(installationId, {}, []);
      console.log("Stored basic GitHub integration despite API errors");
    } catch (fallbackError) {
      console.error("Failed to store even basic integration:", fallbackError);
      throw new Error("Failed to process GitHub installation");
    }
  }
}

/**
 * Handle GitHub App installation webhook
 */
export async function handleGitHubWebhook(
  action: string,
  installation: any,
  organizationId: string
): Promise<{ success: boolean; error?: string }> {
  console.log(`GitHub webhook received: ${action} for org ${organizationId}`);

  try {
    switch (action) {
      case "created":
        try {
          // Extract account info if available from webhook data
          const accountInfo = extractAccountInfo(installation.account);

          await addGitHubIntegration(
            installation.id.toString(),
            installation.permissions || {},
            installation.repositories || [],
            accountInfo
          );

          // Link to external API if we have account info
          if (accountInfo?.id && accountInfo?.type) {
            try {
              const linkingSuccess = await linkGithubUserToOrganization(
                accountInfo.id,
                accountInfo.type as "User" | "Organization"
              );

              if (linkingSuccess) {
                console.log(
                  `Successfully linked GitHub ${accountInfo.type} ${accountInfo.login} to organization ${organizationId} via webhook`
                );
              } else {
                console.warn(
                  `Failed to link GitHub ${accountInfo.type} ${accountInfo.login} to organization ${organizationId} via external API (webhook)`
                );
              }
            } catch (error) {
              console.error(`Error linking GitHub account to external API via webhook:`, error);
              // Don't throw - the GitHub integration should still work
            }
          }

          console.log(`GitHub App installed for org ${organizationId}`);
        } catch (error) {
          console.error(`Failed to add GitHub integration for org ${organizationId}:`, error);
          throw error;
        }
        break;

      case "deleted":
        try {
          await removeGitHubIntegration(organizationId);
          console.log(`GitHub App uninstalled for org ${organizationId}`);
        } catch (error) {
          console.error(`Failed to remove GitHub integration for org ${organizationId}:`, error);
          throw error;
        }
        break;

      case "suspend":
        try {
          const integration = await getGitHubIntegration(organizationId);
          if (integration) {
            await prisma.integration.update({
              where: { id: integration.id },
              data: { active: false }
            });
            console.log(`GitHub App suspended for org ${organizationId}`);
          }
        } catch (error) {
          console.error(`Failed to suspend GitHub integration for org ${organizationId}:`, error);
          throw error;
        }
        break;

      case "unsuspend":
        try {
          const activeIntegration = await getGitHubIntegration(organizationId);
          if (activeIntegration) {
            await prisma.integration.update({
              where: { id: activeIntegration.id },
              data: { active: true }
            });
            console.log(`GitHub App unsuspended for org ${organizationId}`);
          }
        } catch (error) {
          console.error(`Failed to unsuspend GitHub integration for org ${organizationId}:`, error);
          throw error;
        }
        break;

      case "repositories_added":
      case "repositories_removed":
        try {
          // Sync the integration to update repository list
          const synced = await syncGitHubIntegration(organizationId);
          if (synced) {
            console.log(`GitHub App repositories synced for org ${organizationId}`);
          } else {
            console.warn(`Failed to sync repositories for org ${organizationId}`);
          }
        } catch (error) {
          console.error(`Failed to sync GitHub repositories for org ${organizationId}:`, error);
          throw error;
        }
        break;

      default:
        console.log(`Unhandled GitHub webhook action: ${action}`);
        // Don't throw for unknown actions
        break;
    }

    return { success: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
    console.error(`GitHub webhook handler failed for ${action}:`, error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Check if environment is properly configured for GitHub App
 */
export async function isGitHubAppConfigured(): Promise<boolean> {
  return !!(APP_ID && PRIVATE_KEY && CLIENT_ID && CLIENT_SECRET);
}

/**
 * Get configuration status for debugging
 */
export async function getGitHubAppConfigStatus() {
  return {
    hasAppId: !!APP_ID,
    hasPrivateKey: !!PRIVATE_KEY,
    hasClientId: !!CLIENT_ID,
    hasClientSecret: !!CLIENT_SECRET,
    isFullyConfigured: isGitHubAppConfigured()
  };
}

/**
 * Helper function to safely extract account info from GitHub installation data
 * Handles both user and organization account types
 */
function extractAccountInfo(account: any): GitHubAccountInfo {
  if (!account) {
    return {
      login: null,
      id: null,
      type: null,
      avatarUrl: null,
      htmlUrl: null
    };
  }

  // For organizations, GitHub uses 'name' instead of 'login'
  // For users, GitHub uses 'login'
  const login = account.login || account.name || null;

  // Determine account type - GitHub returns 'User' or 'Organization'
  const type = account.type || (account.slug ? "Organization" : "User");

  return {
    login,
    id: account.id || null,
    type,
    avatarUrl: account.avatar_url || null,
    htmlUrl: account.html_url || null
  };
}

/**
 * Helper function to serialize account info for Prisma JSON field
 */
function serializeAccountInfo(
  accountInfo: GitHubAccountInfo | null | undefined
): Prisma.InputJsonValue | undefined {
  if (!accountInfo) {
    return undefined;
  }

  // Ensure all values are properly serializable
  return {
    login: accountInfo.login,
    id: accountInfo.id,
    type: accountInfo.type,
    avatarUrl: accountInfo.avatarUrl,
    htmlUrl: accountInfo.htmlUrl
  } as Prisma.InputJsonValue;
}

/**
 * Helper function to deserialize account info from Prisma JSON field
 */
function deserializeAccountInfo(accountInfo: Prisma.JsonValue | null): GitHubAccountInfo | null {
  if (!accountInfo || accountInfo === null) {
    return null;
  }

  // Type guard and cast
  if (typeof accountInfo === "object" && accountInfo !== null) {
    const info = accountInfo as any;
    return {
      login: info.login || null,
      id: info.id || null,
      type: info.type || null,
      avatarUrl: info.avatarUrl || null,
      htmlUrl: info.htmlUrl || null
    };
  }

  return null;
}
