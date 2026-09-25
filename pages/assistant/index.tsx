import { useEffect, useRef, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import Icon from '@/components/Icon';
import { LapWithRunner } from '@/lib/interfaces';
import { assistantNavItems, themedErrorToast } from '@/lib/utils/';
import ListItem from '@/components/ListItem';
import { AuthAction, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';
import { functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';

function AssistantIndexPage() {
  const [createdLaps, setCreatedLaps] = useState<LapWithRunner[]>([]);
  const [number, setNumber] = useState(0);
  const [ignoreCooldown, setIgnoreCooldown] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const createLap = httpsCallable(functions, 'createLap');
  const deleteLap = httpsCallable(functions, 'deleteLap');

  const numberInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (/^\d$/.test(e.key)) {
        numberInputRef.current?.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function createNewLapHandler() {
    const lapNumber = number;

    if (!lapNumber) {
      return;
    }

    setNumber(0);

    await createLap({ number: lapNumber, ignoreCooldown })
      .then((result) => {
        const newLap = result.data as LapWithRunner;

        // Add new lap to list
        setCreatedLaps((prev) => [newLap, ...prev]);
      })
      .catch((error) => {
        console.error(error);
        themedErrorToast(
          `[${lapNumber}] ${error.message.replace(/\s*\[\d+\]$/, '')}`,
          {
            position: 'bottom-center',
            autoClose: 4000,
            draggable: false,
            hideProgressBar: true,
          }
        );
      });
  }

  async function deleteLapHandler(lapId: string) {
    await deleteLap({ lapId })
      .then(() => {
        // Focus input field
        numberInputRef.current?.focus();
        // Filer out deleted lap
        setCreatedLaps((prev) => prev.filter((lap) => lap.id !== lapId));
      })
      .catch((error) => {
        themedErrorToast(error.message, {
          position: 'bottom-center',
          autoClose: 4000,
          draggable: false,
          hideProgressBar: true,
        });
      });
  }

  return (
    <>
      <Head title="Helfer" />
      <Menu navItems={assistantNavItems} />

      <main className="flex flex-row justify-around">
        <div className="flex justify-center items-center w-fit">
          <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit">
            <legend className="fieldset-legend text-lg">Runde zählen</legend>
            <input
              ref={numberInputRef}
              aria-label="Startnummer"
              autoCorrect="off"
              spellCheck="false"
              autoComplete="off"
              id="number"
              name="number"
              className="font-mono input input-bordered box-border h-44 w-72 rounded-box text-center text-9xl font-medium "
              autoFocus
              onChange={(e) => {
                e.preventDefault();

                const value = e.target.value;

                if (!isNaN(+value)) {
                  const number = +value;

                  if (number < 1000) {
                    setNumber(number);
                  }
                }
              }}
              onKeyDown={async (e) => {
                if (e.key === '.') {
                  e.preventDefault();
                  setNumber(0);
                  return;
                } else if (e.key === 'Enter') {
                  await createNewLapHandler();
                }
              }}
              type="text"
              value={Number(number).toString()}
              min={0}
              required
              inputMode="numeric"
            />
            <label className="label hidden">
              <input
                type="checkbox"
                className="toggle"
                checked={ignoreCooldown}
                onChange={(e) => setIgnoreCooldown(e.target.checked)}
              />
              Cooldown ignorieren
            </label>
            <div className="label text-xs">
              Drücke <kbd className="kbd kbd-xs">Enter</kbd>, um eine Runde zu
              zählen
            </div>
          </fieldset>
        </div>
        <ul className="list h-[calc(100vh-4rem)] overflow-y-scroll grow max-w-2/3">
          {createdLaps.length > 0 ? (
            <>
              {createdLaps
                .sort((a, b) => {
                  return b.createdAt - a.createdAt;
                })
                .map((lap) => (
                  <ListItem
                    key={lap.id + lap.createdAt}
                    medals={false}
                    number={lap.runner.number}
                    mainContent={lap.runner.name.concat(
                      lap.runner.class
                        ? ', '.concat(lap.runner.class || '')
                        : ''
                    )}
                    secondaryContent={
                      new Date(lap.createdAt)
                        .toLocaleTimeString('de-DE')
                        .toString() + ' Uhr'
                    }
                    badgeContent={
                      lap.runner.laps
                        ? lap.runner.laps.toString().concat('. Runde')
                        : ''
                    }
                  >
                    <button
                      disabled={!lap.id}
                      className="btn btn-circle btn-ghost btn-sm hidden text-error md:flex"
                      aria-label="Runde löschen"
                      onClick={async () => {
                        if (isDeleting) return;

                        setIsDeleting(true);

                        try {
                          await deleteLapHandler(lap.id);
                        } finally {
                          setIsDeleting(false);
                        }
                      }}
                    >
                      <Icon name="TrashIcon" />
                    </button>
                  </ListItem>
                ))}
              <li className="p-4 opacity-60 tracking-wide text-center">
                Zuletzt gezählte Runden
              </li>
            </>
          ) : (
            <li className="p-4 opacity-60 tracking-wide text-center">
              Noch keine Runden gezählt
            </li>
          )}
        </ul>
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  LoaderComponent: Loading,
})(AssistantIndexPage);
