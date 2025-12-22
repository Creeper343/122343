// src/app/page.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HomeClient from "@/components/home/HomeClient";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <HomeClient />
      </main>
      <Footer />
    </div>
  );
}