import { useState } from "react";
import { createContainer } from "unstated-next";
import { FolderType } from "../types/folder";
  
function useSelectedFolder(initialState: any) {
    let [selectedFolder, setSelectedFolder] = useState<FolderType>(initialState);
    let [previousSelectedFolders, setPreviousSelectedFolders] = useState<FolderType[]>(initialState);
    let selectFolder = (_selectedFolder: FolderType) => {
        if(selectedFolder){
            setPreviousSelectedFolders(previousSelectedFolders? [...previousSelectedFolders, selectedFolder]: [selectedFolder])
        }
        
        setSelectedFolder(_selectedFolder);
    };
    let previousFolder = () => {
        if(previousSelectedFolders){
            return previousSelectedFolders[previousSelectedFolders.length - 1]
        }
    }
    let deSelectFolder = () => {
        if(previousSelectedFolders){
            const  next = previousSelectedFolders[previousSelectedFolders.length - 1]
            setSelectedFolder(next);
            previousSelectedFolders.pop()
            setPreviousSelectedFolders(previousSelectedFolders);
        } else{
            setSelectedFolder(initialState);
        }
        
    };

    return { selectedFolder, selectFolder, deSelectFolder, previousFolder };
}
  
export default createContainer(useSelectedFolder);