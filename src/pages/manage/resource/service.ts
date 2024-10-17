import {request} from '@/utils/request';

export const fetchResourceList = async (data?) => {
  const res = await request<API.PaginationRes<API.ResourceListResult>>({
    method: 'get',
    url: '/api/resource/list',
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

export const deleteResource = async (id) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/resource/delete',
    data: {
      id,
    },
  });

  return res;
};

export const updateResource = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/resource/update',
    data,
  });

  return res;
};

export const createResource = async (data) => {
  const res = await request<{id: string}>({
    method: 'post',
    url: '/api/resource/create',
    data,
  });

  return res;
};
