import React, { useState } from "react";
import "./folder.css";
import useItem from "../store/item";
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
  const { addFolder, deleteItem, getFoldersByParentId, checkFolderHasItems } = useItem.useContainer();
  let { selectedFolder, selectFolder } = useSelectedFolder.useContainer();
  const [localItem, setLocalItem] = useState("");
  const folderItems = getFoldersByParentId(selectedFolder ? selectedFolder.id : "")
  const folderHasItems = checkFolderHasItems(selectedFolder ? selectedFolder.id : "")

  return (
    <>
      <h1 className="title">{selectedFolder ? selectedFolder.name : "Folder Items"}</h1>
      <div className="items-wrap">
        <ol className="items">
          {folderItems.length > 0 ? (
            folderItems.map((item) => (
              <div className="item-set padding-set" key={item.id + (item && item?.name? item.name: "")}>
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
          ) : !folderHasItems? (
            <p>Folder is Empty</p>
          ): (null)}
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
                addFolder({ name: localItem, parent: selectedFolder ? selectedFolder.id : "" });
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
    </>
  );
}

export default FolderList;
