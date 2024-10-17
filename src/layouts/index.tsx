import {Navigate, Outlet, useLocation, useNavigate} from 'react-router-dom';
import BasicLayout from './basic';
import {isAuthenticated} from '@/utils/utils';
import {request} from '@/utils/request';
import {Suspense, useLayoutEffect} from 'react';
import {Spin} from 'antd';
async function fetchResourceList() {
  const res = await request<API.ResourceListResult>({
    method: 'get',
    url: '/api/user/resource',
  });

  return res;
}

function Index() {
  const location = useLocation();

  const noAuthPaths = ['/login'];
  const pathname = location.pathname;
  const navigate = useNavigate();

  useLayoutEffect(() => {
    if (!isAuthenticated()) {
      return;
    }
    // 权限校验
    (async () => {
      fetchResourceList().then((res) => {
        if (res.success && Array.isArray(res.data)) {
          if (!res.data.map((it) => it.path).includes(pathname)) {
            navigate('/noAuth', {replace: true});
          }
        }
      });
    })();
  }, [pathname]);

  // 登录校验
  if (!noAuthPaths.includes(pathname)) {
    if (!isAuthenticated()) {
      return <Navigate to="login" replace={true} />;
    }
  }

  return (
    <BasicLayout>
      <Suspense
        fallback={
          <Spin style={{margin: '150px auto 0', width: '100%'}} delay={100} size="large" tip="组件加载中"></Spin>
        }
      >
        <Outlet />
      </Suspense>
    </BasicLayout>
  );
}

export default Index;
