import { JwtPayload } from "jsonwebtoken";
import { HydratedDocument } from "mongoose";
import { User } from "src/model";

export interface AuthRequest extends Request {
  user: HydratedDocument<User>;
  decoded: JwtPayload;
}