"use client";

import { useEffect, useState } from "react";
import Await from "./await";

export default function Produtos() {
  const [products, setProducts] = useState<{ id: string; href: string; url: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usePicsum] = useState<boolean>(true);

  const handleLogin = () => {
    window.location.href = "/api/auth";
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (usePicsum) {
      fetchImages("");
    } else if (token) {
      fetchImages(token);
    }
  }, [usePicsum]);

  const fetchImages = async (token: string) => {
    try {
      const response = await fetch(token ? `/api/imagens?token=${token}` : "/api/imagens");
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erro ao buscar imagens");
      }
      const data = await response.json();
      setProducts(data);
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "Erro ao buscar imagens");
    }
  };

  if (!products.length && usePicsum) {
    return <Await />;
  }

  return (
    <div>
      {!usePicsum && !products.length && !error && (
        <button onClick={handleLogin}>Conectar ao Google Drive</button>
      )}
      {error && <p>{error}</p>}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => {
          // Gera o link para a página dinâmica com o ID da imagem
          const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${product.id}`;
          // Gera o link do WhatsApp com a URL da página dinâmica
          const whatsappLink = `https://api.whatsapp.com/send?phone=5517996183333&text=${encodeURIComponent(
            `Olá, gostei deste produto: ${pageUrl}`
          )}`;

          return (
            <div key={product.id} className="group relative">
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm text-gray-700">
                    <a href={whatsappLink}>
                    <img
                        src={product.url}
                        alt={`Produto ${product.id}`}
                        className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                      />
                    </a>
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}