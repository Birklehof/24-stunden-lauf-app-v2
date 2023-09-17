import { useState, FormEvent } from 'react';
import Head from '@/components/Head';
import { createRunner } from '@/lib/utils/firebase/frontend';
import { assistantNavItems, themedPromiseToast } from '@/lib/utils/';
import { AuthAction, useUser, withUser } from 'next-firebase-auth';
import Menu from '@/components/Menu';

function AssistantCreateRunnerPage() {
  const user = useUser();

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
        render: (error) => {
          if (error instanceof Error) {
            return error.message;
          }
          return 'Unbekannter Fehler';
        },
      },
    })
      .then((number) => {
        setNumber(number);
      })
      .finally(() => {
        setSubmitting(false);
      });
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="main !justify-center">
        <Menu navItems={assistantNavItems} signOut={user.signOut} />
        <div className="centered-card">
          <div className="card-body gap-3">
            {number != 0 ? (
              <>
                <h1 className="text-center text-xl font-bold">
                  Läufer erstellt
                </h1>
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
              <form
                onSubmit={createRunnerHandler}
                className="flex flex-col gap-3"
              >
                <h1 className="text-center text-xl font-bold">
                  Läufer hinzufügen
                </h1>
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
                    submitting ? 'btn-disabled loading' : ''
                  }`}
                  type="submit"
                  disabled={submitting}
                >
                  Hinzufügen
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default withUser({
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(AssistantCreateRunnerPage);
