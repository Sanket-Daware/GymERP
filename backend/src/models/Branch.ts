// backend/src/models/Branch.ts
import mongoose, { Document, Schema } from 'mongoose';

export interface IBranch extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<IBranch>(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IBranch>('Branch', BranchSchema);
