import { useState, FormEvent } from 'react';
import Head from '@/components/Head';
import { assistantNavItems, themedErrorToast, themedPromiseToast } from '@/lib/utils/';
import { AuthAction, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';
import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import Loading from '@/components/Loading';

function AssistantCreateRunnerPage() {
  const [submitting, setSubmitting] = useState(false);
  const [number, setNumber] = useState(0);

  const createRunner = httpsCallable(functions, 'createRunner');

  async function createRunnerHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;

    if (email && email.length > 0) {
      const emailLower = email.toLowerCase();
      if (
        !emailLower.endsWith('@birklehof.de') &&
        !emailLower.endsWith('@s.birklehof.de') &&
        !emailLower.endsWith('@alumni.birklehof.de')
      ) {
        themedErrorToast('Nur Birklehof E-Mails erlaubt!');
        setSubmitting(false);
        return;
      }
    }

    let runner: { name: string; email?: string } = { name };

    if (email && email.length > 0) {
      runner.email = email;
    }

    themedPromiseToast(createRunner(runner), {
      pending: 'Läufer wird erstellt...',
      success: 'Läufer wurde erstellt!',
      error: {
        render: ({ data }: any) => {
          if (data instanceof Error) {
            return data.message;
          }
          return 'Unbekannter Fehler';
        },
      },
    })
      .then((response) => {
        setNumber(response.data.number);
      })
      .catch(() => {
        // Do nothing
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <>
      <Head title="Helfer" />
      <Menu navItems={assistantNavItems} />

      <main className="flex flex-col gap-4 pt-2 max-w-sm mx-auto">
        <fieldset className="fieldset border-base-300 rounded-box border p-4 h-fit w-full">
          <legend className="fieldset-legend text-lg font-semibold">
            Läufer hinzufügen
          </legend>
          {number != 0 ? (
            <>
              <input
                name={'text'}
                className="input-bordered input input-disabled w-full"
                readOnly={true}
                type={'text'}
                value={'Startnummer: ' + number}
                required
              />
              <button
                className="btn-primary btn"
                onClick={() => {
                  setNumber(0);
                }}
              >
                Okay!
              </button>
            </>
          ) : (
            <form
              onSubmit={createRunnerHandler}
              className="flex flex-col gap-3"
            >
              <input
                id="name"
                name="name"
                className="input-bordered input w-full"
                placeholder="Name"
                autoFocus
                type="text"
                required
                minLength={3}
              />
              <input
                id="email"
                name="email"
                className="input-bordered input w-full"
                placeholder="Email (optional)"
                type="email"
              />
              <button
                className={`btn-primary btn-outline btn ${
                  submitting ? 'btn-disabled' : ''
                }`}
                type="submit"
                disabled={submitting}
              >
                {submitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Hinzufügen
              </button>
            </form>
          )}
        </fieldset>
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
  whenUnauthedBeforeInit: AuthAction.SHOW_LOADER,
  LoaderComponent: Loading,
})(AssistantCreateRunnerPage);
