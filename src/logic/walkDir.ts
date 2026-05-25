import { failure, success, type ResultAsync } from "../result";

type FileSystemVisitor = {
  visitFile(handle: FileSystemFileHandle): Promise<void> | void;
  enterDirectory?(handle: FileSystemDirectoryHandle): Promise<void> | void;
  leaveDirectory?(handle: FileSystemDirectoryHandle): Promise<void> | void;
};

async function walkDir(
  dirHandle: FileSystemDirectoryHandle,
  visitor: FileSystemVisitor,
): Promise<void> {
  await visitor.enterDirectory?.(dirHandle);
  for await (const [, handle] of dirHandle.entries()) {
    if (handle.kind === "file") {
      await visitor.visitFile(handle);
    }

    if (handle.kind === "directory") {
      await walkDir(handle, visitor);
    }
  }
  await visitor.leaveDirectory?.(dirHandle);
}

function toFile(fileHandle: FileSystemFileHandle): Promise<File> {
  return fileHandle.getFile();
}

class TanitaFileVisitor implements FileSystemVisitor {
  public readonly dataFileHandles: FileSystemFileHandle[] = [];
  public readonly profFileHandles: FileSystemFileHandle[] = [];
  private pathArr: string[] = [];

  public get isCorrectFolder(): boolean {
    return !!this.dataFileHandles.length && !!this.profFileHandles.length;
  }

  public async enterDirectory(handle: FileSystemDirectoryHandle) {
    this.pathArr.push(handle.name);
    console.log(this.pathArr.join("/"));
  }

  public async leaveDirectory(handle: FileSystemDirectoryHandle) {
    this.pathArr.pop();
    console.log(this.pathArr.join("/"));
  }

  public async visitFile(handle: FileSystemFileHandle) {
    const name = handle.name; //no toUppercase coz case matters
    if (name.startsWith("DATA") && name.endsWith("CSV")) {
      this.dataFileHandles.push(handle);
    }

    if (name.startsWith("PROF") && name.endsWith("CSV")) {
      this.profFileHandles.push(handle);
    }
  }
}

export async function findTanitaFilesInFolder(
  dirHandle: FileSystemDirectoryHandle,
): ResultAsync<{ data: File[]; prof: File[] }> {
  try {
    const fileVisitor = new TanitaFileVisitor();
    await walkDir(dirHandle, fileVisitor);
    if (!fileVisitor.isCorrectFolder) {
      return failure({ message: "Incorrect folder. Should be GRAPHV1" });
    }
    const dataFiles = await Promise.all(
      fileVisitor.dataFileHandles.map(toFile),
    );

    const profFiles = await Promise.all(
      fileVisitor.profFileHandles.map(toFile),
    );
    return success({
      data: dataFiles,
      prof: profFiles,
    });
  } catch (error: any) {
    return failure({
      message: error.meesage || "Failed to find tanita files in the folder",
    });
  }
}
