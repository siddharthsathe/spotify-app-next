import { SPOTIFY_API_BASE_URL } from '@/app/constants';
import { cookies } from 'next/headers';

export async function GET() {
    const access_token = (await cookies()).get('access_token')?.value;

    if (!access_token) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const [nowPlaying, topTracks] = await Promise.all([
        fetch(`${SPOTIFY_API_BASE_URL}/me/player/currently-playing`, {
            headers: { Authorization: `Bearer ${access_token}` },
        }),
        fetch(`${SPOTIFY_API_BASE_URL}/me/top/tracks?limit=10`, {
            headers: { Authorization: `Bearer ${access_token}` },
        })
    ]);

    const nowData = nowPlaying.status === 200 ? await nowPlaying.json() : null;
    const topData = await topTracks.json();

    return Response.json({
        currently_playing: nowData?.item?.name || null,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        artist: nowData?.item?.artists?.map((a: any) => a.name).join(', ') || null,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        top_10_tracks: topData.items.map((t: any) => ({
            name: t.name,
            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
            artist: t.artists.map((a: any) => a.name).join(', '),
            uri: t.uri
        }))
    });


}