import useRunner from '@/lib/hooks/useRunner';
import { useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export default function NewLapOverlay() {
  const { laps } = useRunner();
  const [lastLapCount, setLastLapCount] = useLocalStorage('lastLapCount', 0);

  useEffect(() => {
    if (laps > lastLapCount) {
      setLastLapCount(laps);
      animateGrow();
    }
  }, [laps]);

  function animateGrow() {
    // Animation currently not working because of there is no way to call the animation when the value of laps changes
    const grow = document.querySelector('.grow');
    grow?.classList.remove('hidden');
    grow?.classList.add('animate-[grow_4s_linear]');
    // Wait for animation to finish
    setTimeout(() => {
      grow?.classList.remove('animate-[grow_4s_linear]');
      grow?.classList.add('hidden');
    }, 4000);
  }

  return (
    <>
      <div className="absolute z-50 flex hidden h-[max(200vw,200vh)] w-[max(200vw,200vh)] grow items-center justify-center rounded-full bg-success opacity-0">
        <h1 className="animate-[showText_1s_ease-in-out] text-5xl font-bold text-white">
          {laps}. Runde
        </h1>
      </div>
    </>
  );
}
