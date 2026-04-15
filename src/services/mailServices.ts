import {sendMail} from "../utils/sendMail";
import {mailMessages} from "../constants/mailMessages";
import {generateOTP} from "../utils/otpUtil";

export const sendNewAccountConfirmationEmail = async (userEmail: string) => {
    const generatedOTP = generateOTP();
    const { subject, html } = mailMessages.CONFIRM_NEW_ACCOUNT;
    const HTML = html(generatedOTP);
    await sendMail(userEmail, subject, HTML);
    return generatedOTP;
};