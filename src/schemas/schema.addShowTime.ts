import { z } from "zod";

export const AddShowTimeSchema = z.object({
    movie_public_id: z.string(),
    showtime_name:z.string(),
    theater_public_id: z.string(),
    date_time: z.coerce.string(),
    showtime_status: z.enum(['running','housefull','cancelled','scheduled','completed']),
    city:z.string(),
    showtime_price:z.number(),
    total_seats:z.number().min(0).max(100),
}).strict();

export type AddShowTimeInput = z.infer< typeof AddShowTimeSchema >;