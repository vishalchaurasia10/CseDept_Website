import About from "@/components/Content/Home/About";
import Hero from "@/components/Content/Home/Hero";
import Hod from "@/components/Content/Home/Hod";
import Industry from "@/components/Content/Home/Industry";
import Vision from "@/components/Content/Home/Vision";
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

  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  return (
    <>
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
