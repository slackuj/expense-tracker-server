export interface Role {
    id: string;
    name: string;
    description: string;
    permissions?: string[];// permissionIds
}

export type CreateRoleRequest = Omit<Role, 'id'>;
export type EditRoleRequest = Partial<CreateRoleRequest>;