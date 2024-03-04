import * as yup from "yup";
export const validationSchema = yup.object({
    bookingFromDate: yup.string().required("Select From Date"),
    bookingToDate: yup.string().required("Select To Date"),
    officeId: yup.string().nullable().required("Select Primary Office"),
    nextDayLogOut: yup.bool(),
    isCustomiseSchedule: yup.bool(),
    transportType: yup.string().required("Select Transport Type"),
    pickUpPoint: yup.string(),
    dropPoint: yup.string(),
    loginShift: yup.string().required("Select Login Shift"),
    logoutShift: yup.string().required("Select Logout Shift")
});