import { useState } from "react";
import LoadingContext from "./loadingContext";

const NoteState = (props) => {

    const [loading, setLoading] = useState(false)

    return (
        <LoadingContext.Provider value={{ loading, setLoading }}>
            {props.children}
        </LoadingContext.Provider>
    )
}

export default NoteState