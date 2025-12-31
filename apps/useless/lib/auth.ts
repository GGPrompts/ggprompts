import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { genericOAuth } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  trustedOrigins: [
    "https://useless-io.vercel.app",
    "https://useless-io-matts-projects-e61c0393.vercel.app",
    "http://localhost:3000",
  ],
  // Error handling - redirect to login with error instead of 500
  onAPIError: {
    errorURL: "/login?error=auth_error",
  },
  advanced: {
    // Use secure cookies for production, allow insecure for localhost
    useSecureCookies: process.env.NODE_ENV === "production",
    // Cookie settings to fix Next.js 16 double-callback issue
    defaultCookieAttributes: {
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.users,
      session: schema.sessions,
      account: schema.accounts,
      verification: schema.verifications,
    },
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    minPasswordLength: 8,
  },
  // Using Generic OAuth plugin with PKCE disabled to fix Next.js 16 double-callback issue
  plugins: [
    genericOAuth({
      config: [
        {
          providerId: "github",
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          authorizationUrl: "https://github.com/login/oauth/authorize",
          tokenUrl: "https://github.com/login/oauth/access_token",
          scopes: ["read:user", "user:email"],
          pkce: false, // Disable PKCE to fix "please_restart_the_process" error
          // Custom user info fetching to handle GitHub's separate emails endpoint
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          getUserInfo: async (tokens: any) => {
            try {
              const accessToken = tokens.accessToken;
              console.log("[GitHub OAuth] Fetching user info...");

              // Fetch basic user info
              const userResponse = await fetch("https://api.github.com/user", {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "application/json",
                },
              });

              if (!userResponse.ok) {
                const errText = await userResponse.text();
                console.error("[GitHub OAuth] User fetch failed:", userResponse.status, errText);
                throw new Error(`Failed to fetch user: ${userResponse.status}`);
              }

              const user = await userResponse.json();
              console.log("[GitHub OAuth] Got user:", user.login);

              // Fetch emails separately (GitHub doesn't include email in /user if private)
              let email = user.email;
              if (!email) {
                const emailsResponse = await fetch("https://api.github.com/user/emails", {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/json",
                  },
                });

                if (emailsResponse.ok) {
                  const emails = await emailsResponse.json();
                  console.log("[GitHub OAuth] Fetched", emails.length, "emails");
                  // Find primary email or first verified email
                  const primaryEmail = emails.find((e: { primary: boolean; verified: boolean }) => e.primary && e.verified);
                  const verifiedEmail = emails.find((e: { verified: boolean }) => e.verified);
                  email = primaryEmail?.email || verifiedEmail?.email || emails[0]?.email;
                } else {
                  console.error("[GitHub OAuth] Emails fetch failed:", emailsResponse.status);
                }
              }

              return {
                id: String(user.id),
                name: user.name || user.login,
                email: email,
                image: user.avatar_url,
                emailVerified: true,
              };
            } catch (error) {
              console.error("[GitHub OAuth] getUserInfo error:", error);
              throw error;
            }
          },
        },
      ],
    }),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  user: {
    additionalFields: {
      // Can extend user model here if needed
    },
  },
  // Hooks for wallet creation on signup
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            // Check if wallet already exists
            const existingWallet = await db.query.wallets.findFirst({
              where: (wallets, { eq }) => eq(wallets.userId, user.id),
            });

            if (!existingWallet) {
              // Create wallet with $1000 UselessBucks for new users
              await db.insert(schema.wallets).values({
                id: crypto.randomUUID(),
                userId: user.id,
                balance: "1000.00",
              });

              // Record signup bonus transaction
              await db.insert(schema.walletTransactions).values({
                id: crypto.randomUUID(),
                userId: user.id,
                amount: "1000.00",
                type: "signup_bonus",
                description: "Welcome bonus! Enjoy your UselessBucks!",
              });

              // Award early adopter achievement
              await db.insert(schema.userAchievements).values({
                id: crypto.randomUUID(),
                userId: user.id,
                achievementType: "early_adopter",
              });
            }
          } catch (error) {
            console.error("[Auth] Failed to create wallet for user:", user.id, error);
            // Don't throw - let the user creation succeed even if wallet fails
          }
        },
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
