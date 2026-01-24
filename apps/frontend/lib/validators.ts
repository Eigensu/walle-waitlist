import { z } from "zod";

const FILE_MAX_BYTES = 5 * 1024 * 1024;
const PHOTO_MIMES = ["image/jpeg", "image/png"] as const;
const CARD_MIMES = ["image/jpeg", "image/png", "application/pdf"] as const;

const baseString = z.string().trim();

const fileSchema = (allowed: readonly string[]) =>
  z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine((file) => file.size <= FILE_MAX_BYTES, "File must be under 5MB")
    .refine(
      (file) => allowed.includes(file.type),
      `Unsupported file type. Allowed: ${allowed.join(", ")}`
    );

// Extremely permissive schema so UI validation controls the flow; prevents RHF
// resolver from blocking submit when any optional field is empty.
export const playerSchema = z.object({
  played_before: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z.string(),
  residential_area: z.string(),
  firm_name: z.string(),
  designation: z.string(),
  batting_type: z.string(),
  bowling_type: z.string(),
  wicket_keeper: z.string(),
  name_on_jersey: z.string(),
  tshirt_size: z.string(),
  waist_size: z.number(),
  played_jypl_s7: z.string(),
  jypl_s7_team: z.string(),
  photo: z.instanceof(File).nullable(),
  visiting_card: z.instanceof(File).nullable(),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;

export const fileConstraints = {
  maxBytes: FILE_MAX_BYTES,
  photoMimes: PHOTO_MIMES,
  cardMimes: CARD_MIMES,
};
