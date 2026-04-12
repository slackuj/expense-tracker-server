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
    const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL;
    const SUPER_ADMIN_PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
    const SUPER_ADMIN_NAME = process.env.SUPER_ADMIN_NAME;
    const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
    const ADMIN_NAME = process.env.ADMIN_NAME;
    const USER_EMAIL = process.env.USER_EMAIL;
    const USER_NAME = process.env.USER_NAME;
    const USER_PASSWORD = process.env.USER_PASSWORD;

    if (!mongoURI) {
        throw new Error("MONGO_URI is not defined");
    }

    if (!SUPER_ADMIN_EMAIL) {
        throw new Error("SUPER_ADMIN_EMAIL is not defined");
    }

    if (!SUPER_ADMIN_PASSWORD) {
        throw new Error("SUPER_ADMIN_PASSWORD is not defined");
    }

    if (!SUPER_ADMIN_NAME) {
        throw new Error("SUPER_ADMIN_NAME is not defined");
    }

    if (!ADMIN_EMAIL) {
        throw new Error("ADMIN_EMAIL is not defined");
    }

    if (!ADMIN_PASSWORD) {
        throw new Error("ADMIN_PASSWORD is not defined");
    }

    if (!ADMIN_NAME) {
        throw new Error("ADMIN_NAME is not defined");
    }

    if (!USER_EMAIL) {
        throw new Error("USER_EMAIL is not defined");
    }

    if (!USER_NAME) {
        throw new Error("USER_NAME is not defined");
    }

    if (!USER_PASSWORD) {
        throw new Error("USER_PASSWORD is not defined");
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

    // create permissions
    // Transform the object into an array of values and insert at once !!!
    const permissionsArray = Object.values(appPermissions);
    const permissions = await PermissionModel.insertMany(permissionsArray);
    console.log(`${permissions.length} permissions inserted!`);


    const permissionMap = permissions.reduce((acc, p) => {
        acc[p.name] = p._id;
        return acc;
    }, {} as Record<string, any>);


    //create roles
    // transform [permission names] into [permission IDs] and convert roles into rolesArray
    const rolesArray = Object.values(appRoles).map((role) => ({
        ...role,
        // Use .map() to swap the name string for the actual Mongo ID from our lookup
        permissions: role.permissions.map(pName => permissionMap[pName])
    }));

    // Transform the object into an array of values and insert at once !!!
    const roles = await RoleModel.insertMany(rolesArray);
    console.log(`${roles.length} roles inserted!`);

    // create SUPER ADMIN
    const superAdminRole = await RoleModel.findOne({ name: "SUPER_ADMIN" }).select({ id: 1 }).lean();
    if (!superAdminRole) {
        throw new Error("Role 'SUPER_ADMIN' does not exist");
    }
    let hashedPassword = await bcrypt.hash(SUPER_ADMIN_PASSWORD, SALT_ROUNDS);
    await UserModel.create({
        name: SUPER_ADMIN_NAME,
        email: SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        roles: [String(superAdminRole._id)]
    });
    console.log("SUPER_ADMIN created...");

    // create ADMIN
    const adminRole = await RoleModel.findOne({ name: "ADMIN" }).select({ id: 1 }).lean();
    if (!adminRole) {
        throw new Error("Role 'ADMIN' does not exist");
    }
    hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, SALT_ROUNDS);
    await UserModel.create({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: hashedPassword,
        roles: [String(adminRole._id)]
    });
    console.log("ADMIN created...");

    // create USER
    const userRole = await RoleModel.findOne({ name: "USER" }).select({ id: 1 }).lean();
    if (!userRole) {
        throw new Error("Role 'USER' does not exist");
    }
    hashedPassword = await bcrypt.hash(USER_PASSWORD, SALT_ROUNDS);
    await UserModel.create({
        name: USER_NAME,
        email: USER_EMAIL,
        password: hashedPassword,
        roles: [String(userRole._id)]
    });
    console.log("USER created...");

    console.log("Seeding completed");

    await mongoose.disconnect();
    process.exit(0);
};

seed().catch((error) => {
    console.error("Error seeding data:", error);
    process.exit(1);
});
