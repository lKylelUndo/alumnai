import { ENV } from '@/config/env'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    secure: true,
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.CLOUDINARY_API_KEY,
    api_secret: ENV.CLOUDINARY_SECRET_KEY
})


export const uploadImage = async (base64: string, folder = 'alumnai-profiles') => {
    try {
        const result = await cloudinary.uploader.upload(base64, { folder })
        return result
    } catch (error) {
        console.log("Upload image error: ", error)
        throw error
    }
}