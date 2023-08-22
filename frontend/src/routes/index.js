import { Suspense, lazy } from 'react';
import { Navigate, useRoutes, useLocation } from 'react-router-dom';
// layouts
// import MainLayout from '../layouts/main';
import DashboardLayout from '../layouts/dashboard';
import LogoOnlyLayout from '../layouts/LogoOnlyLayout';
// guards
import GuestGuard from '../guards/GuestGuard';
import AuthGuard from '../guards/AuthGuard';
// import RoleBasedGuard from '../guards/RoleBasedGuard';
// config
// import { PATH_AFTER_LOGIN } from '../config';
// routes
import {  PATH_PAGE } from './paths';
// components
import LoadingScreen from '../components/LoadingScreen';
import {decodeJWT} from "../contexts/JWTContext"
// ----------------------------------------------------------------------

const Loadable = (Component) => (props) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { pathname } = useLocation();

  return (
    <Suspense fallback={<LoadingScreen isDashboard={pathname.includes('/')} />}>
      <Component {...props} />
    </Suspense>
  );
};

export default function Router() {
  const user = decodeJWT( localStorage.getItem('accessToken') )
  // console.log(window.location.href)
  return useRoutes([
    {
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <Login />
            </GuestGuard>
          ),
        },
        // {
        //   path: 'register',
        //   element: (
        //     <GuestGuard>
        //       <Register />
        //     </GuestGuard>
        //   ),
        // },
        // { path: 'login-unprotected', element: <Login /> },
        // { path: 'register-unprotected', element: <Register /> },
        // { path: 'reset-password', element: <ResetPassword /> },
        // { path: 'new-password', element: <NewPassword /> },
        // { path: 'verify', element: <VerifyCode /> },
      ],
    },
    // Main Routes
    {
      path: '*',
      element: <LogoOnlyLayout />,
      children: [
        { path: 'maintenance', element: <Maintenance /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: '*', element: <Navigate to="/404" replace /> },
      ],
    },
    {
      path: '/',
      element: (
        // <AuthGuard>
          <DashboardLayout />
        // </AuthGuard>
      ),
      children: [
        // { element: <DashboardApp />, index: true },
        { element: <Navigate to={PATH_PAGE.dashboard} replace />, index: true },
        { path: PATH_PAGE.dashboard, element: <Dashboard /> },
        { path: "map", children: [
          { path: "mapbox", element: <MapMapbox /> },
          { path: "openstreet", element: <MapOpenStreet /> },
        ] },
        { path: PATH_PAGE.user, element: user?.role === 0 ? <UserList /> : <Navigate to="/404" replace /> },
      ],
    },
    // { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}

// AUTHENTICATION
const Login = Loadable(lazy(() => import('../pages/auth/Login')));
// const Register = Loadable(lazy(() => import('../pages/auth/Register')));
// const ResetPassword = Loadable(lazy(() => import('../pages/auth/ResetPassword')));
// const NewPassword = Loadable(lazy(() => import('../pages/auth/NewPassword')));
// const VerifyCode = Loadable(lazy(() => import('../pages/auth/VerifyCode')));

// DASHBOARD
const Dashboard = Loadable(lazy(() => import('../pages/Dashboard'))); 

// MAPS
const MapMapbox = Loadable(lazy(() => import('../pages/maps/MapMapbox'))); 
const MapOpenStreet = Loadable(lazy(() => import('../pages/maps/MapOpenStreet'))); 

// GENERAL
const UserList = Loadable(lazy(() => import('../pages/user/UserList')));


const Maintenance = Loadable(lazy(() => import('../pages/Maintenance')));
const Page500 = Loadable(lazy(() => import('../pages/Page500')));
const Page403 = Loadable(lazy(() => import('../pages/Page403')));
const Page404 = Loadable(lazy(() => import('../pages/Page404')));
