import {request} from '@/utils/request';

export const query = async (data) => {
  const res = await request<API.PaginationRes<API.RoleListResult>>({
    method: 'get',
    url: '/api/role/list',
    data,
  });

  return res;
};

export const remove = async (id) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/role/delete',
    data: {
      id,
    },
  });

  return res;
};

export const edit = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/role/update',
    data,
  });

  return res;
};

export const add = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/role/create',
    data,
  });

  return res;
};

export {query as fetchResourceList} from '../resource/service';
