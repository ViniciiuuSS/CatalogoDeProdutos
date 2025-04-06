import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (!code) {
    return NextResponse.json({ error: "Código não fornecido" }, { status: 400 });
  }

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_DRIVE_CLIENT_SECRET;
  // Usa o origin da request como base para o redirect_uri dinâmico
  const redirectUri = `${origin}/api/auth/callback`; // Ajuste o path conforme sua rota

  const tokenUrl = "https://oauth2.googleapis.com/token";
  const params = new URLSearchParams({
    code: code,
    client_id: clientId!,
    client_secret: clientSecret!,
    redirect_uri: redirectUri,
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

    // Redireciona para a página principal usando o mesmo domínio da request
    return NextResponse.redirect(`${origin}?token=${access_token}`);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
