import { useState } from "react";
import { createContainer } from "unstated-next";
import { FolderType } from "../types/folder";
  
function useSelectedFolder(initialState: any) {
    let [selectedFolder, setSelectedFolder] = useState<FolderType>(initialState);
    let selectFolder = (_selectedFolder: FolderType) => {
        setSelectedFolder(_selectedFolder);
    };
    let deSelectFolder = () => {
        setSelectedFolder(initialState);
    };

    return { selectedFolder, selectFolder, deSelectFolder };
}
  
export default createContainer(useSelectedFolder);