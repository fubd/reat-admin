declare namespace API {
  interface ApiResponse<T = any> {
    success: boolean;
    errorCode?: number;
    errorMessage?: string;
    data: T;
  }

  interface PaginationRes<T = any> {
    pagination: {
      perPage: number;
      currentPage: number;
      total: number;
    };
    data: T;
  }

  interface LoginResult {
    token?: string;
  }

  interface MenuItem {
    id: string;
    userId: string;
    roleId: string;
    createdAt: string;
    updatedAt: string;
    status: number;
    resourceId: string;
    type: number;
    name: string;
    key: string;
    label: string;
    children?: MenuItem[];
    path: string | null;
    pid: string | null;
    sort: number | null;
    icon: string | null;
  }

  type MenuListResult = MenuItem[];

  interface ResourceItem {
    id: string;
    path: string;
    type: number;
    name: string;
    createdAt: string;
    updatedAt: string;
    status: number;
    pid: string | null;
    sort: number | null;
    icon: string | null;
  }
  type ResourceListResult = ResourceItem[];

  interface RoleItem {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    status: number;
    bizStatus: number;
    resource?: ResourceItem[];
    resourceIds?: string[];
  }
  type RoleListResult = RoleItem[];

  interface UserItem {
    id: string;
    username: string;
    status: number;
    mobile: string;
    updatedAt: string;
    createdAt: string;
    bizStatus: number;
  }
  type UserListResult = UserItem[];
}
