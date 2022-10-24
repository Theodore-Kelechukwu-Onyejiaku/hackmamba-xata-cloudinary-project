import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import Credentials from "next-auth/providers/credentials"

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    secret: "oIJjbD2Zuh+lxXUqbpLSI5b3O0EmjSK7TXbkO6D6bqg=",
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        Credentials({
            name: "Custom Provider",
            credentials: {
                email: { label: "Email", type: "text", "placeholder": "theodore@gmail.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                let user = { name: "kaceey", email: "theodore@gmail.com", password: "whatever", "othername": "Kelechukwu" }
                return null
            }
        }),
    ],
    callbacks: {
        async jwt({ token, user, account, profile, isNewUser }) {
            // if Local
            if (user) {
                token.accessToken = user
            }
            // if from github provider
            if (account) {
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken
            return session
        }
    },
    pages: {
        signIn: "/auth/signin"
    },
}
export default NextAuth(authOptions)