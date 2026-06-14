import { failure, success, type ResultAsync } from "../result";

const CSV_EXTENSION_NAME = ".CSV";
const DATA_FILE_NAME_PREFIX = "DATA";
const PROFILE_FILE_NAME_PREFIX = "PROF";

export type RawUserRecord = {
  id: number;
  profile: string;
  data: string;
};

type ProfRaw = {
  model: string;
  birthDateDmy: string;
  bodyTypeCode: number;
  genderCode: number;
  heightCm: number;
  activityLevelCode: number;
  checksum: string;
};

type DataRaw = {
  model: string;
  dateDmy: string;
  timeHms: string;
  genderCode: number;
  ageYears: number;
  heightCm: number;
  activityLevelCode: number;
  bodyTypeCode: number;
  weightKg: number;
  bmi: number;
  fatPercent: number;
  fatRightArmPct: number;
  fatLeftArmPct: number;
  fatRightLegPct: number;
  fatLeftLegPct: number;
  fatTrunkPct: number;
  musclePercent: number | null;
  muscleRightArmPct: number | null;
  muscleLeftArmPct: number | null;
  muscleRightLegPct: number | null;
  muscleLeftLegPct: number | null;
  muscleTrunkPct: number | null;
  boneKg: number | null;
  waterPercent: number | null;
  visceralFatRating: number | null;
  metabolicAgeYears: number | null;
  dailyCalorieIntakeKcal: number | null;
  checksum: string;
  extras: Array<[string, string]>;
};

type Profile = {
  birthDate: Date;
  gender: Gender;
  heightCm: number;
  activityLevelCode: number;
  bodyTypeCode: number;
};

export type Measurement = {
  measuredAt: Date;
  ageYears: number;
  activityLevelCode: number;
  bodyTypeCode: number;
  weightKg: number;
  bmi: number;
  fatPercent: number;
  fatRightArmPct: number;
  fatLeftArmPct: number;
  fatRightLegPct: number;
  fatLeftLegPct: number;
  fatTrunkPct: number;
  musclePercent: number | null;
  muscleRightArmPct: number | null;
  muscleLeftArmPct: number | null;
  muscleRightLegPct: number | null;
  muscleLeftLegPct: number | null;
  muscleTrunkPct: number | null;
  boneKg: number | null;
  waterPercent: number | null;
  visceralFatRating: number | null;
  metabolicAgeYears: number | null;
  dailyCalorieIntakeKcal: number | null;
};

export type UserData = {
  id: number;
  profile: Profile;
  measurements: Measurement[];
};

enum Gender {
  Unknown = "unknown",
  Male = "male",
  Female = "female",
}

type TanitaPair = {
  id: number;
  profile: File;
  data: File;
};

type TanitaRaw = ProfRaw & Omit<DataRaw, "extras">;
type TanitaRawKey = keyof TanitaRaw;
type TanitaRawValue = TanitaRaw[TanitaRawKey];
type TanitaSymbol = keyof typeof tanitaSymbolsToJsStrategy;

function getId(fileName: string): number | null {
  const name = fileName.toUpperCase();

  if (!name.endsWith(CSV_EXTENSION_NAME)) {
    return null;
  }

  const nameWithoutExtension = name.slice(0, -CSV_EXTENSION_NAME.length);

  const dataDigits = nameWithoutExtension.startsWith(DATA_FILE_NAME_PREFIX)
    ? nameWithoutExtension.slice(DATA_FILE_NAME_PREFIX.length)
    : null;
  const profileDigits = nameWithoutExtension.startsWith(
    PROFILE_FILE_NAME_PREFIX,
  )
    ? nameWithoutExtension.slice(PROFILE_FILE_NAME_PREFIX.length)
    : null;
  const digits = dataDigits ?? profileDigits;

  if (digits === null || digits === "") {
    return null;
  }

  const id = Number.parseInt(digits, 10);

  return Number.isInteger(id) ? id : null;
}

