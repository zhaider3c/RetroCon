import toast from 'react-hot-toast';
import { THEME } from '@pages/Theme';

// --- Constants ---
function getEnv(key) {
  let value = import.meta.env[`VITE_${key}`];
  if (value === 'true' || value === 'false') {
    return value === 'true';
  }
  return value;
}

let HEADERS = {
}

const REST = '/rest/v2';

let HOSTS = {}
// UNIFIED-CON
HOSTS.UNICON = { 'url': 'https://unicon.local.cedcommerce.com', 'token': 'Null', type: 'Not selected' };
HOSTS.CATALOG = HOSTS.UNICON;
HOSTS.SALES = HOSTS.UNICON;

const VITE_UNICON_APP_TOKEN_PROD = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjg0ODBjOWQ2ZjM3OWUzZmNjMDEzZDk5Iiwicm9sZSI6ImFwcCIsImlzcyI6ImlwLTEwLTAtMTgtMzgiLCJ0b2tlbl9pZCI6IjY4YWRhM2VhMWVhZTY4MTQzYzA3YmEwMiJ9.ePp3z9UpNN-fi4zvx1F3_psMORY2py7__ljs3u8VUS8RG8r52QhA-xfBwpfTzrHsWtT4GEHCAi54N6uzxs533OtBGTEqbdZpPtTfmSr-UzflAOqYC5siKWtxe_WvxJp9b2zKGM6oAYIvTnqM0-tAhAWb_n8PU74CKx8Rm8MPn9iVaonOuQ-GWsNNyKg2MMwbZeprqENJ69XXDrhLOYx7gVkgkUE8wRNFg9Q1J2NMubCXT_1GROiuKDXIEP7IZSoCTJW0xd7VlgyghYQy5AOWNd5Iu4cE-Yrg3RSvnIYhgvaZcvv3oYh2eJ4ReValqSo3SI4jspbuwYLClD9vrnKlWg"
const VITE_UNICON_APP_TOKEN_STAGING = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjg0ODBjOWQ2ZjM3OWUzZmNjMDEzZDk5Iiwicm9sZSI6ImFwcCIsImlzcyI6ImlwLTEwLTAtMTAtMjM1IiwidG9rZW5faWQiOiI2OGE4NTFmYWI1MzdiYzJiMzcwMTBkYTIifQ.GlHl_63CQUBLbAipPCTp-dnHmuwmhXYnZoqAWxcSgEH4YA3AbypUklYEdga0BKEA95yoJzVH7K3T9VAorRvLWfx_48RRgvAvl1z96KlkE7uO84Jsg-xT4TWd9tbWScqKec7EdjqNYxCjej9JHq2mPzTki2BGyt0eEdChn9THwaupACGTtroAEV0CFsg5jacZE5B8tnz3PG_vhdRlWh07W7AkgbCHqZaBFFYXAfwVy8VMARnQpXZTOl7e63pzkCqXpk10Zxx24EF-1Q_AjzR3puSy30zbs2CYslY6SVCTdxBM-IzxYF4k_GwSFzlrzdaPAoPMER-QrfnjUGBZ0UssPQ"
const VITE_UNICON_APP_TOKEN_DEV = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjg0MjkzNDQ5NzM5ZjJjZDAyMDFiNTI5Iiwicm9sZSI6ImFwcCIsImlzcyI6ImlwLTEwLTAtMS0xMTAiLCJ0b2tlbl9pZCI6IjY4NjhlNWFlOWU1MTFkYTA4YTA0MTEyMiJ9.Yi16hBgJSrNymsmmF_6UB5iqUo1107gpLOW7yTi-IehgXCYSvg6r8jSKmCtVv3NUmsSltAmZyEIDEbsbFBZPR1QRTNq870__6iKJudm_MAJ6w5tdiSwOHbdU7uKs_M_pb29V4I2aqPeXjb1ByDaGNrxYd5_Wx7fEhDm2PgDSoc0BLo3-DA2Jp_hxVDqguWjXN6nAWE8oAbnn29B7szj6fq2jXCCp3hzRjWBdLILZ1FN_e2mi9oaR20h196uJdjZX_jeqR8dak7P3QugyUGMWWtF3Ea5X7caJVG6I02jVQSSc7w2uMCNrGUkh-uV2f1n3mYsEABSqYYpoIM8BpJwd9Q"
const VITE_UNICON_APP_TOKEN_LOCAL = getEnv("LOCAL_APP_KEY") || "Env not set";


