import { useToast } from "../components/Toast";
import { useUserMeasurements } from "../context";
import { getErrorMessage } from "../helpers/error";
import {
  getRawUsersRecords,
  userMeasurementFromRaw,
  type RawUserRecord,
  type UserData,
} from "../logic/parser";
import { findTanitaFilesInFolder } from "../logic/walkDir";
import { success, failure, type Result, type ResultAsync } from "../result";

const RAW_USERS_EXPORT_FILE_NAME = "tanita-raw-users-records.json";

async function openFolderSelectDialog(): ResultAsync<FileSystemDirectoryHandle> {
  try {
    const dirHandle = await (
      window as unknown as ChromiumBasedWindow
    ).showDirectoryPicker();
    return success(dirHandle);
  } catch (error: unknown) {
    return failure({
      message: getErrorMessage(error, "Failed to open a folder"),
    });
  }
}

async function openJsonFileSelectDialog(): ResultAsync<File> {
  return new Promise<Result<File>>((resolve) => {
    const input = document.createElement("input");

    const cleanup = () => {
      input.removeEventListener("change", handleChange);
      input.removeEventListener("cancel", handleCancel);
      input.remove();
    };

    const handleChange = () => {
      const file = input.files?.[0] ?? null;
      cleanup();

      if (file === null) {
        resolve(failure({ message: "No import file selected" }));
        return;
      }

      resolve(success(file));
    };

    const handleCancel = () => {
      cleanup();
      resolve(failure({ message: "No import file selected" }));
    };

    input.type = "file";
    input.accept = "application/json,.json";
    input.multiple = false;
    input.hidden = true;

    input.addEventListener("change", handleChange);
    input.addEventListener("cancel", handleCancel);

    document.body.append(input);
    input.click();
  }).catch((error: unknown) => {
    return failure({
      message: getErrorMessage(error, "Failed to open an import file"),
    });
  });
}

function isRawUserRecord(value: unknown): value is RawUserRecord {
  if (value === null || typeof value !== "object") {
    return false;
  }

  const record = value as RawUserRecord;

  return (
    Number.isInteger(record.id) &&
    typeof record.profile === "string" &&
    typeof record.data === "string"
  );
}

function parseRawUserRecordsJson(raw: string): RawUserRecord[] {
  const parsed = JSON.parse(raw) as unknown;
  console.log(parsed);

  if (!Array.isArray(parsed) || !parsed.every(isRawUserRecord)) {
    throw new Error("Import file must contain RawUserRecord[] JSON data");
  }

  return parsed;
}

function createUserMeasurements(rawUsersRecords: RawUserRecord[]): UserData[] {
  return rawUsersRecords
    .map(userMeasurementFromRaw)
    .filter((userData): userData is UserData => userData !== null);
}

function downloadJsonFile(fileName: string, data: unknown): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

type ButtonClickHandle = () => void;

export function useHandleTanitaFolderOpen(): ButtonClickHandle {
  const { setToast } = useToast();
  const { setUserMeasurements, stroreRawUsersDataToLS } = useUserMeasurements();

  return async () => {
    const dialogResult = await openFolderSelectDialog();
    if (!dialogResult.ok) {
      setToast({
        message: dialogResult.error.message,
        type: "error",
      });
      return;
    }

    const tanitaFilesResult = await findTanitaFilesInFolder(dialogResult.value);
    if (!tanitaFilesResult.ok) {
      setToast({
        message: tanitaFilesResult.error.message,
        type: "error",
      });
      return;
    }

    const rawUsersRecordsResult = await getRawUsersRecords({
      dataFiles: tanitaFilesResult.value.data,
      profileFiles: tanitaFilesResult.value.prof,
    });

    if (!rawUsersRecordsResult.ok) {
      setToast({
        message: getErrorMessage(
          rawUsersRecordsResult.error,
          "Could not process files",
        ),
        type: "error",
      });
      return;
    }

    stroreRawUsersDataToLS(rawUsersRecordsResult.value);

    setUserMeasurements(createUserMeasurements(rawUsersRecordsResult.value));
  };
}

export function useImport(): ButtonClickHandle {
  const { setToast } = useToast();
  const { setUserMeasurements, stroreRawUsersDataToLS } = useUserMeasurements();

  return async () => {
    const fileResult = await openJsonFileSelectDialog();
    if (!fileResult.ok) {
      setToast({
        message: fileResult.error.message,
        type: "error",
      });
      return;
    }

    try {
      const rawUsersRecords = parseRawUserRecordsJson(
        await fileResult.value.text(),
      );

      stroreRawUsersDataToLS(rawUsersRecords);
      setUserMeasurements(createUserMeasurements(rawUsersRecords));
      setToast({
        message: `Imported ${rawUsersRecords.length} raw user records`,
        type: "success",
      });
    } catch (error: unknown) {
      setToast({
        message: getErrorMessage(error, "Could not import raw user records"),
        type: "error",
      });
    }
  };
}

export function useExport(): ButtonClickHandle {
  const { setToast } = useToast();
  const { getRawUsersDataFromLS } = useUserMeasurements();

  return () => {
    const rawUsersRecordsResult = getRawUsersDataFromLS();
    if (!rawUsersRecordsResult.ok) {
      setToast({
        message: rawUsersRecordsResult.error.message,
        type: "error",
      });
      return;
    }

    downloadJsonFile(RAW_USERS_EXPORT_FILE_NAME, rawUsersRecordsResult.value);
    setToast({
      message: `Exported ${rawUsersRecordsResult.value.length} raw user records`,
      type: "success",
    });
  };
}
