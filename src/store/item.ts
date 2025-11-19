import { useCallback, useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { ItemType, NoteContent, NoteItem, NoteItemMap } from "../types/item";
import { createNoteV2, deleteNoteV2, getAllNotesV2, updateNoteV2 } from "../helpers/requests";
import { generateDocId, noteItemChanged, sortNoteItemsByDateAsc } from "../utils";

let called = false;
function useItem(initialState: NoteItemMap = { "": [] }) {
  let [items, setItem] = useState<NoteItemMap>(initialState);
  let [stateLoaded, setStateLoaded] = useState<boolean>(false);

  let getFolderContents = useCallback(
    (_item: NoteItem, done: () => void) => {
      if (items[_item.id]) {
        done();
        return;
      }
      getAllNotesV2(_item.id, (data: any) => {
        if (data?.[0]) {
          setItem((oldItems: NoteItemMap) => {
            oldItems[_item.id] = data?.[0]?.type === "LOG" ? sortNoteItemsByDateAsc(data) : data;
            return oldItems;
          });
        }

        done();
      });
    },
    [items, setItem]
  );

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (!called && userId) {
      getAllNotesV2(undefined, (data: any) => {
        if (data?.[0]) setItem({ "": data });
      });
      called = true;

      const localFolders = localStorage.getItem("selected-folders");
      const foldersToGet = localFolders ? JSON.parse(localFolders) : [];
      const localFolder = localStorage.getItem("selected-folder");
      if (localFolder && localFolder !== "undefined") foldersToGet.push(JSON.parse(localFolder));

      if (foldersToGet && foldersToGet.length > 0) {
        let count = 0;
        foldersToGet.forEach((folder: NoteItem) =>
          getFolderContents(folder, () => {
            count++;
            if (count === foldersToGet.length) {
              console.log("State load completed!");
              setStateLoaded(true);
            }
          })
        );
      } else {
        setStateLoaded(true);
      }
    }
  }, [getFolderContents]);

  let addItem = (_content: NoteContent, _parentId: string, done: () => void) => {
    if (_content.data === "") return;

    let newItem: NoteItem = {
      id: generateDocId(),
      content: _content,
      parentId: _parentId,
      type: _content.date ? ItemType.LOG : ItemType.NOTE,
    };

    createNoteV2(newItem, () => {
      setItem((oldItems: NoteItemMap) => {
        oldItems[_parentId]?.push(newItem);
        return oldItems;
      });
      done();
    });
  };
  let addFolder = (_item: { name: string; parent: string; folderId?: string }, done: () => void) => {
    if (_item.name === "") return;
    let newItem: NoteItem = {
      id: generateDocId(),
      name: _item.name,
      parentId: _item.parent,
      type: ItemType.FOLDER,
    };

    createNoteV2(newItem, () => {
      setItem((oldItems: NoteItemMap) => {
        oldItems[_item.parent]?.push(newItem);
        return oldItems;
      });
      done();
    });
  };
  let updateNoteItem = (_item: NoteItem, done: () => void) => {
    if (_item?.id && _item?.content?.data === "") {
      let newItems: NoteItem[] = items[_item.parentId].filter((i) => i.id !== _item.id);
      updateNoteV2(_item, (data: any) => {
        setItem((oldItems: NoteItemMap) => {
          oldItems[_item.parentId] = newItems;
          return oldItems;
        });
        done();
      });
    } else {
      const itemIndex: number = items[_item.parentId].findIndex((item) => item.id === _item.id);
      const oldItem = items[_item.parentId][itemIndex];

      if (noteItemChanged(oldItem, _item)) {
        updateNoteV2(_item, () => {
          setItem((oldItems: NoteItemMap) => {
            oldItems[_item.parentId][itemIndex] = _item;
            return oldItems;
          });
          done();
        });
      } else {
        done();
      }
    }
  };
  let deleteItem = (_item: NoteItem) => {
    let newItems: NoteItem[] = items[_item.parentId].filter((item) => item !== _item);
    items[_item.parentId] = newItems;

    deleteNoteV2(_item, () => {
      setItem((oldItems: NoteItemMap) => {
        oldItems[_item.id] = newItems;
        return oldItems;
      });
    });
  };
  let getItemsByParent = (parentId: string | undefined) => {
    return items[parentId ?? ""]?.filter((item) => item.type === "NOTE" || item.type === "LOG");
  };
  let getFoldersByParentId = (parentId: string) => {
    return items[parentId]?.filter((item) => item.type === "FOLDER");
  };
  let checkFolderHasItems = (parentId: string) => {
    return items[parentId]?.filter((item) => item?.parentId === parentId)?.length > 0;
  };

  return {
    stateLoaded,
    items,
    addItem,
    addFolder,
    updateNoteItem,
    deleteItem,
    getItemsByParent,
    getFoldersByParentId,
    checkFolderHasItems,
    getFolderContents,
  };
}

export default createContainer(useItem);
