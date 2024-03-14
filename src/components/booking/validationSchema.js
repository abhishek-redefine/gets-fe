import * as yup from "yup";
export const validationSchema = yup.object({
    bookingFromDate: yup.string("Select Booking Start Date"),
    bookingToDate: yup.string("Select Booking End Date"),
    officeId: yup.string("Select Primary Office").required("Select Primary Office"),
    bookingType: yup.string("Select Shift Type").required("Select Shift type"),
    nextDayLogOut: yup.bool("Select Next Day Logout"),
    isCustomiseSchedule: yup.bool("Select Next Day Logout"),
    transportType: yup.string("Select Transport Type").required("Select Transport Type"),
    pickUpPoint: yup.string("Enter Pickup Point"),
    dropPoint: yup.string("Enter Drop Point"),
    loginShift: yup.string().required("Select Login Shift"),
    logoutShift: yup.string().required("Select Logout Shift")
});