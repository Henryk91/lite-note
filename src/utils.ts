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
  data?.forEach((item: any) => {
    if (!createdByList.includes(item.createdBy)) {
      const mainFolder: NoteItem = {
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
          id: logDayId,
          name: logDay,
          parentId: subSubFolderId,
          type: ItemType.FOLDER,
        };

        parentId = logDayId;
      }
      const newNote: NoteItem = {
        id: parentId + "::" + noteType + "::" + newNotes.length.toString(),
        content: content,
        parentId: parentId,
        type: noteType,
      };
      if (parentId.includes("::Mon-Jan-20-2025")) {
        console.log("logDays[logDay]", logDays[parentId]);
        console.log("newNote", newNote);
      }

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
    console.log("itemsToSet", itemsToSet);
    // setItem(itemsToSet);
    return itemsToSet;
  }
  return [];
}
