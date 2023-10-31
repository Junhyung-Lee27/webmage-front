// https://iridescent-zeal.tistory.com/234#%5B%20react-cookie%20%EC%82%AC%EC%9A%A9%EB%B2%95%20%5D-1

import { Cookies } from "react-cookie";

const cookies = new Cookies();

export const setCookie = (name, value, options) => {
  return cookies.set(name, value, {...options})
}

export const getCookie = (name) => {
  return cookies.get(name)
}

export const removeCookie = (name) => {
  return cookies.remove(name);
}