import {request} from '@/utils/request';

export const query = async (data?) => {
  const res = await request<API.PaginationRes<API.ResourceListResult>>({
    method: 'get',
    url: '/api/resource/list',
    data,
  });

  return res;
};

export const remove = async (id) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/resource/delete',
    data: {
      id,
    },
  });

  return res;
};

export const edit = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/resource/update',
    data,
  });

  return res;
};

export const add = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/resource/create',
    data,
  });

  return res;
};

export const fetchFirstResourceList = async () => {
  const res = await request<API.PaginationRes<API.ResourceListResult>>({
    method: 'get',
    url: '/api/resource/list',
    data: {
      level: 1,
      type: 1,
      pageNo: 1,
      pageSize: 9999,
    },
  });

  return res;
};
