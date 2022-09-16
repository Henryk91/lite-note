
import { useState } from "react";
import { createContainer } from "unstated-next";
  
function useItem(initialState = []) {
  
    let [items, setItem] = useState(initialState);
    let addItem = (_item, _parentId) => {
        if(_item === '') return
        let newItem = {id: items.length, content: _item, parentId: _parentId}
        setItem([...items, newItem]); 
    };
    let updateNoteItem = (_item) => {
        const itemIndex = items.findIndex(item => item.id === _item.id)
        let newItems = [...items]
        console.log('newItems',newItems);
        newItems[itemIndex] = _item
        setItem(newItems); 
    };
    let deleteItem = (_item) => {
        let newItem = items.filter((item) => item !== _item); 
        setItem(newItem);
    };
    return { items, addItem, updateNoteItem, deleteItem };
}

export default createContainer(useItem); 