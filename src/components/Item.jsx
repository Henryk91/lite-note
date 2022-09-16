import React, { useState } from "react";
import "./item.css";
import useItem from "../store/item";
import useSelectedFolder from "../store/selectedFolder";

function Item() {
    const { items, addItem, updateNoteItem } = useItem.useContainer();
    let { selectedFolder, selectFolder } = useSelectedFolder.useContainer();
    const [localItem, setLocalItem] = useState("");
    const [showAddNote, setShowAddNote] = useState(false);
    const [updatingNote, setUpdatingNote] = useState({});
    if (selectedFolder.id === undefined) {
        return (<></>)
    }
    let folderItems = items.filter(item => item.parentId === selectedFolder.id)

    const addNewItem = (localItem, parentId) => {
        if (updatingNote.id !== undefined) {
            let item = { ...updatingNote }
            item.content = localItem
            updateNoteItem(item)
            setUpdatingNote({})
        } else {
            addItem(localItem, parentId)
        }

        setLocalItem('')
    }

    const updateItem = (item) => {
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
                        selectFolder({})
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
                    type="textarea"
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
                            <p style={{ marginRight: 12 }}>
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
