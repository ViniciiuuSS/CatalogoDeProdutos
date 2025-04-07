import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get("token") || process.env.GOOGLE_DRIVE_TOKEN || "";
  //const clientId = process.env.GOOGLE_DRIVE_CLIENT_ID || "";
  const folderId = "1RtdUWoMRbNB8hRiGNfsDlBHnCeRvSqgD";

  // Função para gerar IDs aleatórios
  const gerarIdRandom = () => crypto.randomUUID();

  // Função auxiliar para buscar imagens do Picsum
  const fetchPicsumImages = async () => {
    const picsumUrl = "https://picsum.photos/400/400";
    const arrayImagens = [];

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
      return NextResponse.json({ error: error }, { status: 500 });
    }
  };

  // Primeira verificação: GOOGLE_DRIVE_TOKEN
  if (!accessToken) {
    console.warn("GOOGLE_DRIVE_TOKEN não fornecido. Usando Picsum como fallback.");
    return fetchPicsumImages();
  }

  // Se há token, prossegue para o Google Drive (mesmo sem clientId)
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,webViewLink,thumbnailLink,webContentLink)`;
  try {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await response.json();

    if (!response.ok) {
      // Se o token for inválido ou houver outro erro, cai no Picsum
      console.warn("Erro na autenticação do Google Drive:", data.error?.message);
      return fetchPicsumImages();
    }

    const images = data.files.map((file: { id: string | null; webViewLink: string | null; thumbnailLink: string | null; webContentLink: string | null }) => ({
      id: file.id || "id-random",
      href: file.webViewLink || "#",
      url: `/api/image/${file.id}`, // Aqui é onde você coloca a URL do proxy
    }));
console.log(images)
    return NextResponse.json(images);
  } catch (error) {
    console.error("Erro inesperado ao acessar Google Drive:", error);
    return fetchPicsumImages(); // Fallback em caso de erro inesperado
  }
}