const tanitaSymbolsToJsStrategy = {
  MO: {
    key: "model",
    parse: (value: string) => unquote(value),
  },
  DB: {
    key: "birthDateDmy",
    parse: (value: string) => unquote(value),
  },
  DT: {
    key: "dateDmy",
    parse: (value: string) => unquote(value),
  },
  Ti: {
    key: "timeHms",
    parse: (value: string) => unquote(value),
  },
  Bt: {
    key: "bodyTypeCode",
    parse: (value: string) => parseNumber(value),
  },
  GE: {
    key: "genderCode",
    parse: (value: string) => parseNumber(value),
  },
  Hm: {
    key: "heightCm",
    parse: (value: string) => parseNumber(value),
  },
  AL: {
    key: "activityLevelCode",
    parse: (value: string) => parseNumber(value),
  },
  AG: {
    key: "ageYears",
    parse: (value: string) => parseNumber(value),
  },
  Wk: {
    key: "weightKg",
    parse: (value: string) => parseNumber(value),
  },
  MI: {
    key: "bmi",
    parse: (value: string) => parseNumber(value),
  },
  FW: {
    key: "fatPercent",
    parse: (value: string) => parseNumber(value),
  },
  Fr: {
    key: "fatRightArmPct",
    parse: (value: string) => parseNumber(value),
  },
  Fl: {
    key: "fatLeftArmPct",
    parse: (value: string) => parseNumber(value),
  },
  FR: {
    key: "fatRightLegPct",
    parse: (value: string) => parseNumber(value),
  },
  FL: {
    key: "fatLeftLegPct",
    parse: (value: string) => parseNumber(value),
  },
  FT: {
    key: "fatTrunkPct",
    parse: (value: string) => parseNumber(value),
  },
  mW: {
    key: "musclePercent",
    parse: (value: string) => parseNumber(value),
  },
  ml: {
    key: "muscleLeftArmPct",
    parse: (value: string) => parseNumber(value),
  },
  mr: {
    key: "muscleRightArmPct",
    parse: (value: string) => parseNumber(value),
  },
  mR: {
    key: "muscleRightLegPct",
    parse: (value: string) => parseNumber(value),
  },
  mL: {
    key: "muscleLeftLegPct",
    parse: (value: string) => parseNumber(value),
  },
  mT: {
    key: "muscleTrunkPct",
    parse: (value: string) => parseNumber(value),
  },
  bW: {
    key: "boneKg",
    parse: (value: string) => parseNumber(value),
  },
  ww: {
    key: "waterPercent",
    parse: (value: string) => parseNumber(value),
  },
  IF: {
    key: "visceralFatRating",
    parse: (value: string) => parseNumber(value),
  },
  rA: {
    key: "metabolicAgeYears",
    parse: (value: string) => parseNumber(value),
  },
  rD: {
    key: "dailyCalorieIntakeKcal",
    parse: (value: string) => parseNumber(value),
  },
  CS: {
    key: "checksum",
    parse: (value: string) => unquote(value),
  },
} satisfies Record<
  string,
  {
    key: TanitaRawKey;
    parse: (value: string) => TanitaRawValue;
  }
>;

const profileTanitaSymbols = new Set<TanitaSymbol>([
  "MO",
  "DB",
  "Bt",
  "GE",
  "Hm",
  "AL",
  "CS",
]);

const dataTanitaSymbols = new Set<TanitaSymbol>([
  "MO",
  "DT",
  "Ti",
  "GE",
  "AG",
  "Hm",
  "AL",
  "Bt",
  "Wk",
  "MI",
  "FW",
  "Fr",
  "Fl",
  "FR",
  "FL",
  "FT",
  "mW",
  "ml",
  "mr",
  "mR",
  "mL",
  "mT",
  "bW",
  "ww",
  "IF",
  "rA",
  "rD",
  "CS",
]);

function isTanitaSymbol(key: string): key is TanitaSymbol {
  return key in tanitaSymbolsToJsStrategy;
}

function applyTanitaValue(
  raw: Partial<TanitaRaw>,
  key: string,
  value: string,
  allowedSymbols: Set<TanitaSymbol>,
): boolean {
  if (!isTanitaSymbol(key) || !allowedSymbols.has(key)) {
    return false;
  }

  const strategy = tanitaSymbolsToJsStrategy[key];
  const writableRaw = raw as Record<TanitaRawKey, TanitaRawValue>;

  writableRaw[strategy.key] = strategy.parse(value);

  return true;
}

