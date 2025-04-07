import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  const accessToken = process.env.GOOGLE_DRIVE_TOKEN;
  const imageUrl = `https://drive.google.com/uc?export=view&id=${id}`;

  try {
    const response = await fetch(imageUrl, {
      headers: { Authorization: `Bearer ${accessToken}` },
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
