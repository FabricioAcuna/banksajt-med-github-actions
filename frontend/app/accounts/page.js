"use client";
import { useLogin } from "@/context/loginContext";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Account() {
  const [balance, setBalance] = useState(0);
  const { otp } = useLogin();
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function fetchBalance() {
    setLoading(true);
    try {
      const response = await fetch(
        "http://ec2-44-211-155-226.compute-1.amazonaws.com:3001/accounts",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBalance(data.amount);
        setError("");
      } else {
        setError(data.message || "Failed to fetch balance");
      }
    } catch (error) {
      setError("Failed to fetch balance");
    } finally {
      setLoading(false);
    }
  }

  async function depositMoney() {
    setLoading(true);
    try {
      const response = await fetch(
        "http://ec2-44-211-155-226.compute-1.amazonaws.com:3001/me/accounts/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp, amount: Number(amount) }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        setBalance(data.balance);
        setError("");
      } else {
        setError(data.message || "Failed to deposit money");
      }
    } catch (error) {
      setError("Failed to deposit money");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (otp) {
      fetchBalance();
    }
  }, [otp]);

  return (
    <div className="bg-white min-h-screen">
      <header className="w-full h-20 border-b-2 border-solid border-black bg-cyan-700">
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
      <div className=" flex flex-col items-center pt-20">
        <h1 className="font-semibold text-3xl text-black text-center">
          Kontosida
        </h1>
        <p className="text-black pt-10 text-2xl">Saldo: {balance} SEK</p>

        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="flex gap-2 pt-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 border rounded-md text-black"
          />
          <button
            onClick={depositMoney}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Sätt in pengar
          </button>
          <button
            onClick={() => router.push("/sessions")}
            className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
          >
            Logga ut
          </button>
        </div>
      </div>
    </div>
  );
}
