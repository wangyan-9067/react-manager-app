import { combineReducers } from 'redux';
import app from './app';
import voice from './voice';
import data from './data';

const rootReducer = combineReducers({
  app,
  voice,
  data
});

export default rootReducer;
