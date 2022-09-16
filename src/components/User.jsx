import React, { useState } from "react";
import useUser from "../store/user";

function User() {
	const { users, addUser } = useUser.useContainer();
	const [localUser, setLocalUser] = useState("");

	return (
		<div
			style={{
				padding: "2vw",
				display: "flex",
				justifyContent: "left",
				width: "40vw",
				margin: "auto",
			}}
		>
			<div
				style={{
					marginRight: "10px",
					display: "flex",
				}}
			>
				{users.length > 0 &&
					users.map((user) => (
						<p key={user} style={{ marginRight: 12 }}>
							{user}
						</p>

					))}
			</div>
			<input
				type={"text"}
				value={localUser}
				onChange={(e) => setLocalUser(e.target.value)}
				placeholder="user name"
			></input>
			<button onClick={() => addUser(localUser)}>Add</button>
		</div>
	);
}

export default User;
