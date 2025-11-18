import React, { useState } from 'react';
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
  { text: "Jira", url: '/jira', component: Jira, show: true },
  { text: "Admin", url: '/admin', component: Admin, show: true },
  { text: "Settings", url: '/user', component: User, show: true },
  { text: "Canvas", url: '/canvas', component: Whiteboard, show: true },
  { text: "Products", url: '/product', component: Products, show: true },
  { text: "Dashboard", url: '/dashboard', component: Dashboard, show: true },
  { text: "Attributes", url: '/attribute', component: Attribute, show: true },
  { text: "Custom List", url: '/custom-list', component: CustomList, show: true },
  { text: "Notifications", url: '/notification', component: Notification, show: true },
  { text: "Classification", url: '/classification', component: Classification, show: true },
  { text: "Postman", url: '/postman', component: Postman, show: true, tip: "Press Ctrl+B to open preset menu" },
  // --- show: false ---
  { text: "SSO", url: '/sso', component: SSO, show: false },
  { text: "Staff", url: '/staff', component: Staff, show: false },
  { text: "Login", url: '/login', component: Login, show: false },
  { text: "Cache", url: '/cache', component: Cache, show: false },
  { text: "Logout", url: '/login', component: null, show: false },
  { text: "Message", url: '/message', component: Message, show: false },
  { text: "Country", url: '/country', component: Country, show: false },
  { text: "Profile", url: '/profile', component: Profile, show: false },
  { text: "Php Unit", url: '/phpunit', component: Phpunit, show: false },
  { text: "Currency", url: '/currency', component: Currency, show: false },
  { text: "Businesses", url: '/business', component: Business, show: false },
  { text: "API Reference", url: '/swagger', component: Swagger, show: false },
]

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
              const Component = e.component;
              return (
                <Route
                  key={i}
                  path={e.url}
                  element={Component ? <Component di={DI} /> : <Navigate to={'/'} />}
                />
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