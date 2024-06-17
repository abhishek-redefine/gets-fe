import * as yup from "yup";
export const validationSchemaBus = yup.object({
  busRouteName: yup.string("Enter Bus Route Name").required("Enter Area Name"),
  busRouteOfficeId: yup.string("Select Office").required("Select Office"),
  busRouteShiftTime: yup
    .string("Select Shift Time")
    .required("Select Shift Time"),
  busRouteShiftType: yup
    .string("Select Shift Type")
    .required("Select Shift Type"),
  busRouteSeatCount: yup
    .number("Enter Seat Count")
    .moreThan(0, "Enter Seat Count")
    .required("Enter Seat Count"),
  busRouteMiddlePointCount: yup
    .number("Enter Middle Point Count")
    .moreThan(0, "Enter Middle Point Count")
    .required("Enter Middle Point Count"),
});

export const validationSchemaShuttle = yup.object({
  shuttleRouteName: yup
    .string("Enter Shuttle Route Name")
    .required("Enter Area Name"),
  shuttleRouteOfficeId: yup.string("Select Office").required("Select Office"),
  shuttleRouteShiftTime: yup
    .string("Select Shift Time")
    .required("Select Shift Time"),
  shuttleRouteShiftType: yup
    .string("Select Shift Type")
    .required("Select Shift Type"),
  shuttleRouteSeatCount: yup
    .number("Enter Seat Count")
    .moreThan(0, "Enter Seat Count")
    .required("Enter Seat Count"),
});
