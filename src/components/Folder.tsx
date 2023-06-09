import React, { useState } from "react";
import "./folder.css";
import useSelectedFolder from "../store/selectedFolder";
import FolderList from "./FolderList";

function Folder() {
  let { selectedFolder } = useSelectedFolder.useContainer();
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);

  if (selectedFolder && selectedFolder.id !== undefined) {
    return <></>;
  }
  return (
    <div className="page-wrapper">
      <div className="folder-nav">
        <input
          type="button"
          id="edit-nav-button"
          value=""
          onClick={() => {
            console.log("Set edit");
          }}
        />
        <input
          type="button"
          id="edit-nav-button"
          value={!showEditButton ? "Edit" : "Done"}
          onClick={() => {
            setShowEditButton(!showEditButton);
          }}
        />
      </div>
      <FolderList
        showEditButton={showEditButton}
        showAddFolder={showAddFolder}
        setShowAddFolder={setShowAddFolder}
      />
      <footer className="folder-nav">
        <div id="add-folder-button" onClick={() => setShowAddFolder(!showAddFolder)}>
          <i className="far fa-folder" aria-hidden="true"></i>
          <span>+</span>
        </div>
      </footer>
    </div>
  );
}

export default Folder;