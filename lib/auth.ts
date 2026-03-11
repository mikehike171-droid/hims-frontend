import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        locationId: { label: "Location", type: "select" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null
        }

        // In a real app, verify against database
        // This is a mock implementation
        const user = {
          id: "1",
          username: credentials.username,
          email: "admin@pranamhospitals.com",
          name: "Dr. Admin",
          role: "Super Admin",
          locationId: credentials.locationId || "1",
          locationName: "Pranam Main Hospital",
        }

        return user
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
}
