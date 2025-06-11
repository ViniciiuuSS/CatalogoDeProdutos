'use client';

import Image from 'next/image';
import { useInView } from 'react-intersection-observer';

type Product = {
  id: string;
  url: string;
  blur: string;
};

export default function ProductCard({ product }: { product: Product }) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  const pageUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/${product.id}`;
  const whatsappLink = `https://api.whatsapp.com/send?phone=5517981328002&text=${encodeURIComponent(
    `Olá, gostei deste produto: ${pageUrl}`
  )}`;

  return (
    <div key={product.id} ref={ref} className="group relative">
      <div className="mt-4 flex justify-between">
        <div>
          <h3 className="text-sm text-gray-700">
            <a href={whatsappLink}>
              {inView ? (
                <Image
                src={product.url}
                alt={`Produto ${product.id}`}
                width={500}
                height={500}
                placeholder="blur"
                blurDataURL={product.blur}
                quality={60}
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                />
              ) : (
                <div className="aspect-square w-full rounded-md bg-gray-200 lg:aspect-auto lg:h-80 animate-pulse" />
              )}
            </a>
          </h3>
        </div>
      </div>
    </div>
  );
}
