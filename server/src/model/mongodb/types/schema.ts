export type MongooseIdSchema<T> = T & { _id: number };

export type MongooseDTO<T> = T & { id: number };
