import {
  SET_TOAST_MESSAGE,
  SET_TOAST_VARIANT,
  SET_TOAST_DURATION,
  TOGGLE_TOAST,
  TOGGLE_DIALOG
} from '../types';
  
const initialState = {
  message: '',
  variant: '',
  duration: 5000,
  open: false,
  openDialog: false
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

    default:
    	return state;
	}
};
  