function profileFromRawProfieFileString(
  rawProfileString: string,
): Profile | null {
  const entries = rawProfileString.split(",");
  const rawProfile = createDefaultProfileRaw();

  for (let keyPointer = 0; keyPointer + 1 < entries.length; keyPointer += 2) {
    const key = (entries[keyPointer] as TanitaSymbol) ?? ("" as TanitaSymbol);
    const value = entries[keyPointer + 1] ?? "";

    if (applyTanitaValue(rawProfile, key, value, profileTanitaSymbols)) {
      continue;
    }

    console.warn("[Profile] Extra key:", key, "value:", value);
  }

  const birthDate = parseDateDmy(rawProfile.birthDateDmy);

  if (birthDate === null) {
    return null;
  }

  return {
    birthDate,
    bodyTypeCode: rawProfile.bodyTypeCode,
    activityLevelCode: rawProfile.activityLevelCode,
    heightCm: rawProfile.heightCm,
    gender: genderFromCode(rawProfile.genderCode),
  };
}

function measurementsFromRawDataFileString(raw: string): Measurement[] {
  const rows = raw.split(/\r?\n/).filter((line) => Boolean(line.trim()));
  if (!rows.length) {
    return [];
  }
  const measurements: Measurement[] = [];

  for (const row of rows) {
    const entries = row.split(",");
    const rawMeasure = createDefaultDataRaw();

    for (let keyPointer = 0; keyPointer + 1 < entries.length; keyPointer += 2) {
      const key = entries[keyPointer] ?? "";
      const value = entries[keyPointer + 1] ?? "";

      if (applyTanitaValue(rawMeasure, key, value, dataTanitaSymbols)) {
        continue;
      }

      console.warn("[Data] Extra key:", key, "value:", value);
      rawMeasure.extras.push([key, value]);
    }

    const measuredAt = parseDateTimeDmyHms(
      rawMeasure.dateDmy,
      rawMeasure.timeHms,
    );

    if (measuredAt === null) {
      //TODO: mb something else?
      continue;
    }

    measurements.push({
      measuredAt,
      activityLevelCode: rawMeasure.activityLevelCode,
      bodyTypeCode: rawMeasure.bodyTypeCode,
      dailyCalorieIntakeKcal: rawMeasure.dailyCalorieIntakeKcal,
      metabolicAgeYears: rawMeasure.metabolicAgeYears,
      visceralFatRating: rawMeasure.visceralFatRating,
      waterPercent: rawMeasure.waterPercent,
      boneKg: rawMeasure.boneKg,
      muscleTrunkPct: rawMeasure.muscleTrunkPct,
      muscleLeftLegPct: rawMeasure.muscleLeftLegPct,
      muscleRightLegPct: rawMeasure.muscleRightLegPct,
      muscleRightArmPct: rawMeasure.muscleRightArmPct,
      muscleLeftArmPct: rawMeasure.muscleLeftArmPct,
      musclePercent: rawMeasure.musclePercent,
      fatTrunkPct: rawMeasure.fatTrunkPct,
      fatLeftLegPct: rawMeasure.fatLeftLegPct,
      fatRightLegPct: rawMeasure.fatRightLegPct,
      fatLeftArmPct: rawMeasure.fatLeftArmPct,
      fatRightArmPct: rawMeasure.fatRightArmPct,
      fatPercent: rawMeasure.fatPercent,
      bmi: rawMeasure.bmi,
      weightKg: rawMeasure.weightKg,
      ageYears: rawMeasure.ageYears,
    });
  }
  return measurements;
}

function createDefaultProfileRaw(): ProfRaw {
  return {
    model: "",
    birthDateDmy: "",
    bodyTypeCode: 0,
    genderCode: 0,
    heightCm: 0,
    activityLevelCode: 0,
    checksum: "",
  };
}

