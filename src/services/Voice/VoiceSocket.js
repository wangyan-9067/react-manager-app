import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import ManagerLoginResp from './responses/ManagerLoginResp';
import ChannelListResp from './responses/ChannelListResp';
import ChannelJoinResp from './responses/ChannelJoinResp';
import ManagerActionResp from './responses/ManagerActionResp';
import AnchorsOnDutyResp from './responses/AnchorsOnDutyResp';
import ManagerAddResp from './responses/ManagerAddResp';
import ManagerUpdateResp from './responses/ManagerUpdateResp';
import ManagerDeleteResp from './responses/ManagerDeleteResp';
import ManagerAllQueryResp from './responses/ManagerAllQueryResp';
import AnchorAddResp from './responses/AnchorAddResp';
// import AnchorUpdateResp from './responses/AnchorUpdateResp';
import AnchorDeleteResp from './responses/AnchorDeleteResp';
import AnchorAllQueryResp from './responses/AnchorAllQueryResp';
import ManagerKickoutResp from './responses/ManagerKickoutResp';
import WaitingListResp from './responses/WaitingListResp';
import AssignTokenToDelegatorResp from './responses/AssignTokenToDelegatorResp';
import KickDelegatorResp from './responses/KickDelegatorResp';
import AddDelegatorResp from './responses/AddDelegatorResp';
import DeleteDelegatorResp from './responses/DeleteDelegatorResp';
import QueryAllDelegatorResp from './responses/QueryAllDelegatorResp';

import { 
	MANAGER_LOGIN_R, 
	CHANNEL_LIST_R, 
	CHANNEL_JOIN_R, 
	MANAGER_ACTION_R,
	ANCHORS_ON_DUTY_R,
	MANAGER_ADD_R,
	MANAGER_UPDATE_R,
	MANAGER_DELETE_R,
	MANAGER_ALL_QUERY_R,
	ANCHOR_ADD_R,
	// ANCHOR_UPDATE_R,
	ANCHOR_DELETE_R,
	ANCHOR_ALL_QUERY_R,
	MANAGER_KICKOUT_R,
	WAITING_LIST_R,
	ASSIGN_TOKEN_TO_DELEGATOR_R,
	KICK_DELEGATOR_R,
	ADD_DELEGATOR_R,
	DELETE_DELEGATOR_R,
	QUERY_ALL_DELEGATOR_R
} from '../../protocols';

export default class VoiceSocket extends Socket.WebSocketBase {
	constructor() {
		const config = {
			tag: '[VoiceSocket]',
			ucHeartBeatPeriod: 15000
		};
		super(config);
	}

	getUrlList() {
		return ['wss://172.20.2.101:5547'];
	}

	setupRespClazzMap() {
		this.respClazzMap.set(MANAGER_LOGIN_R, ManagerLoginResp);
		this.respClazzMap.set(CHANNEL_LIST_R, ChannelListResp);
		this.respClazzMap.set(CHANNEL_JOIN_R, ChannelJoinResp);
		this.respClazzMap.set(MANAGER_ACTION_R, ManagerActionResp);
		this.respClazzMap.set(ANCHORS_ON_DUTY_R, AnchorsOnDutyResp);

		this.respClazzMap.set(MANAGER_ADD_R, ManagerAddResp);
		this.respClazzMap.set(MANAGER_UPDATE_R, ManagerUpdateResp);
		this.respClazzMap.set(MANAGER_DELETE_R, ManagerDeleteResp);
		this.respClazzMap.set(MANAGER_ALL_QUERY_R, ManagerAllQueryResp);
		this.respClazzMap.set(ANCHOR_ADD_R, AnchorAddResp);
		// this.respClazzMap.set(ANCHOR_UPDATE_R, AnchorUpdateResp);
		this.respClazzMap.set(ANCHOR_DELETE_R, AnchorDeleteResp);
		this.respClazzMap.set(ANCHOR_ALL_QUERY_R, AnchorAllQueryResp);
		this.respClazzMap.set(MANAGER_KICKOUT_R, ManagerKickoutResp);

		this.respClazzMap.set(WAITING_LIST_R, WaitingListResp);
		this.respClazzMap.set(ASSIGN_TOKEN_TO_DELEGATOR_R, AssignTokenToDelegatorResp);
		this.respClazzMap.set(KICK_DELEGATOR_R, KickDelegatorResp);
		this.respClazzMap.set(ADD_DELEGATOR_R, AddDelegatorResp);
		this.respClazzMap.set(DELETE_DELEGATOR_R, DeleteDelegatorResp);
		this.respClazzMap.set(QUERY_ALL_DELEGATOR_R, QueryAllDelegatorResp);
	}
}
