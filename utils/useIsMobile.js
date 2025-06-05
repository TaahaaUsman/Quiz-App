import { useState, useEffect } from "react";

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateSize = () => {
      setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    };

    updateSize(); // Initial check
    window.addEventListener("resize", updateSize);

    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return isMobile;
};

export default useIsMobile;
