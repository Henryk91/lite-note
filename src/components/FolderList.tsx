import React, { useEffect, useState } from "react";
import "./folder.css";
import useItem from "../store/item";
import useSelectedFolder from "../store/selectedFolder";
import { NoteItem } from "../types/item";

function FolderList({
  showEditButton,
  showAddFolder,
  setShowAddFolder,
  hideEdit,
}: {
  showEditButton: boolean;
  showAddFolder: boolean;
  setShowAddFolder: React.Dispatch<React.SetStateAction<boolean>>;
  hideEdit: () => void;
}) {
  const { addFolder, deleteItem, getFoldersByParentId, checkFolderHasItems, getFolderContents, updateNoteItem } =
    useItem.useContainer();
  let { selectedFolder, selectFolder } = useSelectedFolder.useContainer();
  const [localItem, setLocalItem] = useState("");
  const [updatingFolder, setUpdatingFolder] = useState<NoteItem>();
  const [folders, setFolders] = useState<NoteItem[]>(getFoldersByParentId(selectedFolder ? selectedFolder.id : ""));

  const folderHasItems = checkFolderHasItems(selectedFolder ? selectedFolder.id : "");

  const onFolderClick = (item: NoteItem) => {
    if (!showEditButton) {
      getFolderContents(item, () => {
        selectFolder(item);
      });
    } else {
      if (item?.name) {
        setLocalItem(item.name);
        setUpdatingFolder(item);
      }
      setShowAddFolder(!showAddFolder);
    }
  };

  const deleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: NoteItem) => {
    e.stopPropagation();
    deleteItem(item);
    setFolders(getFoldersByParentId(selectedFolder?.id ? selectedFolder.id : ""));
  };

  const addFolderClick = () => {
    if (!updatingFolder) {
      addFolder({ name: localItem, parent: selectedFolder ? selectedFolder.id : "" }, () => {
        setFolders(getFoldersByParentId(selectedFolder?.id ? selectedFolder.id : ""));
      });
    } else {
      const updatedFolder = { ...updatingFolder };
      updatedFolder.name = localItem;
      updateNoteItem(updatedFolder, () => {
        setFolders(getFoldersByParentId(selectedFolder?.id ? selectedFolder.id : ""));
        hideEdit();
      });
    }

    setLocalItem("");
    setShowAddFolder(!showAddFolder);
  };

  useEffect(() => {
    setFolders(getFoldersByParentId(selectedFolder?.id ? selectedFolder.id : ""));
  }, [getFoldersByParentId, selectedFolder?.id]);

  return (
    <>
      <h1 className="title">{selectedFolder ? selectedFolder.name : "Folder Items"}</h1>
      <div className="items-wrap">
        <ol className="items">
          {folders && folders.length > 0 ? (
            folders.map((item, index) => (
              <div
                className="item-set padding-set"
                key={item.parentId + item.id + (item && item?.name ? item.name : "") + index}
              >
                <div className="item-name-box" onClick={() => onFolderClick(item)}>
                  <i className="far fa-folder folder-icon" aria-hidden="true"></i>
                  <li className="item">{item.name} </li>
                </div>
                {showEditButton && (
                  <>
                    <button className="deleteButton" onClick={(e) => deleteClick(e, item)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            ))
          ) : !folderHasItems ? (
            <div className="flex-row">
              <p>Folder is Empty</p>
              <div id="add-folder-button" onClick={() => setShowAddFolder(!showAddFolder)}>
                <i className="far fa-folder" aria-hidden="true"></i>
                <span>+</span>
              </div>
            </div>
          ) : null}
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
            {!updatingFolder ? <p>New Folder</p> : <p>Update Folder</p>}
            <input type="button" id="done-button" value="Done" onClick={() => addFolderClick()} />
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
