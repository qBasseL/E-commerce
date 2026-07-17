import { Injectable } from "@nestjs/common";
import { IUser } from "../../common";
import { DatabaseRepository } from "./base.repository";
import { InjectModel } from "@nestjs/mongoose";
import { User } from 'src/model/user.model';
import { Model } from "mongoose";


@Injectable()
export class UserRepository extends DatabaseRepository<IUser> {
    constructor(
        @InjectModel(User.name)
        protected readonly model: Model<User>
    ) {
        super(model)
    }
}