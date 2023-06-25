import About from "@/components/Content/Home/About";
import Hero from "@/components/Content/Home/Hero";
import Hod from "@/components/Content/Home/Hod";
import Industry from "@/components/Content/Home/Industry";
import Vision from "@/components/Content/Home/Vision";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleLoad = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000); // Adjust the duration as needed
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      document.addEventListener("readystatechange", handleLoad);
    }

    return () => {
      document.removeEventListener("readystatechange", handleLoad);
    };
  }, []);

  return (
    <>
      <Head>
        <title>Home | Department of Computer Science and Engineering</title>
        <meta name="description" content="Department of Computer Science and Engineering, MSRIT" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading ? (
        <div className="loading flex items-center justify-center h-screen">
          <Image src="/images/loading.gif" width={300} height={300} alt="loading" />
        </div>
      ) : (
        <div className="wrapper">
          <Hero />
          <About />
          <Hod />
          <Vision />
          <Industry />
        </div>
      )}
    </>
  );
}
