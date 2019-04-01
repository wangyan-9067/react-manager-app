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
			ucHeartBeatPeriod: 15000,
			lineSelect: {
				respId: 0x860003
			}
		};
		super(config);
	}

	getUrlList() {
		return ['wss://172.20.2.101:5224'];
	}

	setupRespClazzMap() {
		this.respClazzMap.set(CDS_OPERATOR_LOGIN_R, CDSOperatorLoginResp);
	}
}
