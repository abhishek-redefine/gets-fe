import * as yup from "yup";
export const validationSchema = yup.object({
    occasion: yup.string("Enter Occasion Name").required("Enter Occasion Name"),
    holidayDate: yup.string("Select Holiday Date").required("Select Holiday Date"),
    officeId: yup.string("Select Office").required("Select Office")
});