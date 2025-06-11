"use client";

import { useEffect, useState } from "react";
import Await from "./await";
import ProductCard from './ProductCard';

export default function Produtos() {
  const [products, setProducts] = useState<{ id: string; href: string; url: string; blur: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [usePicsum] = useState<boolean>(true);
  const [qtdProd, setQtdProd] = useState<boolean>(true);

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
      if(data.length === 0) {
        setQtdProd(false);
      }
    } catch (ex) {
      setError(ex instanceof Error ? ex.message : "Erro ao buscar imagens");
    }
  };

  if (!products.length && usePicsum) {
    return <Await semProdutos={qtdProd} />;
  }

  return (
    <div>
      {!usePicsum && !products.length && !error && (
        <button onClick={handleLogin}>Conectar ao Google Drive</button>
      )}
      {error && <p>{error}</p>}
      <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
