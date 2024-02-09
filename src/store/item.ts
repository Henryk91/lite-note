import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { NoteItem } from "../types/item";
import { getAllNotes } from "../helpers/requests";

let called = false;
function useItem(initialState = []) {
  useEffect(() => {
    if (!called) {
      let createdByList: string[] = [];
      let newFolders: NoteItem[] = [];
      let newNotes: NoteItem[] = [];
      getAllNotes((data: any) => {
        data?.forEach((item: any) => {
          if (!createdByList.includes(item.createdBy)) {
            const mainFolder: NoteItem = {
              id: item.createdBy,
              name: item.createdBy,
              parentId: "",
              type: "FOLDER",
            };
            newFolders.push(mainFolder);
            createdByList.push(item.createdBy);
          }

          if (!item.heading?.startsWith("Sub: ")) {
            const subFolder: NoteItem = {
              id: item.id,
              name: item.heading === "" ? "Unnamed" : item.heading,
              parentId: item.createdBy,
              type: "FOLDER",
            };
            newFolders.push(subFolder);
          }

          let subSubFolderNames: string[] = [];
          item?.dataLable.forEach((label: any) => {
            const subSubFolderId = (item.id + label.tag).replaceAll(" ", "-");
            if (!subSubFolderNames.includes(label.tag)) {
              subSubFolderNames.push(label.tag);
              const subSubFolder: NoteItem = {
                id: label.data.startsWith("href:") ? label.data.replace("href:", "") : subSubFolderId,
                name: label.tag === "" || !label.tag ? "Unnamed" : label.tag,
                parentId: item.id,
                type: "FOLDER",
              };
              newFolders.push(subSubFolder);
            }

            const newNote: NoteItem = {
              id: subSubFolderId + "NOTE" + newNotes.length.toString(),
              content: label.data,
              parentId: subSubFolderId,
              type: "NOTE",
            };

            if (!label.data.startsWith("href:")) {
              newNotes.push(newNote);
            }
          });
        });
        if (newFolders?.length) {
          setItem([...newFolders, ...newNotes]);
        }
      });

      called = true;
    }
  }, []);

  let [items, setItem] = useState<NoteItem[]>(initialState);
  let addItem = (_item: string, _parentId: string) => {
    if (_item === "") return;
    let newItem: NoteItem = { id: items.length.toString(), content: _item, parentId: _parentId, type: "NOTE" };
    setItem([...items, newItem]);
  };
  let addFolder = (_item: { name: string; parent: string; folderId?: string }) => {
    if (_item.name === "") return;
    let newItem: NoteItem = {
      id: _item.folderId ?? items.length.toString(),
      name: _item.name,
      parentId: _item.parent,
      type: "FOLDER",
    };
    setItem([...items, newItem]);
  };
  let updateNoteItem = (_item: NoteItem) => {
    if (_item?.id && _item.content === "") {
      let newItems: NoteItem[] = items.filter((i) => i.id !== _item.id);
      setItem(newItems);
    } else {
      const itemIndex: number = items.findIndex((item) => item.id === _item.id);
      let newItems: NoteItem[] = [...items];
      newItems[itemIndex] = _item;
      setItem(newItems);
    }
  };
  let deleteItem = (_item: NoteItem) => {
    let newItems: NoteItem[] = items.filter((item) => item !== _item);
    setItem(newItems);
  };
  let getItemsByParent = (parentId: string) => {
    return items?.filter((item) => item?.parentId === parentId && item.type === "NOTE");
  };
  let getFoldersByParentId = (parentId: string) => {
    return items?.filter((item) => item?.parentId === parentId && item.type === "FOLDER");
  };
  let checkFolderHasItems = (parentId: string) => {
    return items?.filter((item) => item?.parentId === parentId)?.length > 0;
  };
  return {
    items,
    addItem,
    addFolder,
    updateNoteItem,
    deleteItem,
    getItemsByParent,
    getFoldersByParentId,
    checkFolderHasItems,
  };
}

export default createContainer(useItem);
