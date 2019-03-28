import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import CDSOperatorLoginResp from './responses/CDSOperatorLoginResp';

import { 
	CDS_OPERATOR_LOGIN_R
} from '../../protocols';

export default class DataSocket extends Socket.WebSocketBase {
	constructor() {
		const config = {
			tag: '[DataSocket]',
			ucHeartBeatPeriod: 15000
		};
		super(config);
	}

	getUrlList() {
		return ['ws://172.20.2.38:5214'];
	}

	setupRespClazzMap() {
		this.respClazzMap.set(CDS_OPERATOR_LOGIN_R, CDSOperatorLoginResp);
	}
}
