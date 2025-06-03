import React from 'react';
import { DI } from './Helper';
import { BrowserRouter, Routes, Route } from "react-router";
import { Toaster } from 'react-hot-toast';

import Cache from '@pages/Cache';
import Swagger from '@pages/Swagger';
import Message from "@pages/Message";
import Phpunit from '@pages/Phpunit';
import Business from "@pages/Business";
import Products from "@pages/Products";
import Attribute from "@pages/Attribute";
import Sidebar from '@components/Sidebar';
import Dashboard from '@pages/Dashboard';
import CustomList from '@pages/CustomList';
import Notification from '@pages/Notification';
import Classification from '@pages/Classification';
import Country from '@pages/Country';
import Currency from '@pages/Currency';
import Login from '@pages/Login';
import Postman from '@pages/Postman';
import Admin from '@pages/Admin';
import Whiteboard from '@pages/Whiteboard';
import { Main as Menubar } from '@components/Menubar';
import { Main as SSO } from '@pages/sso/Main.jsx';

const Redirect = ({ url }) => {
  window.location = url;
  return null;
};
const NAV_URLS = [
  { text: "SSO", url: '/sso', component: <SSO di={DI} />, show: true },
  { text: "Cache", url: '/cache', component: <Cache di={DI} />, show: true },
  { text: "Admin", url: '/admin', component: <Admin di={DI} />, show: true },
  { text: "Country", url: '/country', component: <Country di={DI} />, show: true },
  { text: "Postman", url: '/postman', component: <Postman di={DI} />, show: true },
  { text: "Php Unit", url: '/phpunit', component: <Phpunit di={DI} />, show: true },
  { text: "Canvas", url: '/canvas', component: <Whiteboard di={DI} />, show: true },
  { text: "Products", url: '/product', component: <Products di={DI} />, show: true },
  { text: "Currency", url: '/currency', component: <Currency di={DI} />, show: true },
  { text: "Dashboard", url: '/dashboard', component: <Dashboard di={DI} />, show: true },
  { text: "Attributes", url: '/attribute', component: <Attribute di={DI} />, show: true },
  { text: "Custom List", url: '/custom-list', component: <CustomList di={DI} />, show: true },
  { text: "Notifications", url: '/notification', component: <Notification di={DI} />, show: true },
  { text: "Classification", url: '/classification', component: <Classification di={DI} />, show: true },
  // False
  { text: "Login", url: '/login', component: <Login di={DI} />, show: false },
  { text: "Logout", url: '/login', component: <Redirect url={'/'} />, show: false },
  { text: "Message", url: '/message', component: <Message di={DI} />, show: false },
  { text: "Businesses", url: '/business', component: <Business di={DI} />, show: false },
  { text: "API Reference", url: '/swagger', component: <Swagger di={DI} />, show: false },
];

const App = () => {
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center overflow-hidden'>
      <div className='overflow-y-auto overflow-hidden w-full grow'>
        <BrowserRouter>
          <Routes>
            {/* <Route path="/" element={<Redirect url='https://unicon.local.cedcommerce.com/sso/prompt/login' />} /> */}
            <Route path="/" element={<Redirect url='/login' />} />
            <Route path="/auth/login" element={<Message di={DI} />} />
            {
              NAV_URLS.map((e, i) => {
                return (
                  <Route key={i} path={e.url} element={e.component} />
                )
              })
            }
          </Routes>
        </BrowserRouter>
      </div>
      <Menubar links={NAV_URLS} di={DI} />
      <Toaster />
    </div>
  );
}

export default App