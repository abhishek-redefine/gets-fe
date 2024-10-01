export const ACCESS_TOKEN = "accessToken";
export const USER_ROLES = "userRoles";
export const PERMISSIONS = {
    S: "Search",
    D: "Delete",
    R: "Read",
    W: "Write"
};

export const MASTER_DATA_TYPES = {
    NODAL_POINT: "NodalPoint",
    USER_TYPE: "UserType",
    SHIFT_TYPE: "ShiftType",
    WEEKDAY: "WeekDay",
    TRANSPORT_TYPE: "TransportType",
    SHIFT_TYPE: "ShiftType",
    ROUTE_TYPE: "RouteType",
    GENDER: "Gender",
    ISSUE_TYPE : "TripIssue",
};

export const ROLE_TYPES = {
    EMPLOYEE: "EMPLOYEE",    
};

export const USER_TYPES = {
    EMPLOYEE: "USER_EMPLOYEE",
    ADMIN: "USER_ADMIN",
    DRIVER: "USER_DRIVER",
    ESCORT: "USER_ESCORT",
    VENDOR_TEAM: "USER_VENDOR_TEAM",
    TEAM: "TEAM"
};

export const ROUTING_TYPES = {
    ZONE : "ZONE",
    AREA : "AREA",
    NODAL_POINT : "NODAL_POINT",
    HOME_ROUTE : "HOME_ROUTE",
    BUS_SHUTTLE_ROUTE : "BUS_SHUTTLE_ROUTE"
}

export const COMPLIANCE_TYPES = {
    EHS: "EHS",
    PENALTY: "PENALTY"
};

export const PENDING_APPROVAL_TYPES = {
    DRIVER: "DRIVER",
    VEHICLE: "VEHICLE"
};

export const EHS_ENTRY_TYPES = {
    DRIVER: "DRIVER",
    VEHICLE: "VEHICLE"
}

export const SHIFT_TYPES = {
    VIEW_SHIFT_TIME: "VIEW_SHIFT_TIME",
    SHIFT_TEAM_MAPPING: "SHIFT_TEAM_MAPPING",
    SHIFT_CUTOFF: "SHIFT_CUTOFF",
    CREATE_SHIFT_TIME: "CREATE_SHIFT_TIME",
    DRIVER: "USER_DRIVER"
};

export const TRANSPORT_TYPES = {
    CAB: "CAB",
    SHUTTLE: "SHUTTLE",
    BUS: "BUS"
};

export const SHIFT_TYPE = {
    LOGIN: "LOGIN",
    LOGOUT: "LOGOUT"
};

export const DEFAULT_PAGE_SIZE = 10;

export const DATE_FORMAT = "YYYY-MM-DD";

export const DATE_FORMAT_API = "YYYY-MM-DDTHH:mm:ss.SSS[Z]";
