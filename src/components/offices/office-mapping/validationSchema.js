import * as yup from "yup";
export const validationSchema = yup.object({
    primaryOfficeId: yup.string("Select Primary Office").required("Select Primary Office"),
    secondaryOfficeId: yup.array().of(yup.string()).min(1, "Select at least one secondary office").required("Select secondary office"),
});