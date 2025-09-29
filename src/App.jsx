import React from 'react';
import { DI } from './Helper';
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Cache from '@pages/Cache';
import Swagger from '@pages/Swagger';
import Message from "@pages/Message";
import Phpunit from '@pages/Phpunit';
import Business from "@pages/Business";
import Products from "@pages/Products";
import Attribute from "@pages/Attribute";
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
import Staff from '@pages/Staff';
import Jira from '@pages/Jira/Main';
import Profile from '@pages/Profile';
import User from '@pages/user/Main';

const NAV_URLS = [
  // --- show: true ---
  { text: "User", url: '/user', component: <User di={DI} />, show: true },
  { text: "Jira", url: '/jira', component: <Jira di={DI} />, show: true },
  { text: "Admin", url: '/admin', component: <Admin di={DI} />, show: true },
  { text: "Canvas", url: '/canvas', component: <Whiteboard di={DI} />, show: true },
  { text: "Products", url: '/product', component: <Products di={DI} />, show: true },
  { text: "Dashboard", url: '/dashboard', component: <Dashboard di={DI} />, show: true },
  { text: "Attributes", url: '/attribute', component: <Attribute di={DI} />, show: true },
  { text: "Custom List", url: '/custom-list', component: <CustomList di={DI} />, show: true },
  { text: "Notifications", url: '/notification', component: <Notification di={DI} />, show: true },
  { text: "Classification", url: '/classification', component: <Classification di={DI} />, show: true },
  { text: "Postman", url: '/postman', component: <Postman di={DI} />, show: true, tip: "Press Ctrl+B to open preset menu" },
  // --- show: false ---
  { text: "SSO", url: '/sso', component: <SSO di={DI} />, show: false },
  { text: "Staff", url: '/staff', component: <Staff di={DI} />, show: false },
  { text: "Login", url: '/login', component: <Login di={DI} />, show: false },
  { text: "Cache", url: '/cache', component: <Cache di={DI} />, show: false },
  { text: "Logout", url: '/login', component: <Navigate to={'/'} />, show: false },
  { text: "Message", url: '/message', component: <Message di={DI} />, show: false },
  { text: "Country", url: '/country', component: <Country di={DI} />, show: false },
  { text: "Profile", url: '/profile', component: <Profile di={DI} />, show: false },
  { text: "Php Unit", url: '/phpunit', component: <Phpunit di={DI} />, show: false },
  { text: "Currency", url: '/currency', component: <Currency di={DI} />, show: false },
  { text: "Businesses", url: '/business', component: <Business di={DI} />, show: false },
  { text: "API Reference", url: '/swagger', component: <Swagger di={DI} />, show: false },
].sort((a, b) => {
  // Sort by the string length of the 'show' value (true/false as string), then by value itself (true before false)
  // But since 'show' is always boolean, sort by true before false, then by text length
  if (a.show === b.show) {
    return a.text.length - b.text.length;
  }
  return (a.show === true ? -1 : 1);
});

const App = () => {
  DI.navigate = useNavigate();
  return (
    <div className='w-screen h-screen flex flex-col justify-center items-center overflow-hidden bg-black'>
      <div className='overflow-hidden w-full grow'>
        <Routes>
          {/* <Route path="/" element={<Redirect url='https://unicon.local.cedcommerce.com/sso/prompt/login' />} /> */}
          <Route path="/" element={<Navigate to='/login' />} />
          <Route path="/auth/login" element={<Message di={DI} />} />
          {
            NAV_URLS.map((e, i) => {
              return (
                <Route key={i} path={e.url} element={e.component} />
              )
            })
          }
        </Routes>
      </div>
      <Menubar links={NAV_URLS} di={DI} />
      <Toaster />
    </div>
  );
}

export default App