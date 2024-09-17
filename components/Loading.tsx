import Head from '@/components/Head';
import { getRandomEntry } from '@/lib/utils';
import { useEffect, useState } from 'react';

export default function Loading() {
  const [message, setMessage] = useState('');

  const funnyMessages = [
    'Kurz durchatmen ...',
    'Trinken nicht vergessen!',
    'Kurze Trinkpause',
    'Geduld bitte.',
    'Sind wir bald da?',
    'Es liegt nicht an dir ...',
    // eslint-disable-next-line quotes
    "Don't panic!",
    'Berechne Erfolgschancen',
    'Du bist ja immer noch hier',
    'Gleich fertig, versprochen!',
    '99 bottles of beer on the wall ...',
    'I think I am, therefore, I am.',
    'Optimismus ist nur ein Mangel an Information',
    'Proving P=NP ...',
    'Winter is coming ...',
    'Lade lustigen Spruch ...',
    'Klopf, klopf!',
    'Züchte Einhörner',
    'TODO: Fahrstuhlmusik',
    'Schönen Tag noch.',
    'Mit Senf oder Ketchup?',
    'Systeme werden hochgefahren ...',
    'Mein Einhorn sagt: Die Realität lügt',
    'Mit dem Hund spazieren ...',
    'Mist, dass hätte nicht ... *BOOM*',
    'Downloading more RAM ...',
    'Pixel werden gemalt',
    'Backe Eiscreme',
    'Geduld wird getestet ...',
    '3, 2, 1, ...',
    'Folge dem weißen Hasen',
    '*Lustigen Witz einfügen*',
    'Du, hier?',
    'Kaffee wird gekocht',
    'Schritt 1 von ...',
    'Meer wird geteilt',
  ];

  useEffect(() => {
    // Function to change the message
    const updateMessage = () => {
      setMessage(getRandomEntry(funnyMessages) || '');
    };

    // Call the function initially to set the first message
    updateMessage();

    // Set an interval to update the message every 15 seconds (15000 ms)
    const intervalId = setInterval(updateMessage, 15000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <Head title="Lädt ..." />
      <main className="items-center justify-center gap-10">
        <span
          aria-label="Ladeanimation"
          className="loading loading-infinity loading-lg scale-[300%]"
        />
        <p className="line-clamp-2 h-12 px-10 text-center">{message}</p>
      </main>
    </>
  );
}
