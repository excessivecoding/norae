import { auth } from "@/auth";
import { SongTabs } from "./song-tabs";
import { SongList } from "./song-list";

export const runtime = "edge";

export default async function Page({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const tab = searchParams.tab || "your-songs";

  const session = await auth();

  if (!session?.accessToken) {
    return <div>No access token</div>;
  }

  const response = await fetch("https://api.spotify.com/v1/me/top/tracks", {
    headers: {
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  const data = await response.json();

  const songs = data.items;

  return (
    <div className="p-4 md:p-6">
      <SongTabs tab={tab} />

      <SongList tracks={songs} />
    </div>
  );
}
