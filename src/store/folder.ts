import { useState } from "react";
import { createContainer } from "unstated-next";
import { Folder } from "../types/folder";
  
function useFolder(initialState = []) {
    let [items, setItems] = useState<Folder[]>(initialState);
    let addItem = (_item: string) => {
        if (_item === '') return
        let newItem: Folder = {id: items.length.toString(), name: _item}
        setItems([...items, newItem]);
    };
    let deleteItem = (_item: Folder) => {
        let newItem: Folder[] = items.filter((item) => item !== _item);
        setItems(newItem);
    };
    return { items, addItem, deleteItem };
}
  
export default createContainer(useFolder);