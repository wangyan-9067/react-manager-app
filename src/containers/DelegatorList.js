import React, { useState, useEffect } from 'react';
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
import { getLangConfig } from '../helpers/appUtils';

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

const DelegatorList = ({
  classes,
  delegatorList,
  addDelegator,
  deleteDelegator,
  openDialog,
  toggleDialog
}) => {
  const [openAddDelegatorDialog, setOpenAddDelegatorDialog] = useState(false);
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
  const langConfig = getLangConfig();

  const onClickHandler = () => {
    if (isEdit) {
      setOpenAddDelegatorDialog(true);
    }
  };

  delegatorList.map(delegator => {
    delegator.value = delegator.loginname;
    return delegator;
  });

  let panel;
  let selectedDelegator;

  if (selected && !Array.isArray(selected)) {
    selectedDelegator = delegatorList.find(delegator => delegator.value === selected);
  }

  if (Array.isArray(delegatorList) && delegatorList.length === 0) {
    panel = (
      <Card className={emptyAnchorCardRoot}>
        <CardContent>
          <Typography color="inherit" className={emptyText}>{langConfig.DELEGATOR_LIST_LABEL.NO_RECORD}</Typography>
        </CardContent>
      </Card>
    );
  }

  useEffect(() => {
    if (selected && isEdit) {
      setOpenAddDelegatorDialog(true);
    }
  }, [selected, isEdit]);

	return (
		<div className={root}>
      <Typography color="inherit" align="left" className={headerText}>{langConfig.DELEGATOR_LIST_LABEL.SELECT_DELEGATOR}</Typography>
      <div className={grow} />
      <Button
        variant="contained"
        size="medium"
        color="inherit"
        className={operationButton}
        onClick={() => {
          setSelected();
          setIsEdit(false);
          setOpenAddDelegatorDialog(true);
        }}>
          {langConfig.BUTTON_LABEL.ADD_DELEGATOR}
        </Button>
      {panel}
			<Dialog
				open={openAddDelegatorDialog}
				onClose={() => { setOpenAddDelegatorDialog(false) }}
				aria-labelledby="responsive-dialog-title"
        classes={{ paper: dialogPaper }}
        disableBackdropClick
			>
				<DialogTitle id="responsive-dialog-title">
					<Typography color="inherit" className={dialogTitle} align="center">{ isEdit ? langConfig.BUTTON_LABEL.EDIT : langConfig.BUTTON_LABEL.ADD}{langConfig.DELEGATOR_LIST_LABEL.DELEGATOR_INFO}</Typography>
				</DialogTitle>
				<DialogContent>
          <UserForm
            selectedUser={selectedDelegator}
            addUser={addDelegator}
            deleteUser={deleteDelegator}
            setOpenAddDialog={setOpenAddDelegatorDialog}
            userList={delegatorList}
            isEdit={isEdit}
            openDialog={openDialog}
            toggleDialog={toggleDialog}
            isDelegator={true}
          />
				</DialogContent>
			</Dialog>
      <ToggleButtonGridList
        list={delegatorList}
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
      <div>
        <Button variant="contained" size="medium" color="inherit" className={classNames(dutyButton, cancelButton)} onClick={() => { setSelected(); }}>{langConfig.BUTTON_LABEL.CANCEL_SELECT}</Button>
      </div>
		</div>
	);
}

DelegatorList.proptype = {
  classes: PropTypes.object.isRequired,
  delegatorList: PropTypes.array,
  addDelegator: PropTypes.func,
  deleteDelegator: PropTypes.func,
  openDialog: PropTypes.bool,
  toggleDialog: PropTypes.func
};

const StyledDelegatorList = withStyles(styles)(DelegatorList);

const mapStateToProps = state => {
  const { delegatorList } = state.voice;
  const { openDialog } = state.app;

  return ({
    delegatorList,
    openDialog
  });
};

const mapDispatchToProps = dispatch => ({
	toggleDialog: toggle => dispatch(toggleDialog(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledDelegatorList);