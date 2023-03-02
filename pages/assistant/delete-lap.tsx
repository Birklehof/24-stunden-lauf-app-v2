import { useEffect, useState } from "react";
import Head from "components/Head";
import Loading from "components/Loading";
import useAuth from "lib/hooks/useAuth";
import AssistantMenu from "components/AssistantMenu";
import useLaps from "lib/hooks/useLaps";
import useRunners from "lib/hooks/useRunners";
import Icon from "components/Icon";
import useStaff from "lib/hooks/useStaff";
import useStudents from "lib/hooks/useStudents";

export default function AssistantDeleteRound() {
  const { isLoggedIn, user } = useAuth();
  const { laps, deleteLap } = useLaps();
  const { runners } = useRunners();
  const { staff } = useStaff();
  const { students } = useStudents();

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
  }, [isLoggedIn]);

  if (!user || !laps || !runners || !staff || !students) {
    return <Loading />;
  }

  async function deleteLapHandler(lapId: string) {
    try {
      await deleteLap(lapId);
    } catch (e: any) {
      if (e instanceof Error) {
        alert(e.message);
        return;
      }
      throw e;
    }
  }

  return (
    <>
      <Head title="Assistent" />
      <main className="flex bg-base-200 justify-center h-screen items-center">
        <AssistantMenu />
        <div className="flex flex-row h-1/5 items-center gap-2 px-2 lg:px-0 w-full lg:w-1/2 justify-around">
          <div className="flex flex-start h-screen py-2 w-full justify-center overflow-y-scroll">
            <div className="flex flex-col flex-start gap-2 w-full">
              {laps
                .sort((a, b) => {
                  return (
                    // @ts-ignore
                    b.timestamp - a.timestamp
                  );
                })
                .map((lap) => (
                  <div
                    key={lap.id}
                    className="alert shadow py-2 px-3 rounded-full bg-base-100"
                  >
                    <div className="whitespace-nowrap overflow-hidden">
                      <button
                        className="btn btn-ghost btn-circle btn-sm text-error"
                        onClick={() => deleteLapHandler(lap.id)}
                      >
                        <Icon name="XCircleIcon" />
                      </button>
                      <span className="overflow-hidden text-ellipsis">
                        <span className="font-bold">
                          {"0".repeat(
                            3 - runners[lap.runnerId]?.number.toString().length
                          )}
                          {runners[lap.runnerId]?.number}
                          <span>
                            ,{"  "}
                            {runners[lap.runnerId]?.name}
                            {students[
                              runners[lap.runnerId]?.studentId || ""
                            ]?.firstName
                              .concat(" ")
                              .concat(
                                students[runners[lap.runnerId]?.studentId || ""]
                                  ?.lastName
                              )}
                            {staff[
                              runners[lap.runnerId]?.staffId || ""
                            ]?.firstName
                              .concat(" ")
                              .concat(
                                staff[runners[lap.runnerId]?.staffId || ""]
                                  ?.lastName
                              )}
                            ,{" "}
                            {
                              // Format hh:mm
                              lap.timestamp.toDate().getHours().toString() +
                                ":" +
                                lap.timestamp.toDate().getMinutes().toString()
                            }{" "}
                            {Math.floor(
                              (new Date().getTime() -
                                lap.timestamp.toDate().getTime()) /
                                (1000 * 3600 * 24)
                            ) > 0
                              ? "vor " +
                                Math.floor(
                                  (new Date().getTime() -
                                    lap.timestamp.toDate().getTime()) /
                                    (1000 * 3600 * 24)
                                ) +
                                " Tagen"
                              : "heute"}
                          </span>
                        </span>
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
