import {Route, Routes, useNavigate} from 'react-router-dom';
import {Suspense, lazy} from 'react';
import Layout from './layouts';
import {setNavigate} from './utils/utils';
import NotFound from './NotFound';
import NotAuth from './NoAuth';

const Statistics = lazy(() => import('./pages/statistics'));
const Resource = lazy(() => import('./pages/manage/resource'));
const Role = lazy(() => import('./pages/manage/role'));
const User = lazy(() => import('./pages/manage/user'));
const Login = lazy(() => import('./pages/login'));

const App = () => {
  const navigate = useNavigate();
  setNavigate(navigate);

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Suspense>
            <Login />
          </Suspense>
        }
      />
      <Route path="/" element={<Layout />}>
        <Route index element={<Statistics />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/manage/resource" element={<Resource />} />
        <Route path="/manage/role" element={<Role />} />
        <Route path="/manage/user" element={<User />} />
      </Route>
      <Route path="noAuth" element={<NotAuth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
