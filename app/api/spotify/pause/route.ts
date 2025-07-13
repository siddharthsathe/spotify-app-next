import { SPOTIFY_API_BASE_URL } from '@/app/constants';
import { cookies } from 'next/headers';

export async function POST() {
    const access_token = (await cookies()).get('access_token')?.value;

    const res = await fetch(`${SPOTIFY_API_BASE_URL}/me/player/pause`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${access_token}` },
    })
        .then(result => {
            console.info('Result:', result);
            return result;
        })

        .catch(error => {
            console.info('Failed to pause', error);
            throw error;
        })

    return Response.json({ status: res.status === 200 || res.status === 204 ? 'Playback paused' : 'Failed to pause' });
}
