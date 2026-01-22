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

export const playerSchema = z.object({
  first_name: baseString.min(2, "First name must have at least 2 characters"),
  last_name: baseString.min(2, "Last name must have at least 2 characters"),
  email: baseString.email("Enter a valid email"),
  phone: baseString.regex(
    /^\+?[1-9]\d{1,14}$/,
    "Enter phone in E.164 format (e.g. +911234567890)"
  ),
  residential_area: baseString.min(2, "Residential area is required"),
  firm_name: baseString.min(2, "Firm name is required"),
  designation: baseString.min(2, "Designation is required"),
  photo: fileSchema(PHOTO_MIMES),
  visiting_card: fileSchema(CARD_MIMES),
});

export type PlayerFormValues = z.infer<typeof playerSchema>;

export const fileConstraints = {
  maxBytes: FILE_MAX_BYTES,
  photoMimes: PHOTO_MIMES,
  cardMimes: CARD_MIMES,
};
