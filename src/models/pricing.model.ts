import mongoose, { Schema } from "mongoose";

const env = process.env;

const PricingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bwA4: { type: Number, default: 3 }, // B/W A4 (per page) - ₹
    colorA4: { type: Number, default: 5 }, // Color A4 (per page) - ₹
    bwA3: { type: Number, default: 8 }, // B/W A3 (per page) - ₹
    colorA3: { type: Number, default: 15 }, // Color A3 (per page) - ₹
    doubleSided: { type: Number, default: 1 }, // Double-sided (additional) - ₹
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

const dbConnection = mongoose.connection.useDb(env.DATABASE_NAME ?? '');
export const Pricing = dbConnection.model('Pricing', PricingSchema, 'Pricing');