const VITE_UNICON_URL_LOCAL = "unicon.local.cedcommerce.com"
const VITE_UNICON_URL_DEV = "dev-backend-unicon.threecolts.com"
const VITE_UNICON_URL_STAGING = "uni-stag-backend.cifapps.com"
const VITE_UNICON_URL_PROD = "unicon-backend.cedcommerce.com"

HOSTS = { ...HOSTS, ...JSON.parse(localStorage.getItem("hosts")) };

const API_DEBOUNCE_TIME = 300;

const Z_HOST_PROXY = getEnv("ZHOST_PROXY") || 'https://zaidhaider--90e0a5dc455611f1be7442b51c65c3df.web.val.run';

function shouldProxy(hostname) {
  if (!hostname) return false;
  if (hostname === 'localhost' || hostname.startsWith('127.')) return false;
  if (hostname.endsWith('.local.cedcommerce.com')) return false;
  return true;
}

function proxify(url, headers = {}) {
  try {
    const u = new URL(url);
    if (!shouldProxy(u.hostname)) return { url, headers };
    return {
      url: `${Z_HOST_PROXY}${u.pathname}${u.search}`,
      headers: { ...headers, ZHost: u.hostname },
    };
  } catch {
    return { url, headers };
  }
}

const SAFE_SESSION_KEYS = ['hosts', 'login_data']
const TOAST = {
  success: (message) => {
    toast.custom((data) => (
      <div className='text-white rounded-md min-w-48 flex min-h-10 justify-center items-center overflow-hidden backdrop-blur-md! bg-black/25'
        style={
          {
            backgroundColor: THEME.ACTIVE.bg,
          }
        }>
        <div className='w-2 h-full bg-green-400'>
        </div>
        <div className='grow px-4'>
          {message}
        </div>
      </div>
    ));
  },
  error: (message) => {
    toast.custom((data) => (
      <div className='text-white rounded-md min-w-48 flex min-h-10 justify-center items-center overflow-hidden backdrop-blur-md! bg-black/25'>
        <div className='w-2 h-full bg-red-400'>
        </div>
        <div className='grow px-4'>
          {message}
        </div>
      </div>
    ))
  }
}
const apiEndpoints = {
  'phpunit': '/',
  'app': `${REST}/apps`,
  'user': `${REST}/user`,
  'cache': `${REST}/cache`,
  'staff': `${REST}/staff`,
  'media': `${REST}/media`,
  'menu': `${REST}/staff/menu`,
  'channel': `${REST}/channel`,
  'country': `${REST}/country`,
  'product': `${REST}/product`,
  'login': `${REST}/user/login`,
  'currency': `${REST}/currency`,
  'activity': `${REST}/activity`,
  'logout': `${REST}/user/logout`,
  'attribute': `${REST}/attribute`,
  'state': `${REST}/country/state`,
  'swagger': `${REST}/swagger/json`,
  'business': `${REST}/business`,
  'staff-all': `${REST}/staff/all`,
  'sso-client': `${REST}/sso/client`,
  'business-all': `${REST}/business`,
  'cache-list': `${REST}/redis/list`,
  'cache-flush': `${REST}/cache/flush`,
  'custom-list': `${REST}/custom-list`,
  'product-csv': `${REST}/product/csv`,
  'sso-scope': `${REST}/sso/oauth/scope`,
  'announcement': `${REST}/announcement`,
  'notification': `${REST}/notification`,
  'channel-group': `${REST}/channel/group`,
  'product-count': `${REST}/product/count`,
  'product-delete': `${REST}/product/delete`,
  'product-import': `${REST}/product/import`,
  'classification': `${REST}/classification`,
  'account-setting': `${REST}/account/settings`,
  'sso-scope-permit': `${REST}/sso/scope/permit`,
  'get-upload-url': `${REST}/media/get-upload-url`,
  'attribute-import': `${REST}/attribute-set/default`,
  'product-csv-import': `${REST}/product/import/bulk`,
  'product-autolink': `${REST}/product/autolink`,
  'get-download-url': `${REST}/media/get-download-url`,
  'classification-recount': `${REST}/classification/recount`,
  'jira-auth-url': `${REST}/jira/auth/url`,
  'jira-user': `${REST}/jira/user`,
  'jira-user-issue': `${REST}/jira/user/issues`,
  'admin-user': `${REST}/admin/user`,
  'admin-user-token': `${REST}/user/access-token`,
  'fire-event': `${REST}/ashisogi/event/fire`,
  'account-all': `${REST}/account`,
  'account-step': `${REST}/setup-steps`,
  'config': `${REST}/config`,
  'product-inventory': `${REST}/inventory`,
  'unlinked-products': `${REST}/product/unlinked`,
  'linked-products': `${REST}/product/linked`,
  'partial-linked-products': `${REST}/product/partial-linked`,
  'system-attribute': `${REST}/system/attribute`,
  'warehouse': `${REST}/warehouse`,
  'warehouse-import': `${REST}/warehouse/import`,
  'ai-provider': `${REST}/ai/provider`,
  'ai-models': `${REST}/ai/model`,
  'ai-sync-models': `${REST}/ai/model/sync`,
  'ai-chat': `${REST}/ai/chats`,
  'ai-messages': `${REST}/ai/messages`,
};

