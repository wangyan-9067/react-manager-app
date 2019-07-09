import { createMuiTheme } from '@material-ui/core/styles';

export default {
    toggleButtonRoot: {
        height: '50px',
        margin: '5px',
        color: '#FFFFFF',
        backgroundColor: '#3970B0',
        border: '3px solid #3970B0'
    },
    toggleButtonDisabled: {
        backgroundColor: '#F4F4F4',
        color: '#D5D5D5',
        border: '3px solid #F4F4F4'
    },
    toggleButtonLabel: {
        fontSize: '1rem',
        fontWeight: 'bold'
    }
};

export const toggleButtonTheme = createMuiTheme({
    shadows: new Array(25),
    overrides: {
        MuiToggleButton: {
            root: {
                '&$selected': {
                    color: '#FFFFFF',
                    backgroundColor: '#3970B0',
                    border: '3px solid #DF6C68',
                    '&:hover': {
                        color: '#FFFFFF',
                        backgroundColor: '#3970B0',
                        border: '3px solid #DF6C68'
                    }
                },
                '&:hover': {
                    color: '#FFFFFF',
                    backgroundColor: '#3970B0',
                    border: '3px solid #DF6C68'
                }
            }
        }
    }
});