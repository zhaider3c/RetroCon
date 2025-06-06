/* eslint-disable react/prop-types */

import { Button, Input, TextArea } from "pixel-retroui";
import { THEME } from "./Theme";
import { useEffect, useState } from "react";
import { MdOutlineFlipCameraAndroid } from "react-icons/md";

const Main = ({ di }) => {
    const [bgColor, setBgColor] = useState("black");
    const [fgColor, setFgColor] = useState("white");
    const [penSize, setPenSize] = useState(5);
    const [isDrawing, setIsDrawing] = useState(false);
    const canvasRef = useState(null);

    useEffect(() => {
        {
            const canvas = canvasRef.current;
            if (!canvas) return;
            const width = canvas.parentElement.clientWidth;
            const height = canvas.parentElement.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }
    }, []);

    const startDrawing = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        setIsDrawing(true);
    };

    const draw = (e) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        ctx.lineWidth = penSize;
        ctx.lineCap = "round";
        ctx.strokeStyle = fgColor;
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-5 p-5 bg-zinc-900 text-white">
            <div className="w-full flex justify-start gap-5">
                <label>
                    Background Color
                    <Input {...THEME.ACTIVE_INPUT}
                        type="color"
                        value={bgColor}
                        style={{
                            backgroundColor: bgColor,
                        }}
                        onChange={(e) => setBgColor(e.target.value)}
                    />
                </label>
                <Button className="px-16" onClick={() => {
                    let _=fgColor;
                    setFgColor(bgColor);
                    setBgColor(_);
                }}>
                    <MdOutlineFlipCameraAndroid className='text-2xl' />
                </Button>
                <label style={{ marginLeft: "10px" }}>
                    Pen Color
                    <Input {...THEME.ACTIVE_INPUT}
                        type="color"
                        value={fgColor}
                        onChange={(e) => setFgColor(e.target.value)}
                        style={{
                            backgroundColor: fgColor,
                        }}
                    />
                </label>

                <label style={{ marginLeft: "10px" }}>
                    Pen Size
                    <Input {...THEME.ACTIVE_INPUT}
                        type="number"
                        value={penSize}
                        min="1"
                        max="50"
                        onChange={(e) => setPenSize(Number(e.target.value))}
                    />
                </label>
                <Button {...THEME.ACTIVE} className="px-5 py-3" onClick={() => {
                    document.querySelector("canvas").getContext("2d").clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                }}>
                    Clear
                </Button>
            </div>
            <div className="grow w-full bg-rose-500 grow flex justify-center items-center">
                <canvas
                    ref={canvasRef}
                    style={{ backgroundColor: bgColor }}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}

                ></canvas>
            </div>
        </div >
    );
};
export default Main;