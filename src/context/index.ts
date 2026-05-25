import {
  createContext,
  createElement,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { userMeasurementFromRaw, type UserData } from "../logic/parser";
import { getRawUsersDataFromLS } from "../hooks/useHandleTanitaFolderOpen";

type UserMeasurementsContextValue = {
  userMeasurements: UserData[];
  setUserMeasurements: (data: UserData[]) => void;
};

type UserMeasurementsProviderProps = {
  children: ReactNode;
};

const UserMeasurementsContext =
  createContext<UserMeasurementsContextValue | null>(null);

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
