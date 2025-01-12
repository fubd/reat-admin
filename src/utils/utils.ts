import {STORAGE} from './storage';
import {NavigateFunction} from 'react-router-dom';

let navigate: NavigateFunction;

export function getUserInfo(): API.LoginResult {
  const data = localStorage.getItem(STORAGE.USER_INFO);
  if (data) {
    return JSON.parse(data);
  } else {
    return {};
  }
}

export function setUserInfo(data: any) {
  const prev = getUserInfo();
  localStorage.setItem(STORAGE.USER_INFO, JSON.stringify({...prev, ...data}));
}

export const isAuthenticated = (): boolean => {
  return !!getUserInfo()?.token;
};

export const setNavigate = (nav: NavigateFunction) => {
  navigate = nav;
};

export const getNavigate = (): NavigateFunction => {
  return navigate;
};

export const logout = () => {
  localStorage.removeItem(STORAGE.USER_INFO);
  const navigate = getNavigate();
  navigate('/login');
};

