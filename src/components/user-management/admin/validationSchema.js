import * as yup from "yup";
export const validationSchema = yup.object({
    name: yup.string("Enter Escort Name").required("Enter Escort Name"),
    mobile: yup.string("Enter Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile.").required("Enter Mobile No"),
    alternateMobile: yup.string("Enter Alternate Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile."),
    gender: yup.string("Select Gender").required("Select Gender"),
    primaryOfficeId: yup.string("Select Primary Office").required("Select Primary Office"),
    secondaryOfficeId: yup.string("Select Primary Office"),
    address: yup.string("Enter Escort Address").required("Enter Escort Address"),
    email: yup.string("Enter Email").required("Enter Email"),
    roles: yup.string("Select Employee Role").required("Select Employee Role"),
});