function createDefaultDataRaw(): DataRaw {
  return {
    model: "",
    dateDmy: "",
    timeHms: "",
    genderCode: 0,
    ageYears: 0,
    heightCm: 0,
    activityLevelCode: 0,
    bodyTypeCode: 0,
    weightKg: 0,
    bmi: 0,
    fatPercent: 0,
    fatRightArmPct: 0,
    fatLeftArmPct: 0,
    fatRightLegPct: 0,
    fatLeftLegPct: 0,
    fatTrunkPct: 0,
    musclePercent: null,
    muscleRightArmPct: null,
    muscleLeftArmPct: null,
    muscleRightLegPct: null,
    muscleLeftLegPct: null,
    muscleTrunkPct: null,
    boneKg: null,
    waterPercent: null,
    visceralFatRating: null,
    metabolicAgeYears: null,
    dailyCalorieIntakeKcal: null,
    checksum: "",
    extras: [],
  };
}

async function readFileText(file: File): Promise<string> {
  return file.text();
}

function parseNumber(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function unquote(value: string): string {
  const trimmed = value.trim();

  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function genderFromCode(code: number): Gender {
  if (code === 1) return Gender.Male;
  if (code === 2) return Gender.Female;
  return Gender.Unknown;
}

function parseDateDmy(value: string): Date | null {
  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());

  if (match === null) {
    return null;
  }

  const day = Number.parseInt(match[1] ?? "", 10);
  const month = Number.parseInt(match[2] ?? "", 10);
  const year = Number.parseInt(match[3] ?? "", 10);
  const date = new Date(year, month - 1, day);

  if (!isSameLocalDate(date, year, month, day)) {
    return null;
  }

  return date;
}

function parseDateTimeDmyHms(dateDmy: string, timeHms: string): Date | null {
  const dateMatch = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(dateDmy.trim());
  const timeMatch = /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/.exec(timeHms.trim());

  if (dateMatch === null || timeMatch === null) {
    return null;
  }

  const day = Number.parseInt(dateMatch[1] ?? "", 10);
  const month = Number.parseInt(dateMatch[2] ?? "", 10);
  const year = Number.parseInt(dateMatch[3] ?? "", 10);
  const hour = Number.parseInt(timeMatch[1] ?? "", 10);
  const minute = Number.parseInt(timeMatch[2] ?? "", 10);
  const second = Number.parseInt(timeMatch[3] ?? "", 10);
  const date = new Date(year, month - 1, day, hour, minute, second);

  if (
    !isSameLocalDate(date, year, month, day) ||
    date.getHours() !== hour ||
    date.getMinutes() !== minute ||
    date.getSeconds() !== second
  ) {
    return null;
  }

  return date;
}

function isSameLocalDate(
  date: Date,
  year: number,
  month: number,
  day: number,
): boolean {
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export async function getRawUsersRecords({
  profileFiles,
  dataFiles,
}: {
  profileFiles: File[];
  dataFiles: File[];
}): ResultAsync<RawUserRecord[]> {
  try {
    const tanitaPairs: TanitaPair[] = [];

    for (const profFile of profileFiles) {
      const profFileId = getId(profFile.name);
      if (profFileId === null) {
        return failure({ message: "Profile file id not found" });
      }

      const dataFile = dataFiles.find(
        (dataF) => getId(dataF.name) === profFileId,
      );

      if (dataFile === undefined) {
        return failure({ message: "Profile and data files do not match" });
      }

      tanitaPairs.push({
        id: profFileId,
        profile: profFile,
        data: dataFile,
      });
    }

    const usersRecords: RawUserRecord[] = [];

    for (const pair of tanitaPairs) {
      const profileFileContent = await readFileText(pair.profile);
      const dataFileContent = await readFileText(pair.data);
      const firstProfileLine = profileFileContent
        .split(/\r?\n/)
        .find((line) => line.trim() !== "");

      if (firstProfileLine === undefined) {
        return failure({
          message: `Profile file ${pair.profile.name} is empty`,
        });
      }

      usersRecords.push({
        id: pair.id,
        profile: firstProfileLine,
        data: dataFileContent,
      });
    }

    return success(usersRecords);
  } catch (error: any) {
    return failure({ message: error.message || "Could not process files" });
  }
}

export function userMeasurementFromRaw(raw: RawUserRecord): UserData | null {
  const profile = profileFromRawProfieFileString(raw.profile);

  if (profile === null) {
    return null;
  }

  return {
    id: raw.id,
    profile,
    measurements: measurementsFromRawDataFileString(raw.data),
  };
}
