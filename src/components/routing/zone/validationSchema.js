import * as yup from "yup";
export const validationSchema = yup.object({
  name: yup.string("Enter Zone Name").required("Enter Zone Name"),
  officeId: yup
    .string("Select Primary Office")
    .required("Select Primary Office"),
});
