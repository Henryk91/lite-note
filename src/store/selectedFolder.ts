import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { NoteItem } from "../types/item";

const getInitFromStorage = (name: string, defaultValue: any) => {
  const localItem = localStorage.getItem(name);
  if (localItem && localItem !== "undefined") {
    return JSON.parse(localItem);
  }
  return defaultValue;
};

function useSelectedFolder(initialState: any) {
  let [selectedFolder, setSelectedFolder] = useState<NoteItem>(getInitFromStorage("selected-folder", initialState));
  let [previousSelectedFolders, setPreviousSelectedFolders] = useState<NoteItem[]>(
    getInitFromStorage("selected-folders", initialState)
  );

  useEffect(() => {
    if (previousSelectedFolders && previousSelectedFolders.length > 0) {
      localStorage.setItem("selected-folders", JSON.stringify(previousSelectedFolders));
    } else {
      localStorage.removeItem("selected-folders");
    }
  }, [previousSelectedFolders?.length, previousSelectedFolders]);

  useEffect(() => {
    if (selectedFolder) {
      localStorage.setItem("selected-folder", JSON.stringify(selectedFolder));
    } else {
      localStorage.removeItem("selected-folder");
    }
  }, [selectedFolder]);

  let selectFolder = (_selectedFolder: NoteItem) => {
    if (selectedFolder) {
      setPreviousSelectedFolders(
        previousSelectedFolders ? [...previousSelectedFolders, selectedFolder] : [selectedFolder]
      );
    }

    setSelectedFolder(_selectedFolder);
  };
  let previousFolder = () => {
    if (previousSelectedFolders) {
      return previousSelectedFolders[previousSelectedFolders.length - 1];
    }
  };

  let deSelectFolder = () => {
    if (previousSelectedFolders) {
      const next = previousSelectedFolders[previousSelectedFolders.length - 1];
      setSelectedFolder(next);
      previousSelectedFolders.pop();
      setPreviousSelectedFolders(previousSelectedFolders);
    } else {
      setSelectedFolder(initialState);
    }
  };

  return { selectedFolder, selectFolder, deSelectFolder, previousFolder, previousSelectedFolders };
}

export default createContainer(useSelectedFolder);
