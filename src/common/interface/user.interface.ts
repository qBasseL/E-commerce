import { GenderEnum, languageEnum, ProviderEnum, RoleEnum } from "../enum";

export interface IUser {
    firstName: string;
    lastName: string;
    username?: string;
    email: string;
    password: string;
    phone?: string;
    profilePicture?: string;
    profileCoverPictures?: string[];
    DOB?: Date;
    deletedAt?: Date;
    restoredAt?: Date;
    confirmEmail?: Date;
    changeCredentialTime?: Date;
    gender: GenderEnum;
    provider: ProviderEnum;
    role: RoleEnum;
    createdAt: Date;
    updatedAt?: Date;
    lang: languageEnum
}