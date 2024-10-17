import axios from 'axios';
import {BASE_URL} from './constants';
import {getNavigate, getUserInfo} from './utils';
import {notification} from 'antd';

const instance = axios.create({
  responseType: 'json',
  timeout: 60000,
});

instance.interceptors.request.use((config) => {
  const {token} = getUserInfo();

  if (config?.url?.includes(BASE_URL) && !config.url.includes('login')) {
    // 判断是否存在token，如果存在的话，则每个http header都加上token
    if (token) {
      config.headers['token'] = token;
    }
  }
  return config;
});

instance.interceptors.response.use((response) => {
  const errorMessage = response?.data?.errorMessage;
  const errorCode = response?.data?.errorCode;
  const success = response?.data?.success;

  if (!success) {
    if (errorCode === 10001) {
      // 未登录
      notification.error({message: errorMessage});
      getNavigate()('/login', {replace: true});
    } else {
      // 其他错误
      notification.error({message: errorMessage});
    }
  }

  return response.data;
});

export const request = function <T>({
  method,
  url,
  data,
}: {
  method: string;
  url: string;
  data?: any;
}): Promise<API.ApiResponse<T>> {
  if (method === 'get') {
    return instance.get(url, {
      params: data,
    });
  } else {
    return instance({
      method,
      url,
      data,
    });
  }
};
