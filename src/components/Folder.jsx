import React, { useState } from "react";
import "./folder.css";
import useFolder from "../store/folder";
import useSelectedFolder from "../store/selectedFolder";

function Folder() {
    let { items, addItem, deleteItem } = useFolder.useContainer();
    let { selectedFolder, selectFolder } = useSelectedFolder.useContainer();
    const [localItem, setLocalItem] = useState("");
    const [showAddFolder, setShowAddFolder] = useState(false);
    const [showEditButton, setShowEditButton] = useState(false);

    if (selectedFolder.id !== undefined) {
        return (<></>)
    }
    return (
        <div className="page-wrapper">
            <div className="folder-nav">
                <input
                    type="button"
                    id="edit-nav-button"
                    value=""
                    onClick={() => {
                        console.log('Set edit');
                    }}
                />
                <input
                    type="button"
                    id="edit-nav-button"
                    value={!showEditButton ? "Edit" : "Done"}
                    onClick={() => {
                        setShowEditButton(!showEditButton)
                    }}
                />
            </div>
            <h1 className="title">Folder Items</h1>
            <ol className="items">
                {items.length > 0 ? (
                    items.map((item) => (
                        <div className="item-set padding-set" key={item.id + item.name}>
                            <div className="item-name-box" onClick={() => selectFolder(item)}>
                                {/* <span className="folder-icon"></span> */}
                                <i  className="far fa-folder folder-icon" aria-hidden="true"></i>
                                <li className="item" >
                                    {item.name}{" "}
                                </li>
                            </div>
                            {showEditButton && <>
                                <button className="deleteButton"
                                    onClick={() => deleteItem(item)}>
                                    Delete
                                </button>
                            </>}
                        </div>
                    ))
                ) : (
                    <p>Folder is Empty</p>
                )}
            </ol>
            {showAddFolder && <div id="add-folder-input-wrapper">
                <div className="folder-nav">
                    <input
                        type="button"
                        id="cancel-button"
                        value="Cancel"
                        onClick={() => {
                            setShowAddFolder(!showAddFolder);
                        }}
                    />
                    <p>New Folder</p>
                    <input
                        type="button"
                        id="done-button"
                        value="Done"
                        onClick={() => {
                            addItem(localItem);
                            setLocalItem("");
                            setShowAddFolder(!showAddFolder);
                        }}
                    />
                </div>
                <input
                    autoFocus
                    type="text"
                    id="newItem"
                    placeholder="New Folder Name"
                    value={localItem}
                    onChange={(e) => setLocalItem(e.target.value)}
                />

            </div>}
            <div id="add-folder-button" onClick={() => setShowAddFolder(!showAddFolder)}>
                <i  className="far fa-folder" aria-hidden="true"></i>
                <span>+</span>
            </div>
        </div>
    );
}

export default Folder;