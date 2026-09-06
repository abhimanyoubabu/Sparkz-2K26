import { google } from "googleapis";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");

    if (!code) {
        return new Response("Missing authorization code", {
            status: 400,
        });
    }

    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await auth.getToken(code);

    return new Response(
        `<pre>Refresh Token:\n${tokens.refresh_token || "No refresh token returned"}</pre>`,
        {
            headers: {
                "Content-Type": "text/html",
            },
        }
    );
}