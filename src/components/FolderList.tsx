import React, { useState } from "react";
import "./folder.css";
import useFolder from "../store/folder";
import useSelectedFolder from "../store/selectedFolder";

function FolderList({
  showEditButton,
  showAddFolder,
  setShowAddFolder,
}: {
  showEditButton: boolean;
  showAddFolder: boolean;
  setShowAddFolder: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  let { items, addItem, deleteItem } = useFolder.useContainer();
  let { selectedFolder, selectFolder } = useSelectedFolder.useContainer();
  const [localItem, setLocalItem] = useState("");

  return (
    <section className="section">
      <h1 className="title">{selectedFolder ? selectedFolder.name : "Folder Items"}</h1>
      <div className="items-wrap">
        <ol className="items">
          {items.length > 0 ? (
            items.map((item) => (
              <div className="item-set padding-set" key={item.id + item.name}>
                <div className="item-name-box" onClick={() => selectFolder(item)}>
                  <i className="far fa-folder folder-icon" aria-hidden="true"></i>
                  <li className="item">{item.name} </li>
                </div>
                {showEditButton && (
                  <>
                    <button className="deleteButton" onClick={() => deleteItem(item)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>Folder is Empty</p>
          )}
        </ol>
      </div>
      {showAddFolder && (
        <div id="add-folder-input-wrapper">
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
        </div>
      )}
    </section>
  );
}

export default FolderList;