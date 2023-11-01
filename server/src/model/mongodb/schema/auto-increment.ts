import { Schema, model } from "mongoose";

interface Counter {
  id: string
  seq: number
}

const counterSchema = new Schema<Counter>({
  id: {
    type: String,
    required: true,
    unique: true
  },
  seq: {
    type: Number,
    default: 0
  }
});

const CounterModel = model<Counter>("counter", counterSchema);

export async function getCounter (counterName: string): Promise<number> {
  const count = await CounterModel.findOneAndUpdate(
    { id: counterName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return count.seq;
};
