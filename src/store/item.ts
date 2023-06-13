import { useState } from "react";
import { createContainer } from "unstated-next";
import { NoteItem } from "../types/item";

function useItem(initialState = []) {
  let [items, setItem] = useState<NoteItem[]>(initialState);
  let addItem = (_item: string, _parentId: string) => {
    if (_item === "") return;
    let newItem: NoteItem = { id: items.length, content: _item, parentId: _parentId };
    setItem([...items, newItem]);
  };
  let updateNoteItem = (_item: NoteItem) => {
    if (_item?.id && _item.content === "") {
        let newItems: NoteItem[] = items.filter(i => i.id !== _item.id)
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
    return items?.filter((item) => item?.parentId === parentId);
  };

  return { items, addItem, updateNoteItem, deleteItem, getItemsByParent };
}

export default createContainer(useItem);
