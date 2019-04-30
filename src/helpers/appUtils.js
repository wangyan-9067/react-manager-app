import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';
import { MANAGER_LOGIN, CDS_OPERATOR_LOGIN } from '../protocols';
import { VALUE_LENGTH, DATA_SERVER_VALUE_LENGTH } from '../constants';

export const voiceServerLoginCMD = (username, password, socket) => {
  socket.writeBytes(Socket.createCMD(MANAGER_LOGIN, bytes => {
    bytes.writeBytes(Socket.stringToBytes(username, VALUE_LENGTH.LOGIN_NAME));
    bytes.writeBytes(Socket.stringToBytes(password, VALUE_LENGTH.PASSWORD));
  }));
};

export const dataServerLoginCMD = (username, password, socket) => {
  socket.writeBytes(Socket.createCMD(CDS_OPERATOR_LOGIN, bytes => {
    bytes.writeUnsignedShort();
    bytes.writeUnsignedShort();
    bytes.writeBytes(Socket.stringToBytes('', DATA_SERVER_VALUE_LENGTH.VL_VIDEO_ID));
    bytes.writeBytes(Socket.stringToBytes(username, DATA_SERVER_VALUE_LENGTH.VL_USER_NAME));
    bytes.writeBytes(Socket.stringToBytes(password, DATA_SERVER_VALUE_LENGTH.VL_PSW));
    bytes.writeUnsignedInt();
  }));
};

export const handleLoginFailure = ({setIsUserAuthenticated, setToastMessage, setToastVariant, setToastDuration, toggleToast, message}) => {
  setIsUserAuthenticated(false);
  setToastMessage(message);
  setToastVariant('error');
  setToastDuration(null);
  toggleToast(true);
};

export const mapBetHistoryResult = (loginname, result) => {
  return result.map(item => {
    let temp = item.$;

    return {
      name: loginname,
      gmtype: temp.platformtype,
      gmcode: temp.gmcode,
      billno: temp.billno,
      betTime: temp.billtime,
      table: temp.tablecode,
      playerVal: temp.playerpoint,
      bankerVal: temp.bankerpoint,
      amount: temp.account,
      profit: temp.cus_account,
      playtype: parseInt(temp.playtype),
      cardlist: temp.cardlist,
      flag: temp.flag,
      remark: temp.remark
    }
  })
}