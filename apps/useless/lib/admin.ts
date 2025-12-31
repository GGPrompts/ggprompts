import { headers } from "next/headers";
import { auth } from "./auth";
import { db } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

/**
 * Get the current session from server-side
 */
export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Check if current user is admin - redirects to login if not authenticated
 * or to home if not admin
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  // Query the database to check isAdmin
  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user?.isAdmin) {
    redirect("/?error=unauthorized");
  }

  return { session, user };
}

/**
 * Check if current user is admin (returns boolean, doesn't redirect)
 */
export async function isAdmin(): Promise<boolean> {
  const session = await getSession();

  if (!session?.user) {
    return false;
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  return user?.isAdmin ?? false;
}
