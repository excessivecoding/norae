import { auth } from "@/auth";
import { SongTabs } from "./song-tabs";
import { SongList } from "./song-list";
import { RetryButton } from "./components/retry-button";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Session } from "next-auth";

export const runtime = "edge";

export default async function Page({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab || "your-songs";

  // Get tab title for display
  const getTabTitle = (tabName: string) => {
    switch (tabName) {
      case "your-songs":
        return "Your Saved Songs";
      case "your-top":
        return "Your Top Tracks";
      case "top-spotify":
        return "South Korea Top 50";
      case "archives":
        return "Recently Played";
      default:
        return "Your Songs";
    }
  };

  const session = await auth();

  if (!session?.accessToken) {
    return (
      <div className="p-4 md:p-6">
        <SongTabs tab={tab} />
        <div className="mt-6 p-4 bg-amber-50 text-amber-700 rounded-md">
          <p>Please sign in with Spotify to view your music.</p>
          <RetryButton />
        </div>
      </div>
    );
  }

  try {
    const songs = await getSongsByTab({
      tab,
      session,
    });

    return (
      <div className="p-4 md:p-6">
        <SongTabs tab={tab} />

        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">{getTabTitle(tab)}</h2>
          {songs.length > 0 ? (
            <SongList tracks={songs} />
          ) : (
            <div className="p-4 bg-gray-50 text-gray-500 rounded-md">
              <p>No songs found. Try another category or check back later.</p>
              <RetryButton />
            </div>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Failed to load songs:", error);
    return (
      <div className="p-4 md:p-6">
        <SongTabs tab={tab} />
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">{getTabTitle(tab)}</h2>
          <div className="p-4 bg-red-50 text-red-500 rounded-md">
            <p>Error loading songs. Please try again later.</p>
            <RetryButton />
          </div>
        </div>
      </div>
    );
  }
}

async function getSongsByTab(args: { tab: string; session: Session }) {
  try {
    if (args.tab === "your-songs") {
      const env = getCloudflareContext().env as Env;
      if (!args.session.user?.email) {
        throw new Error("Need auth");
      }
      const favoriteTracks =
        (await env.KV.get(`v1/${args.session.user?.email}/favorites`, {
          type: "json",
        })) || [];

      return favoriteTracks || [];
    }

    if (args.tab === "your-top") {
      const response = await fetch(
        "https://api.spotify.com/v1/me/top/tracks?limit=50",
        {
          headers: {
            Authorization: `Bearer ${args.session.accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.items;
    }

    // if (args.tab === "top-spotify") {
    //   // Fetch the South Korea Top 50 playlist
    //   const playlistId = "37i9dQZEVXbNxXF4SkHj9F";
    //   const response = await fetch(
    //     `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${args.accessToken}`,
    //       },
    //     }
    //   );

    //   if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    //   }

    //   const data = await response.json();

    //   // Playlist tracks are nested within items[].track
    //   return data.items.map((item: any) => item.track);
    // }

    if (args.tab === "archives") {
      const env = getCloudflareContext().env as Env;
      if (!args.session.user?.email) {
        throw new Error("Need auth");
      }

      const archivedTracks =
        (await env.KV.get(`v1/${args.session.user?.email}/archived`, {
          type: "json",
        })) || [];

      return archivedTracks;
    }

    throw new Error("Invalid tab");
  } catch (error) {
    console.error(`Error fetching songs for tab ${args.tab}:`, error);
    return []; // Return empty array on error to prevent app crash
  }
}
