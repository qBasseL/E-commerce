import { BadRequestException } from "@nestjs/common"
import { diskStorage } from "multer"
import { randomUUID } from "node:crypto"
import type { Request } from "express"
import { resolve } from "node:path"
import { existsSync, mkdirSync } from "node:fs"
import { IMulter } from "../interface"

export const fileFieldValidation = {
    image: ['image/jpeg', 'image/png', 'image/jpg'],
    video: ['video/mp4']
}

export const localMulter = ({ validations = [], fileSize = 5, folder = 'public' }: { validations?: string[], folder?: string, fileSize?: number }) => {
    return {
        storage: diskStorage({
            destination(req: Request, file: IMulter, callback: Function) {
                const fullPath = resolve(`./uploads/${folder}`)
                if (!existsSync(fullPath)) {
                    mkdirSync(fullPath, { recursive: true })
                }
                return callback(null, fullPath)
            },
            filename(req: Request, file: IMulter, callback: Function) {
                const uniqueFileName = randomUUID() + '_' + file.originalname
                file.finalPath = `./uploads/${folder}`
                return callback(null, uniqueFileName)
            },
        }),
        fileFilter(req: Request, file: IMulter, callback: Function) {
            if (!validations.includes(file.mimetype)) {
                return callback(new BadRequestException('Invalid file format'))
            }
            return callback(null, true)
        },
        limits: { fileSize: fileSize * 1024 * 1024 }
    }
}