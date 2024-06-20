"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Howl } from "howler";
import { v4 as uuidv4 } from "uuid";
import { useOnlineStatus } from "../store/statusContext";

import { db } from "../config";
import copo from "../../public/copo.png";
import { useRouter } from "next/navigation";

const UserScreen = () => {
  const router = useRouter();

  const formRef = useRef<HTMLFormElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  const [selectedOption, setSelectedOption] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isToastVisible, setIsToastVisible] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  const { isOnline } = useOnlineStatus();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    const savedOption = localStorage.getItem("selectedOption");
    if (savedOption) {
      setSelectedOption(savedOption);
    }
  }, []);

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target !== modalContentRef.current) {
      handleCancel();
    }
  };

  const handleSubmit = () => {
    setIsModalOpen(true);
  };

  const handleConfirm = async () => {
    localStorage.setItem("selectedOption", selectedOption);
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.error("User ID is null");
      return;
    }

    if (isOnline) {
      const gameDoc = doc(db, "game", userId);
      await setDoc(
        gameDoc,
        { selectedOption: selectedOption },
        { merge: true }
      );
      const productionDoc = doc(db, "game", "current");
      const productionDocAnswer = await getDoc(productionDoc);
      const correctAnswer = productionDocAnswer.data()?.selectedProduct;
      const sound = new Howl({
        src: [selectedOption === correctAnswer ? "/success.mp3" : "/error.mp3"],
      });
      sound.play();
    }
    setIsModalOpen(false);
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 3000);
    router.push("/result");
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-yellow-200 h-screen place-content-center justify-center">
      <h1 className="text-center text-3xl font-semibold mb-10">
        Onde você acha que estava o Ninho novo?
      </h1>
      <form
        ref={formRef}
        onSubmit={(e) => e.preventDefault()}
        className="flex justify-center gap-40"
      >
        <div
          className={
            selectedOption === "product1"
              ? "bg-yellow-400 ring-4 ring-black rounded-lg font-semibold border-black p-3"
              : ""
          }
        >
          <h2 className="text-2xl text-center mb-6">Copo 1</h2>
          <label>
            <input
              type="radio"
              value="product1"
              checked={selectedOption === "product1"}
              onChange={handleOptionChange}
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
            selectedOption === "product2"
              ? "bg-yellow-400 rounded-lg font-semibold ring-4 ring-black p-3"
              : ""
          }
        >
          <h2 className="text-2xl text-center mb-6 ">Copo 2</h2>
          <label>
            <input
              type="radio"
              value="product2"
              checked={selectedOption === "product2"}
              onChange={handleOptionChange}
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
      <div className="flex gap-6 place-content-center mt-10">
        <Link
          href="/"
          className="bg-yellow-100 p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold border-2 border-black"
        >
          Menu
        </Link>
        <button
          onClick={handleSubmit}
          className="bg-yellow-100 p-3 rounded-xl transition-all hover:scale-110 hover:bg-yellow-400 hover:font-bold border-2 border-black"
        >
          Confirmar
        </button>
      </div>
      {isToastVisible && (
        <div className="fixed top-0 right-0 m-6 bg-slate-50 text-green-800 p-4 rounded">
          ✅ Resposta gravada com sucesso!
        </div>
      )}
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
      {isModalOpen && (
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          onClick={handleBackgroundClick}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div
              ref={modalContentRef}
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Confirmar escolha
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Está certo disso? 👀
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50  px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirm}
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-red-500 hover:text-white  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCancel}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserScreen;
