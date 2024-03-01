import * as yup from "yup";
export const validationSchema = yup.object({
    name: yup.string("Enter Escort Name").required("Enter Escort Name"),
    escortId: yup.string("Enter Escort Id").required("Enter Escort ID"),
    mobile: yup.string("Enter Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile.").required("Enter Mobile No"),
    alternateMobile: yup.string("Enter Alternate Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile.").required("Enter Alternate mobile no"),
    gender: yup.string("Select Gender").required("Select Gender"),
    officeIds: yup.array().of(yup.string()).min(1, "Select at least one primary office").required("Select Primary Office"),
    address: yup.string("Enter Escort Address").required("Enter Escort Address"),
    email: yup.string("Enter Email").required("Enter Email"),
});