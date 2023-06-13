type NoteItem = {
    id: string
    type: "FOLDER" | "NOTE"
    name?: string,
    content?: string,
    parentId: string,
}

export type {NoteItem}