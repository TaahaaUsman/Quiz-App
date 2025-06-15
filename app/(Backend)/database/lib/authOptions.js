// lib/authOptions.js

import GoogleProvider from "next-auth/providers/google";
import db from "./db"; // Your MongoDB connection utility
import User from "../models/userModel/userSchema"; // Your Mongoose User model

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        await db(); // Connect to DB

        const existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          const newUser = new User({
            name: user.name,
            email: user.email,
            profilePictureUrl: user.image,
            provider: "google",
          });

          await newUser.save();
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      if (user) {
        const dbUser = await User.findOne({ email: user.email });
        token.id = dbUser._id;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login", // optional: redirect to your login page
  },
};
