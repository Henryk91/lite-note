import { useState } from "react";
import { createContainer } from "unstated-next";
import { FolderType } from "../types/folder";

function useFolder(initialState = []) {
  let [items, setItems] = useState<FolderType[]>(initialState);
  let addItem = (_item: { name: string; parent: string }) => {
    if (_item.name === "") return;
    let newItem: FolderType = { id: items.length.toString(), name: _item.name, parent: _item.parent };
    setItems([...items, newItem]);
  };
  let deleteItem = (_item: FolderType) => {
    let newItem: FolderType[] = items.filter((item) => item !== _item);
    setItems(newItem);
  };
  return { items, addItem, deleteItem };
}

export default createContainer(useFolder);
