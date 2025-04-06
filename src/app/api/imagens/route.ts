import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  let accessToken = searchParams.get("token");

  accessToken = process.env.TOKEN || accessToken;

  const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
  const folderId = "1RtdUWoMRbNB8hRiGNfsDlBHnCeRvSqgD";

  // Função para gerar IDs aleatórios
  function gerarIdRandom() {
    return crypto.randomUUID();
  }

  const arrayImagens: Array<object> = [];

  // Se GOOGLE_DRIVE_CLIENT_ID não existir ou não houver token, faz 10 requisições ao Picsum
  if (!clientId || accessToken == "") {
    const picsumUrl = "https://picsum.photos/400/400";

    try {
      for (let i = 0; i < 10; i++) {
        const response = await fetch(picsumUrl);
        if (!response.ok) {
          throw new Error("Erro ao buscar imagem do Picsum");
        }
        arrayImagens.push({
          id: gerarIdRandom(),
          href: "#",
          url: response.url,
        });
      }
      return NextResponse.json(arrayImagens);
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }

  // Se GOOGLE_DRIVE_CLIENT_ID existir, usa o access_token (OAuth)
  if (!accessToken) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 400 });
  }

  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,webViewLink,thumbnailLink,webContentLink)`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error.message || "Erro ao buscar imagens");
    }

    const images = data.files.map((file: { id: string | null; webViewLink: string | null; thumbnailLink: string | null; webContentLink: string | null }) => ({
      id: file.id || "id-random",
      href: file.webViewLink || "#",
      url: `/api/image/${file.id}`, // Aqui é onde você coloca a URL do proxy
    }));

    return NextResponse.json(images);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
