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

export const getPublicIdFromUrl = (url: string) => {
    try {
        const parts = url.split('/');
        const folder = parts[parts.length - 2];
        const lastPart = parts[parts.length - 1];
        const filename = lastPart.split('.')[0];
        return `${folder}/${filename}`;
    } catch {
        return "";
    }
}

export const deleteImage = async (publicId: string) => {
    if (!publicId) return;
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log("Delete image error: ", error);
    }
}