import { auth } from "@/auth";
import { SongPageContent } from "./content";

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

  return <SongPageContent data={data} />;
}