const NO_AUTH_APIS = [
  'login',
];

let apiTimes = {};

let DI = {};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// --- Functions ---
function init(url) {
  const isNoAuth = NO_AUTH_APIS.some((endpoint) => url === DI.api.get(endpoint));
  const token = localStorage.getItem('token');
  HEADERS['Authorization'] = isNoAuth || !token ? null : 'Bearer ' + token;
  const business = localStorage.getItem('business');
  HEADERS['Business'] = !isNoAuth && /^[a-f0-9]{24}$/i.test(business) ? business : null;
  if (!isNoAuth && !token) {
    DI.navigate('/login');
  } else if (url != DI.api.get('business') &&
    !isNoAuth &&
    !localStorage.getItem('business')) {
    DI.navigate('/business');
  }
}

function errorRedirect(message, to = '/logout', time = 3000, handle = true) {
  const url = `/message?message=${message.replaceAll(' ', '%20')}&wait=${time}&forward=${to}&auto=false`
  if (handle) {
    DI.navigate(url);
  }
}

function defaultErrorHandler(error, error_callback) {
  if (error_callback) {
    error_callback(error);
  } else {
    TOAST.error(error.message);
  }
  console.error(error);
}

async function handleResponse(response, callback, { suppressMessageToast = false } = {}) {
  let data = {};
  try {
    const text = await response.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    data = {};
  }
  if (response.ok) {
    if (!suppressMessageToast && (data.message || data.msg)) {
      if (data.success) {
        TOAST.success(data.message ?? data.msg);
      } else {
        TOAST.error(data.message ?? data.msg);
      }
    }
  } else {
    if (response.status == 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('business');
      DI.navigate('/login?error=Session Expired');
      // errorRedirect('Session Expired', '/login', 1500, true);
    }
    TOAST.error(data.message ?? "Error");
  }
  callback(data, { ok: response.ok, status: response.status });
  return response.ok;
}

function filterHeaders(headers) {
  return Object.fromEntries(
    Object.entries(headers).filter(
      ([key, value]) => value !== null && value !== undefined)
  );
}

async function call({ url, method, body = null, headers = {}, callback = () => { }, error_callback = () => { }, isUpload = false, suppressMessageToast = false }) {
  if (!getEnv("DISABLE_DEBOUNCE")) {
    const debounceKey = `${method}:${url}`;
    if ((apiTimes[debounceKey] ?? 0) < Date.now()) {
      apiTimes[debounceKey] = Date.now() + API_DEBOUNCE_TIME;
    } else {
      return;
    }
  }
  init(url);
  let sendHeaders = { ...HEADERS };
  if (!body) {
    sendHeaders["Content-Type"] = null;
  } else if (isUpload) {
    sendHeaders["Content-Type"] = null;
  } else {
    sendHeaders["Content-Type"] = "application/json";
    if (typeof body === 'object') {
      body = JSON.stringify(body);
    }
  }
  sendHeaders = filterHeaders({ ...sendHeaders, ...headers });
  const { url: finalUrl, headers: finalHeaders } = proxify(url, sendHeaders);
  await fetch(finalUrl, {
    method: method,
    headers: finalHeaders,
    ...(body ? { body: body } : {})
  }).then(response => handleResponse(response, callback, { suppressMessageToast })).catch(error => {
    defaultErrorHandler(error, error_callback);
  });
}

