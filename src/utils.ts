import { ItemType, NoteItem } from "./types/item";

export const generateDocId = () => {
  let text = "";

  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 20; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

export function noteItemChanged(a: NoteItem, b: NoteItem): boolean {
  if (a === b) return false; // same reference

  // basic fields
  if (a.id !== b.id) return true;
  if (a.type !== b.type) return true;
  if (a.name !== b.name) return true;
  if (a.parentId !== b.parentId) return true;

  // content can be undefined or an object
  const c1 = a.content;
  const c2 = b.content;

  if (!c1 && !c2) return false; // both missing
  if (!c1 || !c2) return true; // one missing → changed

  // compare content fields
  if (c1.date !== c2.date) return true;
  if (c1.data !== c2.data) return true;

  return false;
}

function formatDate(input: string): string {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date format");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // Extract the weekday from the original input (first 3 chars)
  const weekday = input.slice(0, 3);

  return `${year}/${month}/${day} ${weekday}`;
}

export function processGetAllNotes(data: any) {
  let logDays: any = {};
  let createdByList: string[] = [];
  let newFolders: NoteItem[] = [];
  let newNotes: NoteItem[] = [];
  const userId = localStorage.getItem("userId") ?? "";
  data?.forEach((item: any) => {
    if (!createdByList.includes(item.createdBy)) {
      const mainFolder: NoteItem = {
        userId,
        id: item.createdBy,
        name: item.createdBy,
        parentId: "",
        type: ItemType.FOLDER,
      };
      newFolders.push(mainFolder);
      createdByList.push(item.createdBy);
    }

    if (!item.heading?.startsWith("Sub: ")) {
      const subFolder: NoteItem = {
        userId,
        id: item.id,
        name: item.heading === "" ? "Unnamed" : item.heading,
        parentId: item.createdBy,
        type: ItemType.FOLDER,
      };
      newFolders.push(subFolder);
    }

    let subSubFolderNames: string[] = [];
    item?.dataLable.forEach((label: any) => {
      const subSubFolderId = (item.id + "::" + label.tag).replaceAll(" ", "-");
      if (!subSubFolderNames.includes(label.tag)) {
        subSubFolderNames.push(label.tag);
        const subSubFolder: NoteItem = {
          userId,
          id: label.data.startsWith("href:") ? label.data.replace("href:", "") : subSubFolderId,
          name: label.tag === "" || !label.tag ? "Unnamed" : label.tag,
          parentId: item.id,
          type: ItemType.FOLDER,
        };
        newFolders.push(subSubFolder);
      }
      let content = { data: label.data, date: item.date };
      let noteType = ItemType.NOTE;

      let parentId = subSubFolderId;
      if (label.data.includes('"json":true')) {
        noteType = ItemType.LOG;
        const jsonData = label.data ? JSON.parse(label.data) : { data: "", date: "" };
        content = { data: jsonData.data, date: jsonData.date };
        const logDay = jsonData.date ? formatDate(jsonData.date.substring(0, 16).trim()) : "unknown";

        const logDayId = (subSubFolderId + "::" + logDay).trim().replaceAll(" ", "-");

        logDays[logDayId] = {
          userId,
          id: logDayId,
          name: logDay,
          parentId: subSubFolderId,
          type: ItemType.FOLDER,
        };

        parentId = logDayId;
      }
      const newNote: NoteItem = {
        userId,
        id: parentId + "::" + noteType + "::" + newNotes.length.toString(),
        content: content,
        parentId: parentId,
        type: noteType,
      };
      // logDays
      if (!label.data.startsWith("href:")) {
        newNotes.push(newNote);
      }
    });
  });
  if (newFolders?.length) {
    const logDayFolders: NoteItem[] = Object.values(logDays);

    const sortedLogDayFolders = logDayFolders.sort((a, b) => (b?.name ?? "").localeCompare(a?.name ?? ""));
    const itemsToSet = [...newFolders, ...newNotes, ...sortedLogDayFolders];
    return itemsToSet;
  }
  return [];
}

const checkIsToday = (dateString: string) => {
  const today = new Date();
  const someDate = new Date(dateString);
  return (
    someDate.getDate() === today.getDate() &&
    someDate.getMonth() === today.getMonth() &&
    someDate.getFullYear() === today.getFullYear()
  );
};

export function getLogDuration(currentDate: string, nextDate?: string) {
  const getTimeDifference = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const duration = endDate.getTime() - startDate.getTime();
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    let hoursString = hours < 10 ? "0" + hours : hours;
    let minutesString = minutes < 10 ? "0" + minutes : minutes;

    return hoursString + ":" + minutesString;
  };

  if (!nextDate) {
    if (checkIsToday(currentDate)) {
      nextDate = new Date() + "";
    }
  }

  const duration = nextDate ? "(" + getTimeDifference(currentDate, nextDate) + ")" : "";
  return duration;
}

export function sortNoteItemsByDateAsc(items: NoteItem[]): NoteItem[] {
  return [...items].sort((a, b) => {
    const dateA = a.content?.date ? new Date(a.content.date).getTime() : 0;
    const dateB = b.content?.date ? new Date(b.content.date).getTime() : 0;
    return dateA - dateB;
  });
}
