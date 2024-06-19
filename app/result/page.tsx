"use client";
import { useEffect, useState } from "react";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  DocumentData,
} from "firebase/firestore";
import { db } from "../config";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

const ResultScreen = () => {
  const [correctChoices, setCorrectChoices] = useState<DocumentData[]>([]);
  const [incorrectChoices, setIncorrectChoices] = useState<DocumentData[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUserId(localStorage.getItem("userId"));
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      const docRef = doc(collection(db, "game"), "current");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const gameData = docSnap.data();
        const productionChoice = gameData.selectedProduct;
        console.log("Production choice:", productionChoice);

        const userRef = doc(db, "game", userId);
        const userChoicesCollection = collection(userRef, "userChoices");
        const userChoicesSnapshot = await getDocs(userChoicesCollection);

        let newCorrectChoices: DocumentData[] = [];
        let newIncorrectChoices: DocumentData[] = [];

        userChoicesSnapshot.forEach((doc) => {
          const userChoiceData = doc.data();
          const selectedOption = userChoiceData.selectedOption;
          if (selectedOption === productionChoice) {
            newCorrectChoices.push(doc.data());
          } else {
            newIncorrectChoices.push(doc.data());
          }
        });

        setCorrectChoices(newCorrectChoices);
        setIncorrectChoices(newIncorrectChoices);
      }
    };

    fetchData();
  }, [userId]);

  const data = [
    {
      name: "Respostas",
      Corretas: correctChoices.length,
      Incorretas: incorrectChoices.length,
    },
  ];

  if (!userId) return null;

  return (
    <div>
      <h1>Result Screen</h1>
      <h2>Correct Choices</h2>
      <p>{correctChoices.length}</p>
      <h2>Incorrect Choices</h2>
      <ul>
        <p>{incorrectChoices.length}</p>
      </ul>
      <BarChart width={500} height={300} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis
          tickFormatter={(value) =>
            value === 0 ? "" : Math.floor(value).toString()
          }
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="Corretas" fill="#8884d8" />
        <Bar dataKey="Incorretas" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

export default ResultScreen;
