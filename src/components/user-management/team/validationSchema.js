import * as yup from "yup";
export const validationSchema = yup.object({
    name: yup.string("Enter Team Name").required("Enter Team Name"),
    officeIds: yup.array().of(yup.string()).min(1, "Select at least one office").required("Select Office"),
    managerIds: yup.array().of(yup.string()).min(1, "Select at least one Manager").required("Select Manager"),
    //managerIds: yup.array().of("Select Manager").required("Select Manager"),
    shiftType: yup.string("Select Shift Type").required("Select Shift Type"),
    description: yup.string("Enter Description").required("Enter Description"),
    sendNotification: yup.string("Enter Notification Type").required("Enter Notification Type"),
    comment: yup.string("Enter Comment")
});