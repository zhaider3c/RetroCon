import { useEffect, useState } from "react";
import BG from '@assets/system-attr.gif';
import Scroll from "@components/Scroll";
import { FaAsterisk, FaCheck, FaGripLinesVertical, FaTimes } from "react-icons/fa";
import { TbBinaryTree2Filled } from "react-icons/tb";
import { IoFilter } from "react-icons/io5";
import { MdArrowBack, MdArrowBackIos } from "react-icons/md";

function Expandable({ text, icon }) {
    return (
        <div className='flex gap-1 justify-start items-start group m-0 p-0 text-purple-200'>
            <p>{icon} </p>
            <p className='overflow-hidden w-0 group-hover:w-24 duration-300'>{text} </p>
        </div>
    )
}
function LargeView({ attribute }) {
    
}
export default function Main({ di }) {
    const [attributes, setAttributes] = useState([]);
    const [newOnly, setNewOnly] = useState(false);
    useEffect(() => {
        di.request.get({
            url: di.api.get('system-attribute') + (newOnly ? "?new_only=true" : ""),
            callback: (res) => {
                setAttributes(res.data ?? []);
            }
        });
    }, [newOnly]);

    return (
        <div style={{ backgroundImage: `url('${BG}')` }} className='flex flex-col w-full h-full flex gap-5 justify-center items-center bg-cover bg-center overflow-hidden'>
            <div className='w-full flex justify-start items-center grow border-t-5! border-t-purple-600!'>
                <div
                    className='flex justify-start items-center w-fit h-full px-5'
                    style={{
                        background: "linear-gradient(135deg, rgba(76,29,149) 90%, transparent 91%)"
                    }}
                >
                    <button onClick={() => { di.navigate("/attribute"); }}>
                        <a href="#attribute" className='flex gap-1 items-center text-purple-200 text-lg font-bold'>
                            <MdArrowBackIos className='text-purple-200' />
                            <span className='text-purple-200'>Attributes</span>
                        </a>
                    </button>
                    <p className='text-purple-100 font-black text-3xl px-3'><FaGripLinesVertical /></p>
                    <p className='text-2xl text-purple-200'>
                        System Attributes
                    </p>
                    <p className='text-purple-100 flex gap-1 justify-start items-center px-5'>
                        <button onClick={() => setNewOnly(!newOnly)} className='flex gap-1 justify-start items-center bg-purple-200 rounded-xl px-3 py-1'>
                            {newOnly ? <FaCheck className='text-yellow-500' /> : <FaTimes className='text-purple-400' />}
                            <span> Show only new attributes </span>
                        </button>
                    </p>
                    <div className='aspect-square h-full'>
                        {/* Filler */}
                    </div>
                </div>
            </div>
            <div className='h-190 w-3/4 py-3'>
                <Scroll>
                    <div className='grid grid-cols-2 gap-3 w-full'>
                        {attributes.map((attribute) => (
                            <div className={`flex flex-col p-3 border-2! backdrop-blur-lg! bg-black/50 border-purple-500! ${!attribute.in_db ? "border-s-yellow-500! border-s-4!" : ""}`} key={attribute.code}>
                                <div className='flex gap-1 justify-start items-start'>
                                    <h2 className='text-2xl text-purple-300'>{attribute.name}</h2>
                                    {/* <p>{!(attribute.is_required || attribute.use_for_variation || attribute.is_filterable) && <Expandable text="Nothing" icon={<PiEmptyBold className='text-purple-900' />} />} </p> */}
                                    <p>{attribute.is_required && <Expandable text="Required" icon={<FaAsterisk className='text-purple-200' />} />} </p>
                                    <p>{attribute.use_for_variation && <Expandable text="Variation" icon={<TbBinaryTree2Filled className='text-purple-200' />} />} </p>
                                    <p>{attribute.is_filterable && <Expandable text="Filterable" icon={<IoFilter className='text-purple-200' />} />} </p>
                                </div>
                                <div className='flex gap-1 justify-start items-center text-purple-400'>
                                    <p>{attribute.code}</p>
                                    <p><FaGripLinesVertical className='text-purple-200' /> </p>
                                    <p>{attribute.type} </p>
                                </div>
                                <div className='flex gap-1 justify-start items-center text-purple-400'>
                                    <p>In Database: <span className='text-purple-200'>{attribute.in_db ? "Yes" : "No"} </span></p>
                                </div>
                                <p className='text-purple-100'>{attribute.hint} </p>
                            </div>
                        ))}
                    </div>
                </Scroll>
            </div>
        </div>
    );

}