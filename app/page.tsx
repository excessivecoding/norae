import { auth } from "@/auth";
import { SongTabs } from "./song-tabs";
import { SongList } from "./song-list";

export const runtime = "edge";

export default async function Page({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  // Extract tab from search params with default value
  const tab = searchParams.tab || "your-songs";

  // Fetch user session and potentially data from Spotify
  // const session = await auth();

  // // Server-side data fetching for Spotify top tracks
  // let topTracks = null;

  // if (session?.accessToken) {
  //   try {
  //     const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
  //       headers: {
  //         Authorization: `Bearer ${session.accessToken}`,
  //       },
  //     });

  //     if (response.ok) {
  //       topTracks = await response.json();
  //     }
  //   } catch (error) {
  //     console.error("Error fetching top tracks:", error);
  //   }
  // }
  // console.log(topTracks);

  return (
    <div className="p-4 md:p-6">
      <SongTabs tab={tab} />

      <SongList
        tracks={[
          {
            id: "1",
            name: "눈밤 (Spring Snow)",
            artists: [{ name: "Lovely Runner" }],
            duration_ms: 201000,
          },
          {
            id: "2",
            name: "Hype Boy",
            artists: [{ name: "NewJeans" }],
            duration_ms: 179000,
          },
          {
            id: "3",
            name: "OMG",
            artists: [{ name: "NewJeans" }],
            duration_ms: 198000,
          },
          {
            id: "4",
            name: "Ditto",
            artists: [{ name: "NewJeans" }],
            duration_ms: 185000,
          },
          {
            id: "5",
            name: "Super Shy",
            artists: [{ name: "NewJeans" }],
            duration_ms: 194000,
          },
        ]}
      />
    </div>
  );
}
