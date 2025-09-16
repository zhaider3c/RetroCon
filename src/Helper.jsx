import toast from 'react-hot-toast';



let HEADERS = {
}

const REST = '/rest/v2';

let HOSTS = {}
// UNIFIED-CON
HOSTS.UNICON = { 'url': 'https://onecon.local.cedcommerce.com', 'token': 'Null', type: 'Not selected' };
HOSTS.CATALOG = HOSTS.UNICON;
HOSTS.SALES = HOSTS.UNICON;

const VITE_UNICON_APP_TOKEN_PROD = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjg0ODBjOWQ2ZjM3OWUzZmNjMDEzZDk5Iiwicm9sZSI6ImFwcCIsImlzcyI6ImlwLTEwLTAtMTgtMzgiLCJ0b2tlbl9pZCI6IjY4YWRhM2VhMWVhZTY4MTQzYzA3YmEwMiJ9.ePp3z9UpNN-fi4zvx1F3_psMORY2py7__ljs3u8VUS8RG8r52QhA-xfBwpfTzrHsWtT4GEHCAi54N6uzxs533OtBGTEqbdZpPtTfmSr-UzflAOqYC5siKWtxe_WvxJp9b2zKGM6oAYIvTnqM0-tAhAWb_n8PU74CKx8Rm8MPn9iVaonOuQ-GWsNNyKg2MMwbZeprqENJ69XXDrhLOYx7gVkgkUE8wRNFg9Q1J2NMubCXT_1GROiuKDXIEP7IZSoCTJW0xd7VlgyghYQy5AOWNd5Iu4cE-Yrg3RSvnIYhgvaZcvv3oYh2eJ4ReValqSo3SI4jspbuwYLClD9vrnKlWg"
const VITE_UNICON_APP_TOKEN_STAGING = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjg0ODBjOWQ2ZjM3OWUzZmNjMDEzZDk5Iiwicm9sZSI6ImFwcCIsImlzcyI6ImlwLTEwLTAtMTAtMjM1IiwidG9rZW5faWQiOiI2OGE4NTFmYWI1MzdiYzJiMzcwMTBkYTIifQ.GlHl_63CQUBLbAipPCTp-dnHmuwmhXYnZoqAWxcSgEH4YA3AbypUklYEdga0BKEA95yoJzVH7K3T9VAorRvLWfx_48RRgvAvl1z96KlkE7uO84Jsg-xT4TWd9tbWScqKec7EdjqNYxCjej9JHq2mPzTki2BGyt0eEdChn9THwaupACGTtroAEV0CFsg5jacZE5B8tnz3PG_vhdRlWh07W7AkgbCHqZaBFFYXAfwVy8VMARnQpXZTOl7e63pzkCqXpk10Zxx24EF-1Q_AjzR3puSy30zbs2CYslY6SVCTdxBM-IzxYF4k_GwSFzlrzdaPAoPMER-QrfnjUGBZ0UssPQ"
const VITE_UNICON_APP_TOKEN_DEV = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiNjg0MjkzNDQ5NzM5ZjJjZDAyMDFiNTI5Iiwicm9sZSI6ImFwcCIsImlzcyI6ImlwLTEwLTAtMS0xMTAiLCJ0b2tlbl9pZCI6IjY4NjhlNWFlOWU1MTFkYTA4YTA0MTEyMiJ9.Yi16hBgJSrNymsmmF_6UB5iqUo1107gpLOW7yTi-IehgXCYSvg6r8jSKmCtVv3NUmsSltAmZyEIDEbsbFBZPR1QRTNq870__6iKJudm_MAJ6w5tdiSwOHbdU7uKs_M_pb29V4I2aqPeXjb1ByDaGNrxYd5_Wx7fEhDm2PgDSoc0BLo3-DA2Jp_hxVDqguWjXN6nAWE8oAbnn29B7szj6fq2jXCCp3hzRjWBdLILZ1FN_e2mi9oaR20h196uJdjZX_jeqR8dak7P3QugyUGMWWtF3Ea5X7caJVG6I02jVQSSc7w2uMCNrGUkh-uV2f1n3mYsEABSqYYpoIM8BpJwd9Q"
const VITE_UNICON_APP_TOKEN_LOCAL = import.meta.env.VITE_LOCAL_APP_KEY || "Env not set";


const VITE_UNICON_URL_LOCAL = "onecon.local.cedcommerce.com"
const VITE_UNICON_URL_DEV = "uni-backend.cifapps.com"
const VITE_UNICON_URL_STAGING = "uni-stag-backend.cifapps.com"
const VITE_UNICON_URL_PROD = "unicon-backend.cedcommerce.com"

