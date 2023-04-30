import { Runner, Student, Staff } from "@/lib/interfaces";
import { ToastOptions, ToastPromiseParams, toast } from "react-toastify";

export function getRunnerName(
  runnerId: string,
  runners: { [id: string]: Runner },
  students: { [id: string]: Student },
  staff: { [id: string]: Staff }
): string {
  const runner = runners[runnerId];

  if (!runner) {
    return "Unbekannt";
  }

  if (runner.name) {
    return runner.name;
  } else if (runner.studentId) {
    const student = students[runner.studentId];
    if (student) {
      return student.firstName.concat(" ").concat(student.lastName);
    }
  } else if (runner.staffId) {
    const staffMember = staff[runner.staffId];
    if (staffMember) {
      return staffMember.firstName.concat(" ").concat(staffMember.lastName);
    }
  }

  return "Unbekannt";
}

export function themedPromiseToast(
  promise: Promise<any> | (() => Promise<any>),
  { pending, error, success }: ToastPromiseParams<any, unknown, unknown>,
  options?: ToastOptions<{}> | undefined
) {
  return toast.promise(
    promise,
    {
      pending,
      success,
      error,
    },
    {
      ...options,
      theme:
        localStorage.getItem("usehooks-ts-dark-mode") === "dark"
          ? "dark"
          : "light",
    }
  );
}
