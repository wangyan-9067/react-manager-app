import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import UserForm from '../components/UserForm';
import ToggleButtonGridList from '../components/ToggleButtonGridList';
import { toggleDialog } from '../actions/app';
import { setManagerAction, setFormValues } from '../actions/voice';
import { MANAGER_ACTION_TYPE } from '../constants';
import { getLangConfig } from '../helpers/appUtils';
import voiceAPI from '../services/Voice/voiceAPI';

import dialogStyles from '../css/dialog.module.css';
import buttonStyles from '../css/button.module.scss';

const styles = () => ({
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        overflow: 'hidden',
        padding: '10px',
        backgroundColor: '#FFFFFF',
        borderRadius: '10px'
    },
    grow: {
        flexGrow: 1,
    },
    headerText: {
        fontSize: '1.125rem',
        color: '#656565',
        fontWeight: 'bold',
        marginTop: '0.3rem'
    },
    emptyAnchorCardRoot: {
        width: '100%'
    },
    emptyText: {
        fontSize: '1.1rem',
        color: '#656565'
    }
});

const ManagerList = ({
    classes,
    managerList,
    openDialog,
    toggleDialog,
    setManagerAction,
    setFormValues
}) => {
    const firstUpdate = useRef(true);
    const [openAddManagerDialog, setOpenAddManagerDialog] = useState(false);
    const [selected, setSelected] = useState();
    const [isEdit, setIsEdit] = useState(false);
    const {
        root,
        grow,
        headerText,
        emptyAnchorCardRoot,
        emptyText
    } = classes;
    const { dialogPaper, dialogTitle } = dialogStyles;
    const { addUserButton } = buttonStyles;
    const { ADD_MANAGER, EDIT_MANAGER } = MANAGER_ACTION_TYPE;
    const langConfig = getLangConfig();

    const onClickHandler = () => {
        if (isEdit) {
            setOpenAddManagerDialog(true);
        }
    };

    managerList.map(manager => {
        manager.value = manager.loginname;
        return manager;
    });

    let panel;
    let selectedManager;

    if (selected && !Array.isArray(selected)) {
        selectedManager = managerList.find(manager => manager.value === selected);
    }

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        setManagerAction(isEdit ? EDIT_MANAGER : ADD_MANAGER);

        return () => {
            setManagerAction("");
        }
    }, [isEdit]);

    if (Array.isArray(managerList) && managerList.length === 0) {
        panel = (
            <Card className={emptyAnchorCardRoot}>
                <CardContent>
                    <Typography color="inherit" className={emptyText}>{langConfig.MANAGER_LIST_LABEL.NO_RECORD}</Typography>
                </CardContent>
            </Card>
        );
    }

    useEffect(() => {
        if (selected && isEdit) {
            setOpenAddManagerDialog(true);
        }
    }, [selected, isEdit]);
    return (
        <div className={root}>
            <Typography color="inherit" align="left" className={headerText}>{langConfig.MANAGER_LIST_LABEL.SELECT_MANAGER}</Typography>
            <div className={grow} />
            <Button
                variant="contained"
                size="medium"
                color="inherit"
                className={addUserButton}
                onClick={() => {
                    setSelected();
                    setIsEdit(false);
                    setOpenAddManagerDialog(true);
                    setManagerAction(ADD_MANAGER);
                }}>
                {langConfig.BUTTON_LABEL.ADD_MANAGER}
            </Button>
            {panel}
            <Dialog
                open={openAddManagerDialog}
                onClose={() => { setOpenAddManagerDialog(false) }}
                aria-labelledby="responsive-dialog-title"
                classes={{ paper: dialogPaper }}
                disableBackdropClick
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography color="inherit" className={dialogTitle} align="center">{isEdit ? langConfig.BUTTON_LABEL.EDIT : langConfig.BUTTON_LABEL.ADD}{langConfig.MANAGER_LIST_LABEL.MANAGER_INFO}</Typography>
                </DialogTitle>
                <DialogContent>
                    <UserForm
                        selectedUser={selectedManager}
                        addUser={(...args) => voiceAPI.addManager(...args)}
                        deleteUser={(...args) => voiceAPI.deleteManager(...args)}
                        setOpenAddDialog={setOpenAddManagerDialog}
                        userList={managerList}
                        isEdit={isEdit}
                        openDialog={openDialog}
                        toggleDialog={toggleDialog}
                        isManager={true}
                        setFormValues={setFormValues}
                    />
                </DialogContent>
            </Dialog>
            <ToggleButtonGridList
                list={managerList}
                exclusive={true}
                selectedValue={selected}
                onChangeHandler={value => {
                    if (!value) {
                        return;
                    }
                    setSelected(value);
                    setIsEdit(true);
                }}
                onClickHandler={onClickHandler}
            />
        </div>
    );
}

ManagerList.proptype = {
    classes: PropTypes.object.isRequired,
    managerList: PropTypes.array,
    openDialog: PropTypes.bool,
    toggleDialog: PropTypes.func,
    setManagerAction: PropTypes.func,
    setFormValues: PropTypes.func
};

const StyledManagerList = withStyles(styles)(ManagerList);

const mapStateToProps = state => {
    const { managerList } = state.voice;
    const { openDialog } = state.app;

    return ({
        managerList,
        openDialog
    });
};

const mapDispatchToProps = dispatch => ({
    toggleDialog: toggle => dispatch(toggleDialog(toggle)),
    setManagerAction: action => dispatch(setManagerAction(action)),
    setFormValues: values => dispatch(setFormValues(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledManagerList);