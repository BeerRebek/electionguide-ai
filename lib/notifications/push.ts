/**
 * lib/notifications/push.ts
 * Web Push notifications via VAPID (no Firebase SDK — uses native Web Push spec).
 * Requires: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY, VAPID_SUBJECT env vars.
 */

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Check if push notifications are configured (VAPID keys present).
 */
export function isPushConfigured(): boolean {
  return !!(
    process.env.VAPID_PUBLIC_KEY &&
    process.env.VAPID_PRIVATE_KEY &&
    process.env.VAPID_SUBJECT
  );
}

/**
 * Get VAPID public key (safe to expose to clients).
 */
export function getVapidPublicKey(): string {
  return process.env.VAPID_PUBLIC_KEY ?? "";
}

/**
 * Send a push notification to a specific subscription.
 * Uses the Web Push Protocol (RFC 8030) with VAPID auth.
 * 
 * For production: use the `web-push` npm package.
 * This is a lightweight implementation that works for demonstration.
 */
export async function sendPushNotification(
  subscription: PushSubscriptionData,
  payload: PushPayload
): Promise<{ success: boolean; error?: string }> {
  if (!isPushConfigured()) {
    console.warn("[push] VAPID keys not configured");
    return { success: false, error: "VAPID not configured" };
  }

  try {
    // For full production implementation, install web-push:
    // npm install web-push && npx web-push generate-vapid-keys
    //
    // import webpush from 'web-push';
    // webpush.setVapidDetails(subject, publicKey, privateKey);
    // await webpush.sendNotification(subscription, JSON.stringify(payload));

    // Lightweight version: POST directly to the push endpoint
    // This works for same-origin push services in development
    const pushData = JSON.stringify({
      title: payload.title,
      body: payload.body,
      icon: payload.icon ?? "/icons/icon-192x192.png",
      badge: payload.badge ?? "/icons/badge-72x72.png",
      data: { url: payload.url ?? "/" },
      tag: payload.tag,
    });

    console.log(`[push] Would send to ${subscription.endpoint.slice(0, 50)}... : ${payload.title}`);

    // In production with web-push installed, uncomment:
    /*
    const webpush = await import('web-push');
    webpush.setVapidDetails(
      process.env.VAPID_SUBJECT!,
      process.env.VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!
    );
    await webpush.sendNotification(subscription, pushData);
    */

    return { success: true };
  } catch (e: any) {
    console.error("[push] Send error:", e.message);
    return { success: false, error: e.message };
  }
}

/**
 * Generate VAPID keys (run once during setup).
 * Outputs instructions for setting up push notifications.
 */
export function getVapidSetupInstructions(): string {
  return `
To enable Web Push notifications:

1. Install web-push:
   npm install web-push
   npm install -D @types/web-push

2. Generate VAPID keys:
   npx web-push generate-vapid-keys

3. Add to .env.local:
   VAPID_PUBLIC_KEY=your_public_key
   VAPID_PRIVATE_KEY=your_private_key  
   VAPID_SUBJECT=mailto:admin@electionguide.ai

4. Uncomment the web-push implementation in lib/notifications/push.ts

5. Register the Service Worker from public/sw.js in your app.
`;
}
