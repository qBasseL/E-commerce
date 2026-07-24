import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { generateSlug, IBrand } from "src/common";

type BrandDocument = HydratedDocument<IBrand>

@Schema(
    {
        timestamps: true,
        strict: true,
        strictQuery: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
        collection: 'Brand'
    }
)
export class Brand implements IBrand {

    @Prop({ type: String, minLength: 2, maxLength: 50, required: true })
    name!: string;

    @Prop({ type: String, required: true })
    slug!: string;

    @Prop({ type: String, required: true })
    img_url!: string;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    createdBy!: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: false })
    updatedBy?: Types.ObjectId;

    @Prop({ type: Date })
    deletedAt?: Date | undefined;

}

export const brandSchema = SchemaFactory.createForClass(Brand);



brandSchema.pre('save', function (this: BrandDocument & { wasNew: boolean }) {
    if (this.isModified('name')) {
        this.slug = generateSlug(this.name)
    }
})

export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: brandSchema }])