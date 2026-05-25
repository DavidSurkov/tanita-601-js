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
import { success, failure, type ResultAsync, type Result } from "../result";

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

const stroreRawUsersDataToLS = (data: RawUserRecord[]) => {
  localStorage.setItem("rawUsersRecords", JSON.stringify(data));
};

export const getRawUsersDataFromLS = (): Result<RawUserRecord[]> => {
  const res = localStorage.getItem("rawUsersRecords");
  if (!res) {
    return failure({ message: "Local storage does not have users records" });
  }
  try {
    return success(JSON.parse(res) as RawUserRecord[]);
  } catch (error) {
    return failure({
      message: getErrorMessage(error, "error happened during parsing"),
    });
  }
};

type ButtonClickHandle = () => void;

export function useHandleTanitaFolderOpen(): ButtonClickHandle {
  const { setToast } = useToast();
  const { setUserMeasurements } = useUserMeasurements();

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

    setUserMeasurements(
      rawUsersRecordsResult.value
        .map(userMeasurementFromRaw)
        .filter((userData): userData is UserData => userData !== null),
    );
  };
}
