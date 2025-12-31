import { createAuthClient } from "better-auth/react";
import { genericOAuthClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  plugins: [genericOAuthClient()],
});

// Export hooks for React components
export const { signIn, signUp, signOut, useSession } = authClient;

// Social sign-in helper using generic OAuth (PKCE disabled on server)
export const signInWithGitHub = () => {
  return signIn.oauth2({
    providerId: "github",
    callbackURL: "/products",
  });
};
