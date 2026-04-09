import { z } from "zod";

export const GetShowTimeSchema = z.object({
    theater_public_id: z.array(z.string()).min(1),
}).strict();

export type GetShowTimeInput = z.infer< typeof  GetShowTimeSchema >;