import mongoose, { Schema } from "mongoose";
import validator from "validator";

const env = process.env;

const UserSchema = new Schema({
    shopName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true,
        validate: {
            validator: (value: string) => validator.isEmail(value),
        },
    },
    password: { type: String, required: true },
    number: { type: String, required: true },
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pinCode: { type: String, required: true },
    address: { type: String, required: true },
    qrCode: { type: String }, // QR code as data URL (base64 encoded image)
    shopLink: { type: String }, // Shop link for QR code
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const User = dbConnection.model('User', UserSchema, 'User');