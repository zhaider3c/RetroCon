import { Button, Card } from "pixel-retroui"
import { THEME } from "@pages/Theme";
import { useState } from "react";
const Slider = (props) => {
    const [isOn, setIsOn] = useState(false);

    return (
        <div
            className="min-h-8 min-w-16 flex items-center duration-300 cursor-pointer relative rounded"
            style={{ backgroundColor: props.bg ?? THEME.SECONDARY.bg }}
            onClick={(e) => {
                setIsOn((prev) => !prev)
                if (isOn) {
                    e.target.style.backgroundColor = props.activeBg ?? THEME.SUCCESS.bg;
                } else {
                    e.target.style.backgroundColor = props.bg ?? THEME.SECONDARY.bg;
                }
                props.onClick?.(isOn)
            }}
            style={{ userSelect: "none" }}
        >
            <div
                className="bg-red-500 w-1/2 h-full rounded duration-300 absolute"
                style={{
                    right: isOn ? "50%" : "0%",
                    transition: "right 0.3s",
                    pointerEvents: "none"
                }}
            />
        </div>
    );
}


export default Slider;