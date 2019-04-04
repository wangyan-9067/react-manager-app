import {
  SET_TOAST_MESSAGE,
  SET_TOAST_VARIANT,
  TOGGLE_TOAST,
  SET_TOAST_DURATION,
  TOGGLE_DIALOG
} from '../types';

export const setToastMessage = message => ({ type: SET_TOAST_MESSAGE, message });
export const setToastVariant = variant => ({ type: SET_TOAST_VARIANT, variant });
export const setToastDuration = duration => ({ type: SET_TOAST_DURATION, duration });
export const toggleToast = toggle => ({ type: TOGGLE_TOAST, toggle });
export const toggleDialog = toggle => ({ type: TOGGLE_DIALOG, toggle });