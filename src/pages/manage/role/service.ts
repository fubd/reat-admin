import {request} from '@/utils/request';

export const fetchRoleList = async (data) => {
  const res = await request<API.PaginationRes<API.RoleListResult>>({
    method: 'get',
    url: '/api/role/list',
    data,
  });

  return res;
};

export const deleteRole = async (id) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/role/delete',
    data: {
      id,
    },
  });

  return res;
};

export const updateRole = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/role/update',
    data,
  });

  return res;
};

export const createRole = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/role/create',
    data,
  });

  return res;
};

export {fetchResourceList} from '../resource/service';
