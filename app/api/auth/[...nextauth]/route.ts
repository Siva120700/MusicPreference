import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  // Optional: Add a database to persist sessions and accounts
  // database: process.env.DATABASE_URL,
  
  // Optional: Configure session settings
  session: {
    jwt: true,
  },
  
  // Optional: Configure callbacks for handling session and token
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Store user ID in the token
      }
      return token;
    },
    async session({ session, token }) {
      session.id = token.id; // Make user ID accessible in the session
      return session;
    },
  },
  
  // Optional: Add event handlers for logging and debugging
  events: {
    signIn: (message) => {
      console.log("User signed in:", message);
    },
    error: (error) => {
      console.error("NextAuth error:", error);
    },
  },

  // Optional: Add pages for custom routes
  pages: {
    signIn: '/auth/signin',  // Display custom sign-in page
    // error: '/auth/error' // Error page
  },
};

export default NextAuth(authOptions);
