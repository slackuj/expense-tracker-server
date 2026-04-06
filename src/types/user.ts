export interface UserRegisterRequest  {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface UserLoginRequest {
    email: string;
    password: string;
}

export interface UserSession {
    userId: string;
    refreshToken: string;
    expiresAt: Date;
}

export interface AuthenticatedUser {
    id: string;
    email: string;
    name: string;
    roles: string[];// array of roles
    //permissions: string[];// array of permission IDs
}

export interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];// array of permission IDs
}

/*
YOU ALSO NEED TO CHECK ACCESS TOKEN, WHEN OPERATIONS ARE BEING CARRIED OUT VIA USER'S ACCOUNT.
THEREFORE, POSTPONED FOR NOW !!!
----> ALSO CONSIDER THE SCENARIO FOR DELETION !!!
type UserDataUpdateRequest =  Partial<Omit<UserRegisterRequest, 'password' | 'confirmPassword'>>;
type UsePasswordUpdateRequest = Pick<UserRegisterRequest, 'email' | 'password' | 'confirmPassword'>;*/
