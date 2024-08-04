import * as yup from "yup";
export const validationSchema = yup.object({
  name: yup.string("Enter Area Name").required("Enter Area Name"),
  officeId: yup.string("Select Office").required("Select Office"),
  zoneName: yup.string("Select Zone").required("Select Zone"),
  shiftType: yup.string("Select Shift Type").required("Select Shift Type"),
  serviceType: yup
    .string("Select Service Type")
    .required("Select Service Type"),
});
