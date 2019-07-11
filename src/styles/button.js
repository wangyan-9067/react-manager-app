const button = {
    color: '#FFFFFF',
    fontWeight: 'bold',
    backgroundColor: '#0F58A7',
    '&:hover': {
        backgroundColor: '#0F58A7',
        borderColor: '#0F58A7',
    }
};

export default {
    actionButtonWrapper: {
        width: '100%',
        minWidth: '750px'
    },
    actionButton: {
        margin: '5px auto',
        padding: '3px 20px',
        borderRadius: '60px',
        fontSize: '1.5rem',
        ...button
    },
    addUserButton: {
        width: '120px',
        margin: '0 5px',
        padding: '3px 20px',
        fontSize: '1.125rem',
        ...button
    },
    redButton: {
        color: '#FFFFFF',
        backgroundColor: '#FD0100',
        '&:hover': {
            backgroundColor: '#FD0100',
            borderColor: '#FD0100',
        }
    },
    blackButton: {
        color: '#FFFFFF',
        backgroundColor: '#4A4B4F',
        '&:hover': {
            backgroundColor: '#4A4B4F',
            borderColor: '#4A4B4F',
        }
    },
    darkGrayButton: {
        color: '#FFFFFF',
        backgroundColor: '#656565',
        '&:hover': {
            backgroundColor: '#656565',
            borderColor: '#656565',
        }
    },
    greenButton: {
        color: '#FFFFFF',
        backgroundColor: '#4FA329',
        '&:hover': {
            backgroundColor: '#4FA329',
            borderColor: '#4FA329',
        }
    }
};