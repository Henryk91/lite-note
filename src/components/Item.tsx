import React, { useEffect, useState } from "react";
import "./item.css";
import useItem from "../store/item";
import useSelectedFolder from "../store/selectedFolder";
import { NoteItem } from "../types/item";
import { getLogDuration } from "../utils";

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
  const [localItemDate, setLocalItemDate] = useState("");
  const [updatingNote, setUpdatingNote] = useState<NoteItem>();
  const [notes, setNotes] = useState<NoteItem[]>(getItemsByParent(selectedFolder?.id));

  const addNewItem = (localItem: string, parentId: string) => {
    if (updatingNote && updatingNote.id !== undefined) {
      let item: NoteItem = { ...updatingNote } as NoteItem;
      item.content = { data: localItem };
      if (localItemDate && localItemDate !== "") item.content.date = localItemDate;
      updateNoteItem(item, () => {
        setUpdatingNote(undefined);
        setNotes(getItemsByParent(selectedFolder?.id));
      });
    } else {
      addItem(localItem, parentId, () => {
        setNotes(getItemsByParent(selectedFolder?.id));
      });
    }
    setLocalItem("");
  };

  const updateItem = (item: NoteItem) => {
    if (item.content) {
      setLocalItem(item.content.data);
      if (item.content.date) setLocalItemDate(item.content.date);
      setShowAddNote(!showAddNote);
      setUpdatingNote(item);
      setNotes(getItemsByParent(selectedFolder?.id));
    }
  };

  const deleteClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: NoteItem) => {
    e.stopPropagation();
    deleteItem(item);
    setNotes(getItemsByParent(selectedFolder?.id));
  };

  useEffect(() => {
    setNotes(getItemsByParent(selectedFolder?.id));
  }, [selectedFolder?.id, getItemsByParent]);

  useEffect(() => {
    if (!showAddNote) {
      setLocalItem("");
      setLocalItemDate("");
      return;
    }
    const ta = document.getElementById("new-note-item") as HTMLTextAreaElement;
    if (ta) {
      ta?.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);
    }
  }, [showAddNote]);

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
          {updatingNote?.type === "LOG" && (
            <input id="log-date" value={localItemDate} onChange={(e) => setLocalItemDate(e.target.value)}></input>
          )}
          <textarea
            id="new-note-item"
            placeholder="New Note"
            value={localItem}
            onChange={(e) => setLocalItem(e.target.value)}
          />
        </div>
      )}

      <div className="note-list">
        {notes &&
          notes.length > 0 &&
          notes.map((item, i) => (
            <div className="item-set" key={item.id + item.parentId} onClick={() => updateItem(item)}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {item.content?.date && (
                  <div style={{ display: "flex", flexDirection: "row", marginTop: "1em" }}>
                    <span>
                      {item.content?.date.substring(0, item.content?.date.indexOf("GMT")).trim() +
                        " " +
                        getLogDuration(item.content?.date, notes?.[i + 1]?.content?.date)}
                    </span>
                  </div>
                )}
                <p>{item.content?.data}</p>
              </div>
              {showEditButton && (
                <button className="deleteButton" onClick={(e) => deleteClick(e, item)}>
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
