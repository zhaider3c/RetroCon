import toast from 'react-hot-toast';



let HEADERS = {
}

const REST = '/rest/v2';

let HOSTS = {}
// UNIFIED-CON
HOSTS.UNICON = 'https://onecon.local.cedcommerce.com';
HOSTS.CATALOG = HOSTS.UNICON;
HOSTS.SALES = HOSTS.UNICON;
// HOSTS.PHPUNIT = '/coverage-html';

// HOSTS.UNICON = 'https://unicon.local.cedcommerce.com';
// HOSTS.CATALOG = 'https://catalog.local.cedcommerce.com';
// HOSTS.SALES = 'https://sales.local.cedcommerce.com';


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
    if (response.status == 401 || response.status == 403) {
      localStorage.removeItem('token');
      localStorage.removeItem('business');
      // errorRedirect('Invalid Authorization', '/login', 1500, true);
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

export { DI };