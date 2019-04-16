import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSBetHistResp extends Socket.ResponseBase {
	parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();
    
    this.total = bytes.readUnsignedInt();
    this.totalValidBet = bytes.readDouble();
    this.totalbet = bytes.readDouble();
    this.totalwin = bytes.readDouble();
    this.manager = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);

    this.num = bytes.readUnsignedShort();
		this.betHistList = [];

		for (let i = 0 ; i < this.num; i++) {
			let result = {};
			result.name = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
			result.gmtype = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GM_TYPE);
			result.gmcode = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE);
			result.billno = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_BILL_NO);
			result.betTime = (bytes.readUnsignedInt() << 32) | bytes.readUnsignedInt();
			result.table = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_TBL_CODE);
			result.playerVal = bytes.readByte();
			result.bankerVal = bytes.readByte();
			result.amount = bytes.readDouble();
			result.profit = bytes.readDouble();
			result.playtype = bytes.readByte();
			
			let banker = [];
			let player = [];

			for (let i = 0; i < DATA_SERVER_VALUE_LENGTH.VL_BANKER; i++) {
				banker.push(bytes.readByte());
			}
			result.banker = banker;

			for (let i = 0; i < DATA_SERVER_VALUE_LENGTH.VL_PLAYER; i++) {
				player.push(bytes.readByte());
			}
			result.player = player;

			result.flag = bytes.readByte();
			
			this.betHistList.push(result);
		}
	}
}