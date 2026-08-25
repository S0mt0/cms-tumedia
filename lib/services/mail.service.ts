import axios, { isAxiosError } from "axios";

import { getEnvironment } from "@/lib/env";
import type { AsyncResult } from "@/lib/types/content";

type MailMessage = { to: string; subject: string; text: string; html: string };
type MailServiceConfig = {
  appName: string;
  sender: { name: string; email: string };
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[
        character
      ]!)
  );
}

class MailService {
  appName: string = "Tumedia";
  sender: MailServiceConfig["sender"] = {
    name: "no-reply",
    email: "ifeanyi@thetumedia.com",
  };

  constructor(private readonly config?: MailServiceConfig) {
    this.appName = config?.appName || this.appName;
    this.sender = config?.sender || this.sender;
  }

  async send(message: MailMessage): Promise<AsyncResult<{ messageId?: string }>> {
    try {
      const response = await axios.post<{ messageId?: string }>("https://api.brevo.com/v3/smtp/email", {
        sender: this.sender,
        to: [{ email: message.to }],
        subject: message.subject,
        textContent: message.text,
        htmlContent: message.html,
      }, {
        headers: {
          "api-key": getEnvironment().BREVO_API_KEY,
          "content-type": "application/json",
        },
      });
      return { success: "Email sent.", data: response.data };
    } catch (caught) {
      console.error("Brevo email delivery failed", caught);
      return { error: isAxiosError(caught) && caught.response?.status === 401 ? "Email delivery is not configured correctly." : "We could not send that email. Please try again shortly." };
    }
  }

  async sendMagicLinkEmail({ to, url }: { to: string; url: string }): Promise<AsyncResult<{ messageId?: string }>> {
    return this.send({
      to,
      subject: `Sign in to ${this.appName}`,
      text: `Use this secure, one-time link to sign in to ${this.appName}: ${url}`,
      html: `<p>Use this secure, one-time link to sign in to ${escapeHtml(
        this.appName
      )}:</p><p><a href="${escapeHtml(url)}">Sign in to ${escapeHtml(
        this.appName
      )}</a></p><p>This link expires soon and can only be used once.</p>`,
    });
  }

  async sendAccessRevokedEmail({
    to,
    contactEmail,
  }: {
    to: string;
    contactEmail: string;
  }): Promise<AsyncResult<{ messageId?: string }>> {
    return this.send({
      to,
      subject: `Your ${this.appName} access has been revoked`,
      text: `Your ${this.appName} access and active sessions have been revoked. Contact ${contactEmail} if you believe this was a mistake.`,
      html: `<p>Your ${escapeHtml(
        this.appName
      )} access and active sessions have been revoked.</p><p>If you believe this was a mistake, contact <a href="mailto:${escapeHtml(
        contactEmail
      )}">${escapeHtml(contactEmail)}</a>.</p>`,
    });
  }

  async sendUserNotification({
    to,
    subject,
    message,
    actionUrl,
    actionLabel,
  }: {
    to: string;
    subject: string;
    message: string;
    actionUrl?: string;
    actionLabel?: string;
  }): Promise<AsyncResult<{ messageId?: string }>> {
    const action =
      actionUrl && actionLabel
        ? `<p><a href="${escapeHtml(actionUrl)}">${escapeHtml(
            actionLabel
          )}</a></p>`
        : "";

    return this.send({
      to,
      subject,
      text: `${message}${actionUrl ? `\n\n${actionUrl}` : ""}`,
      html: `<p>${escapeHtml(message)}</p>${action}`,
    });
  }
}

export const mailService = new MailService();
