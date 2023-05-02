import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import ActivityDetails from "../../features/activities/details/ActivityDetails";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import TestErrors from "../../features/errors/TestError";
import ActivityForm from "../../features/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import ProfilePage from "../../features/profiles/ProfilePage";
import App from "../layout/App";

export const routes: RouteObject[] = [
    {
        path: '/',
        element:  <App />,
        children: [
            { path:'activities', element: <ActivityDashboard/>},
            { path:'activities/:id', element: <ActivityDetails/>},
            { path:'createActivity', element: <ActivityForm key="create"/>},
            { path:'manage/:id', element: <ActivityForm key="update"/>},
            { path:'errors', element: <TestErrors />},
            { path:'not-found', element: <NotFound />},
            { path:'server-error', element: <ServerError />},
            { path:'profiles/:username', element: <ProfilePage />},
            { path:'*', element: <Navigate replace to='/not-found' />},
        ]
    },
    { path:'', element: <HomePage/>},

];

export const router = createBrowserRouter(routes);