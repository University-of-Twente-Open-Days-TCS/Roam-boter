import React from "react";

const ListAIs = ({AIs}) => {
    return (
        <div>
            <h1>List of AIs</h1>
            A list of the team's AIs will be visible here.
            <ul>
                {AIs.map((ai, i) =>
                    <li key={i}>{ai.name}</li>
                )}
            </ul>
        </div>
    );
}

export default ListAIs;