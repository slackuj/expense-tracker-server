import {sendMail} from "../utils/sendMail";
import {mailMessages} from "../constants/mailMessages";

export const sendNewAccountConfirmationEmail = async (userEmail: string) => {
    const { subject, html } = mailMessages.CONFIRM_NEW_ACCOUNT;
    return await sendMail(userEmail, subject, html);
};