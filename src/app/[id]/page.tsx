import Link from "next/link";
import { JSX } from "react";

interface MetadataProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MetadataProps) {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${id}`;
  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${id}`;

  return {
    title: "TaiSacola - Produto Incrível",
    description: "Veja este produto incrível!",
    openGraph: {
      title: "Produto Incrível",
      description: "Veja este produto incrível!",
      images: [{ url: imageUrl }],
      url: pageUrl,
      type: "website",
    },
  };
}

interface ProdutoPageProps {
  params: Promise<{ id: string }>;
}
export default async function ProdutoPage({
  params,
}: ProdutoPageProps): Promise<JSX.Element> {
  const resolvedParams = await Promise.resolve(params);
  const { id } = resolvedParams;
  const imageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/image/${id}`;

  return (
    <div className="flex justify-center items-center">
      <img src={imageUrl} alt="Imagem do produto" className="w-dvh" />
      <div
        id="toast-bottom-right"
        className="fixed flex items-center justify-center w-full max-w-xs p-4 space-x-4 text-gray-500 bg-white divide-x rtl:divide-x-reverse divide-gray-200 rounded-lg shadow-sm right-5 bottom-5 dark:text-gray-400 dark:divide-gray-700 dark:bg-gray-800"
        role="alert"
      >
        <div className="flex items-center justify-center text-sm font-normal">
          <button
            type="button"
            className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
          >
            <Link href="/" target="_self" rel="noopener noreferrer">
              <h1>Voltar ao Catálogo</h1>
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
}
