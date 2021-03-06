import 'cube-egret-polyfill';
import * as Socket from 'cube-socket/live';

import CDSUpdatePlayerAmountResp from './responses/CDSUpdatePlayerAmountResp';
import CDSOperatorLoginResp from './responses/CDSOperatorLoginResp';
import CDSOperatorControlContractTableResp from './responses/CDSOperatorControlContractTableResp';
import CDSOperatorControlContractTableEBAC from './responses/CDSOperatorControlContractTableEBAC';
import CDSOperatorControlKickoutClientResp from './responses/CDSOperatorControlKickoutClientResp';
import CDSClientEnterTableNotifyResp from './responses/CDSClientEnterTableNotifyResp';
import CDSClientLeaveTableNotifyResp from './responses/CDSClientLeaveTableNotifyResp';
import CDSVideoStatusResp from './responses/CDSVideoStatusResp';
import CDSClientListResp from './responses/CDSClientListResp';
import CDSControlReqVideoResp from './responses/CDSControlReqVideoResp';
// import CDSBetHistResp from './responses/CDSBetHistResp';
import CDSBetListResp from './responses/CDSBetListResp';
import CDSTableLimitResp from './responses/CDSTableLimitResp';
import CDSActionResp from './responses/CDSActionResp';
import CDSAnchorBetResp from './responses/CDSAnchorBetResp';
import CDSJettonResp from './responses/CDSJettonResp';
import { CONFIG, ENV } from '../../config';

import {
    CDS_OPERATOR_LOGIN_R,
    CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R,
    CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC,
    CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R,
    CDS_CLIENT_ENTER_TABLE_NOTIFY,
    CDS_CLIENT_LEAVE_TABLE_NOTIFY,
    CDS_VIDEO_STATUS,
    CDS_CLIENT_LIST,
    CDS_CONTROL_REQ_VIDEO_RES,
    // CDS_BET_HIST_R,
    CDS_BET_LIST,
    CDS_TABLE_LIMIT,
    CDS_ACTION_R,
    CDS_UPDATE_PLAYER_AMOUNT_R,
    CDS_ANCHOR_BET_R,
    CDS_JETTON_R
} from '../../protocols';

export default class DataSocket extends Socket.WebSocketBase {
    constructor() {
        const config = {
            tag: '[DataSocket]',
            ucHeartBeatPeriod: 15000,
            heartBeatLength: 16
        };
        super(config);
    }

    getUrlList() {
        return CONFIG.DATA_SERVER_URL[ENV];
    }

    setupRespClazzMap() {
        this.respClazzMap.set(CDS_UPDATE_PLAYER_AMOUNT_R, CDSUpdatePlayerAmountResp);
        this.respClazzMap.set(CDS_OPERATOR_LOGIN_R, CDSOperatorLoginResp);
        this.respClazzMap.set(CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R, CDSOperatorControlContractTableResp);
        this.respClazzMap.set(CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC, CDSOperatorControlContractTableEBAC);
        this.respClazzMap.set(CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R, CDSOperatorControlKickoutClientResp);
        this.respClazzMap.set(CDS_CLIENT_ENTER_TABLE_NOTIFY, CDSClientEnterTableNotifyResp);
        this.respClazzMap.set(CDS_CLIENT_LEAVE_TABLE_NOTIFY, CDSClientLeaveTableNotifyResp);
        this.respClazzMap.set(CDS_VIDEO_STATUS, CDSVideoStatusResp);
        this.respClazzMap.set(CDS_CLIENT_LIST, CDSClientListResp);
        this.respClazzMap.set(CDS_CONTROL_REQ_VIDEO_RES, CDSControlReqVideoResp);
        // this.respClazzMap.set(CDS_BET_HIST_R, CDSBetHistResp);
        this.respClazzMap.set(CDS_BET_LIST, CDSBetListResp);
        this.respClazzMap.set(CDS_TABLE_LIMIT, CDSTableLimitResp);
        this.respClazzMap.set(CDS_ACTION_R, CDSActionResp);
        this.respClazzMap.set(CDS_ANCHOR_BET_R, CDSAnchorBetResp);
        this.respClazzMap.set(CDS_JETTON_R, CDSJettonResp);
    }
}
