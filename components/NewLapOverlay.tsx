import { useEffect } from "react";

interface NewRoundOverlayProps {
  laps: number;
}

export default function NewLapOverlay({ laps }: NewRoundOverlayProps) {
  useEffect(() => {
    if (laps > 0) {
      animateGrow();
    }
  }, [laps]);

  function animateGrow() {
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
      <div className="hidden flex grow opacity-0 z-50 absolute w-[max(200vw,200vh)] h-[max(200vw,200vh)] bg-success justify-center items-center rounded-full">
        <h1 className="text-5xl text-white font-bold animate-[showText_1s_ease-in-out]">
          {laps}. Runde
        </h1>
      </div>
    </>
  );
}
