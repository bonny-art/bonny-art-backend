import { Schema, model } from 'mongoose';
const masterSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    purchasedPatterns: [{ type: Schema.Types.ObjectId, ref: 'Pattern' }],
});
export const Master = model('Master', masterSchema);
