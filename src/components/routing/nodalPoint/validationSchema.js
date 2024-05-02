import * as yup from "yup";
export const validationSchema = yup.object({
  name: yup.string("Enter Area Name").required("Enter Area Name"),
  officeId: yup.string("Select Office").required("Select Office"),
  areaName: yup.string("Select Area").required("Select Area"),
  shiftType: yup.string("Select Shift Type").required("Select Shift Type"),
  geoCode: yup.string("Select geo code").required("Select geo code"),
  reportingTime: yup
    .string("Select Reporting Time")
    .required("Select Reporting Time"),
});
