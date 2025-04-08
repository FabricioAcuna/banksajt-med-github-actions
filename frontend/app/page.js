"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className=" bg-white min-h-screen m-0 ">
      <header className="w-full h-20 border border-solid border-black bg-cyan-600 m-0 ">
        <nav className="flex justify-center items-center h-full">
          <ul className="flex justify-center gap-6 text-black">
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
      <section
        className="flex justify-center items-center min-h-screen"
        style={{
          backgroundImage:
            "url('https://www.bankid.com/assets/bankid/img/man-bank-sol.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div>
          <Link href={"/users"}>
            <button className=" border border-solid border-black rounded-sm py-5 px-10 text-black bg-green-500">
              Skapa användare
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
