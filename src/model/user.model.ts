import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from "@nestjs/mongoose";
import { HydratedDocument,  } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../common/enum";
import type { IUser } from "../common/interface";


export type HUserDocument = HydratedDocument<IUser>

@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strict: true,
    strictQuery: true,
    collection: 'User'
})
export class User implements IUser {

    @Prop({ type: String, required: true })
    firstName!: string;

    @Prop({ type: String, required: true })
    lastName!: string;

    @Virtual({
        set: function (this: HUserDocument, value: string) {
            const [firstName, lastName] = value.split(" ")
            this.set({ firstName, lastName })
        },
        get: function (this: any) {
            return `${this.firstName} ${this.lastName}`
        }
    })
    username?: string | undefined;

    @Prop({ type: String, required: true, unique: true })
    email!: string;

    @Prop({
        type: String, required: function (this: HUserDocument) {
            this.provider === ProviderEnum.System
        }
    })
    password!: string;

    @Prop({ type: String, required: false })
    phone?: string;

    @Prop({ type: String, required: false })
    profilePicture?: string;

    @Prop({ type: Array<String>, required: false })
    profileCoverPictures?: string[];

    @Prop({ type: Date })
    DOB?: Date;

    @Prop({ type: Date })
    changeCredentialTime?: Date;

    @Prop({ type: Date })
    confirmEmail?: Date;

    @Prop({ type: Date, required: true, default: new Date() })
    createdAt!: Date;

    @Prop({ type: Date })
    updatedAt?: Date;

    @Prop({ type: Date })
    deletedAt?: Date;

    @Prop({ type: Date })
    restoredAt?: Date;

    @Prop({ type: String, enum: Object.values(GenderEnum), required: true })
    gender!: GenderEnum;

    @Prop({ type: String, enum: Object.values(ProviderEnum), required: true, default: ProviderEnum.System })
    provider!: ProviderEnum;

    @Prop({ type: String, enum: Object.values(RoleEnum), required: true, default: RoleEnum.User })
    role!: RoleEnum;

}

export const userSchema = SchemaFactory.createForClass(User)
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: userSchema }])