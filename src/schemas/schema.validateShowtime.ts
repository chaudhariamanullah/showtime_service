import { z } from "zod";

export const ValidateShowtimeSchema = z.object({
    dateAndTime:z.coerce.date(),
    screen_public_id: z.string(),
}).strict();

export type ValidateShowtimeInput = z.infer< typeof ValidateShowtimeSchema >;