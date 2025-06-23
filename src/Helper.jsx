import toast from 'react-hot-toast';



let HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "*",

}

const REST = '/rest/v2';

const HOSTS = {}
// UNIFIED-CON
HOSTS.UNICON = 'https://onecon.local.cedcommerce.com';
HOSTS.CATALOG = HOSTS.UNICON;
HOSTS.SALES = HOSTS.UNICON;

// HOSTS.UNICON = 'https://unicon.local.cedcommerce.com';
// HOSTS.CATALOG = 'https://catalog.local.cedcommerce.com';
// HOSTS.SALES = 'https://sales.local.cedcommerce.com';

HOSTS.PHPUNIT = '/coverage-html';

const apiEndpoints = {
  phpunit: '/',
  app: `${REST}/apps`,
  user: `${REST}/user`,
  cache: `${REST}/redis`,
  media: `${REST}/media`,
  channel: `${REST}/channel`,
  country: `${REST}/country`,
  currency: `${REST}/currency`,
  product: `${REST}/product`,
  attribute: `${REST}/attribute`,
  activity: `${REST}/activity`,
  login: `${REST}/user/login`,
  logout: `${REST}/user/logout`,
  swagger: `${REST}/swagger/json`,
  state: `${REST}/country/state`,
  staff: `${REST}/staff`,
  menu: `${REST}/staff/menu`,
  'staff-all': `${REST}/staff/all`,
  'cache-list': `${REST}/redis/list`,
  'custom-list': `${REST}/custom-list`,
  'business-all': `${REST}/business`,
  'product-csv': `${REST}/product/csv`,
  'product-count': `${REST}/product/count`,
  'product-delete': `${REST}/product/delete`,
  'product-import': `${REST}/product/import`,
  'notification': `${REST}/notification`,
  'announcement': `${REST}/announcement`,
  'classification': `${REST}/classification`,
  'account-setting': `${REST}/account/settings`,
  'channel-group': `${REST}/channel/group`,
  'attribute-import': `${REST}/attribute-set/default`,
  'product-csv-import': `${REST}/product/import/bulk`,
  'get-upload-url': `${REST}/media/get-upload-url`,
  'get-download-url': `${REST}/media/get-download-url`,
  'classification-recount': `${REST}/classification/recount`,

};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function init(url) {
  if (!url.includes("/login")) {
    HEADERS['Authorization'] = 'Bearer ' + (localStorage.getItem('token'));
    if (!url.includes('business')) {
      HEADERS['Business'] = localStorage.getItem('business');
    }
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
    if (data.message)
      toast.success(data.message);
  } else {
    if (response.status == 401 || response.status == 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('business');
      // errorRedirect('Invalid Authorization', '/login', 1500, true);
    }
    toast.error(data.message);
  }
  callback(data);
  return response.ok;
}

function filterHeaders(headers) {
  return Object.fromEntries(
    Object.entries({ ...HEADERS, ...headers }).filter(([key, value]) => Boolean(value))
  );
}

export const DI = {
  request: {
    get: async (
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
      let sendHeaders = filterHeaders({ "Content-Type": "application/json", ...headers });
      if (!url) {
        url = '/rest/v2/ping';
      }

      try {
        await fetch(url, {
          method: 'POST',
          headers: sendHeaders,
          body
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
      else return `${HOSTS[host.toUpperCase()]}${apiEndpoints[endpoint.toLowerCase()]}`;
    }
  },
  formatTime: (dateObj) => {
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