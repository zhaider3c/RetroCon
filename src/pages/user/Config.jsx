/* eslint-disable react/prop-types */

import { Button, Card, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'pixel-retroui';
import { THEME } from '@pages/Theme';
import { useEffect, useMemo, useState } from 'react';
import Scroll from '@components/Scroll';
import Form from '@components/Form';
import Json from '@components/Json';
import Account from '@components/AccountSelector';
import Slider from '@components/Slider';

/** Backend config type enum (string values). */
export const CONFIG_TYPES = [
    { value: 'global', label: 'Global' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'user_id', label: 'User' },
    { value: 'business_id', label: 'Business' },
    { value: 'user_marketplace', label: 'User marketplace' },
    { value: 'business_marketplace', label: 'Business marketplace' },
    { value: 'account_id', label: 'Account ID' },
    { value: 'channel_service_account', label: 'Channel service account' },
];

/** Settings namespace for config API (`group` on GET/POST). Add entries as backend adds groups. */
export const SETTING_GROUPS = [
    { value: 'product_setting', label: 'Product setting' },
    { value: 'order_setting', label: 'Order setting' },
];

const FIELD = {
    key: { label: 'Key', type: 'text', placeholder: 'Required' },
    value: { label: 'Value', type: 'textarea', placeholder: 'Required' },
    marketplace: { label: 'Marketplace', type: 'text', placeholder: '' },
    account_id: { label: 'Account ID', type: 'text', placeholder: '' },
    group: { label: 'Group', type: 'text', placeholder: '' },
    channel_service_code: { label: 'Channel service code', type: 'text', placeholder: '' },
    user_id: { label: 'User ID', type: 'text', placeholder: '' },
};

/** Extra GET query fields shown per config type (always sends `type` from selector). */
const GET_EXTRA_KEYS_BY_TYPE = {
    global: [],
    marketplace: ['marketplace'],
    user_id: [],
    business_id: ['group'],
    user_marketplace: ['marketplace'],
    business_marketplace: ['marketplace', 'account_id', 'group'],
    account_id: ['account_id'],
    channel_service_account: ['channel_service_code', 'marketplace', 'account_id'],
};

/** Extra POST body fields shown per config type. */
const POST_EXTRA_KEYS_BY_TYPE = {
    global: [],
    marketplace: ['marketplace'],
    user_id: ['user_id'],
    business_id: ['group'],
    user_marketplace: ['marketplace', 'user_id'],
    business_marketplace: ['marketplace', 'account_id', 'group'],
    account_id: ['account_id'],
    channel_service_account: ['marketplace', 'account_id'],
};

function buildFieldsForType(baseKeys, extraKeys) {
    const needsAccount = extraKeys.includes('account_id');
    const keysOnlyForm = extraKeys.filter((k) => k !== 'account_id');
    const out = {};
    baseKeys.forEach((k) => {
        out[k] = FIELD[k];
    });
    keysOnlyForm.forEach((k) => {
        out[k] = FIELD[k];
    });
    return { fields: out, needsAccount };
}

function buildQuery(params) {
    const q = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
        if (v === null || v === undefined || v === '') return;
        q.set(k, String(v));
    });
    const s = q.toString();
    return s ? `?${s}` : '';
}

/** GET config body: show `value` (or `data`) when success; otherwise `message` / `msg` / `error`. */
function getConfigReadDisplay(payload) {
    if (payload === null || payload === undefined) {
        return { kind: 'message', text: '' };
    }
    if (typeof payload !== 'object' || Array.isArray(payload)) {
        return { kind: 'value', content: payload, asJson: typeof payload === 'object' };
    }
    if (payload.success === true) {
        const content =
            payload.value !== undefined ? payload.value : payload.data !== undefined ? payload.data : undefined;
        if (content === undefined) {
            return { kind: 'value', content: '', asJson: false };
        }
        const asJson = typeof content === 'object' && content !== null;
        return { kind: 'value', content, asJson };
    }
    const text = payload.message ?? payload.msg ?? payload.error ?? '';
    return { kind: 'message', text: String(text) };
}

function coerceConfigValue(raw) {
    const t = raw.trim();
    if (t === '') return '';
    if (!Number.isNaN(Number(t)) && t !== '' && !Number.isNaN(parseFloat(t))) {
        return parseFloat(t);
    }
    const lower = t.toLowerCase();
    if (lower === 'true') return true;
    if (lower === 'false') return false;
    return t;
}

function accountIdFromAccount(account) {
    if (!account) return null;
    const id = account.id ?? account._id?.$oid ?? account._id;
    return id != null ? String(id) : null;
}

