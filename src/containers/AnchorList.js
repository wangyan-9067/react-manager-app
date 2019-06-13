import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';

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
import { compareArray } from '../helpers/utils';
import { getLangConfig } from '../helpers/appUtils';
import { MANAGER_ACTION_TYPE } from '../constants';
import voiceAPI from '../services/Voice/voiceAPI';

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
  operationButton: {
    width: '120px',
    margin: '0 5px',
    padding: '3px 20px',
		fontSize: '1.125rem',
		fontWeight: 'bold',
		color: '#FFFFFF',
		backgroundColor: '#1F5FA6',
    '&:hover': {
      backgroundColor: '#1F5FA6',
      borderColor: '#1F5FA6',
    }
  },
  dutyButton: {
    width: '120px',
    margin: '0 20px',
    padding: '2px 20px',
		fontSize: '1.125rem',
		fontWeight: 'bold',
    color: '#FFFFFF',
    borderRadius: '16px',
		backgroundColor: '#1F5FA6',
    '&:hover': {
      backgroundColor: '#1F5FA6',
      borderColor: '#1F5FA6',
    }
  },
  cancelButton: {
    backgroundColor: '#AAAAAA',
    '&:hover': {
      backgroundColor: '#1F5FA6',
      borderColor: '#1F5FA6',
    }
  },
  emptyAnchorCardRoot: {
    width: '100%'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#656565'
  },
	dialogPaper: {
		width: '100%'
  },
	dialogTitle: {
		color: '#656565',
		fontSize: '1.25rem',
		fontWeight: 'bold'
  }
});

const usePrevious = value => {
  const ref = useRef();

  useEffect(() => {
    ref.current = value;
  });

  return ref.current;
}

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
    operationButton,
    dutyButton,
    cancelButton,
    emptyAnchorCardRoot,
    emptyText,
    dialogPaper,
    dialogTitle
  } = classes;
  const prevAnchorsOnDutyList = usePrevious(anchorsOnDutyList);
  const { ADD_ANCHOR, EDIT_ANCHOR } = MANAGER_ACTION_TYPE;
  const langConfig = getLangConfig();

  const onClickHandler = () => {
    if (isEdit) {
      setOpenAddAnchorDialog(true);
    }
  };

  anchorList.map(anchor => {
    anchor.value = anchor.loginname;
    return anchor;
  });

  let panel;
  let selectedAnchor;

  if (selected && !Array.isArray(selected)) {
    selectedAnchor = anchorList.find(anchor => anchor.value === selected);
  }

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
    const flattenArrays = {
      prev: prevAnchorsOnDutyList && prevAnchorsOnDutyList.map(anchor => anchor.anchorName),
      current: anchorsOnDutyList && anchorsOnDutyList.map(anchor => anchor.anchorName)
    }

    if (!compareArray(flattenArrays.prev, flattenArrays.current)) {
      setSelected(flattenArrays.current);
    }
  });

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

	return (
		<div className={root}>
      <Typography color="inherit" align="left" className={headerText}>{langConfig.ANCHOR_LIST_LABEL.SELECT_ANCHOR}</Typography>
      <div className={grow} />
      <Button variant="contained" size="medium" color="inherit" disabled={isEdit} className={operationButton} onClick={() => { setOpenAddAnchorDialog(true); setManagerAction(ADD_ANCHOR); }}>{langConfig.BUTTON_LABEL.ADD_ANCHOR}</Button>
      <Button
        variant="contained"
        size="medium"
        color="inherit"
        className={operationButton}
        onClick={() => {
          setSelected();
          setIsEdit(!isEdit);
        }}>{langConfig.BUTTON_LABEL.EDIT}</Button>
      {panel}
			<Dialog
				open={openAddAnchorDialog}
				onClose={() => { setOpenAddAnchorDialog(false) }}
				aria-labelledby="responsive-dialog-title"
        classes={{ paper: dialogPaper }}
        disableBackdropClick
			>
				<DialogTitle id="responsive-dialog-title">
					<Typography color="inherit" className={dialogTitle} align="center">{ isEdit ? langConfig.BUTTON_LABEL.EDIT : langConfig.BUTTON_LABEL.ADD}{langConfig.ANCHOR_LIST_LABEL.ANCHOR_INFO}</Typography>
				</DialogTitle>
				<DialogContent>
          <UserForm
            selectedUser={selectedAnchor}
            setOpenAddDialog={setOpenAddAnchorDialog}
            userList={anchorList}
            isEdit={isEdit}
            openDialog={openDialog}
            toggleDialog={toggleDialog}
            isManager={false}
            setFormValues={setFormValues}
          />
				</DialogContent>
			</Dialog>
      <ToggleButtonGridList
        list={anchorList}
        exclusive={isEdit}
        selectedValue={selected}
        onChangeHandler={value => {
          if (!value) {
            return;
          }
          setSelected(value);
        }}
        onClickHandler={onClickHandler}
      />
      <div>
        <Button variant="contained" size="medium" color="inherit" className={dutyButton} disabled={isEdit} onClick={() => { voiceAPI.setAnchorsDuty(selected); voiceAPI.getAnchorsDutyList(); }}>{langConfig.BUTTON_LABEL.CONFIRM}</Button>
        <Button variant="contained" size="medium" color="inherit" className={classNames(dutyButton, cancelButton)} disabled={isEdit} onClick={() => { setSelected(); }}>{langConfig.BUTTON_LABEL.CANCEL_SELECT}</Button>
      </div>
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