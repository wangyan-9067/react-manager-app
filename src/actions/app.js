import {
  SET_TOAST_MESSAGE,
  SET_TOAST_VARIANT,
  TOGGLE_TOAST,
  SET_TOAST_DURATION,
  TOGGLE_DIALOG,
  SET_IS_USER_AUTHENTICATED,
  SET_MANAGER_CREDENTIAL,
  RESET_ACTION,
  TOGGLE_LOADING
} from '../types';

export const setToastMessage = message => ({ type: SET_TOAST_MESSAGE, message });
export const setToastVariant = variant => ({ type: SET_TOAST_VARIANT, variant });
export const setToastDuration = duration => ({ type: SET_TOAST_DURATION, duration });
export const toggleToast = toggle => ({ type: TOGGLE_TOAST, toggle });
export const toggleDialog = toggle => ({ type: TOGGLE_DIALOG, toggle });
export const setIsUserAuthenticated = status => ({ type: SET_IS_USER_AUTHENTICATED, status });
export const setManagerCredential = credential => ({ type: SET_MANAGER_CREDENTIAL, credential});
export const resetAction = () => ({ type: RESET_ACTION });
export const toggleLoading = toggle => ({ type: TOGGLE_LOADING, toggle });