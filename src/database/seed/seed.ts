// INITIALIZES DATABASE WITH DEFAULT SEED DATA
import mongoose from "mongoose";
import dotenv from "dotenv";
import {PermissionModel} from "../../models/PermissionModel";
import {RoleModel} from "../../models/RoleModel";
import {UserModel} from "../../models/UserModel";
import bcrypt from "bcrypt";
import {appPermissions} from "../../constants/permissions";
import {appRoles} from "../../constants/roles";
import { SALT_ROUNDS } from "../../constants/authConstants";
import {SessionModel} from "../../models/SessionModel";

dotenv.config();

const seed = async () => {
    const mongoURI = process.env.MONGO_URI;
    const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
    const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
    const superAdminName = process.env.SUPER_ADMIN_NAME;

    if (!mongoURI) {
        throw new Error("MONGO_URI is not defined");
    }

    if (!superAdminEmail) {
        throw new Error("SUPER_ADMIN_EMAIL is not defined");
    }

    if (!superAdminPassword) {
        throw new Error("SUPER_ADMIN_PASSWORD is not defined");
    }

    if (!superAdminName) {
        throw new Error("SUPER_ADMIN_NAME is not defined");
    }

    // Connect to MongoDB
    await mongoose.connect(mongoURI);
    console.log("Connected to DB for seeding");

    // delete all the documents
    await UserModel.deleteMany();
    await SessionModel.deleteMany();
    await RoleModel.deleteMany();
    await PermissionModel.deleteMany();
    console.log("Deleted all existing documents!");

    // Transform the object into an array of values and insert at once !!!
    const permissionsArray = Object.values(appPermissions);
    const permissions = await PermissionModel.insertMany(permissionsArray);
    console.log(`${permissions.length} permissions inserted!`);

    // Transform the object into an array of values and insert at once !!!
    const rolesArray = Object.values(appRoles);
    const roles = await RoleModel.insertMany(rolesArray);
    console.log(`${roles.length} roles inserted!`);

    // create SUPER ADMIN
    const role = await RoleModel.findOne({ name: "SUPER_ADMIN" }).select({ _id: 1 }).lean();
    const hashedPassword = await bcrypt.hash(superAdminPassword, SALT_ROUNDS);
    await UserModel.create({
        name: superAdminName,
        email: superAdminEmail,
        password: hashedPassword,
        roles: [String(role!._id)]
    });

    console.log("Seeding completed");

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});
