/**
 * Centralized type definitions for Spotify-related data
 */

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: { id?: string; name: string }[];
  album?: {
    id: string;
    name: string;
    images?: { url: string; height: number; width: number }[];
  };
  duration_ms: number;
}
