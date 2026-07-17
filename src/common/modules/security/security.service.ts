import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { compare, hash } from "bcrypt";
import crypto from 'node:crypto'

@Injectable()
export class SecurityService {
    constructor(private readonly configService: ConfigService) { }

    public generateEncryption = (plaintext: string): string => {

        const iv = crypto.randomBytes(Number(this.configService.get<string>('IV_LENGTH')))
        const ENC_KEY = this.configService.get<string>('ENC_SECRET_KEY') as string
        const cipherIV = crypto.createCipheriv('aes-256-cbc', ENC_KEY, iv)
        let cipherText = cipherIV.update(plaintext, 'utf-8', 'hex')
        cipherText += cipherIV.final('hex')

        return `${iv.toString('hex')}:${cipherText}`
    }

    public generateDecryption = (cipherText: string): string => {

        const [iv, encryptedData] = cipherText.split(':') || [] as string[];
        if (!iv || !encryptedData) {
            throw new BadRequestException('Invalid Data')
        }
        const ENC_KEY = this.configService.get<string>('ENC_SECRET_KEY') as string
        const binaryIV = Buffer.from(iv, 'hex')
        const deCipherText = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, binaryIV)
        let plainText = deCipherText.update(encryptedData, 'hex', 'utf-8')
        plainText += deCipherText.final('utf-8')

        return plainText
    }

    public generateHash = async ({ plaintext, salt = Number(this.configService.get<string>('SALT_ROUND')) }: {
        plaintext: string,
        salt?: number
    }): Promise<string> => {
        return await hash(plaintext, salt)
    }

    public compareHash = async ({ plaintext, ciphertext }: {
        plaintext: string,
        ciphertext: any
    }): Promise<boolean> => {
        return await compare(plaintext, ciphertext)
    }

}