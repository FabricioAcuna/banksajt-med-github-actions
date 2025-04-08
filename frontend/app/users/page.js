"use client";

import Link from "next/link";
import { useState } from "react";

export default function User() {
  const [inputUser, setInputUser] = useState("");
  const [inputPass, setInputPass] = useState("");

  async function addUser() {
    const response = await fetch(
      "http://ec2-44-211-155-226.compute-1.amazonaws.com:3001/users",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: inputUser,
          password: inputPass,
        }),
      }
    );

    const data = await response.json();

    console.log("data", data);

    if (response.ok) {
      alert("användaren skapad");
      setInputUser("");
      setInputPass("");
    } else {
      alert("Error");
    }
  }

  return (
    <div>
      <header className="w-full h-20 border-b-2 border-solid border-black bg-cyan-700 ">
        <nav className="flex justify-center items-center h-full">
          <ul className="flex justify-center gap-6">
            <Link href={"/"}>
              <li>Hem</li>
            </Link>
            <Link href={"/sessions"}>
              <li>Logga in</li>
            </Link>
            <Link href={"/users"}>
              <li>Skapa användare</li>
            </Link>
          </ul>
        </nav>
      </header>
      <div className=" bg-white h-screen flex flex-col justify-center items-center gap-4">
        <div className="border border-solid border-black p-12">
          <h1 className=" font-semibold text-4xl text-black pb-10">
            Skapa användare
          </h1>

          <h2 className="text-black font-semibold"> Nytt Användarnamn</h2>
          <input
            className="border border-solid border-black p-3 rounded-sm text-black"
            value={inputUser}
            onChange={(e) => setInputUser(e.target.value)}
          ></input>

          <h2 className="text-black font-semibold pt-6"> Nytt Lösenord</h2>

          <input
            className="border border-solid border-black p-3 rounded-sm text-black"
            value={inputPass}
            onChange={(e) => setInputPass(e.target.value)}
          ></input>
          <div className=" flex justify-center m-6">
            <button
              className="border-2 border-solid border-black rounded-md py-3 px-8 text-black bg-blue-500"
              onClick={addUser}
            >
              Skapa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
