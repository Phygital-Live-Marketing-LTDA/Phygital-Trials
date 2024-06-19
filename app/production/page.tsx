"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import copo from "../../public/copo.png";
import { db } from "../config";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { useOnlineStatus } from "../store/statusContext";

const ProductionScreen = () => {
  const [selectedProduct, setSelectedProduct] = useState("");
  const { isOnline } = useOnlineStatus();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const savedProduct = localStorage.getItem("selectedProduct");
    if (savedProduct) {
      setSelectedProduct(savedProduct);
    }
  }, []);

  useEffect(() => {
    if (isOnline) {
      const fetchSelectedProduct = async () => {
        const docRef = doc(collection(db, "game"), "current");
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          if (
            docSnap.data().selectedProduct !==
            localStorage.getItem("selectedProduct")
          ) {
            localStorage.setItem(
              "selectedProduct",
              docSnap.data().selectedProduct
            );
            setSelectedProduct(docSnap.data().selectedProduct);
          }
        } else {
          console.log("No such document!");
        }
      };
      fetchSelectedProduct();

      const localProduct = localStorage.getItem("selectedProduct");
      if (localProduct) {
        const docRef = doc(collection(db, "game"), "current");
        setDoc(docRef, { selectedProduct: localProduct });
      }
    }
  }, [isOnline]);

  const handleProductChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedProduct(e.target.value);
    localStorage.setItem("selectedProduct", e.target.value);
  };

  const handleSubmit = async () => {
    if (isOnline) {
      const docRef = doc(collection(db, "game"), "current");
      await setDoc(docRef, { selectedProduct: selectedProduct });
    }
  };

  return (
    <div className="bg-yellow-200 h-screen place-content-center justify-center">
      <h1 className="text-center text-3xl font-semibold mb-10">
        Onde estará o Ninho novo?
      </h1>
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-center gap-40"
      >
        <div
          className={
            selectedProduct === "product1"
              ? "bg-yellow-400 ring-4 ring-black rounded-lg font-semibold border-black p-3"
              : ""
          }
        >
          <h2 className="text-2xl text-center mb-6">Copo 1</h2>
          <label>
            <input
              type="radio"
              value="product1"
              checked={selectedProduct === "product1"}
              onChange={handleProductChange}
              style={{ display: "none" }}
            />
            <Image
              src={copo}
              alt="Copo 1"
              width={400}
              height={400}
              className="hover:scale-105 transition hover:ease-in-out hover:cursor-pointer"
            />
          </label>
        </div>
        <div
          className={
            selectedProduct === "product2"
              ? "bg-yellow-400 rounded-lg font-semibold ring-4 ring-black p-3"
              : ""
          }
        >
          <h2 className="text-2xl text-center mb-6 ">Copo 2</h2>
          <label>
            <input
              type="radio"
              value="product2"
              checked={selectedProduct === "product2"}
              onChange={handleProductChange}
              style={{ display: "none" }}
            />
            <Image
              src={copo}
              alt="Copo 2"
              width={400}
              height={400}
              className="hover:scale-105 transition hover:ease-in-out hover:cursor-pointer"
            />
          </label>
        </div>
      </form>
      <div className="flex place-content-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-yellow-100 p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold border-2 border-black"
        >
          Salvar
        </button>
      </div>
    </div>
  );
};

export default ProductionScreen;
