import mongoose, { Document, Schema } from "mongoose";

export interface ILog extends Document {
  message: string;
  stack?: string;
  route?: string;
  method?: string;
}

const logSchema = new Schema<ILog>(
  {
    message: { type: String, required: true },
    stack: String,
    route: String,
    method: String,
  },
  { timestamps: true }
);

export const Log = mongoose.model<ILog>("Log", logSchema);
