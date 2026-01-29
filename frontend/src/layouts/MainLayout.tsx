import { useState } from "react";
import { Outlet } from "react-router";

import Footer from "../components/Footer.tsx";
import Header from "../components/Header.tsx";

export default function MainLayout() {
  const [counter, setCounter] = useState(0);
  return (
    <>
      <Header />
      <main className="mb-10 flex max-w-[1440px] flex-grow flex-col items-center">
        <Outlet context={{ counter, setCounter }} />
      </main>
      <Footer />
    </>
  );
}
