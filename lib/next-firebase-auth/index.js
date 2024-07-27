import { init } from 'next-firebase-auth';
import { firebaseConfig } from '@/lib/firebase/firebaseConfig';
import { themedErrorToast } from '../utils';

const initAuth = () => {
  // console.log('initAuth');

  init({
    authPageURL: '/',
    appPageURL: '/redirect',
    loginAPIEndpoint: '/api/auth/login',
    logoutAPIEndpoint: '/api/auth/logout',
    onLoginRequestError: () => {
      themedErrorToast('Fehler beim Einloggen');
    },
    onLogoutRequestError: () => {
      themedErrorToast('Fehler beim Ausloggen');
    },
    // Use application default credentials (takes precedence over firebaseAdminInitConfig if set)
    // useFirebaseAdminDefaultCredential: true,
    firebaseAdminInitConfig: {
      credential: {
        projectId: firebaseConfig.projectId,
        clientEmail: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')
          ?.client_email,
        // The private key must not be accessible on the client side.
        privateKey: JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}')
          ?.private_key,
      },
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    },
    firebaseClientInitConfig: firebaseConfig,
    // tenantId: 'example-tenant-id', // Optional, only necessary in multi-tenant configuration
    cookies: {
      name: '24 Stunden Lauf App', // required
      // Keys are required unless you set `signed` to `false`.
      // The keys cannot be accessible on the client side.
      keys: [
        process.env.COOKIE_SECRET_CURRENT,
        process.env.COOKIE_SECRET_PREVIOUS,
      ],
      httpOnly: true,
      maxAge: 12 * 60 * 60 * 24 * 1000, // twelve days
      overwrite: true,
      path: '/',
      sameSite: 'lax',
      secure: false,
      signed: true,
    },
    onVerifyTokenError: () => {
      themedErrorToast('Fehler beim Verifizieren des Tokens');
    },
    onTokenRefreshError: () => {
      themedErrorToast('Fehler beim Aktualisieren des Tokens');
    },
  });
};

export default initAuth;
