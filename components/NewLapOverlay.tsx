import useRunner from "@/lib/hooks/useRunner";
import { useEffect, useMemo } from "react";
import { useLocalStorage } from "usehooks-ts";

export default function NewLapOverlay() {
  const { laps } = useRunner();
  const [lastLapCount, setLastLapCount] = useLocalStorage("lastLapCount", 0);

  useEffect(() => {
    if (laps > lastLapCount) {
      setLastLapCount(laps);
      animateGrow();
    }
  }, [laps]);

  function animateGrow() {
    // Animation currently not working because of there is no way to call the animation when the value of laps changes
    const grow = document.querySelector(".grow");
    grow?.classList.remove("hidden");
    grow?.classList.add("animate-[grow_4s_linear]");
    // Wait for animation to finish
    setTimeout(() => {
      grow?.classList.remove("animate-[grow_4s_linear]");
      grow?.classList.add("hidden");
    }, 4000);
  }

  return (
    <>
      <div className="hidden absolute flex opacity-0 grow z-50 w-[max(200vw,200vh)] h-[max(200vw,200vh)] bg-success justify-center items-center rounded-full">
        <h1 className="text-5xl text-white font-bold animate-[showText_1s_ease-in-out]">
          {laps}. Runde
        </h1>
      </div>
    </>
  );
}
