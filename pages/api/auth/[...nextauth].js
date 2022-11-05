import NextAuth from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcrypt';
import { getXataClient } from '../../../utils/xata';

const xata = getXataClient();

export const authOptions = {
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXT_AUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
    Credentials({
      name: 'Custom Provider',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'theodore@gmail.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // check if user already exists
        const user = await xata.db.Users.filter('email', req.body.email).getFirst();
        console.log(user)
        // if user does not exist
        if (!user) {
          // return res.json({ data: null, error: "Account does not exists" })
          throw new Error('Account does not exist');
        }

        // return if user's provider is github
        if (user.provider === 'github') {
          throw new Error('Please provide a valid email address and password.');
        }

        // check if passwords match
        const isPasswordSame = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordSame) {
          // return res.status(400).json({ error: "Email or password is incorrect" })
          throw new Error('Email or password is incorrect');
        }
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({
      token, user, account,
    }) {
      // if Local
      if (user) {
        token.accessToken = user;
        token.user = user;
      }
      // if from github provider
      if (account) {
        if (account?.provider === 'github') {
          // check if user already exists
          const dbUser = await xata.db.Users.filter('email', user.email).filter('provider', 'github').getFirst();
          token.user = dbUser;

          // if no user exists, create new
          if (!dbUser) {
            // check if email already exists
            const dbUser = await xata.db.Users.filter('email', user.email).getFirst();
            if (dbUser) {
              throw new Error('An account with that email address already exists. Please use a unique email.');
            }

            // save user
            const newUser = await xata.db.Users.create({ fullName: user.name, email: user.email, provider: 'github' });
            token.user = newUser;
          }
        }
        token.accessToken = account?.access_token;
      }

      return token;
    },
    async session({ session, token }) {
      session.accessToken = token?.accessToken;
      session.user = token.user;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
export default NextAuth(authOptions);
