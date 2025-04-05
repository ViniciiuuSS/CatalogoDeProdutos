import { NextResponse } from "next/server";

export async function GET() {
  function gerarIdRandom() {
    return crypto.randomUUID();
  }
  const arrayImagens: Array<object> = [];

  for (let i = 0; i < 10; i++) {
    const response = await fetch(`https://picsum.photos/400/400`);
    if (response.ok) {
      arrayImagens.push({
        id: gerarIdRandom(),
        href: "#",
        url: response.url,
      });
    }
  }

  return NextResponse.json(arrayImagens);
}
