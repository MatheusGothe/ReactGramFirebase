//import { getCurrentIp } from "../getCurrentIp";
//const localIp = getCurrentIp()
const localIp = "192.168.18.10"
//console.log(localIp)
export const api = `http://${localIp}:5000/api`; 
export const uploads = `http://${localIp}:5000/uploads`;
export const requestConfig = (method, data, token = null, image = null) => {
  let config;

  if (image) {
    config = {
      method,
      body: data,
      headers: {},
    };
  } else if (method === 'DELETE' || data === null) {
    config = {
      method,
      headers: {},
    };
  } else {
    config = {
      method,
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};