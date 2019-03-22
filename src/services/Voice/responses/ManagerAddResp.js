import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class ManagerAddResp extends Socket.ResponseBase {
	parseResp(bytes) {
		this.code = bytes.readUnsignedInt(); // 0 - ok; 1 - fail (some manager already in channel)
	}
}