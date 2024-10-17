import {ReactNode, useEffect, useState} from 'react';
import {Button, ConfigProvider, Layout, notification} from 'antd';
import {LeftOutlined} from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';
import Header from './Header';
import SideMenu from './Menu';
import * as styles from './index.module.less';

interface IProps {
  children: ReactNode;
}

const BasicLayout = ({children}: IProps) => {
  const {Content, Sider} = Layout;
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    notification.config({duration: 1.2});
  }, []);

  return (
    <ConfigProvider locale={zhCN}>
      <Layout style={{minHeight: '100vh'}}>
        <Header />
        <Layout>
          <Sider width={220} className={styles.siderWrapper} collapsed={collapsed}>
            <Button
              shape="circle"
              className={`${styles.siderBtn} ${collapsed ? styles.collapsed : ''}`}
              onClick={() => setCollapsed(!collapsed)}
            >
              <LeftOutlined />
            </Button>
            <SideMenu />
          </Sider>
          <Layout>
            <Content
              className="site-layout-background"
              style={{
                padding: '16px 24px',
                margin: 0,
                minHeight: 280,
              }}
            >
              {children}
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default BasicLayout;
