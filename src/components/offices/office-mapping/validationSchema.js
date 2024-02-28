import * as yup from "yup";
export const validationSchema = yup.object({
    primaryOfficeId: yup.string("Select Primary Office").required("Select Primary Office"),
    secondaryOfficeId: yup.string("Select Secondary Office").required("Select Secondary Office"),
});