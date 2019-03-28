import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { VALUE_LENGTH } from '../../../constants';

export default class WaitingListResp extends Socket.ResponseBase {
	parseResp(bytes) {
		this.count = bytes.readUnsignedInt();
		this.clientList = [];

		for (let i = 0 ; i < this.count; i++) {
			this.clientList.push({
				clientName: bytes.readUTFBytes(VALUE_LENGTH.LOGIN_NAME),
				nickName: bytes.readUTFBytes(VALUE_LENGTH.NICK_NAME),
        validBet: bytes.readUnsignedInt(),
        waitingStartTime: bytes.readUnsignedInt()
			});
		}
	}
}