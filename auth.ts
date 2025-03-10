import NextAuth from "next-auth";
import Spotify from "next-auth/providers/spotify";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Spotify({
      authorization:
        "https://accounts.spotify.com/authorize?scope=user-read-email%20user-top-read ",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Initial sign in
      if (account && account.provider === "spotify") {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        return token;
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token has expired, try to refresh it
      try {
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            client_id: process.env.AUTH_SPOTIFY_ID as string,
            client_secret: process.env.AUTH_SPOTIFY_SECRET as string,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string,
          }),
        });

        const refreshedTokens = await response.json();

        if (!response.ok) {
          console.error("Error refreshing access token", refreshedTokens);
          // If there's an error, return the current token to avoid breaking the flow
          return token;
        }

        console.log("Token refreshed successfully");

        return {
          ...token,
          accessToken: refreshedTokens.access_token,
          // Fall back to old refresh token if a new one is not provided
          refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
          expiresAt: Math.floor(Date.now() / 1000 + refreshedTokens.expires_in),
        };
      } catch (error) {
        console.error("Error refreshing token:", error);
        return token;
      }
    },
    session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      if (token.refreshToken) {
        session.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
});
