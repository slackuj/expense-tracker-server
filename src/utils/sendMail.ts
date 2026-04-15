import nodemailer from "nodemailer";
import {config} from "../config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: config.GOOGLE_APP_EMAIL,
        pass: config.GOOGLE_APP_PASSWORD,
    },
});
/*try{
    await transporter.verify();
    console.log("Server is ready to take our messages");
} catch(error){
    console.error("Verification failed: ", error);
}*/
export const sendMail = async( to: string, subject: string, html: string ) => {
    try{
        const info = await transporter.sendMail({
            from: config.GOOGLE_APP_EMAIL,
            to,
            subject,
            html,
        });
        console.log("Message sent: %s", info.messageId);
    } catch(error){
        console.error("Error sending mail: ", error);
        throw new Error("Error sending mail");
    }
};