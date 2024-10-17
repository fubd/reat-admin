import {request} from '@/utils/request';

export const fetchUserList = async (data) => {
  const res = await request<API.PaginationRes<API.UserListResult>>({
    method: 'get',
    url: '/api/user/list',
    data,
  });

  return res;
};

export const deleteUser = async (id) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/user/delete',
    data: {
      id,
    },
  });

  return res;
};

export const updateUser = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/user/update',
    data,
  });

  return res;
};

export const createUser = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/user/create',
    data,
  });

  return res;
};

export {fetchRoleList} from '../role/service';
