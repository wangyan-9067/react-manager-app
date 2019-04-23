import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

import PopoverList from './PopoverList';
import TextList from './TextList';
import { DATA_SERVER_VIDEO_STATUS, DATA_SERVER_GAME_STATUS, PLAYTYPE } from '../constants';
import { isObject, isNonEmptyArray } from '../helpers/utils';

const styles = {
	cardHeader: {
		display: 'flex',
    padding: '12px',
    alignItems: 'center',
		backgroundColor: '#13C636',
		color: '#FFFFFF',
		fontWeight: 'bold'
	},
	redCardHeader: {
		backgroundColor: '#F82021',
	},
	cardContent: {
		textAlign: 'left',
		color: '#818181'
	},
	cardActionButton: {
		margin: '0 auto',
		backgroundColor: '#E2E2E2',
		color: '#6C6C6C'
	},
	tableNo: {
		flex: '0 0 auto'
	},
	tableStatus: {
		flex: '1 1 auto'
	},
	tableValue: {
		fontWeight: 'bold',
		padding: '10px'
	},
	fieldWrapper: {
		alignItems: 'center'
	}
};

const getTableStatus = status => {
	const { FREE, CONTRACTED } = DATA_SERVER_VIDEO_STATUS;
	
	switch(status) {
		case FREE:
			return '可進桌 / 可包桌';

		case CONTRACTED:
			return '包桌中';
		
		default:
		return '';
	}
};

const getGameStatus = status => {
	const { CLOSED, CAN_BET, DISPATCH_CARD, LAST_CALL, TURN_CARD, NEW_SHOE, PAUSE_BET } = DATA_SERVER_GAME_STATUS;
	
	switch(status) {
		case CLOSED:
			return '遊戲關閉';

		case CAN_BET:
			return '可以下注';

		case DISPATCH_CARD:
			return '正在發牌';

		case LAST_CALL:
			return 'Last Call';
		
		case TURN_CARD:
			return '正在眯牌';

		case NEW_SHOE:
			return '洗牌';

		case PAUSE_BET:
			return '暫停下注';
		
		default:
		return '-';
	}
};

const getPlayTypeText = playtype => {
	const { BANKER, PLAYER, TIE, BANKER_PAIR, PLAYER_PAIR, BANKER_NO_COMMISSION, BANKER_DRAGON_BONUS, PLAYER_DRAGON_BONUS, SUPER_SIX, ANY_PAIR, PERFECT_PAIR } = PLAYTYPE;

	switch(playtype) {
		case BANKER:
			return '庄';

		case PLAYER:
			return '閑';

		case TIE:
			return '和';

		case BANKER_PAIR:
			return '閑對';
		
		case PLAYER_PAIR:
			return '庄對';

		case BANKER_NO_COMMISSION:
			return '庄免佣';

		case BANKER_DRAGON_BONUS:
			return '庄龍寶';

		case PLAYER_DRAGON_BONUS:
			return '闲龍寶';

		case SUPER_SIX:
			return '超级六';

		case ANY_PAIR:
			return '任意對子';

		case PERFECT_PAIR:
			return '完美對子';
		
		default:
		return;
	}
}

// const getAnchorByVid = (vid, anchorsOnDutyList) => {
// 	const targetAnchor = anchorsOnDutyList.find(anchor => anchor.vid === vid);
// 	return targetAnchor ? targetAnchor.anchorName : '-';
// };

const getTableLimitList = (vid, tableLimit) => {
	const playtypeList = Object.values(PLAYTYPE);
	const hashTableList = tableLimit.byHash[vid];
	
	if (isNonEmptyArray(hashTableList)) {
		return hashTableList.filter(value => {
			if (playtypeList.includes(value.playtype)) {
				return value;
			}
		});
	}

	return [];
}

const DataItem = ({ item }) => {
	const { playtype, min, max} = item;

  return (
    <ListItem>
      <ListItemText
        primary={`${getPlayTypeText(playtype)}: $${min} - $${max}`}
      />
    </ListItem>
  );
};

const TableTile = ({ classes, item, anchorsOnDutyList, toggleDialog, setKickoutClient, channelList, tableLimit }) => {
	const { cardContent, tableNo, tableStatus, tableValue, cardActionButton, fieldWrapper } = classes;
	const { vid, dealerName, gameCode, status, tableOwner, gameStatus, seatedPlayerNum } = item;
	const currentChannel = channelList.find(channel => channel.vid === vid);
	const currentAnchorName = isObject(currentChannel) && currentChannel.anchorName ? currentChannel.anchorName : '-';
	const tableLimitList = getTableLimitList(vid, tableLimit);
	const tableLimitDisplay = isNonEmptyArray(tableLimitList) ? (
		<PopoverList buttonText="限紅列表">
			<TextList list={tableLimitList} dataItem={DataItem} />
		</PopoverList>
	) : <span className={tableValue}>-</span>

	// TODO: 顯示牌靴

	const tableTileClasses = classNames.bind(classes);
	const tileHeaderClass = tableTileClasses({
		cardHeader: true,
		redCardHeader: status !== DATA_SERVER_VIDEO_STATUS.FREE
	});

  return (
		<Card>
			<div className={tileHeaderClass}>
				<div className={tableNo}>{vid}</div>
				<div className={tableStatus}>{getTableStatus(status)}</div>
			</div>
			<CardContent className={cardContent}>
				<Typography color="inherit"><span>座位數:</span><span className={tableValue}>{seatedPlayerNum}/7</span></Typography>
				<Typography color="inherit"><span>局號:</span><span className={tableValue}>{gameCode || '-'}</span></Typography>
				<Typography color="inherit"><span>荷官:</span><span className={tableValue}>{dealerName || '-'}</span></Typography>
				<Typography color="inherit"><span>主播:</span><span className={tableValue}>{/* getAnchorByVid(vid, anchorsOnDutyList) */}{currentAnchorName}</span></Typography>
				<Grid container spacing={8} alignItems="flex-end" className={fieldWrapper}>
					<Grid item><Typography color="inherit">限紅:</Typography></Grid>
					<Grid item>{tableLimitDisplay}</Grid>
				</Grid>
				<Typography color="inherit"><span>桌主:</span><span className={tableValue}>{tableOwner || '-'}</span></Typography>
				<Typography color="inherit"><span>牌靴:</span><span className={tableValue}>-</span></Typography>
				<Typography color="inherit"><span>遊戲狀態:</span><span className={tableValue}>{getGameStatus(gameStatus)}</span></Typography>
			</CardContent>
			<CardActions>
				<Button
					variant="contained"
					size="medium"
					color="inherit"
					className={cardActionButton}
					onClick={() => {
						setKickoutClient({
							vid,
							clientName: tableOwner
						});
						toggleDialog(true);
					}}
					disabled={!tableOwner}
				>
					踢走桌主
				</Button>
			</CardActions>
		</Card>
  );
}

TableTile.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TableTile);