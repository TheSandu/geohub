import axios from "axios";

export const setSession = (accessToken) => {
  if (typeof window !== 'undefined')
    localStorage.setItem('token', accessToken);
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined')
    return localStorage.getItem('token');
};

export const setUserSession = ( user ) => {
  if (typeof window !== 'undefined')
    localStorage.setItem('user', JSON.stringify( user ));
};

export const getAccessUser = () => {
  if (typeof window !== 'undefined')
    return JSON.parse( localStorage.getItem('user') );
};

axios.defaults.headers.common = {
  'Content-Type': 'application/json',
  'Accept':  'application/json',
  'token': getAccessToken() || '',
};

export default axios;
