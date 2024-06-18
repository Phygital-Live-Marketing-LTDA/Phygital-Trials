"use client";
// UserScreen.js
import React, { useState } from "react";

const UserScreen = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e: any) => {
    setSelectedOption(e.target.value);
  };

  const handleConfirm = () => {
    // Lógica para confirmar a escolha do usuário
  };

  return (
    <div>
      <h1>Escolha o Produto</h1>
      <form>
        <label>
          Produto 1:
          <input
            type="radio"
            value="product1"
            checked={selectedOption === "product1"}
            onChange={handleOptionChange}
          />
        </label>
        <label>
          Produto 2:
          <input
            type="radio"
            value="product2"
            checked={selectedOption === "product2"}
            onChange={handleOptionChange}
          />
        </label>
      </form>
      <button onClick={handleConfirm}>Confirmar Escolha</button>
    </div>
  );
};

export default UserScreen;
