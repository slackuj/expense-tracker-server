import {sendMail} from "../utils/sendMail";
import {mailMessages} from "../constants/mailMessages";
import {generateOTP} from "../utils/generateOTP";

export const sendNewAccountConfirmationEmail = async (userEmail: string) => {
    const { subject, html } = mailMessages.CONFIRM_NEW_ACCOUNT;
    const generatedOTP = generateOTP();
    html.replace('generatedOTP', generatedOTP);
    await sendMail(userEmail, subject, html);
    return generatedOTP;
};