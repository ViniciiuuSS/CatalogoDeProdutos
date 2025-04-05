"use client";

import { Key, useEffect, useState } from "react";
import Await from "./await";

export default function Produtos() {
  const [products, setProducts] = useState<{ id: string | null | undefined; href: string | undefined; url: string | undefined }[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/imagens", { method: "GET" });
      if (!response.ok) {
        console.error("Erro ao buscar imagens:", response.statusText);
        return;
      }
      const data = await response.json();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  if (!products.length) {
    return <Await />;
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {products.map((product) => (
        <div key={product.id} className="group relative">
          <img src={product.url} alt={`Produto ${product.id}`} className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80" />
          <div className="mt-4 flex justify-between">
            <div>
              <h3 className="text-sm text-gray-700">
                <a href={product.href}>
                  <span aria-hidden="true" className="absolute inset-0" />
                </a>
              </h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
