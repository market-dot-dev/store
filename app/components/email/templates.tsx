import { getRootUrl } from "@/lib/domain";
import { BaseEmailTemplate } from "./base-template";

// Helper to get URLs
const appUrl = getRootUrl();

export const createNewSubscriptionEmail = (customerName: string, tierName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Congratulations! <b>${customerName}</b> has purchased your <b>${tierName}</b> tier.
    </p>
    <a
      href="${appUrl}"
      style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#000000;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px"
      target="_blank"
    >
      View Dashboard
    </a>
  `;

  return BaseEmailTemplate({
    previewText: `New subscription from ${customerName} for ${tierName}!`,
    children: content
  });
};

export const createWelcomeEmail = (userName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Hello <strong>${userName}</strong>,
    </p>
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Thank you for registering with <strong>market.dev</strong>!
    </p>
    <a
      href="${appUrl}"
      style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#000000;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px"
      target="_blank"
    >
      Get Started
    </a>
  `;

  return BaseEmailTemplate({
    previewText: `Welcome to market.dev!`,
    children: content
  });
};

export const createNewPurchaseEmail = (customerName: string, tierName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Congratulations! <b>${customerName}</b> has purchased your <b>${tierName}</b> package.
    </p>
    <a
      href="${appUrl}"
      style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#000000;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px"
      target="_blank"
    >
      View Dashboard
    </a>
  `;

  return BaseEmailTemplate({
    previewText: `New purchase from ${customerName} for ${tierName}!`,
    children: content
  });
};

export const createPurchaseConfirmationEmail = (tierName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Thank you for purchasing the <b>${tierName}</b> tier. You now have access to all the benefits of this tier.
    </p>
    <a
      href="${appUrl}"
      style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#000000;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px"
      target="_blank"
    >
      View Your Benefits
    </a>
  `;

  return BaseEmailTemplate({
    previewText: `Thank you for purchasing ${tierName}!`,
    children: content
  });
};

export const createSubscriptionCancelledEmail = (customerName: string, tierName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      <b>${customerName}</b> has cancelled their subscription to your <b>${tierName}</b> tier.
    </p>
  `;

  return BaseEmailTemplate({
    previewText: `Subscription Cancelled by ${customerName}`,
    children: content
  });
};

export const createSubscriptionCancelledConfirmationEmail = (tierName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      You have cancelled your subscription to the <b>${tierName}</b> tier.
    </p>
  `;

  return BaseEmailTemplate({
    previewText: `Subscription Cancelled`,
    children: content
  });
};

export const createNewProspectEmail = (
  prospectName: string,
  prospectEmail: string,
  tierName: string
) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Congratulations! <b>${prospectName}</b> has expressed interest in your <b>${tierName}</b> tier.
      You can contact them at ${prospectEmail} to provide them with the benefits of this tier.
    </p>
  `;

  return BaseEmailTemplate({
    previewText: `New prospect interested in ${tierName}!`,
    children: content
  });
};

export const createNewCustomerSignUpEmail = (userName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Hello <strong>${userName}</strong>,
    </p>
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Thank you for registering with <strong>market.dev</strong>!
    </p>
    <a
      href="${appUrl}"
      style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#000000;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px"
      target="_blank"
    >
      Get Started
    </a>
  `;

  return BaseEmailTemplate({
    previewText: `Welcome to market.dev!`,
    children: content
  });
};

export const createSubscriptionConfirmationEmail = (tierName: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Thank you for purchasing the <b>${tierName}</b> tier. You now have access to all the benefits of this tier.
    </p>
    <a
      href="${appUrl}"
      style="line-height:100%;text-decoration:none;display:block;max-width:100%;background-color:#000000;border-radius:5px;color:#fff;font-size:16px;font-weight:bold;text-align:center;width:100%;padding:10px 10px"
      target="_blank"
    >
      Manage Subscription & Benefits
    </a>
  `;

  return BaseEmailTemplate({
    previewText: `Thank you for purchasing ${tierName}!`,
    children: content
  });
};

export const createVerificationEmail = (token: string, domain: string) => {
  const content = `
    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#525f7f;text-align:left">
      Your verification code for signing in to <strong>${domain}</strong> is:
    </p>
    <p style="font-size:24px;line-height:32px;margin:24px 0;color:#000000;text-align:center;font-weight:bold;letter-spacing:2px">
      ${token}
    </p>
    <p style="font-size:14px;line-height:24px;margin:16px 0;color:#525f7f;text-align:center">
      This code will expire in 5 minutes
    </p>
  `;

  return BaseEmailTemplate({
    previewText: `Your verification code: ${token}`,
    children: content
  });
};
