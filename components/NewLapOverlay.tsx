import { useEffect } from 'react';
import { useLocalStorage } from 'usehooks-ts';

export default function NewLapOverlay({
  lapCount,
}: {
  lapCount: number | undefined;
}) {
  const [lastLapCount, setLastLapCount] = useLocalStorage('lastLapCount', 0);

  useEffect(() => {
    if (lapCount === undefined) return;

    if (lapCount > lastLapCount) {
      setLastLapCount(lapCount);
      animateGrow();
    } else if (lapCount < lastLapCount) {
      setLastLapCount(lapCount);
    }
  }, [lapCount, lastLapCount, setLastLapCount]);

  function animateGrow() {
    // Animation currently not working because of there is no way to call the animation when the value of laps changes
    const grow = document.querySelector('.grow');
    const container = document.querySelector('.container');
    container?.classList.remove('hidden');
    grow?.classList.add('animate-[grow_4s_linear]');
    // Wait for animation to finish
    setTimeout(() => {
      grow?.classList.remove('animate-[grow_4s_linear]');
      container?.classList.add('hidden');
    }, 4000);
  }

  return (
    <>
      <div className="container fixed left-1/2 top-1/2 z-50 flex hidden aspect-square h-dvh! h-screen w-screen -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="z-50 flex aspect-square h-[300%] w-[300%] grow items-center justify-center rounded-full bg-success opacity-0">
          <h1 className="z-50 animate-[showText_1s_ease-in-out] text-5xl font-bold text-white">
            Runde {lapCount}
          </h1>
        </div>
      </div>
    </>
  );
}
