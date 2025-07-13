import { cookies } from 'next/headers';

export async function GET() {
    const access_token = (await cookies()).get('access_token')?.value;

    if (!access_token) {
        return Response.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const [nowPlaying, topTracks] = await Promise.all([
        fetch('https://api.spotify.com/v1/me/player/currently-playing', {
            headers: { Authorization: `Bearer ${access_token}` },
        }),
        fetch('https://api.spotify.com/v1/me/top/tracks?limit=10', {
            headers: { Authorization: `Bearer ${access_token}` },
        })
    ]);

    const nowData = nowPlaying.status === 200 ? await nowPlaying.json() : null;
    const topData = await topTracks.json();

    return Response.json({
        currently_playing: nowData?.item?.name || null,
        artist: nowData?.item?.artists?.map((a: any) => a.name).join(', ') || null,
        top_10_tracks: topData.items.map((t: any) => ({
            name: t.name,
            artist: t.artists.map((a: any) => a.name).join(', '),
            uri: t.uri
        }))
    });


}