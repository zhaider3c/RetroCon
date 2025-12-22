import ReactJson from "@microlink/react-json-view";
import { TextArea } from "pixel-retroui";
import { useState } from "react";

export default function Main({ di }) {
    const [data, setData] = useState({});
    function hadleData(value) {
        try {
            setData(JSON.parse(value));
        } catch (error) {
        }
    }
    return (
        <div>
            <TextArea {...THEME.ACTIVE_INPUT} onChange={(e) => hadleData(e.target.value)} />
            <ReactJson src={data} />
        </div>
    )

}