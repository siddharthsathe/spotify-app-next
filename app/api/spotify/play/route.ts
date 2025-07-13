import { SPOTIFY_API_BASE_URL } from '@/app/constants';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
    const access_token = (await cookies()).get('access_token')?.value;
    const { uri } = await req.json();

    const res = await fetch(`${SPOTIFY_API_BASE_URL}/me/player/play`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${access_token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uris: [uri] }),
    });

    return Response.json({ status: res.status === 204 ? 'Track playing' : 'Failed to play' });
}