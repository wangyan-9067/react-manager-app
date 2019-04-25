import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

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
	}
}
