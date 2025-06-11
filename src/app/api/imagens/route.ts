import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || "" || searchParams;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  // Função para gerar IDs aleatórios
  const gerarIdRandom = () => crypto.randomUUID();

  // Função auxiliar para buscar imagens do Picsum (fallback)
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

  // Verifica se a API_KEY está disponível
  if (!apiKey) {
    console.warn("GOOGLE_DRIVE_API_KEY não fornecida. Usando Picsum como fallback.");
    return fetchPicsumImages();
  }

  // URL atualizada com a API_KEY
  const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name,webViewLink,thumbnailLink)&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      console.warn("Erro na requisição ao Google Drive:", data.error?.message);
      return fetchPicsumImages();
    }

    const images = data.files.map((file: { id: string | null; webViewLink: string | null; thumbnailLink: string | null; webContentLink: string | null }) => ({
      id: file.id || "id-random",
      href: file.webViewLink || "#",
      url: `/api/image/${file.id}`, // Mantém a URL do proxy
    }));

    return NextResponse.json(images);
  } catch (error) {
    console.error("Erro inesperado ao acessar Google Drive:", error);
    return fetchPicsumImages(); // Fallback em caso de erro inesperado
  }
}