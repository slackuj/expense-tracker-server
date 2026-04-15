export interface UserConfirmationRequest  {
    email: string;
    code: string;
}

export interface ResendConfirmationCodeRequest  {
    email: string;
}