import axios from 'axios';

export let ENV;
export let CONFIG = {};

export function getConfig() {
  return axios.request({
      url: './config.json'
  }).then(response => {
    CONFIG = { ...response.data };
    ENV = CONFIG.ENV;
  });
}