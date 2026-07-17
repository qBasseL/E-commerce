import { Injectable } from "@nestjs/common";
import { CreateOptions, DeleteResult, HydratedDocument, Model, MongooseUpdateQueryOptions, PopulateOptions, ProjectionType, QueryFilter, QueryOptions, ReturnsNewDoc, Types, UpdateQuery, UpdateResult, UpdateWithAggregationPipeline } from "mongoose";

@Injectable()
export abstract class DatabaseRepository<T> {
    constructor(protected readonly model: Model<T>) { }

    async create({ data }: {
        data: Partial<T>,
    }
    ): Promise<HydratedDocument<T>>

    async create({ data, options }: {
        data: Partial<T>[],
        options?: CreateOptions | undefined
    }
    ): Promise<HydratedDocument<T>[]>

    async create({ data, options }: {
        data: Partial<T>[] | Partial<T>,
        options?: CreateOptions | undefined
    }
    ): Promise<HydratedDocument<T>[] | HydratedDocument<T>> {
        return await this.model.create(data as any, options)
    }

    async createOne({ data, options }: { data: Partial<T>, options?: CreateOptions | undefined }): Promise<HydratedDocument<T>> {
        const [doc] = await this.create({ data: [data], options }) || []
        return doc as HydratedDocument<T>
    }

    //Finds

    async findOne({ filter, projection, options, populate }: {
        filter?: QueryFilter<T>,
        projection?: ProjectionType<T> | null | undefined,
        options?: QueryOptions<T> | null | undefined,
        populate?: PopulateOptions | PopulateOptions[] | null
    }): Promise<HydratedDocument<T> | null> {
        const query = this.model.findOne(filter, projection, options)

        if (populate) {
            query.populate(populate)
        }

        return await query
    }

    async findById({ id, projection, options, populate }: {
        id?: Types.ObjectId,
        projection?: ProjectionType<T> | null | undefined,
        options?: QueryOptions<T> | null | undefined,
        populate?: PopulateOptions | PopulateOptions[] | null
    }) {
        const doc = this.model.findById(id, projection, options)
        if (populate) {
            doc.populate(populate)
        }
        return await doc
    }

    //updates

    async updateOne({ filter, update, options }: {
        filter: QueryFilter<T>,
        update: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions | null
    }): Promise<UpdateResult> {
        return this.model.updateOne(filter, update, options)
    }

    async updateMany({ filter, update, options }: {
        filter: QueryFilter<T>,
        update: UpdateQuery<T> | UpdateWithAggregationPipeline,
        options?: MongooseUpdateQueryOptions | null
    }): Promise<UpdateResult> {
        return this.model.updateMany(filter, update, options)
    }

    async findByIdAndUpdate({ id, update, options = { new: true } }: {
        id: Types.ObjectId,
        update: UpdateQuery<T>,
        options: QueryOptions<T> & ReturnsNewDoc
    }): Promise<HydratedDocument<T> | null> {
        return this.model.findByIdAndUpdate(id, update, options)
    }

    async findOneAndUpdate({ filter, update, options = { new: true } }: {
        filter: QueryFilter<T>,
        update: UpdateQuery<T>,
        options: QueryOptions<T> & ReturnsNewDoc
    }): Promise<HydratedDocument<T> | null> {
        return this.model.findOneAndUpdate(filter, update, options)
    }



    //Deletes


    async deleteOne({ filter }: {
        filter: QueryFilter<T>,
        // options?: QueryOptions<T> | null
    }): Promise<DeleteResult> {
        return this.model.deleteOne(filter)
    }

    async deleteMany({ filter }: {
        filter: QueryFilter<T>,
        // options?: QueryOptions<T> | null
    }): Promise<DeleteResult> {
        return this.model.deleteMany(filter)
    }

    async findOneAndDelete({ filter }: {
        filter: QueryFilter<T>,
    }): Promise<DeleteResult | null> {
        return this.model.findOneAndDelete(filter)
    }

    async findByIdAndDelete({ id }: {
        id: Types.ObjectId,
    }): Promise<DeleteResult | null> {
        return this.model.findByIdAndDelete(id)
    }

}