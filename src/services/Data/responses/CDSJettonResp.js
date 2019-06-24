import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { DATA_SERVER_VALUE_LENGTH } from '../../../constants';

export default class CDSJettonResp extends Socket.ResponseBase {


// struct RES_INFO
//         {
//             t_uint16        playtype;
//             double          win;
//         };
//         PACKET_HEADER       head;
//         char                vid[_VL_VIDEO_ID];
//         char                gmcode[_VL_GAME_CODE];
//         char                name[_VL_USER_NAME];
//         double              res;
//         double              left;
//         char                currency[_VL_CURRENCY];
//         float               frate;
//         t_byte              num;
//         double              totalPayout;
//         RES_INFO            data[1];


  parseResp(bytes) {
    bytes.readUnsignedShort();
    bytes.readUnsignedShort();    
    this.vid = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID);
    this.gmcode = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_GAME_CODE);
    this.name = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_USER_NAME);
    this.res = bytes.readDouble();    
    this.left = bytes.readDouble();    
    this.currency = bytes.readUTFBytes(DATA_SERVER_VALUE_LENGTH.VL_CURRENCY);    
    this.frate = bytes.readFloat();
    const num = bytes.readByte();
    this.totalPayout = bytes.readDouble();
    this.payouts = [];
    for(let i = 0; i < num; i++) {
        this.payouts.push({
            playtype: bytes.readUnsignedShort(),
            win: bytes.readDouble()
        })
    }    
  }
}