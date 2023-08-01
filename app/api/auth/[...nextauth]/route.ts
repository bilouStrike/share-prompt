import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import User from "@models/user";
import { connectToDB } from "@utils/database";

const { GOOGLE_CLIENT_ID = "", GOOGLE_CLIENT_SECRECT = "" } = process.env;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRECT,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session?.user?.email });

      if (session.user) {
        /* @ts-ignore */
        session.user.id = sessionUser._id.toString();
      }

      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();
        // check if user already exists
        const userExists = await User.findOne({ email: profile?.email });

        //if not, save a new user
        if (!userExists) {
          await User.create({
            email: profile?.email,
            username: profile?.name?.replaceAll(" ", "").toLowerCase(),
            image: profile?.image,
          });
        }
        return true;
      } catch (error) {
        console.log("sign in error", error);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
