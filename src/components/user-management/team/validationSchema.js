import * as yup from "yup";
export const validationSchema = yup.object({
    name: yup.string("Enter Team Name").required("Enter Team Name"),
    officeId: yup.string("Enter Office ID").required("Enter Office ID"),
    managerIds: yup.string("Select Manager").required("Select Manager"),
    shiftType: yup.string("Select Shift Type").required("Select Shift Type"),
    description: yup.string("Enter Description").required("Enter Description"),
    sendNotification: yup.string("Enter Notification Type").required("Enter Notification Type"),
    comment: yup.string("Enter Comment")
});