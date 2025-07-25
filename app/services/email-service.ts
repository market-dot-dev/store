"use server";

import * as EmailTemplates from "@/app/components/email/templates";
import { Prospect, User } from "@/app/generated/prisma";
import { getRootUrl } from "@/lib/domain";
import sgMail from "@sendgrid/mail";
import { getUserById } from "./user-service";

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

type RequiredUserProps = {
  name: User["name"];
  email: User["email"];
} & Partial<User>;

type RequiredProspectProps = {
  name: Prospect["name"];
  email: Prospect["email"];
};

const appURLWithProtocol = getRootUrl("app");

/**
 * Send an email with the provided details
 *
 * @param email - Recipient's email address
 * @param subject - Email subject
 * @param text - Plain text content
 * @param html - HTML content
 */
async function sendEmail(email: string | null, subject: string, text: string, html: string) {
  // console.log('sending email', email, subject, html);
  if (!email) {
    console.error("Invalid email address");
    return;
  }
  const msg = {
    to: email, // recipient
    from: {
      name: process.env.SENDGRID_FROM_NAME, // verified sender
      email: process.env.SENDGRID_FROM_EMAIL // verified sender
    },
    subject: subject,
    text: text,
    html: html
  } as any;

  try {
    await sgMail.send(msg);
    console.log(`Email sent to ${email}`);
  } catch (error: any) {
    console.error(error);

    if (error.response) {
      console.error(error.response.body);
    }
  }
}

/**
 * Send subscription notification to tier owner
 *
 * @param userId - ID of the tier owner
 * @param customer - Customer who subscribed
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfNewSubscription(
  userId: string,
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = `You have a new customer for ${tierName}!`;
  const html = EmailTemplates.createNewSubscriptionEmail(customer.name || "", tierName);
  const text = `Congratulations! ${customer.name} has purchased your ${tierName} tier.`;
  const user = await getUserById(userId);

  if (!user) {
    console.error(`User not found with id: ${userId}`);
    return;
  }

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send purchase notification to tier owner
 *
 * @param userId - ID of the tier owner
 * @param customer - Customer who made the purchase
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfNewPurchase(
  userId: string,
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = `You have a new customer for ${tierName}!`;
  const html = EmailTemplates.createNewPurchaseEmail(customer.name || "", tierName);
  const text = `Congratulations! ${customer.name} has purchased your ${tierName} package.`;
  const user = await getUserById(userId);

  if (!user) {
    console.error(`User not found with id: ${userId}`);
    return;
  }

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send subscription confirmation to customer
 *
 * @param customer - Customer who subscribed
 * @param tierName - Name of the tier
 */
