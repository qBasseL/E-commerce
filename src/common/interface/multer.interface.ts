export interface IMulter extends Express.Multer.File {
    finalPath?: string
}