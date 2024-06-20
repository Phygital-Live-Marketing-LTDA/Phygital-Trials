"use client";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config";
import ResultsChart from "../components/chart";
import { useOnlineStatus } from "../store/statusContext";
import Link from "next/link";

const ResultsScreen = () => {
  const [results, setResults] = useState<
    { userId: string; selectedOption: any; isCorrect: boolean }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showMessage, setShowMessage] = useState(true);

  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const gameCollection = collection(db, "game");

    const unsubscribe = onSnapshot(gameCollection, async (gameSnapshot) => {
      const results = [];

      for (const gameDoc of gameSnapshot.docs) {
        const userId = gameDoc.id;

        if (userId === "current") continue;

        const userDocRef = doc(db, "game", userId);
        const userDoc = await getDoc(userDocRef);

        if (userDoc && userDoc.exists()) {
          const selectedOption = userDoc.data().selectedOption;
          const correctProductRef = doc(db, "game", "current");
          const correctProductDoc = await getDoc(correctProductRef);
          const correctProduct = correctProductDoc.data()?.selectedProduct;

          results.push({
            userId,
            selectedOption,
            isCorrect: selectedOption === correctProduct,
          });
        }
      }

      setResults(results);
      setLoading(false);
    });

    // Limpe a inscrição ao desmontar
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="bg-yellow-200 w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-200 h-screen place-content-center justify-center">
      <h1 className="relative text-center text-5xl font-semibold">
        <span className="animate-pulse">🔴</span>
        Resultados ao vivo
      </h1>
      <h2 className="text-center text-2xl font-semibold">
        Total de votos: {results.length}
      </h2>
      <div className="flex items-center justify-center">
        <ResultsChart results={results} />
      </div>
      {showMessage &&
        (!isOnline ? (
          <div className="fixed top-0 right-0 m-6 bg-slate-50 text-red-800 p-4 rounded">
            ❌ Você não está conectado!
          </div>
        ) : (
          <div className="fixed top-0 right-0 m-6 bg-slate-50 text-green-800 p-4 rounded">
            ✅ Conectado!
          </div>
        ))}
      <div className="flex gap-6 place-content-center mt-10">
        <Link
          href="/"
          className="bg-yellow-100 p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold border-2 border-black"
        >
          Menu
        </Link>
      </div>
    </div>
  );
};

export default ResultsScreen;
