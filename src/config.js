import axios from 'axios';

export const ENV = process.env.REACT_APP_ENV;
export let CONFIG = {};

export function getConfig() {
  return axios.request({
      url: './config.json'
  }).then(response => {
    CONFIG = { ...response.data };
  });
}