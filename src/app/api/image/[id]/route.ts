import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Extrai o pathname da URL (ex.: "/api/image/15hktv-zgn2JKvRDfnCEeT8CV1foXgbB2")
  const url = new URL(req.url);
  const pathname = url.pathname;
  
  // Pega a última parte após o último "/" (o id)
  const id = pathname.split('/').pop();

  // Verifica se o id foi fornecido
  if (!id) {
    return NextResponse.json({ error: "ID não fornecido" }, { status: 400 });
  }

  const accessToken = process.env.GOOGLE_DRIVE_TOKEN;

  // Monta a URL da imagem no Google Drive
  const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;

  try {
    // Faz a requisição para buscar a imagem
    const response = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Verifica se a resposta foi bem-sucedida

    // Verifica se a resposta foi bem-sucedida
    if (!response.ok) {
      throw new Error("Erro ao buscar imagem do Google Drive");
    }

    // Converte a resposta em um blob (imagem)
    const imageBlob = await response.blob();

    // Retorna a imagem com os cabeçalhos apropriados

    // Retorna a imagem com os cabeçalhos apropriados
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": imageBlob.type || "image/jpeg", // Define o tipo da imagem
        "Cache-Control": "public, max-age=31536000",    // Cache por 1 ano (opcional)
      },
    });
  } catch (error) {
    // Retorna erro em caso de falha
    // Retorna erro em caso de falha
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}