function ConfigTypeDropdown({ value, onChange, label }) {
    const current = CONFIG_TYPES.find((t) => t.value === value) ?? CONFIG_TYPES[0];
    return (
        <div className="flex flex-col gap-2 w-full min-w-0 px-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 w-full">{label}</h3>
            <div className="flex flex-col w-full min-w-0 bg-transparent">
                <DropdownMenu {...THEME.ACTIVE} className="w-full">
                    <DropdownMenuTrigger className="w-full min-h-10 h-10 flex items-center justify-start text-left">
                        <span className="text-sm font-medium w-full truncate">{current.label}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-0.5 max-h-64 w-[min(100vw-2rem,20rem)] min-w-[12rem] overflow-y-auto z-50">
                        {CONFIG_TYPES.map((t) => (
                            <DropdownMenuItem key={t.value} className="w-full min-h-9 rounded-xl hover:bg-white/15">
                                <Button
                                    type="button"
                                    {...THEME.ACTIVE_INPUT}
                                    className="w-full min-h-9 justify-start text-left text-sm"
                                    onClick={() => onChange(t.value)}
                                >
                                    {t.label}
                                </Button>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

function SettingGroupDropdown({ value, onChange, label }) {
    const current = SETTING_GROUPS.find((g) => g.value === value) ?? SETTING_GROUPS[0];
    return (
        <div className="flex flex-col gap-2 w-full min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 w-full">{label}</h3>
            <Card {...THEME.ACTIVE_INPUT} className="flex flex-col w-full min-w-0">
                <DropdownMenu {...THEME.ACTIVE} className="w-full">
                    <DropdownMenuTrigger className="w-full min-h-10 h-10 flex items-center justify-start text-left">
                        <span className="text-sm font-medium w-full truncate">{current.label}</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="flex flex-col gap-0.5 max-h-64 w-[min(100vw-2rem,20rem)] min-w-[12rem] overflow-y-auto z-50">
                        {SETTING_GROUPS.map((g) => (
                            <DropdownMenuItem key={g.value} className="w-full min-h-9 rounded-xl hover:bg-white/15">
                                <Button
                                    type="button"
                                    {...THEME.ACTIVE_INPUT}
                                    className="w-full min-h-9 justify-start text-left text-sm"
                                    onClick={() => onChange(g.value)}
                                >
                                    {g.label}
                                </Button>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </Card>
        </div>
    );
}

function AccountFieldRow({ di, account, setAccount, label = 'Account' }) {
    return (
        <div className="flex flex-col gap-2 w-full min-w-0">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 w-full">{label}</h3>
            <Card {...THEME.ACTIVE_INPUT} className="flex flex-col w-full min-w-0 min-h-10">
                <Account
                    di={di}
                    account={account}
                    setAccount={setAccount}
                    theme={THEME.ACTIVE_INPUT}
                    className="w-full min-h-9 flex items-center justify-start"
                />
            </Card>
        </div>
    );
}

/** Compact force toggle for GET row (next to Fetch). */
function ForceNextToSubmit({ value, onChange, typeKey }) {
    return (
        <div className="flex flex-row items-center gap-2 shrink-0">
            <span className="text-sm font-bold text-white/90 whitespace-nowrap">Force</span>
            <Slider
                key={`force-slider-${typeKey}`}
                checked={value}
                {...THEME.ACTIVE_BUTTON}
                className="w-16 h-8 min-w-16 shrink-0"
                onClick={() => onChange((f) => !f)}
            />
        </div>
    );
}

const Config = ({ di }) => {
    const [readPayload, setReadPayload] = useState(null);
    const [activeForm, setActiveForm] = useState('get');
    const [getType, setGetType] = useState('global');
    const [postType, setPostType] = useState('global');
    const [getAccount, setGetAccount] = useState(null);
    const [postAccount, setPostAccount] = useState(null);
    const [getForce, setGetForce] = useState(false);
    const [settingGroup, setSettingGroup] = useState(SETTING_GROUPS[0].value);

    useEffect(() => setGetAccount(null), [getType]);
    useEffect(() => setPostAccount(null), [postType]);
    useEffect(() => setGetForce(false), [getType]);

    const { fields: getFormFields, needsAccount: getNeedsAccount } = useMemo(
        () => buildFieldsForType(['key'], GET_EXTRA_KEYS_BY_TYPE[getType] || []),
        [getType],
    );

    const { fields: postFormFields, needsAccount: postNeedsAccount } = useMemo(
        () => buildFieldsForType(['key', 'value'], POST_EXTRA_KEYS_BY_TYPE[postType] || []),
        [postType],
    );

    return (
        <Scroll className="grow w-full h-full min-h-0 min-w-0 flex flex-col">
            <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-4 py-6 sm:px-6 flex-1 min-h-0 min-w-0">
                <SettingGroupDropdown label="Setting group" value={settingGroup} onChange={setSettingGroup} />
                <div className="flex flex-row gap-3 w-full">
                    <Button
                        type="button"
                        {...(activeForm === 'get' ? THEME.ACTIVE_BUTTON : THEME.ACTIVE_INPUT)}
                        className="min-w-28"
                        onClick={() => setActiveForm('get')}
                    >
                        Get config
                    </Button>
                    <Button
                        type="button"
                        {...(activeForm === 'set' ? THEME.ACTIVE_BUTTON : THEME.ACTIVE_INPUT)}
                        className="min-w-28"
                        onClick={() => setActiveForm('set')}
                    >
                        Set config
                    </Button>
                </div>

                {activeForm === 'get' ? (
                    <Card
                        className="flex flex-col gap-4 w-full min-h-0 p-5 sm:p-6"
                        {...THEME.SECONDARY}
                    >
                        <div className="flex flex-col lg:flex-row gap-4 w-full min-w-0 min-h-0">
                            <div className="flex flex-col gap-4 w-full lg:flex-[2] min-w-0">
                                <ConfigTypeDropdown label="Config type" value={getType} onChange={setGetType} />
                                {getNeedsAccount && (
                                    <AccountFieldRow di={di} account={getAccount} setAccount={setGetAccount} label="Account" />
                                )}
                                <div className="flex flex-col w-full min-w-0 min-h-0 p-5">
                                    <Form
                                        key={`get-${getType}`}
                                        di={di}
                                        fields={getFormFields}
                                        submitText="Fetch"
                                        beforeSubmit={
                                            <ForceNextToSubmit
                                                typeKey={getType}
                                                value={getForce}
                                                onChange={setGetForce}
                                            />
                                        }
                                        onSubmit={(data) => {
                            const key = (data.key || '').trim();
                            const skipKeyForScope = getType === 'account_id' || getType === 'business_id';
                            if (!skipKeyForScope && !key) {
                                di.toast.error('Key is required');
                                return;
                            }
                            if (getNeedsAccount) {
                                const aid = accountIdFromAccount(getAccount);
                                if (!aid) {
                                    di.toast.error('Select an account');
                                    return;
                                }
                            }
                            const extra = { force: getForce ? '1' : '0' };
                            (GET_EXTRA_KEYS_BY_TYPE[getType] || []).forEach((k) => {
                                if (k === 'account_id') {
                                    const aid = accountIdFromAccount(getAccount);
                                    if (aid) extra.account_id = aid;
                                } else if (data[k] !== undefined && data[k] !== '') {
                                    extra[k] = data[k];
                                }
                            });
                            const queryParams = {
                                type: getType,
                                group: settingGroup,
                                ...extra,
                            };
                            if (key) queryParams.key = key;
                            const query = buildQuery(queryParams);
                            di.request.get({
                                url: di.api.get('config') + query,
                                suppressMessageToast: true,
                                callback: (data) => {
                                    setReadPayload(data);
                                },
                            });
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 w-full lg:flex-1 min-w-0 shrink-0">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-white/60 w-full">Response</h3>
                                <Card
                                    {...THEME.ACTIVE_INPUT}
                                    className="w-full max-h-96 overflow-auto p-4"
                                >
                                    {readPayload === null ? (
                                        <p className="text-sm text-white/60">No response yet</p>
                                    ) : (() => {
                                        const view = getConfigReadDisplay(readPayload);
                                        if (view.kind === 'message') {
                                            return (
                                                <p className="text-sm text-white/90 whitespace-pre-wrap break-words">
                                                    {view.text}
                                                </p>
                                            );
                                        }
                                        if (view.asJson) {
                                            return <Json data={view.content} />;
                                        }
                                        return (
                                            <p className="text-sm text-white/90 whitespace-pre-wrap break-words">
                                                {view.content === null || view.content === undefined
                                                    ? ''
                                                    : String(view.content)}
                                            </p>
                                        );
                                    })()}
                                </Card>
                            </div>
                        </div>
                    </Card>
                ) : (
                    <Card
                        className="flex flex-col gap-4 w-full min-h-0 p-5 sm:p-6"
                        {...THEME.SECONDARY}
                    >
                        <div className="flex flex-col gap-4 w-full min-w-0 flex-1">
                            <ConfigTypeDropdown label="Config type" value={postType} onChange={setPostType} />
                            {postNeedsAccount && (
                                <AccountFieldRow di={di} account={postAccount} setAccount={setPostAccount} label="Account" />
                            )}
                            <div className="flex flex-col w-full min-w-0 min-h-0 p-5">
                                <Form
                                    key={`post-${postType}`}
                                    di={di}
                                    fields={postFormFields}
                                    submitText="Save"
                                    onSubmit={(data) => {
                            const key = (data.key || '').trim();
                            const valueRaw = data.value ?? '';
                            if (!key) {
                                di.toast.error('Key is required');
                                return;
                            }
                            if (String(valueRaw).trim() === '') {
                                di.toast.error('Value is required');
                                return;
                            }
                            if (postNeedsAccount) {
                                const aid = accountIdFromAccount(postAccount);
                                if (!aid) {
                                    di.toast.error('Select an account');
                                    return;
                                }
                            }
                            const body = {
                                key,
                                value: coerceConfigValue(String(valueRaw)),
                                type: postType,
                                group: settingGroup,
                            };
                            (POST_EXTRA_KEYS_BY_TYPE[postType] || []).forEach((k) => {
                                if (k === 'account_id') {
                                    const aid = accountIdFromAccount(postAccount);
                                    if (aid) body.account_id = aid;
                                } else {
                                    const v = data[k];
                                    if (v !== undefined && String(v).trim() !== '') {
                                        body[k] = String(v).trim();
                                    }
                                }
                            });
                            di.request.post({
                                url: di.api.get('config'),
                                body,
                                callback: () => {},
                            });
                                    }}
                                />
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </Scroll>
    );
};

export default Config;
