import { useState, FormEvent } from 'react';
import Head from '@/components/Head';
import { createRunner } from '@/lib/utils/firebase/frontend';
import { assistantNavItems, themedPromiseToast } from '@/lib/utils/';
import { AuthAction, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';

function AssistantCreateRunnerPage() {
  const [submitting, setSubmitting] = useState(false);
  const [number, setNumber] = useState(0);

  async function createRunnerHandler(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;

    themedPromiseToast(createRunner(name), {
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
      .then((number) => {
        setNumber(number);
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

      <main className="p-10 gap-7 justify-start">
        <h1 className="text-2xl font-semibold">Läufer hinzufügen</h1>

        {number != 0 ? (
          <>
            <input
              name={'text'}
              className="input-bordered input input-disabled"
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
          <form onSubmit={createRunnerHandler} className="flex flex-col gap-3">
            <input
              id="name"
              name="name"
              className="input-bordered input"
              placeholder="Name"
              autoFocus
              type="text"
              required
              minLength={3}
            />
            <button
              className={`btn-primary btn-outline btn ${
                submitting ? 'btn-disabled' : ''
              }`}
              type="submit"
              disabled={submitting}
            >
              {submitting && <span className="loading loading-spinner"></span>}
              Hinzufügen
            </button>
          </form>
        )}
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AssistantCreateRunnerPage);
