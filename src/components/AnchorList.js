import React, { useState } from 'react';
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

import AnchorForm from './AnchorForm';
import ToggleButtonGridList from './ToggleButtonGridList';

const styles = theme => ({
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

const AnchorList = props => {
  const [openAddManagerDialog, setOpenAddManagerDialog] = useState(false);
  let { classes, anchorList, getAnchorList, addAnchor } = props;
  const {
    root,
    grow,
    headerText,
    operationButton,
    emptyAnchorCardRoot,
    emptyText,
    dialogPaper,
    dialogTitle,
    tileClass
  } = classes;
  
  let panel;
  anchorList = [
    {
      loginname: 'aliceTest',
      password: '1234',
      nickname: 'aliceTest',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
    {
      loginname: 'aliceTest2',
      password: '1234',
      nickname: 'aliceTest2',
      url: 'http://www.colegioexpressao.com/assets/images/avatar-2.png',
      value: 'aliceTest2'
    },
  ];

  if (Array.isArray(anchorList) && anchorList.length === 0) {
    panel = (
      <Card className={emptyAnchorCardRoot}>
        <CardContent>
          <Typography color="inherit" className={emptyText}>沒有主播記錄!</Typography>
        </CardContent>
      </Card>
    );
  }
	return (
		<div className={root}>
      <Typography color="inherit" align="left" className={headerText}>請選取值班主播</Typography>
      <div className={grow} />
      <Button variant="contained" size="medium" color="inherit" className={operationButton} onClick={() => { setOpenAddManagerDialog(true); }}>新增主播</Button>
      <Button variant="contained" size="medium" color="inherit" className={operationButton}>編輯</Button>
      {panel}
			<Dialog
				open={openAddManagerDialog}
				onClose={() => { setOpenAddManagerDialog(false) }}
				aria-labelledby="responsive-dialog-title"
        classes={{ paper: dialogPaper }}
        disableBackdropClick
			>
				<DialogTitle id="responsive-dialog-title">
					<Typography color="inherit" className={dialogTitle} align="center">新增主播資料</Typography>
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
            <AnchorForm 
              getAnchorList={getAnchorList}
              addAnchor={addAnchor}
              setOpenAddManagerDialog={setOpenAddManagerDialog}
            />
          </DialogContentText>
				</DialogContent>
			</Dialog>
      <ToggleButtonGridList list={anchorList} tileClass={tileClass} customCols={6} />
      <div>
        <Button variant="contained" size="medium" color="inherit" className={operationButton}>確定</Button>
        <Button variant="contained" size="medium" color="inherit" className={operationButton}>取消選取</Button>
      </div>
		</div>
	);
}

const StyledAnchorList = withStyles(styles)(AnchorList);

const mapStateToProps = state => {
  const { anchorList } = state.voice;
  return ({
    anchorList
  });
};

const mapDispatchToProps = dispatch => ({
  // setVoiceAppId: id => dispatch(setVoiceAppId(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(StyledAnchorList);