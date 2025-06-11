import { NextResponse } from "next/server";
import { generateBlurFromBuffer } from "@/lib/generateBlur";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const apiKey = process.env.GOOGLE_DRIVE_API_KEY || "" || searchParams;
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

  const gerarIdRandom = () => crypto.randomUUID();

  const fetchImageBuffer = async (imageId: string): Promise<Buffer> => {
    const url = `https://drive.google.com/uc?export=view&id=${imageId}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erro ao baixar imagem do Google Drive");
    return Buffer.from(await response.arrayBuffer());
  };

  const fetchPicsumImages = async () => {
    const picsumUrl = "https://picsum.photos/400/400";
    const arrayImagens = [];

    for (let i = 0; i < 10; i++) {
      const response = await fetch(picsumUrl);
      if (!response.ok) continue;
      const buffer = Buffer.from(await response.arrayBuffer());
      const blur = await generateBlurFromBuffer(buffer);

      arrayImagens.push({
        id: gerarIdRandom(),
        href: "#",
        url: response.url,
        blur,
      });
    }
    return NextResponse.json(arrayImagens);
  };

  if (!apiKey || !folderId) {
    console.warn("Sem credenciais. Usando fallback.");
    return fetchPicsumImages();
  }

  const listUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(id,name)&key=${apiKey}`;

  try {
    const response = await fetch(listUrl);
    const data = await response.json();

    if (!response.ok || !data.files) {
      console.warn("Erro ao listar arquivos:", data.error?.message);
      return fetchPicsumImages();
    }

    const images = await Promise.all(
      data.files.map(async (file: { id: string; name: string }) => {
        const id = file.id;
        let blur = "";

        try {
          const buffer = await fetchImageBuffer(id);
          blur = await generateBlurFromBuffer(buffer);
        } catch (e) {
          console.warn(`Erro ao gerar blur para imagem ${id}:`, e);
        }

        return {
          id,
          href: `https://drive.google.com/file/d/${id}/view`,
          url: `/api/image/${id}`, // proxy para evitar CORS
          blur,
        };
      })
    );

    return NextResponse.json(images);
  } catch (error) {
    console.error("Erro inesperado ao acessar Google Drive:", error);
    return fetchPicsumImages();
  }
}
