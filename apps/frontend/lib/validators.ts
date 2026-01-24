import { z } from "zod";

const FILE_MAX_BYTES = 10 * 1024 * 1024;
const PHOTO_MIMES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
] as const;
const CARD_MIMES = [
  "image/jpeg",
  "image/png",
  "image/heic",
  "image/heif",
  "application/pdf",
] as const;


const fileSchema = (allowed: readonly string[]) =>
  z
    .instanceof(File)
    .refine((file) => file.size > 0, "File is required")
    .refine((file) => file.size <= FILE_MAX_BYTES, "File must be under 10MB")
    .refine(
      (file) => allowed.includes(file.type),
      `Unsupported file type. Allowed: ${allowed.join(", ")}`
    );

// Extremely permissive schema so UI validation controls the flow; prevents RHF
// resolver from blocking submit when any optional field is empty.
export const playerSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  email: z.string(),
  phone: z
    .string()
    .regex(/\d{10,}/, "Phone must have at least 10 digits"),
  residential_area: z.string(),
  firm_name: z.string(),
  designation: z.string(),
  batting_type: z.string(),
  bowling_type: z.string(),
  wicket_keeper: z.string(),
  name_on_jersey: z.string(),
  tshirt_size: z.string(),
  waist_size: z.coerce.number(),
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
