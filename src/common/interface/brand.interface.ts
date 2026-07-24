import { Types } from "mongoose";

export interface IBrand {
    name: string;
    slug: string;
    img_url: string;
    createdBy: Types.ObjectId;
    updatedBy?: Types.ObjectId
    deletedAt?: Date;
    restoredAt?: Date;
}