import { useState } from "react";
import { createContainer } from "unstated-next";
  
function useSelectedFolder(initialState = {}) {
    let [selectedFolder, setSelectedFolder] = useState(initialState);
    let selectFolder = (_selectedFolder) => {
        setSelectedFolder(_selectedFolder);
    };
    let toggleFolder = (_selectedFolder) => {
        setSelectedFolder(_selectedFolder);
    };

    return { selectedFolder, selectFolder, toggleFolder };
}
  
export default createContainer(useSelectedFolder);