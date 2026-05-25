/// <reference types="vite/client" />

type ChromiumBasedWindow = Window & {
  showDirectoryPicker: () => Promise<FileSystemDirectoryHandle>;
};
