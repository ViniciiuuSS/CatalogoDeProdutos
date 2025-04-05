import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  console.log(code);
  if (!code) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  const redirectUri = process.env.GOOGLE_DRIVE_REDIRECT_URI;

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const params = new URLSearchParams({
    code: code,
    client_id: clientId!,
    client_secret: clientSecret!,
    redirect_uri: redirectUri!,
    grant_type: "authorization_code",
  });

  try {
    const response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error_description || "Erro ao obter token");
    }

    const { access_token } = data;

    // Redireciona para a página principal com o token na URL
    return NextResponse.redirect(`http://localhost:3000?token=${access_token}`);
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
