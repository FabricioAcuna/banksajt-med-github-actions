"use client";

import { useLogin } from "@/context/loginContext";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const { setOtp } = useLogin();
  const router = useRouter();

  async function User() {
    const response = await fetch(
      "http://ec2-44-211-155-226.compute-1.amazonaws.com:3001/sessions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: user,
          password: pass,
        }),
      }
    );

    const data = await response.json();
    console.log("data", data);

    if (data.otp) {
      alert("Inloggning Lyckades," + " " + "token: " + data.otp);
      setOtp(data.otp);
      router.push("/accounts");
    } else {
      alert("fel vid inloggning");
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
      <div className=" bg-white h-screen flex flex-col justify-center items-center">
        <div className=" border border-solid border-black p-12">
          <h1 className=" font-semibold text-4xl text-black pb-10 text-center">
            Logga in
          </h1>

          <h2 className="text-black font-semibold">Användarnamn</h2>
          <input
            className="border border-solid border-black p-2 rounded-sm text-black"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          ></input>

          <h2 className="text-black font-semibold pt-6">Lösenord</h2>
          <input
            className="border border-solid border-black p-2 rounded-sm text-black"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          ></input>
          <div className=" flex justify-center m-6">
            <button
              className="border-2 border-solid border-black rounded-md py-2 px-4 text-black bg-blue-500"
              onClick={User}
            >
              logga in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
