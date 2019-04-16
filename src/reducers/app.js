import {
  SET_TOAST_MESSAGE,
  SET_TOAST_VARIANT,
  SET_TOAST_DURATION,
  TOGGLE_TOAST,
  TOGGLE_DIALOG,
  SET_IS_USER_AUTHENTICATED,
  SET_MANAGER_CREDENTIAL,
  RESET_ACTION,
  TOGGLE_LOADING
} from '../types';
  
const initialState = {
  message: '',
  variant: '',
  duration: 5000,
  open: false,
  openDialog: false,
  isUserAuthenticated: null,
  managerCredential: null,
  showLoading: false
};

export default function app(state = initialState, action) {
	switch (action.type) {
    case SET_TOAST_MESSAGE:
      const message = action.message;
      return { ...state, message };

    case SET_TOAST_VARIANT:
      const variant = action.variant;
      return { ...state, variant };

    case SET_TOAST_DURATION:
      const duration = action.duration;
      return { ...state, duration };

    case TOGGLE_TOAST:
      const open = action.toggle;
      return { ...state, open };

    case TOGGLE_DIALOG:
      const openDialog = action.toggle;
      return { ...state, openDialog };

    case SET_IS_USER_AUTHENTICATED:
      const isUserAuthenticated = action.status;
      return { ...state, isUserAuthenticated };

    case SET_MANAGER_CREDENTIAL:
      const managerCredential = action.credential;
      return { ...state, managerCredential };

    case RESET_ACTION:
      return initialState;

    case TOGGLE_LOADING:
      const showLoading = action.toggle;
      return { ...state, showLoading };

    default:
    	return state;
	}
};
  