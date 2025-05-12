import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@restaurant-system/config";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // 마스터 계정 체크
        if (credentials.email === "dsaslb@gmail.com" && credentials.password === "1234") {
          const master = await prisma.user.upsert({
            where: { email: "dsaslb@gmail.com" },
            update: {},
            create: {
              email: "dsaslb@gmail.com",
              password: await bcrypt.hash("1234", 10),
              name: "Master",
              role: "ADMIN",
            },
          });
          return {
            id: master.id,
            email: master.email,
            name: master.name,
            role: master.role,
          };
        }

        // 일반 사용자 인증
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 