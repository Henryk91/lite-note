import React, { useState } from "react";
import "./folder.css";
import useSelectedFolder from "../store/selectedFolder";
import FolderList from "./FolderList";
import Item from "./Item";

function Folder() {
  let { selectedFolder, deSelectFolder, previousFolder } = useSelectedFolder.useContainer();
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showEditButton, setShowEditButton] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  return (
    <div className="page-wrapper">
      <div className="folder-nav">
        {selectedFolder ? (
          <input
            type="button"
            id="edit-nav-button"
            value={`< ${previousFolder() ? previousFolder()?.name : "Folders"}`}
            onClick={() => {
              deSelectFolder();
            }}
          />
        ) : (
          <div id="edit-nav-button"></div>
        )}
        <input
          type="button"
          id="edit-nav-button"
          value={!showEditButton ? "Edit" : "Done"}
          onClick={() => {
            setShowEditButton(!showEditButton);
          }}
        />
      </div>
      <FolderList showEditButton={showEditButton} showAddFolder={showAddFolder} setShowAddFolder={setShowAddFolder} />
      <Item showAddNote={showAddNote} setShowAddNote={setShowAddNote} />
      <footer className="folder-nav">
        <div id="add-folder-button" onClick={() => setShowAddFolder(!showAddFolder)}>
          <i className="far fa-folder" aria-hidden="true"></i>
          <span>+</span>
        </div>
        <div id="add-note-button" onClick={() => setShowAddNote(!showAddNote)}>
          <i className="far fa-sticky-note" aria-hidden="true"></i>
          <span>+</span>
        </div>
      </footer>
    </div>
  );
}

export default Folder;
