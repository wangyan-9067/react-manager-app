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
			this.betHistList.push({
				name: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME),
				gmtype: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GM_TYPE),
				gmcode: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE),
				billno: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_BILL_NO),
        betTime: bytes.readDouble(),
        table: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_TBL_CODE),
				playerVal: bytes.readByte(),
				bankerVal: bytes.readByte(),
				amount: bytes.readDouble(),
        profit: bytes.readDouble(),
        playtype: bytes.readByte(),
				banker: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_BANKER),
				player: bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_PLAYER),
				flag: bytes.readByte()
			});
		}
	}
}