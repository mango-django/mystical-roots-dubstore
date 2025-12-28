"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/lib/hooks/useUser";


const images = [
  "/hero/hero1.webp",
  "/hero/hero2.webp",
  "/hero/hero3.webp",
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const { user, isVIP, isAdmin } = useUser();


  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative h-[100svh] w-full overflow-hidden">

        {images.map((src, i) => (
        <div
          key={src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={src}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
