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
import { getLangConfig } from '../helpers/appUtils';
import { MANAGER_ACTION_TYPE } from '../constants';
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

const AnchorList = ({
    classes,
    anchorList,
    openDialog,
    toggleDialog,
    anchorsOnDutyList,
    setManagerAction,
    setFormValues
}) => {
    const firstUpdate = useRef(true);
    const [openAddAnchorDialog, setOpenAddAnchorDialog] = useState(false);
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
    const { ADD_ANCHOR, EDIT_ANCHOR } = MANAGER_ACTION_TYPE;
    const langConfig = getLangConfig();

    const onClickHandler = () => {
        if (isEdit) {
            setOpenAddAnchorDialog(true);
        }
    };

    let panel;
    let selectedAnchor;
    if (selected && !Array.isArray(selected)) {
        selectedAnchor = anchorList.find(anchor => anchor.loginname === selected);
    }

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }

        setManagerAction(isEdit ? EDIT_ANCHOR : ADD_ANCHOR);

        return () => {
            setManagerAction("");
        }
    }, [isEdit]);

    if (Array.isArray(anchorList) && anchorList.length === 0) {
        panel = (
            <Card className={emptyAnchorCardRoot}>
                <CardContent>
                    <Typography color="inherit" className={emptyText}>{langConfig.ANCHOR_LIST_LABEL.NO_RECORD}</Typography>
                </CardContent>
            </Card>
        );
    }

    useEffect(() => {
        if (selected && isEdit) {
            setOpenAddAnchorDialog(true);
        }
    }, [selected, isEdit]);
    return (
        <div className={root}>
            <Typography color="inherit" align="left" className={headerText}>{langConfig.ANCHOR_LIST_LABEL.SELECT_ANCHOR}</Typography>
            <div className={grow} />
            <Button variant="contained" size="medium" color="inherit" className={addUserButton} onClick={() => {
                setSelected();
                setIsEdit(false);
                setOpenAddAnchorDialog(true);
                setManagerAction(ADD_ANCHOR);
            }}>{langConfig.BUTTON_LABEL.ADD_ANCHOR}</Button>
            {panel}
            <Dialog
                open={openAddAnchorDialog}
                onClose={() => { setOpenAddAnchorDialog(false) }}
                aria-labelledby="responsive-dialog-title"
                classes={{ paper: dialogPaper }}
                disableBackdropClick
            >
                <DialogTitle id="responsive-dialog-title">
                    <Typography color="inherit" className={dialogTitle} align="center">{isEdit ? langConfig.BUTTON_LABEL.EDIT : langConfig.BUTTON_LABEL.ADD}{langConfig.ANCHOR_LIST_LABEL.ANCHOR_INFO}</Typography>
                </DialogTitle>
                <DialogContent>
                    <UserForm
                        selectedUser={selectedAnchor}
                        addUser={(...args) => voiceAPI.addAnchor(...args)}
                        deleteUser={(...args) => voiceAPI.deleteAnchorz(...args)}
                        setOpenAddDialog={setOpenAddAnchorDialog}
                        userList={anchorList}
                        isEdit={isEdit}
                        openDialog={openDialog}
                        toggleDialog={toggleDialog}
                        isManager={false}
                        isAnchor={true}
                        isDelegator={false}
                        setFormValues={setFormValues}
                    />
                </DialogContent>
            </Dialog>
            <ToggleButtonGridList
                list={anchorList}
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

AnchorList.proptype = {
    classes: PropTypes.object.isRequired,
    anchorList: PropTypes.array,
    openDialog: PropTypes.bool,
    toggleDialog: PropTypes.func,
    anchorsOnDutyList: PropTypes.array,
    setManagerAction: PropTypes.func,
    setFormValues: PropTypes.func
};

const StyledAnchorList = withStyles(styles)(AnchorList);

const mapStateToProps = state => {
    const { anchorList, anchorsOnDutyList } = state.voice;
    const { openDialog } = state.app;

    return ({
        anchorList,
        anchorsOnDutyList,
        openDialog
    });
};

const mapDispatchToProps = dispatch => ({
    toggleDialog: toggle => dispatch(toggleDialog(toggle)),
    setManagerAction: action => dispatch(setManagerAction(action)),
    setFormValues: values => dispatch(setFormValues(values))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledAnchorList);