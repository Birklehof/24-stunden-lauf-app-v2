import React from 'react';
import {
  signInWithPopup,
  signInWithRedirect,
  signInWithCustomToken,
} from 'firebase/auth';
import {
  auth,
  microsoftOAuthProvider,
} from '@/lib/firebase';
import useAuth from '@/lib/hooks/useAuth';
import { themedPromiseToast } from '@/lib/utils';

export default function LoginOptions() {
  const { isLoggedIn } = useAuth();

  const handleRunnerAuth = async () => {
    themedPromiseToast(signInWithPopup(auth, microsoftOAuthProvider), {
      pending: 'Anmeldung läuft...',
      success: {
        render: () => {
          return 'Willkommen zurück!';
        },
        icon: '👋',
        type: 'info',
      },
      error: 'Fehler beim Anmelden!',
    });
  };

  const handleStaffAuth = async () => {
    themedPromiseToast(
      signInWithCustomToken(
        auth,
        'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2lkZW50aXR5dG9vbGtpdC5nb29nbGVhcGlzLmNvbS9nb29nbGUuaWRlbnRpdHkuaWRlbnRpdHl0b29sa2l0LnYxLklkZW50aXR5VG9vbGtpdCIsImlhdCI6MTY5Mzk4ODU3MSwiZXhwIjoxNjkzOTkyMTcxLCJpc3MiOiJmaXJlYmFzZS1hZG1pbnNkay00eDg1ekBiaXJrbGVob2YtZjE5MzEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJzdWIiOiJmaXJlYmFzZS1hZG1pbnNkay00eDg1ekBiaXJrbGVob2YtZjE5MzEuaWFtLmdzZXJ2aWNlYWNjb3VudC5jb20iLCJ1aWQiOiJrWVBRWDNVS0FhTzFhNkNBQUlFcGVFNlNVNVYyIn0.PQbxYBURfnTg3vtqj_NaxKcsM5eHMzYyoDLQdmzcDOO_8jYypPbaM_KRxiOcaO7HdBvsb5t_C5VpFTKD7FLS0mqMHznHUQq-SWO-cNpsF_fTiocsCPry1RzL0CDeDnReu6g6xRYWVu-t2K2NM8U2hCc8uIi9vSA6JASAnWvsuF3AokkyD6zrQN3Wun4-qPr49bfnO9sOJsSNVPZ59CaiCvAccNYTWkqSN7Vtync46cmwX4DWHeDN5eTxMkX3r5CRMF5qAa4MLNTWyl0EGbyM33LUa0DhCMRwuN9Ge5Hcap25uvDjpYR9WofcIRk-D7T7IBHNwPXc4wtE5vwdWL0VrQ'
      ),
      {
        pending: 'Anmeldung läuft...',
        success: {
          render: () => {
            return 'Willkommen zurück!';
          },
          icon: '👋',
          type: 'info',
        },
        error: 'Fehler beim Anmelden!',
      }
    );
  };

  return (
    <>
      {/* This button is only for the e2e tests because the popup fails */}
      <button
        id="cypress-e2e-login"
        className="btn-primary btn-outline btn hidden"
        onClick={() => signInWithRedirect(auth, microsoftOAuthProvider)}
      >
        Cypress e2e Login
      </button>
      <button
        className="btn-primary btn-outline btn w-full"
        onClick={handleRunnerAuth}
        disabled={isLoggedIn}
      >
        {isLoggedIn && <span className="loading loading-spinner" />}
        Läufer
      </button>
      <div className="divider">
        <p className="text-sm font-bold tracking-wider text-gray-300">ODER</p>
      </div>
      <button
        className="btn-primary btn-outline btn w-full"
        onClick={handleStaffAuth}
        disabled={isLoggedIn}
      >
        {isLoggedIn && <span className="loading loading-spinner" />}
        Assistent
      </button>
    </>
  );
}
