import { z } from "zod";

export const EditShowTimeSchema = z.object({
    showtime_name:z.string(),
    movie_public_id: z.string(),
    theater_public_id: z.string(),
    date_time: z.string(),
    city:z.string(),
    showtime_status:z.enum(['running','housefull','cancelled','scheduled','completed']),
    showtime_price:z.number(),
    old_total_seats:z.number().min(0).max(100),
    new_total_seats:z.number().min(10).max(100)
}).strict();

export type EditShowTimeInput = z.infer< typeof EditShowTimeSchema >;