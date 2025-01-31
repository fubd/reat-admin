import {getIconCom} from '@/pages/manage/resource/Picker';
import {request} from '@/utils/request';
import {proxy} from 'valtio';

interface IStore {
  menuList: Array<API.MenuItem>;
  openKeys: Array<string>;
  selectedKeys: Array<string>;
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

const store = proxy<IStore>({
  menuList: [],
  openKeys: [],
  selectedKeys: [],
});

async function getMenuList({current} = {current: false}) {
  const res = await request<API.MenuListResult>({
    method: 'get',
    url: '/api/user/menu',
  });

  if (res.success) {
    if (Array.isArray(res.data)) {
      const menuList = buildTreeRecursive(res.data);
      const parent = findParentRecursive(menuList, location.pathname);
      const openKeys = parent ? [parent.key] : [];
      const selectedKeys = parent ? [parent.key, location.pathname] : [location.pathname];

      store.menuList = menuList;

      if (!current) {
        store.openKeys = openKeys;
        store.selectedKeys = selectedKeys;
      }
    }
  }

  return res;
}

export {store, getMenuList};
