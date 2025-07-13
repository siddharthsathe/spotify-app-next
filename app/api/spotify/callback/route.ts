import { SPOTIFY_API_AUTH_URL } from '@/app/constants';
import { NextRequest, NextResponse } from 'next/server';
import querystring from 'querystring';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get('code');

    if (!code) {
        console.info('No code found in URL');
        return NextResponse.json({ message: 'Invalid URL' })
    }

    // Get access token & refresh token based on the auth code 
    const body = querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI,
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    });

    const res = await fetch(`${SPOTIFY_API_AUTH_URL}/api/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
    });

    const data = await res.json();

    const { access_token } = data;

    // Ideally in a prod app I would save tokens in DB 
    const response = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/api/spotify`);
    response.cookies.set('access_token', access_token, {
        httpOnly: true,
        path: '/',
        maxAge: 3600
    });

    return response;
}
