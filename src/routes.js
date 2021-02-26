import React from 'react';


const Users = React.lazy(() => import('./views/users/Users'));
// const Login = React.lazy(() => import('./views/login/index.js'));
const Open = React.lazy(() => import('./views/openJobs'));
const User = React.lazy(() => import('./views/users/User'));
const Coupons = React.lazy(() => import('./views/coupons/Coupon'));

const routes = [
  
  { path: '/users', exact: true,  name: 'Users', component: Users },
  // { path: '/login', exact: true,  name: 'Users', component: Login },
  { path: '/openJobs', exact: true,  name: 'OpenJobs', component: Open },
  { path: '/coupons', exact: true,  name: 'Coupons', component: Coupons },
  { path: '/user/:id', exact: true, name: 'User Details', component: User }
];

export default routes;
