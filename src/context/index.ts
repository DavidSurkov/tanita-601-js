import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  userMeasurementFromRaw,
  type RawUserRecord,
  type UserData,
} from "../logic/parser";
import { failure, type Result, success } from "../result";
import { getErrorMessage } from "../helpers/error";

type UserMeasurementsContextValue = {
  userMeasurements: UserData[];
  setUserMeasurements: (data: UserData[]) => void;
  stroreRawUsersDataToLS: (data: RawUserRecord[]) => void;
  getRawUsersDataFromLS: () => Result<RawUserRecord[]>;
};

type UserMeasurementsProviderProps = {
  children: ReactNode;
};

const UserMeasurementsContext =
  createContext<UserMeasurementsContextValue | null>(null);

const USERS_LS_KEY = "rawUsersRecords";

const stroreRawUsersDataToLS = (data: RawUserRecord[]) => {
  localStorage.setItem(USERS_LS_KEY, JSON.stringify(data));
};

const getRawUsersDataFromLS = (): Result<RawUserRecord[]> => {
  const res = localStorage.getItem(USERS_LS_KEY);
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

export function UserMeasurementsProvider({
  children,
}: UserMeasurementsProviderProps) {
  const [userMeasurements, setUserMeasurements] = useState<UserData[]>([]);

  useEffect(() => {
    const dataInLS = getRawUsersDataFromLS();
    if (dataInLS.ok) {
      setUserMeasurements(
        dataInLS.value
          .map(userMeasurementFromRaw)
          .filter((userData): userData is UserData => userData !== null),
      );
    }

    return () => setUserMeasurements([]);
  }, []);

  return createElement(
    UserMeasurementsContext,
    {
      value: {
        userMeasurements,
        setUserMeasurements: (data) => {
          setUserMeasurements(data);
        },
        stroreRawUsersDataToLS,
        getRawUsersDataFromLS,
      },
    },
    children,
  );
}

export function useUserMeasurements(): UserMeasurementsContextValue {
  const context = useContext(UserMeasurementsContext);

  if (context === null) {
    throw new Error(
      "useUserMeasurements must be used inside UserMeasurementsProvider",
    );
  }

  return context;
}
