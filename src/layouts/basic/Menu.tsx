import {Menu} from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import {getMenuList, store} from '@/store/store';
import {useSnapshot} from 'valtio';

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = useSnapshot(store);
  const handleClick = (e: {key: string}) => {
    if (e.key) {
      navigate(e.key);
      store.selectedKeys = [e.key];
    }
  };

  function onOpenChange(keys: string[]) {
    store.openKeys = keys;
  }

  useEffect(() => {
    getMenuList();
  }, [location.pathname]);

  return (
    <Menu
      mode="inline"
      selectedKeys={state.selectedKeys}
      style={{height: '100%', borderRight: 0}}
      items={state.menuList}
      onClick={handleClick}
      openKeys={state.openKeys}
      onOpenChange={onOpenChange}
      forceSubMenuRender
    />
  );
};

export default SideMenu;