// --- DI (dependency injection) ---
DI = {
  request: {
    get: ({ url, headers, callback, error_callback, suppressMessageToast }) => {
      call({ url, method: "GET", body: null, headers, callback, error_callback, suppressMessageToast });
    },
    upload: ({ url, body, headers, callback, error_callback }) => {
      call({ url, method: "POST", body, headers, callback, error_callback, isUpload: true });
    },
    post: ({ url, body, headers, callback, error_callback, suppressMessageToast }) => {
      call({ url, method: "POST", body, headers, callback, error_callback, suppressMessageToast });
    },
    put: ({ url, body, headers, callback, error_callback }) => {
      call({ url, method: "PUT", body, headers, callback, error_callback });
    },
    patch: ({ url, body, headers, callback, error_callback }) => {
      call({ url, method: "PATCH", body, headers, callback, error_callback });
    },
    delete: ({ url, headers, callback, error_callback }) => {
      call({ url, method: "DELETE", body: null, headers, callback, error_callback });
    }
  },
  api: {
    get: (endpoint, host = 'UNICON', isFile = false) => {
      if (isFile)
        return `${apiEndpoints[endpoint.toLowerCase()]}`.replace("{{HOST}}", host.toLowerCase());
      else return `${HOSTS[host.toUpperCase()].url}${apiEndpoints[endpoint.toLowerCase()]}`;
    }
  },
  formatTime: (dateObj) => {
    if (!dateObj) return null;
    let date = new Date(Number(dateObj * 1000));
    return `
    ${date.getHours()}:${date.getMinutes()}
    ${" "}
    ${date.getDate().toString().padStart(2, '0')} ${(MONTHS[date.getMonth()])}, ${date.getFullYear()}`
  }
};
DI.getUser = () => {
  let localStorageUser = localStorage.getItem('user');
  if (localStorageUser && localStorageUser !== 'undefined') {
    return JSON.parse(localStorage.getItem('user'));
  }
  return false;
};

DI.hosts = HOSTS;
DI.toast = TOAST;
DI.proxify = proxify;

DI.url_profiles = {
  dev: {
    url: VITE_UNICON_URL_DEV,
    token: VITE_UNICON_APP_TOKEN_DEV,
  },
  staging: {
    url: VITE_UNICON_URL_STAGING,
    token: VITE_UNICON_APP_TOKEN_STAGING,
  },
  prod: {
    url: VITE_UNICON_URL_PROD,
    token: VITE_UNICON_APP_TOKEN_PROD,
  },
  local: {
    url: VITE_UNICON_URL_LOCAL,
    token: VITE_UNICON_APP_TOKEN_LOCAL,
  },
}


DI.decodedToken = (token) => {
  if (!token) {
    token = localStorage.getItem('token');
  }
  let decoded = JSON.parse(atob(token.split('.')[1]));

  return decoded ?? false;
}

DI.clearLocalStorage = () => {
  let outSession = {};
  for (const key of SAFE_SESSION_KEYS) {
    outSession[key] = localStorage.getItem(key);
  }
  localStorage.clear();
  for (const key of Object.keys(outSession)) {
    localStorage.setItem(key, outSession[key]);
  }
}

DI.clipboard = {
  copy: (text) => {
    navigator.clipboard.writeText(text);
  }
}

DI.getUID = () => {
  return Math.random().toString(36).substring(2, 15);
}

const colors = ['red', 'orange', 'amber', 'yellow', 'lime', 'green', 'emerald', 'teal', 'cyan', 'sky', 'blue', 'indigo', 'violet', 'purple', 'fuchsia', 'pink', 'rose']
DI.generateColorMap = (keys) => {
  let map = {};
  keys.forEach(key => {
    map[key] = colors[Math.floor(Math.random() * colors.length)];
  });
  return map;
}

DI.getCurrentBusiness = () => {
  return localStorage.getItem('business');
}

DI.resolveOid = (oid) => {
  if (oid && typeof oid === 'object') {
    return oid.$oid;
  }
  return oid;
}

export { DI };
