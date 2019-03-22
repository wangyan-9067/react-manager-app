import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import ManagerLoginResp from './responses/ManagerLoginResp';
import ChannelListResp from './responses/ChannelListResp';
import ChannelJoinResp from './responses/ChannelJoinResp';
import ManagerActionResp from './responses/ManagerActionResp';

import { 
	MANAGER_LOGIN_R, 
	CHANNEL_LIST_R, 
	CHANNEL_JOIN_R, 
	MANAGER_ACTION_R 
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
	}
}
