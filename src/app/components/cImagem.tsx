import Image from 'next/image';

export default function MeuComponente() {
  return (
    <Image
      className="h-23 w-auto"
      src="/img/logo_transparente.png" // Caminho relativo a partir de /public
      alt="Logo"
      width={200} // Substitua por largura real da imagem
      height={64} // Substitua por altura real da imagem
    />
  );
}