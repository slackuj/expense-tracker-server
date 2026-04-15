export const mailMessages = {
    CONFIRM_NEW_ACCOUNT: {
        subject: "Expense Tracker Confirmation Instructions",
        // ALSO INCLUDE CONFIRMATION LINK TOO ... LATER
        html: " <div class=\"content\">\n" +
            "        <h1>Please confirm your account.</h1>\n" +
            "        <hr>\n" +
            "        <p class=\"instruction\">Please return to your browser window and enter this <strong>6-digit code</strong> to confirm your account.</p>\n" +
            "        <p class=\"code\">generatedOTP</p>\n" +
            "        <p class=\"security-note\">If you did not make this change, please disregard this email. Do not reply to this automated email.</p>\n" +
            "    </div>",
    },
};