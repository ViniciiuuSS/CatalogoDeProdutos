import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest, context: { params: { id: string } }) {
  const { id } = context.params;
  const accessToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;

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
        "Content-Type": imageBlob.type || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
