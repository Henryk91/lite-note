import { useState } from "react";
import { createContainer } from "unstated-next";
  
function useFolder(initialState = []) {
    let [items, setItems] = useState(initialState);
    let addItem = (_item) => {
        if (_item === '') return
        let newItem = {id: items.length, name: _item}
        setItems([...items, newItem]);
    };
    let deleteItem = (_item) => {
        let newItem = items.filter((item) => item !== _item);
        setItems(newItem);
    };
    return { items, addItem, deleteItem };
}
  
export default createContainer(useFolder);