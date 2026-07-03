import { z } from "zod";

export const LinkSchema = z.object({
  name: z.string().min(1).max(255),
  destinationUrl: z.string().url(),
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
  domain: z.string().optional(),
  rotatorMode: z.enum(["turbo", "slow"]),
  note: z.string().optional(),
});