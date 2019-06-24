// Voice server
export const MANAGER_LOGIN = 0x0bb201;
export const MANAGER_LOGIN_R = 0x0bb202;
export const CHANNEL_LIST_R = 0x0bb203;
export const CHANNEL_JOIN = 0x0bb204;
export const CHANNEL_JOIN_R = 0x0bb205;
export const MANAGER_ACTION = 0x0bb206;
export const ASSIGN_TABLE_TO_CHANNEL = 0x0bb208;
export const MANAGER_ACTION_R = 0x0bb209;
export const MANAGER_LOGOUT = 0x0bb20a;
export const ANCHORS_ON_DUTY_UPDATE = 0x0bb20b;
export const ANCHORS_ON_DUTY_REQUEST = 0x0bb20c;
export const ANCHORS_ON_DUTY_R = 0x0bb20c;
export const MANAGER_ADD_REQ = 0x0bb20d;
export const MANAGER_ADD_R = 0x0bb20d;
export const MANAGER_UPDATE_REQ = 0x0bb20e;
export const MANAGER_UPDATE_R = 0x0bb20e;
export const MANAGER_DELETE = 0x0bb20f;
export const MANAGER_DELETE_R = 0x0bb20f;
export const MANAGER_ALL_QUERY_REQ = 0x0bb210;
export const MANAGER_ALL_QUERY_R = 0x0bb210;
export const ANCHOR_ADD_REQ = 0x0bb211;
export const ANCHOR_ADD_R = 0x0bb211;
// export const ANCHOR_UPDATE_REQ = 0x0bb212;
// export const ANCHOR_UPDATE_R = 0x0bb212;
export const ANCHOR_DELETE_REQ = 0x0bb213;
export const ANCHOR_DELETE_R = 0x0bb213;
export const ANCHOR_ALL_QUERY_REQ = 0x0bb214;
export const ANCHOR_ALL_QUERY_R = 0x0bb214;
export const MANAGER_KICKOUT_R = 0x0bb215;
export const WAITING_LIST_R = 0x0bb216;
export const ASSIGN_TOKEN_TO_DELEGATOR = 0x0bb217;
export const ASSIGN_TOKEN_TO_DELEGATOR_R = 0x0bb217;
export const KICK_DELEGATOR = 0x0bb218;
export const KICK_DELEGATOR_R = 0x0bb218;
export const ADD_DELEGATOR = 0x0bb219;
export const ADD_DELEGATOR_R = 0x0bb219;
export const DELETE_DELEGATOR = 0x0bb21a;
export const DELETE_DELEGATOR_R = 0x0bb21a;
export const QUERY_ALL_DELEGATOR = 0x0bb21b;
export const QUERY_ALL_DELEGATOR_R = 0x0bb21b;

//Data server
export const CDS_UPDATE_PLAYER_AMOUNT_R = 0x090026;
export const CDS_OPERATOR_LOGIN = 0x090038;
export const CDS_OPERATOR_LOGIN_R = 0x090039;
export const CDS_OPERATOR_LOGOUT = 0x090046;
export const CDS_OPERATOR_CONTROL_CONTRACT_TABLE = 0x095047;
export const CDS_OPERATOR_CONTROL_CONTRACT_TABLE_R = 0x095048;
export const CDS_OPERATOR_CONTROL_CONTRACT_TABLE_EBAC = 0x095049;
export const CDS_OPERATOR_CONTROL_KICKOUT_CLIENT = 0x090029;
export const CDS_OPERATOR_CONTROL_KICKOUT_CLIENT_R = 0x09002a;
export const CDS_CLIENT_ENTER_TABLE_NOTIFY = 0x080024;
export const CDS_CLIENT_LEAVE_TABLE_NOTIFY = 0x080026;
export const CDS_VIDEO_STATUS = 0x015051;
export const CDS_CLIENT_LIST = 0x080020;
export const CDS_CONTROL_REQ_VIDEO_RES = 0x0d0006;
// export const CDS_BET_HIST = 0x090024;
// export const CDS_BET_HIST_R = 0x090025;
export const CDS_BET_LIST = 0x080011;
export const CDS_TABLE_LIMIT = 0x09002f;
export const CDS_ADD_MANAGER = 0x09003a;
export const CDS_REMOVE_MANAGER = 0x09003b;
export const CDS_UPDATE_MANAGER = 0x09003c;
export const CDS_ADD_ANCHOR = 0x09003d;
export const CDS_REMOVE_ANCHOR = 0x09003e;
export const CDS_UPDATE_ANCHOR = 0x09003f;
export const CDS_ACTION_R = 0x090040;
export const CDS_ANCHOR_BET_R = 0x09b003;
export const CDS_JETTON_R = 0x080032;

// Null Gate
export const GATE_REQUEST_CACHE = 0x4054a;
export const GATE_FORWARD_MSG = 0x4052f;
export const GET_BET_RECORDS = 0x40092;
export const GET_BET_RECORDS_R = 0x40093;