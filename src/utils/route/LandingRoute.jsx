import { createBrowserRouter } from 'react-router-dom'
import LandingLayout from '../../components/layout/LandingLayout';
import About from '../../pages/landing/About';
import Appointment from '../../pages/landing/Appointment';
import Content from '../../pages/landing/Content';
import Form from '../../pages/landing/Form';
import Home from '../../pages/landing/Home';
import Support from '../../pages/landing/Support';
import Login from '../../pages/landing/Login';
import PrivateRoute from './PrivateRoute';
import AdminLayout from '../../components/layout/AdminLayout';
import AdminRoutes from './AdminRoutes';
import Article from '../../pages/landing/Article';

const LandingRoute = createBrowserRouter ([

    {path: '/', element: <LandingLayout />, 
        children: [
            {index: true, element: <Home />},
            { path: '*', element: <Home/> },
            { path: 'home', element: <Home /> },
            { path: 'about', element: <About /> },
            { path: 'content', element: <Content /> },
            { path: 'appointment', element: <Appointment /> },
            { path: 'form', element: <Form /> },
            { path: 'login', element: <Login /> },
            { path: 'support', element: <Support /> },
            { path: 'article/:id', element: <Article /> },

        ],
     },
     {
        path: '/admin/', element: (
            <PrivateRoute>
              <AdminLayout />
             </PrivateRoute>
          ),
          children: AdminRoutes
     }

]);

export default LandingRoute