HOSTS = { ...HOSTS, ...JSON.parse(localStorage.getItem("hosts")) };


const apiEndpoints = {
  phpunit: '/',
  app: `${REST}/apps`,
  user: `${REST}/user`,
  cache: `${REST}/redis`,
  staff: `${REST}/staff`,
  media: `${REST}/media`,
  menu: `${REST}/staff/menu`,
  channel: `${REST}/channel`,
  country: `${REST}/country`,
  product: `${REST}/product`,
  login: `${REST}/user/login`,
  currency: `${REST}/currency`,
  activity: `${REST}/activity`,
  logout: `${REST}/user/logout`,
  attribute: `${REST}/attribute`,
  state: `${REST}/country/state`,
  swagger: `${REST}/swagger/json`,
  business: `${REST}/business`,
  'staff-all': `${REST}/staff/all`,
  'sso-client': `${REST}/sso/client`,
  'business-all': `${REST}/business`,
  'cache-list': `${REST}/redis/list`,
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
  'get-download-url': `${REST}/media/get-download-url`,
  'classification-recount': `${REST}/classification/recount`,
  'jira-auth-url': `${REST}/jira/auth/url`,
  'jira-user': `${REST}/jira/user`,
  'jira-user-issue': `${REST}/jira/user/issues`,
  'admin-user': `${REST}/admin/user`,
  'admin-user-token': `${REST}/user/access-token`,
};

let DI = {};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function init(url) {
  HEADERS['Authorization'] = 'Bearer ' + (localStorage.getItem('token'));
  HEADERS['Business'] = localStorage.getItem('business');
  if (url != DI.api.get('login') && !localStorage.getItem('token')) {
    DI.navigate('/login');
  } else if (url != DI.api.get('business') &&
    url != DI.api.get('login') &&
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

function defaultErrorHandler(error) {
  toast.error(error.message);
  console.error(error.response);
}

async function handleResponse(response, callback) {
  let data = await response.json();
  if (response.ok) {
    if (data.message || data.msg)
      toast.success(data.message ?? data.msg);
  } else {
    if (response.status == 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('business');
      errorRedirect('Session Expired', '/login', 1500, true);
    }
    toast.error(data.message ?? "Error");
  }
  callback(data);
  return response.ok;
}

function filterHeaders(headers) {
  return Object.fromEntries(
    Object.entries({ ...HEADERS, ...headers }).filter(
      ([key, value]) => {
        if (value && (value.includes('null') || value.includes('undefined'))) {
          return false;
        }
        return Boolean(value);
      })
  );
}

DI = {
  request: {
    get: async (
      { url,
        headers = {},
        callback = (res) => { },
        error_callback = (err) => { } }
    ) => {
      init(url);
      let sendHeaders = { ...headers, "Content-Type": "null" };
      sendHeaders = filterHeaders(sendHeaders);
      if (!url) {
        url = '/rest/v2/ping';
      }
      try {
        await fetch(url, {
          method: 'GET',
          headers: sendHeaders
        }).then(response => handleResponse(response, callback));
      } catch (error) {
        defaultErrorHandler(error);
        error_callback(error);
      }
    },
    delete: async (
      { url,
        headers = {},
        callback = (res) => { },
        error_callback = (err) => { } }
    ) => {
      init(url);
      let sendHeaders = filterHeaders(headers);
      if (!url) {
        url = '/rest/v2/ping';
      }
      try {
        await fetch(url, {
          method: 'DELETE',
          headers: sendHeaders
        }).then(response => handleResponse(response, callback));
      } catch (error) {
        defaultErrorHandler(error);
        error_callback(error);
      }
    },
    post: async (
      {
        url,
        headers = {},
        body = "{}",
        callback = (res) => { },
        error_callback = (err) => { }
      }
    ) => {
      init(url);

      // If body is a string, set Content-Type to application/json, else don't set it
      let baseHeaders = { ...headers };
      if (typeof body === "string") {
        baseHeaders["Content-Type"] = "application/json";
      }
      let sendHeaders = filterHeaders(baseHeaders);

      if (!url) {
        url = '/rest/v2/ping';
      }

      try {
        await fetch(url, {
          method: 'POST',
          headers: sendHeaders,
          body: body
        }).then(response => handleResponse(response, callback));
      } catch (error) {
        defaultErrorHandler(error);
        error_callback(error);
      }
    },
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
  return (async () => {
    let user;
    await DI.request.get(({
      url: DI.api.get('user'), callback: (res) => {
        user = res.data;
      }
    }));
    return user;
  })();
};

DI.hosts = HOSTS;
DI.toast = {
  error: toast.error,
  success: toast.success,
}

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

export { DI };