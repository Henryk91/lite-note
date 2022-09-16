import React from "react";

import useUser from "./user";
import useFolder from "./folder";
import useItem from "./item";
import useSelectedFolder from "./selectedFolder";

const Provider = (props) => {
	return (
		<useFolder.Provider>
			<useItem.Provider> 
				<useUser.Provider>
                    <useSelectedFolder.Provider>
                        {props.children}
                    </useSelectedFolder.Provider>
                </useUser.Provider>
			</useItem.Provider>
		</useFolder.Provider>
	);
};

export default Provider;
