"use client";
import { useEffect, useState } from "react";
import { category } from "../assets/categorie";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); // mobile if less than 768px
    };

    handleResize(); // Run once when mounted
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize); // Clean-up
  }, []);

  const handleClick = (id) => {
    dispatch(setSelectedCategory(id));
  };

  if (isMobile) return <></>;

  return (
    <aside className="hidden md:block w-1/4 px-8">
      <h2 className="text-xl font-semibold mb-4">Find Courses</h2>
      <ul className="space-y-2">
        {category.map((cat) => (
          <li
            key={cat._id}
            onClick={() => handleClick(cat._id)}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            {cat.name}
          </li>
        ))}
      </ul>
    </aside>
  );
}
