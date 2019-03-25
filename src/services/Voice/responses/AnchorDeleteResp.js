import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

export default class AnchorDeleteResp extends Socket.ResponseBase {
	parseResp(bytes) {
		this.code = bytes.readUnsignedInt();
	}
}