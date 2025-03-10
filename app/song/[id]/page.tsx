import { auth } from "@/auth";
import { SongPageContent } from "./content";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const runtime = "edge";

export default async function SongPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.accessToken) {
    throw new Error("No access token found");
  }

  const response = await fetch(
    `https://api.spotify.com/v1/tracks/${params.id}`,
    {
      headers: {
        Authorization: `Bearer ${session.accessToken}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch song data");
  }

  const data = await response.json();

  const env = getCloudflareContext().env as Env;
  const favorites = await env.KV.get(`v1/${session.user?.email}/favorites`);

  // console.log(favorites, session, params.id);
  return (
    <SongPageContent
      data={data}
      isFavorite={favorites?.includes(params.id) || false}
    />
  );
}
