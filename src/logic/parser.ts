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

function parseProfileCsvRow(row: string): ProfRaw {
  const entries = row.split(",");
  const profileRaw = createDefaultProfileRaw();

  for (let keyPointer = 0; keyPointer + 1 < entries.length; keyPointer += 2) {
    const key = entries[keyPointer] ?? "";
    const value = entries[keyPointer + 1] ?? "";

    switch (key) {
      case "MO":
        profileRaw.model = unquote(value);
        break;
      case "DB":
        profileRaw.birthDateDmy = unquote(value);
        break;
      case "Bt":
        profileRaw.bodyTypeCode = parseNumber(value);
        break;
      case "GE":
        profileRaw.genderCode = parseNumber(value);
        break;
      case "Hm":
        profileRaw.heightCm = parseNumber(value);
        break;
      case "AL":
        profileRaw.activityLevelCode = parseNumber(value);
        break;
      case "CS":
        profileRaw.checksum = unquote(value);
        break;
      default:
        console.warn("[Profile] Extra key:", key, "value:", value);
    }
  }

  return profileRaw;
}

function parseDataCsvRow(row: string): DataRaw {
  const entries = row.split(",");
  const dataRaw = createDefaultDataRaw();

  for (let keyPointer = 0; keyPointer + 1 < entries.length; keyPointer += 2) {
    const key = entries[keyPointer] ?? "";
    const value = entries[keyPointer + 1] ?? "";

    switch (key) {
      case "MO":
        dataRaw.model = unquote(value);
        break;
      case "DT":
        dataRaw.dateDmy = unquote(value);
        break;
      case "Ti":
        dataRaw.timeHms = unquote(value);
        break;
      case "GE":
        dataRaw.genderCode = parseNumber(value);
        break;
      case "AG":
        dataRaw.ageYears = parseNumber(value);
        break;
      case "Hm":
        dataRaw.heightCm = parseNumber(value);
        break;
      case "AL":
        dataRaw.activityLevelCode = parseNumber(value);
        break;
      case "Bt":
        dataRaw.bodyTypeCode = parseNumber(value);
        break;
      case "Wk":
        dataRaw.weightKg = parseNumber(value);
        break;
      case "MI":
        dataRaw.bmi = parseNumber(value);
        break;
      case "FW":
        dataRaw.fatPercent = parseNumber(value);
        break;
      case "Fr":
        dataRaw.fatRightArmPct = parseNumber(value);
        break;
      case "Fl":
        dataRaw.fatLeftArmPct = parseNumber(value);
        break;
      case "FR":
        dataRaw.fatRightLegPct = parseNumber(value);
        break;
      case "FL":
        dataRaw.fatLeftLegPct = parseNumber(value);
        break;
      case "FT":
        dataRaw.fatTrunkPct = parseNumber(value);
        break;
      case "mW":
        dataRaw.musclePercent = parseNumber(value);
        break;
      case "ml":
        dataRaw.muscleLeftArmPct = parseNumber(value);
        break;
      case "mr":
        dataRaw.muscleRightArmPct = parseNumber(value);
        break;
      case "mR":
        dataRaw.muscleRightLegPct = parseNumber(value);
        break;
      case "mL":
        dataRaw.muscleLeftLegPct = parseNumber(value);
        break;
      case "mT":
        dataRaw.muscleTrunkPct = parseNumber(value);
        break;
      case "bW":
        dataRaw.boneKg = parseNumber(value);
        break;
      case "ww":
        dataRaw.waterPercent = parseNumber(value);
        break;
      case "IF":
        dataRaw.visceralFatRating = parseNumber(value);
        break;
      case "rA":
        dataRaw.metabolicAgeYears = parseNumber(value);
        break;
      case "rD":
        dataRaw.dailyCalorieIntakeKcal = parseNumber(value);
        break;
      case "CS":
        dataRaw.checksum = unquote(value);
        break;
      default:
        console.warn("[Data] Extra key:", key, "value:", value);
        dataRaw.extras.push([key, value]);
    }
  }

  return dataRaw;
}

function profileFromRawProfieFileString(raw: string): Profile | null {
  const row = parseProfileCsvRow(raw);
  const birthDate = parseDateDmy(row.birthDateDmy);

  if (birthDate === null) {
    return null;
  }

  return {
    birthDate,
    bodyTypeCode: row.bodyTypeCode,
    activityLevelCode: row.activityLevelCode,
    heightCm: row.heightCm,
    gender: genderFromCode(row.genderCode),
  };
}

function measurementsFromRawDataFileString(raw: string): Measurement[] {
  const rows = raw.split(/\r?\n/).filter((line) => Boolean(line.trim()));
  if (!rows.length) {
    return [];
  }
  const measurements: Measurement[] = [];

  for (const row of rows) {
    const rawMeasure = parseDataCsvRow(row);
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
