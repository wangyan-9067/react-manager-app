import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

import UserForm from './UserForm';
import ToggleButtonGridList from './ToggleButtonGridList';
import { toggleDialog } from '../actions/app';

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    overflow: 'hidden',
    padding: '20px',
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
  },
  tileClass: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    minHeight: '76px'
  }
});

const ManagerList = props => {
  const [openAddManagerDialog, setOpenAddManagerDialog] = useState(false);
  const [selected, setSelected] = useState();
  const [isEdit, setIsEdit] = useState(false);
  const {
    classes,
    managerList,
    addManager,
    deleteManager,
    openDialog,
    toggleDialog
  } = props;
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
    dialogTitle,
    tileClass
  } = classes;

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

  if (Array.isArray(managerList) && managerList.length === 0) {
    panel = (
      <Card className={emptyAnchorCardRoot}>
        <CardContent>
          <Typography color="inherit" className={emptyText}>沒有經理記錄!</Typography>
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
      <Typography color="inherit" align="left" className={headerText}>請選取需要編輯的經理</Typography>
      <div className={grow} />
      <Button
        variant="contained"
        size="medium"
        color="inherit"
        className={operationButton}
        onClick={() => {
          setSelected();
          setIsEdit(false);
          setOpenAddManagerDialog(true);
        }}>
          新增經理
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
					<Typography color="inherit" className={dialogTitle} align="center">{ isEdit ? '編輯' : '新增'}經理資料</Typography>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
            <UserForm
              selectedUser={selectedManager}
              addUser={addManager}
              deleteUser={deleteManager}
              setOpenAddDialog={setOpenAddManagerDialog}
              userList={managerList}
              isEdit={isEdit}
              openDialog={openDialog}
              toggleDialog={toggleDialog}
              isManager={true}
            />
          </DialogContentText>
				</DialogContent>
			</Dialog>
      <ToggleButtonGridList
        list={managerList}
        tileClass={tileClass}
        customCols={6}
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
        <Button variant="contained" size="medium" color="inherit" className={classNames(dutyButton, cancelButton)} onClick={() => { setSelected(); }}>取消選取</Button>
      </div>
		</div>
	);
}

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
	toggleDialog: toggle => dispatch(toggleDialog(toggle))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledManagerList);