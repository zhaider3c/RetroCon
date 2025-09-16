import { Button, Card } from "pixel-retroui"
import { THEME } from "@pages/Theme";
import { useState } from "react";
const Slider = (props) => {
    const [isOn, setIsOn] = useState(false);
    return (
        <div
            className="min-h-8 min-w-16 flex items-center duration-300 cursor-pointer relative rounded"
            data-on={isOn}
            style={{
                borderColor: props.borderColor ?? "black",
                backgroundColor: "rgba(0,0,0,0.5)",
                userSelect: "none",
                boxShadow: `inset 2px 2px 0 2px var(--button-custom-shadow, var(--shadow-button, ${props.shadowColor ?? "black"})), inset -2px -2px 0 2px var(--button-custom-bg, var(--bg-button, ${props.bg ?? THEME.SECONDARY.bg}))`,
                color: props.textColor ?? "white",
            }}
            onClick={(e) => {
                setIsOn(!isOn);
                let child = e.target.children[0];
                if (isOn) {
                    child.style.left == "50%"
                }
                if (child.style.left === "0%") {
                    child.style.backgroundColor = props.activeBg ?? THEME.SUCCESS.bg;
                    child.style.borderColor = props.borderSuccessColor ?? THEME.SUCCESS.borderColor;
                    child.style.left = "50%";
                } else {
                    child.style.backgroundColor = props.bg ?? THEME.SECONDARY.bg;
                    child.style.borderColor = props.borderColor ?? "black";
                    child.style.left = "0%";
                }
                e.checked = e.target.dataset.on === 'true';                
                props.onClick?.(e)
            }}
        >
            <div
                className="w-1/2 h-full rounded duration-300 absolute"
                style={{
                    backgroundColor: props.bg ?? THEME.SECONDARY.bg,
                    borderColor: props.borderColor ?? "black",
                    borderWidth: props.borderWidth ?? "4px",
                    borderStyle: props.borderStyle ?? "inset",
                    borderRadius: props.borderRadius ?? "8px",
                    left: "0%",
                    transition: "left 0.3s",
                    pointerEvents: "none"
                }}
            />
        </div>
    );
}


export default Slider;