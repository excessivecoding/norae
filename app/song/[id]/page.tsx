import { auth } from "@/auth";
import { LyricsSection, SongPageContent } from "./content";
import { getLyrics, hasUserFavorite } from "../../actions";
import { SpotifyTrack } from "@/app/types/spotify";
import { redis } from "@/app/redis";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function SongPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.accessToken || !session?.user?.email) {
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

  const data = (await response.json()) as SpotifyTrack;

  const isFavorite = await hasUserFavorite(session.user.email, params.id);

  return (
    <SongPageContent data={data} isFavorite={isFavorite}>
      <Suspense fallback={<LyricsLoadingSkeleton />}>
        <Lyrics data={data} />
      </Suspense>
    </SongPageContent>
  );
}

async function Lyrics(props: { data: SpotifyTrack }) {
  const lyrics = ((await getLyrics(props.data)) || "").split("\n");
  return <LyricsSection lyrics={lyrics} songId={props.data.id} />;
}

function LyricsLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card className="border-none backdrop-blur-sm shadow-none">
        <CardContent className="p-8">
          <div className="space-y-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="md:sticky md:top-6 md:self-start">
        <Card className="border-none bg-white/80 backdrop-blur-sm shadow-none mt-6">
          <CardContent className="p-8">
            <div className="space-y-4">
              <Skeleton className="h-[300px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
