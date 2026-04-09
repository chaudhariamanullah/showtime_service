import { z } from "zod";

export const filterQuerySchema = z.object({
    date:z.string(),
    city:z.string(),
    movie_name: z.string(),
    theater_public_id: z.string(),
    limit:z.string(),
    offset:z.string()
}).strict().partial();

export type filterQueryInput = z.infer< typeof filterQuerySchema>;