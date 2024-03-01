import * as yup from "yup";
export const validationSchema = yup.object({
    officeIds: yup.array().of(yup.string()).min(1, "Select at least one office").required("Select Office"),
    vendorId: yup.string("Enter Vendor ID").required("Enter Vendor ID"),
    name: yup.string("Enter Vendor Name").required("Enter Vendor Name"),
    address: yup.string("Enter Vendor Address").required("Enter Vendor Address"),
    gstNo: yup.string("Enter Vendor GST No").required("Enter Vendor GST No"),
    city: yup.string("Enter Vendor City").required("Enter Vendor City"),
    mob: yup.string("Enter Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile.").required("Enter Mobile No"),
    contactPerson: yup.string("Enter Contact Person").required("Enter Contact Person"),
    contactPersonMob: yup.string("Enter Contact Person Mobile No").min(10, "Please Enter a valid mobile.").max(10, "Please Enter a valid mobile.").required("Enter Contact Person Mobile No"),
    email: yup.string("Enter Email").required("Enter Email"),
    remarks: yup.string("Enter remarks"),
    role: yup.string("Select Vendor Role").required("Select Vendor Role"),
});