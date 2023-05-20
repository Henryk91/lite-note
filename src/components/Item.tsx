import React, { useState } from "react";
import "./item.css";
import useItem from "../store/item";
import useSelectedFolder from "../store/selectedFolder";
import { NoteItem } from "../types/item";


function Item() {
    const { items, addItem, updateNoteItem } = useItem.useContainer();
    let { selectedFolder, deSelectFolder } = useSelectedFolder.useContainer();
    const [localItem, setLocalItem] = useState("");
    const [showAddNote, setShowAddNote] = useState(false);
    const [updatingNote, setUpdatingNote] = useState<NoteItem>();
    if (!selectedFolder || !selectedFolder.id) {
        return (<></>)
    }
    let folderItems = items.filter(item => item.parentId === selectedFolder.id)

    const addNewItem = (localItem: string, parentId: string) => {
        if (updatingNote && updatingNote.id !== undefined) {
            let item: NoteItem = { ...updatingNote } as NoteItem
            item.content = localItem
            updateNoteItem(item)
            setUpdatingNote(undefined)
        } else {
            addItem(localItem, parentId)
        }

        setLocalItem('')
    }

    const updateItem = (item: NoteItem) => {
        setLocalItem(item.content)
        setShowAddNote(!showAddNote)
        setUpdatingNote(item)
    }

    return (
        <div
            className="page-wrapper"
        >
            <div className="folder-nav">
                <input
                    type="button"
                    id="edit-nav-button"
                    value="< Folders"
                    onClick={() => {
                        deSelectFolder()
                    }}
                />
            </div>
            <h1 className="title">{selectedFolder.name}</h1>

            {showAddNote && <div id="add-folder-input-wrapper">
                <div className="folder-nav">
                    <input
                        type="button"
                        id="cancel-button"
                        value={"< " + selectedFolder.name}
                        onClick={() => {
                            setShowAddNote(!showAddNote);
                        }}
                    />
                    <input
                        type="button"
                        id="done-button"
                        value="Done"
                        onClick={() => {
                            addNewItem(localItem, selectedFolder.id)
                            setLocalItem("");
                            setShowAddNote(!showAddNote);
                        }}
                    />
                </div>
                <textarea
                    autoFocus
                    id="new-note-item"
                    placeholder="New Note"
                    value={localItem}
                    onChange={(e) => setLocalItem(e.target.value)}
                />

            </div>}

            <div
                className="note-list"
            >
                {folderItems.length > 0 &&
                    folderItems.map((item) => (
                        <div className="item-set" key={item.id + item.parentId} onClick={() => updateItem(item)}>
                            <p className="note-item" style={{ marginRight: 12 }}>
                                {item.content}
                            </p>
                        </div>

                    ))}
            </div>
            <div className="bottom-nav">
                <div id="add-note-button" onClick={() => setShowAddNote(!showAddNote)}>
                    <i className="far fa-sticky-note" aria-hidden="true"></i>
                    <span>+</span>
                </div>
            </div>
        </div>
    );
}

export default Item;
