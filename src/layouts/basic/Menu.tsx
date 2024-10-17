import {Menu} from 'antd';
import {useNavigate, useLocation} from 'react-router-dom';
import {request} from '@/utils/request';
import {useEffect, useState} from 'react';
import {getIconCom} from '@/pages/manage/resource/Picker';

async function fetchMenuList() {
  const res = await request<API.MenuListResult>({
    method: 'get',
    url: '/api/user/menu',
  });

  return res;
}

function buildTreeRecursive(data: any[], pid = null): any {
  return data
    .filter((item: any) => item.pid === pid)
    .map((item: any) => {
      const children = buildTreeRecursive(data, item.id);
      return {
        label: item.name,
        key: `${item.path || item.id}`,
        children: children.length ? children : undefined,
        icon: getIconCom(item.icon),
      };
    });
}

function findParentRecursive(data: API.MenuItem[], searchValue: string): API.MenuItem | undefined {
  function searchTree(nodes: API.MenuItem[], parent?: API.MenuItem | undefined): API.MenuItem | undefined {
    for (const node of nodes) {
      const matchCondition = node.key === searchValue;
      if (matchCondition) {
        return parent;
      }

      if (node?.children && node?.children.length) {
        const result = searchTree(node.children, node);
        if (result) return result; // 找到结果后立即返回
      }
    }
    return; // 未找到匹配项
  }

  // 开始搜索
  return searchTree(data);
}

const SideMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuList, setMenuList] = useState<Array<API.MenuItem>>([]);
  const [openKeys, setOpenKeys] = useState<Array<string>>([]);
  const [selectedKeys, setSelectedKeys] = useState<Array<string>>([]);

  const handleClick = (e: {key: string}) => {
    if (e.key) {
      navigate(e.key);
      setSelectedKeys([e.key]);
    }
  };

  function onOpenChange(keys: string[]) {
    setOpenKeys(keys);
  }

  useEffect(() => {
    fetchMenuList().then((res) => {
      if (res.success) {
        if (Array.isArray(res.data)) {
          const menuList = buildTreeRecursive(res.data);
          const parent = findParentRecursive(menuList, location.pathname);
          const openKeys = parent ? [parent.key] : [];
          const selectedKeys = parent ? [parent.key, location.pathname] : [location.pathname];

          setOpenKeys(openKeys);
          setMenuList(menuList);
          setSelectedKeys(selectedKeys);
        }
      }
    });
  }, [location.pathname]);

  return (
    <Menu
      mode="inline"
      selectedKeys={selectedKeys}
      style={{height: '100%', borderRight: 0}}
      items={menuList}
      onClick={handleClick}
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      forceSubMenuRender
    />
  );
};

export default SideMenu;
