
import { useState } from "react";
import { createContainer } from "unstated-next";
import { NoteItem } from "../types/item";

function useItem(initialState = []) {
  
    let [items, setItem] = useState<NoteItem[]>(initialState);
    let addItem = (_item: string, _parentId: string) => {
        if(_item === '') return
        let newItem: NoteItem = {id: items.length, content: _item, parentId: _parentId}
        setItem([...items, newItem]); 
    };
    let updateNoteItem = (_item: NoteItem) => {
        const itemIndex: number = items.findIndex(item => item.id === _item.id)
        let newItems: NoteItem[] = [...items]
        newItems[itemIndex] = _item
        setItem(newItems); 
    };
    let deleteItem = (_item: NoteItem) => {
        let newItems: NoteItem[] = items.filter((item) => item !== _item); 
        setItem(newItems);
    };
    return { items, addItem, updateNoteItem, deleteItem };
}

export default createContainer(useItem); 