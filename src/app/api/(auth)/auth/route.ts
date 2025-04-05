import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;
  const scope = "https://www.googleapis.com/auth/drive.readonly";
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline`;

  return NextResponse.redirect(authUrl);
}