import React, { useState } from "react";
import "./item.css";
import useItem from "../store/item";
import useSelectedFolder from "../store/selectedFolder";
import { NoteItem } from "../types/item";

function Item({
  showEditButton,
  showAddNote,
  setShowAddNote,
}: {
  showEditButton: boolean;
  showAddNote: boolean;
  setShowAddNote: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { addItem, updateNoteItem, deleteItem, getItemsByParent } = useItem.useContainer();
  let { selectedFolder } = useSelectedFolder.useContainer();
  const [localItem, setLocalItem] = useState("");
  const [updatingNote, setUpdatingNote] = useState<NoteItem>();

  let folderItems = getItemsByParent(selectedFolder?.id);

  const addNewItem = (localItem: string, parentId: string) => {
    if (updatingNote && updatingNote.id !== undefined) {
      let item: NoteItem = { ...updatingNote } as NoteItem;
      item.content = localItem;
      updateNoteItem(item);
      setUpdatingNote(undefined);
    } else {
      addItem(localItem, parentId);
    }

    setLocalItem("");
  };

  const updateItem = (item: NoteItem) => {
    if (item.content) {
      setLocalItem(item.content);
      setShowAddNote(!showAddNote);
      setUpdatingNote(item);
    }
  };

  return (
    <>
      {showAddNote && (
        <div id="add-folder-input-wrapper">
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
                addNewItem(localItem, selectedFolder.id);
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
        </div>
      )}

      <div className="note-list">
        {folderItems.length > 0 &&
          folderItems.map((item) => (
            <div className="item-set" key={item.id + item.parentId}>
              <div onClick={() => updateItem(item)}>
                <p>{item.content} </p>
              </div>
              {showEditButton && (
                <button className="deleteButton" onClick={() => deleteItem(item)}>
                  Delete
                </button>
              )}
            </div>
          ))}
      </div>
    </>
  );
}

export default Item;
