type NoteContent = {
  date?: string;
  data: string;
};

export enum ItemType {
  FOLDER = "FOLDER",
  NOTE = "NOTE",
  LOG = "LOG",
}

export type NoteItem = {
  userId?: string;
  id: string;
  type: ItemType;
  name?: string;
  content?: NoteContent;
  parentId: string;
};

export type NoteItemMap = {
  [key: string]: NoteItem[];
};
