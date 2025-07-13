import { SPOTIFY_API_AUTH_URL } from '@/app/constants';
import { NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET() {
    const params = querystring.stringify({
        response_type: 'code',
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        scope: 'user-read-playback-state user-modify-playback-state user-top-read',
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
    });

    return NextResponse.redirect(`${SPOTIFY_API_AUTH_URL}/authorize?${params}`);
}
