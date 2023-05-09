import { useEffect, useState } from 'react';
import Head from '@/components/Head';
import Loading from '@/components/Loading';
import useAuth from '@/lib/hooks/useAuth';
import { createRunner } from '@/lib/firebaseUtils';
import useCollectionAsDict from '@/lib/hooks/useCollectionAsDict';
import { Runner } from '@/lib/interfaces';
import { themedPromiseToast } from '@/lib/utils';

export default function AssistantCreateRunner() {
  const [runners, runnersLoading, runnersError] = useCollectionAsDict<Runner>(
    'apps/24-stunden-lauf/runners'
  );

  const { isLoggedIn, user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [number, setNumber] = useState(0);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user) {
    return <Loading />;
  }

  async function createRunnerHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (submitting) {
      return;
    }

    setSubmitting(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const name = formData.get('name') as string;

    themedPromiseToast(createRunner(name, runners), {
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
      <main className="main">
        <div className="small-card">
          <div className="card-body gap-3">
            {number != 0 ? (
              <>
                <h1 className="text-center text-xl font-bold">
                  Läufer erstellt
                </h1>
                <input
                  name={'text'}
                  className="input-bordered input input-disabled w-full max-w-xs"
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
                  className="input-bordered input w-full max-w-xs"
                  placeholder="Name"
                  autoFocus
                  type="text"
                  required
                  minLength={3}
                />
                <button
                  className={`btn-outline btn-primary btn w-full ${
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
