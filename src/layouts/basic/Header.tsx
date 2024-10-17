import {Button, Dropdown, Input} from 'antd';
import {ReactComponent as LogoSvg} from '@/assets/logo.svg';
import {ReactComponent as StartSvg} from '@/assets/start.svg';
import {BellOutlined, SearchOutlined, LogoutOutlined} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {useNavigate} from 'react-router-dom';
import * as styles from './index.module.less';
import {logout} from '@/utils/utils';

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuProps['items'] = [
    {
      key: '3',
      label: '退出登录',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ];

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.title}>
        <LogoSvg />
        <span className={styles.title}>React Admin</span>
      </div>
      <div className={styles.right}>
        <Input placeholder="Please Search" suffix={<SearchOutlined />} />
        <Button shape="circle" icon={<BellOutlined />} />
        <Button shape="circle" icon={<StartSvg />} />
        <Dropdown menu={{items: menuItems}}>
          <div className={styles.userInfo}>
            <img src={require('@/assets/avatar.png')} className={styles.avatar} alt="User Avatar" />
            <span className={styles.username}>Admin</span>
          </div>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
