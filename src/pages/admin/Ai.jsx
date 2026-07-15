/* eslint-disable react/prop-types */

import { Button, Card, Input, Popup, TextArea } from "pixel-retroui";
import { THEME } from "@pages/Theme";
import { useEffect, useState } from "react";
import { BiImage, BiPencil, BiPlus } from "react-icons/bi";
import Form from "@components/Form";
import Scroll from "@components/Scroll";
const Add = ({ popupOpen, setPopupOpen, di, setErrors, errors, editing, setEditing, refresh, setRefresh }) => {
    const [formData, setFormData] = useState({});
    const [models, setModels] = useState([]);
    const [colorMap, setColorMap] = useState({});

    useEffect(() => {
        if (editing) {
            di.request.get({
                url: di.api.get('ai-models') + "?filter[provider_id][1]=" + editing._id.$oid, callback: (res) => {
                    setModels(res.data);
                }
            });

            if (editing.urls) {
                editing.url = Object.keys(editing.urls).map(key => key + ':' + editing.urls[key]).join('\n');
            }
            if (editing.additional_data) {
                editing.additional_data = Object.keys(editing.additional_data).map(key => key + ':' + editing.additional_data[key]).join('\n');
            }
            setFormData(editing);
        }
    }, [editing]);

    useEffect(() => {
        if (models.length > 0) {
            let owners = models.map(model => {
                return model.owner;
            });
            let map = di.generateColorMap(owners);

            const classMap = {};
            Object.entries(map).forEach(([key, value]) => {
                value = 'rose';
                classMap[key] = `bg-${value}-800 text-${value}-300`;
            });
            setColorMap(classMap);
        }
    }, [models]);

    function submitForm(e) {
        e.preventDefault();
        const form = new FormData(e.target);
        const data = Object.fromEntries(form);
        const requiredFields = ['name', 'access_token', 'urls'];
        let preparedErrors = {};
        try {
            let urls = data.urls.split('\n');
            let urlData = {};
            for (let url of urls) {
                let [key, ...value] = url.split(':');
                console.log(key, value);

                if (key && value.length > 0) {
                    let val = value.join(':').trim();
                    urlData[key.trim()] = val;
                }
            }
            let additionalDataStrings = data.additional_data.split('\n');
            let additionalData = {};
            for (let datum of additionalDataStrings) {
                let [key, ...value] = datum.split(':');
                if (key && value.length > 0) {
                    let val = value.join(':').trim();
                    additionalData[key.trim()] = val;
                }
            }
            data.urls = urlData;
            data.additional_data = additionalData;

        } catch (error) {
            console.error(error);
            di.toast.error("Error submitting form: " + error.message);
        }
        // Validations
        for (let field of requiredFields) {
            if (!data[field] || data[field] === '') {
                preparedErrors[field] = `${field} is required`;
            }
        }
        if (!Object.keys(data.urls).includes('base_url')) {
            preparedErrors.urls = "base_url is required";
        }
        if (Object.keys(preparedErrors).length > 0) {
            console.log(preparedErrors);
            setErrors(preparedErrors);
            return;
        }
        data.code = formData.code;
        di.request.post({
            url: di.api.get('ai-provider'),
            body: JSON.stringify(data),
            callback: (res) => {
                di.toast.success(res.message);
                setPopupOpen(false);
                setRefresh(refresh + 1);
            }
        });
    }

    return (
        <Popup isOpen={popupOpen} {...THEME.PRIMARY} onClose={() => { setErrors({}); setPopupOpen(false); setEditing(null); setFormData({}); }}>
            <div className="flex gap-2 justify-center items-center h-196">
                <Card {...THEME.SECONDARY} className="flex flex-col min-w-128 grow h-full p-5 gap-5">
                    <div className="flex flex-col gap-3 justify-center items-center p-5">
                        <div className="flex justify-start items-center w-full gap-5">
                            <p className="text-2xl font-bold text-start">{
                                editing ? 'Editing' : 'Adding'} {editing ? editing.name : 'a new AI Provider'}
                            </p>
                            <Button {...THEME.ACCENT} onClick={(e) => {
                                e.preventDefault();
                                di.request.get({
                                    url: di.api.get('ai-sync-models'),
                                    callback: (res) => {
                                        di.toast.success(res.message);
                                    }
                                });
                            }}>Sync models</Button>
                        </div>
                        <form className="flex flex-col gap-3 justify-center items-center" onSubmit={submitForm}>
                            <div className="w-full flex flex-col gap-3 justify-start items-start p-5 rounded-xl   ">
                                <div className="flex flex-col gap-2 w-full">
                                    {errors.name && <p className="text-red-500">{errors.name}</p>}
                                    <div className="flex justify-start items-center w-full gap-5">
                                        <Input className="grow" {...THEME.ACTIVE_INPUT} placeholder="Name" name="name" value={formData?.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value, code: e.target.value.toLowerCase().replace(/ /g, '_') })} />
                                        <Card {...THEME.PRIMARY} className="w-1/3 overflow-hidden text-ellipsis whitespace-nowrap">Code: {formData?.code}</Card>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full">
                                    {errors.api_key && <p className="text-red-500">{errors.api_key}</p>}
                                    <Input {...THEME.ACTIVE_INPUT} type="password" placeholder="API Key" name="access_token" value={formData?.access_token || ''}
                                        onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                                        onMouseEnter={(e) => {
                                            e.target.type = 'text';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.type = 'password';
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 justify-start items-start">
                                <div className="flex flex-col gap-2 p-5 rounded-xl">
                                    <div className="flex gap-2 justify-between items-center">
                                        <label className="font-bold text-zinc-300">URLs</label>
                                        {errors.urls && <p className="text-red-500 font-bold text-sm">{errors.urls}</p>}
                                    </div>
                                    <TextArea {...THEME.ACTIVE_INPUT} placeholder="Base URL:<URL>" name="urls" rows={5} cols={60} resize={false} value={formData?.url || ''} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
                                </div>
                                <div className="flex flex-col gap-2 p-5 rounded-xl">
                                    {errors.additional_data && <p className="text-red-500">{errors.additional_data}</p>}
                                    <label className="font-bold text-zinc-300">Additional Data</label>
                                    <TextArea {...THEME.ACTIVE_INPUT} placeholder="Key:Value" name="additional_data" rows={5} cols={60} resize={false} value={formData?.additional_data || ''} onChange={(e) => setFormData({ ...formData, additional_data: e.target.value })} />
                                </div>
                            </div>
                            <div className="flex justify-between items-end w-full">
                                <Button {...THEME.SUCCESS} className="px-5!">Save</Button>
                                {editing?._id && (<Button {...THEME.DANGER} className="px-5!" onClick={(e) => {
                                    e.preventDefault();
                                    di.request.delete({
                                        url: di.api.get('ai-provider') + `?name=${editing.name}`, callback: (res) => {
                                            di.toast.success(res.message);
                                            setEditing(null);
                                            setRefresh(refresh + 1);
                                            setPopupOpen(false);
                                        }
                                    });
                                }}>Delete</Button>)}
                            </div>
                        </form>
                    </div>
                </Card >

                <div className="flex gap-2 justify-center items-center w-1/3 h-full">
                    {models.length > 0 && (
                        <Card {...THEME.SECONDARY} className="flex flex-col gap-2 justify-start items-center w-full h-full">
                            <Scroll>
                                <div className="flex flex-col gap-2 justify-start items-start w-full">
                                    {models.map((model, i) => {
                                        return (
                                            <div key={i} data-owner={model.owner} className="border-2! border-teal-600! rounded-md p-2 flex flex-col justify-start items-start w-full">
                                                <div className="flex justify-end items-center w-full gap-2">
                                                    <p className={`py-1 px-2 text-xs font-black rounded-md bg-teal-800/50 text-teal-400`}>{model.owner}</p>
                                                </div>
                                                <p className="capitalize">{model.code.split('/').pop().replaceAll('-', ' ')}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            </Scroll>
                        </Card>

                    )}
                </div>
            </div>
        </Popup >
    )
}

const List = ({ di, setPopupOpen, popupOpen, setEditing, refresh }) => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(refresh);
    useEffect(() => {
        di.request.get({
            url: di.api.get('ai-provider'), callback: (res) => {
                setProviders(res.data);
            }
        });
    }, [loading]);
    if (providers.length === 0) {
        return (
            <Card {...THEME.SECONDARY} className="w-64 h-64 flex justify-center items-center">
                <button onClick={() => setPopupOpen(true)} className="flex flex-col gap-2 justify-center items-center w-full h-full">
                    <BiPlus className="text-6xl text-zinc-400" />
                    <p className="text-2xl text-zinc-400">Add AI </p>
                    <p className="text-zinc-400 text-2xl">Provider</p>
                </button>
            </Card>
        )
    }
    return (
        <div className="w-full flex flex-col gap-2 min-h-128 backdrop-blur-md! bg-black/25 rounded-xl p-5 border-2! border-black/25!">
            <div className="flex justify-start items-center w-full gap-5">
                <span className="text-2xl">
                    AI Providers
                </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
                {providers && providers.map((provider, i) => (
                    <Card key={i} {...THEME.PRIMARY} className="flex gap-2 justify-center items-start">
                        <div>
                            {
                                provider?.urls?.icon_url ? <img src={provider.urls.icon_url} alt={provider.name} className="w-16 h-16 rounded-md" />
                                    : <div className="w-16 h-16 rounded-md bg-zinc-700 flex justify-center items-center">
                                        <BiImage className="text-2xl text-zinc-400" />
                                    </div>
                            }
                        </div>
                        <div className="flex flex-col gap-2 justify-center items-start grow overflow-hidden text-ellipsis whitespace-nowrap">
                            <p className="text">{provider.name}</p>
                            <p className="text">
                                <span>Base URL:</span>
                                <span>{provider.urls.base_url}</span>
                            </p>
                        </div>
                        <div>
                            <button onClick={() => {
                                setEditing(provider)
                                setPopupOpen(true)
                            }
                            }>
                                <BiPencil className="text-2xl text-blue-400" />
                            </button>
                        </div>
                    </Card>
                ))}
                <div className="flex justify-center items-center w-fit">
                    <Button {...THEME.TRANSLUCENT} className="flex gap-2 justify-center items-center p-0 w-16 h-16" onClick={() => setPopupOpen(true)}>
                        <BiPlus className="text-2xl" />
                    </Button>
                </div>
            </div>
        </div>
    )
}

const Main = ({ di }) => {
    const [popupOpen, setPopupOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [errors, setErrors] = useState({});
    const [refresh, setRefresh] = useState(0);
    return (
        <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
            <List di={di} setPopupOpen={setPopupOpen} popupOpen={popupOpen} setEditing={setEditing} refresh={refresh} />
            <Add popupOpen={popupOpen} setPopupOpen={setPopupOpen} di={di} setErrors={setErrors} errors={errors} editing={editing} setEditing={setEditing} refresh={refresh} setRefresh={setRefresh} />
        </div>
    )
};
export default Main;