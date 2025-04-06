import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const accessToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const imageUrl = `https://drive.google.com/uc?export=view&id=${params.id}`;

  try {
    const response = await fetch(imageUrl, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar imagem do Google Drive");
    }

    const imageBlob = await response.blob();
    return new NextResponse(imageBlob, {
      headers: {
        "Content-Type": imageBlob.type || "image/jpeg", // Ajuste conforme o tipo da imagem
        "Cache-Control": "public, max-age=31536000", // Cache por 1 ano (opcional)
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
