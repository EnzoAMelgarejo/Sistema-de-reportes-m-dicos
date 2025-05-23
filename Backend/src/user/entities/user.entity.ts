export enum Role {
    USER = 'USER',
    ADMIN = 'ADMIN',
}

export class User {
    id: number;
    name: string;
    email: string;
    auth0Id: string;
    role: Role;
    createdAt: Date;
    isActive: boolean;
}
