import { useState } from "react";
import RoleContext from "./roleContext";

const RoleState = (props) => {

    const [role, setRole] = useState({ name: '', email: '', status: false, role: 'student' })

    return (
        <RoleContext.Provider value={{ role, setRole }}>
            {props.children}
        </RoleContext.Provider>
    )
}

export default RoleState