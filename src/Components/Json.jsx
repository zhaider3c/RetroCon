import { Card } from "pixel-retroui"
import { THEME } from "@pages/Theme";
import { useState } from "react";
import { VscTriangleDown } from "react-icons/vsc";
const Json = ({ data, even = false }) => {
    const [open, setOpen] = useState(true);
    return (
        <Card className={"bg-[url('/wall.png')] bg-size-[auto_18px] bg-top bg-2x flex flex-col bg-repeat-x gap-0 p-0 m-0 " + `${open ? "" : "h-10 overflow-hidden"}`} {...(even ? THEME.MUDDY : THEME.POP)} >
            <div className="flex justify-start items-center w-full  p-0 m-0 bg-blend-multiply"
                onClick={() => setOpen(!open)}>
                {<VscTriangleDown />}
            </div>
            <div className="">
                {
                    Object.keys(data ?? {}).map((e, i) => {
                        let loop = typeof data[e] === 'object' || Array.isArray(data[e]);
                        return (
                            <div key={i} className={`gap-1 text-sm max-w-256 overflow-x-hidden`}>
                                <p className="font-black">{e}</p>
                                {
                                    (loop) ?
                                        <Json data={data[e]} even={!even} /> :
                                        (<p className={`ps-4 w-full`}>{data[e].toString()}</p>)

                                }
                            </div>
                        )
                    })
                }
            </div>
        </Card >
    )

}
export default Json;