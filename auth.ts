import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// NextAuth v5 (Auth.js) config for Google OAuth restricted to the admin's email.
// Required env vars: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET,
// NEXTAUTH_URL (auto-detected on Vercel, set explicitly for local dev), ADMIN_EMAIL.
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async signIn({ user }) {
      const allowedEmail = process.env.ADMIN_EMAIL;
      if (!allowedEmail) return false;
      return user.email?.toLowerCase() === allowedEmail.toLowerCase();
    },
    async session({ session }) {
      return session;
    },
  },
});
