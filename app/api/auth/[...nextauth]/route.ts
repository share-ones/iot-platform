//C:\server\server\app\api\auth\[...nextauth]\route.ts

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    Credentials({
      name: "credentials",

      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // ⭐ 暂时写死测试账号
        if (
          credentials?.username === "admin" &&
          credentials?.password === "123456"
        ) {
          return {
            id: "admin",
            name: "admin",
          };
        }

        return null;
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
