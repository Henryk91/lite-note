
import { useState } from "react";
import { createContainer } from "unstated-next";
  
function useUser(initialState = []) {
    let [users, setUser] = useState(initialState); 
    let addUser = (_user) => {
        setUser([...users, _user]); 
    };
    let deleteUser = (_user) => {
        let newUser = users.filter((user) => user !== _user); 
        setUser(newUser);
    };
    return { users, addUser, deleteUser };
}
  
export default createContainer(useUser); 