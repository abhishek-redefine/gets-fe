import * as yup from "yup";
export const validationSchema = yup.object({
    empId: yup.string("Enter Employee Id").required("Enter Employee ID"),
    name: yup.string("Enter Employee Name").required("Enter Employee Name"),
    gender: yup.string("Select Gender").required("Select Gender"),
    email: yup.string("Enter Email").required("Enter Email"),
    mob: yup.string("Enter Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile.").required("Enter Mobile No"),
    altMob: yup.string("Enter Alternate Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile."),
    primaryOfficeId: yup.string("Select Primary Office").required("Select Primary Office"),
    role: yup.string("Select Employee Role").required("Select Employee Role"),
    transportEligibilities: yup.string("Select Transport").required("Select Transport"),
    address: yup.string("Enter Employee Address").required("Enter Employee Address"),
    geoCode: yup.string("Enter Employee Geocode"),
    isAddHocBooking: yup.bool().nullable(),
    mobAppAccess: yup.bool().nullable(),
    notificationTypes: yup.array().of(yup.string()).min(1, "Select at least one notification type").required("Select Notification Type"),
    profileStatus: yup.bool().nullable().required("Select Profile Status"),
    team: yup.string("Select Employee Team"),
    reportingManager: yup.string("Select Reporting Manager"),
    costCenter: yup.string("Enter Cost Center"),
    startDate: yup.string("Select Start Date"),
    endDate: yup.string("Select End Date"),
    businessUnit: yup.string("Enter Business Unit"),
    weekOff: yup.array().of(yup.string()).min(1, "Select at least one day off").required("Select Weekly Off"),
    specialStatus: yup.string("Select Special Status")
});