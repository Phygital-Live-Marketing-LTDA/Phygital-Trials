import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col gap-5 w-full h-screen items-center place-content-center bg-yellow-200">
      <h1 className="text-3xl mb-16 animate-bounce">
        Qual tela deseja visitar?
      </h1>
      <Link
        href="./production"
        className="w-56 text-center bg-yellow-100 ring-2 ring-black p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold "
      >
        Time de Produção
      </Link>
      <Link
        href="./user"
        className="w-56 text-center bg-yellow-100 ring-2 ring-black p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold "
      >
        Escolha do usuário
      </Link>
      <Link
        href="./result"
        className="w-56 text-center bg-yellow-100 ring-2 ring-black p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold "
      >
        Resultados
      </Link>
    </main>
  );
}
