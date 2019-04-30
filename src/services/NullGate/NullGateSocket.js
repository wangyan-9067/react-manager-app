import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { GATE_FORWARD_MSG } from '../../protocols';
import GetBetRecordsResp from './responses/GetBetRecordsResp';

export default class NullGateSocket extends Socket.WebSocketBase {
	constructor() {
		const config = {
			tag: '[NullGateSocket]'
		};
		super(config);
	}

	getUrlList() {
		return ['wss://172.20.2.204:5881'];
	}

	setupRespClazzMap() {
		this.respClazzMap.set(GATE_FORWARD_MSG, GetBetRecordsResp);
	}
}
