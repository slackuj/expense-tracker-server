import {UserRegisterRequest} from "../types/user";
import {UserModel} from "../models/UserModel";
import {SALT_ROUNDS} from "../constants/authConstants";
import bcrypt from "bcrypt";

type registerData = Omit<UserRegisterRequest, "confirmPassword">;
export const register = async (data: registerData) => {
    const { name, email, password } = data;
    const existingUser = await UserModel.findOne({ email });

    if (existingUser) {
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    return await UserModel.create({
        name,
        email,
        password: hashedPassword
    });
}