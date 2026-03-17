import React, { useState } from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithCustomToken,
} from 'firebase/auth';
import { auth, microsoftOAuthProvider } from '@/lib/firebase';
import { themedErrorToast, themedPromiseToast } from '@/lib/utils/';

export default function LoginOptions() {
  const [pending, setPending] = useState(false);

  const handleRunnerAuth = async () => {
    setPending(true);
    await themedPromiseToast(
      signInWithPopup(auth, microsoftOAuthProvider),
      {
        pending: 'Anmeldung läuft...',
        success: {
          render: () => {
            return 'Willkommen zurück!';
          },
          icon: () => {
            return '👋';
          },
          type: 'info',
        },
        error: 'Fehler beim Anmelden!',
      },
    );
  };

  const handleStaffAuth = async () => {
    setPending(true);

    // Ask user for a six digit code
    const code = prompt('Bitte gib den 6-stelligen Code ein:', '');

    if (!code || code.length !== 6 || !/^\d+$/.test(code)) {
      themedErrorToast('Fehlerhafter Code!');
      return;
    }

    // Check the code against the backend
    const response = await fetch('/api/auth/staff', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });

    if (!response.ok) {
      themedErrorToast('Fehler beim Anmelden!');
      return;
    }

    await themedPromiseToast(
      signInWithCustomToken(auth, (await response.json()).token),
      {
        pending: 'Anmeldung läuft...',
        success: {
          render: () => {
            return 'Willkommen zurück!';
          },
          icon: () => {
            return '👋';
          },
          type: 'info',
        },
        error: 'Fehler beim Anmelden!',
      }
    );
  };

  return (
    <>
      <button
        className="btn-primary btn-outline btn w-full text-lg"
        onClick={() => {
          handleRunnerAuth().finally(() => {
            setPending(false);
          });
        }}
        disabled={pending}
      >
        {pending && <span className="loading loading-spinner" />}
        Läufer*in
      </button>
      <div className="divider">
        <p className="text-sm font-semibold tracking-wider opacity-60">ODER</p>
      </div>
      <button
        className="btn-primary btn-outline btn w-full text-lg"
        onClick={() => {
          handleStaffAuth().finally(() => {
            setPending(false);
          });
        }}
        disabled={pending}
      >
        {pending && <span className="loading loading-spinner" />}
        Helfer*in
      </button>
    </>
  );
}
