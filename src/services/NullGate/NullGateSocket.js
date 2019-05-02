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
		return [process.env.REACT_APP_NULL_GATE_SERVER_URL];
	}

	setupRespClazzMap() {
		this.respClazzMap.set(GATE_FORWARD_MSG, GetBetRecordsResp);
	}
}