export async function confirmCustomerSubscription(customer: RequiredUserProps, tierName: string) {
  const subject = `Thank you for purchasing ${tierName}!`;
  const html = EmailTemplates.createSubscriptionConfirmationEmail(tierName);
  const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier. Please visit your dashboard at ${appURLWithProtocol} to manage your subscription & benefits.`;

  try {
    await sendEmail(customer.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send purchase confirmation to customer
 *
 * @param customer - Customer who made the purchase
 * @param tierName - Name of the tier
 */
export async function confirmCustomerPurchase(customer: RequiredUserProps, tierName: string) {
  const subject = `Thank you for purchasing ${tierName}!`;
  const html = EmailTemplates.createPurchaseConfirmationEmail(tierName);
  const text = `Thank you for purchasing the ${tierName} tier. You now have access to all the benefits of this tier.`;

  try {
    await sendEmail(customer.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send subscription cancellation notification to tier owner
 *
 * @param user - Tier owner
 * @param customer - Customer who cancelled
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfSubscriptionCancellation(
  user: RequiredUserProps,
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = `Subscription Cancelled by ${customer.name}`;
  const html = EmailTemplates.createSubscriptionCancelledEmail(customer.name || "", tierName);
  const text = `${customer.name} has cancelled their subscription to your ${tierName} tier.`;

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send subscription cancellation confirmation to customer
 *
 * @param customer - Customer who cancelled
 * @param tierName - Name of the tier
 */
export async function confirmCustomerSubscriptionCancellation(
  customer: RequiredUserProps,
  tierName: string
) {
  const subject = "Subscription Cancelled";
  const html = EmailTemplates.createSubscriptionCancelledConfirmationEmail(tierName);
  const text = `You have cancelled your subscription to the ${tierName} tier.`;

  try {
    await sendEmail(customer.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send new prospect notification to tier owner
 *
 * @param user - Tier owner
 * @param prospect - Prospect who expressed interest
 * @param tierName - Name of the tier
 */
export async function notifyOwnerOfNewProspect(
  user: RequiredUserProps,
  prospect: RequiredProspectProps,
  tierName: string
): Promise<void> {
  const subject = `A new prospect is interested in ${tierName}!`;
  const html = EmailTemplates.createNewProspectEmail(prospect.name || "", prospect.email, tierName);
  const text = `Congratulations! ${prospect.name} has expressed interest in your ${tierName} tier.`;

  try {
    await sendEmail(user.email, subject, text, html);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

/**
 * Send welcome email to new maintainer
 *
 * @param user - New maintainer
 */
export async function sendWelcomeEmailToMaintainer(user: RequiredUserProps): Promise<void> {
  const subject = `Welcome to market.dev!`;
  const html = EmailTemplates.createWelcomeEmail(user.name || "");
  const text = `Hello ${user.name},\n\nThank you for registering with market.dev!`;

  await sendEmail(user.email, subject, text, html);
}

/**
 * Send welcome email to new customer
 *
 * @param user - New customer
 */
export async function sendWelcomeEmailToCustomer(user: RequiredUserProps): Promise<void> {
  const subject = `Welcome to market.dev!`;
  const html = EmailTemplates.createNewCustomerSignUpEmail(user.name || "");
  const text = `Hello ${user.name},\n\nThank you for registering with market.dev!`;

  await sendEmail(user.email, subject, text, html);
}

/**
 * Send verification email with login token
 *
 * @param email - Recipient email
 * @param token - Verification token
 * @param domain - Domain for the verification
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  domain: string
): Promise<void> {
  const subject = `Verification code`;
  const html = EmailTemplates.createVerificationEmail(token, domain);
  const text = `Your verification code for signing in to ${domain} is ${token}`;

  await sendEmail(email, subject, text, html);
}

/**
 * Send team invitation email
 *
 * @param email - Recipient's email address
 * @param organizationName - Name of the organization they're being invited to
 * @param inviterName - Name of the person who sent the invitation
 * @param inviteId - Invitation ID for the join link
 */
export async function sendTeamInvitationEmail(
  email: string,
  organizationName: string,
  inviterName: string,
  inviteId: string
): Promise<void> {
  const joinUrl = `${appURLWithProtocol}/join/${inviteId}`;
  const subject = `You've been invited to join ${organizationName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>You've been invited to join ${organizationName}</h2>
      <p>Hi there,</p>
      <p>${inviterName} has invited you to join the <strong>${organizationName}</strong> organization on Market.dev.</p>
      <p>Click the button below to accept the invitation:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${joinUrl}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Accept Invitation
        </a>
      </div>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all; color: #666;">${joinUrl}</p>
      <p style="margin-top: 30px; color: #666; font-size: 14px;">
        This invitation will expire in 7 days. If you weren't expecting this invitation, you can safely ignore this email.
      </p>
    </div>
  `;

  const text = `
    You've been invited to join ${organizationName}
    
    ${inviterName} has invited you to join the ${organizationName} organization on Market.dev.
    
    Accept the invitation by visiting: ${joinUrl}
    
    This invitation will expire in 7 days.
  `;

  await sendEmail(email, subject, text, html);
}
