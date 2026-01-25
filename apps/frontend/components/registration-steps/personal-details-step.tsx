import { ShieldCheck } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/file-upload";
import { RulesNotice } from "@/components/rules-notice";
import { type PlayerFormValues } from "@/lib/validators";

type PersonalDetailsStepProps = {
  form: UseFormReturn<PlayerFormValues>;
  fieldClass: string;
};

export function PersonalDetailsStep({
  form,
  fieldClass,
}: PersonalDetailsStepProps) {
  return (
    <div className="space-y-6">
      <RulesNotice />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="first_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>First name</FormLabel>
              <FormControl>
                <Input className={fieldClass} placeholder="John" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="last_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last name</FormLabel>
              <FormControl>
                <Input className={fieldClass} placeholder="Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  className={fieldClass}
                  placeholder="you@example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <select
                    className={`${fieldClass} w-24 cursor-pointer`}
                    defaultValue="+91"
                  >
                    <option value="+91">+91</option>
                    <option value="+1">+1</option>
                    <option value="+44">+44</option>
                    <option value="+971">+971</option>
                  </select>
                  <Input
                    className={fieldClass}
                    placeholder="9876543210"
                    maxLength={10}
                    type="tel"
                    {...field}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      field.onChange(value);
                    }}
                  />
                </div>
              </FormControl>
              <FormDescription>Enter 10-digit mobile number</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="residential_area"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Residential area</FormLabel>
              <FormControl>
                <Input
                  className={fieldClass}
                  placeholder="City name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="firm_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Firm / Organization name</FormLabel>
              <FormControl>
                <Input
                  className={fieldClass}
                  placeholder="Company name"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="designation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation / Role</FormLabel>
              <FormControl>
                <Input
                  className={fieldClass}
                  placeholder="Your role"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="photo"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FileUpload
                  label="Passport-size photo"
                  description="JPG/PNG/HEIC/HEIF up to 10MB"
                  accept="image/*"
                  value={field.value instanceof File ? field.value : null}
                  onChange={(file) => field.onChange(file)}
                  error={fieldState.error?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="visiting_card"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <FileUpload
                  label="Visiting Card"
                  description="JPG/PNG/HEIC/HEIF/PDF up to 10MB"
                  accept="image/*,application/pdf"
                  value={field.value instanceof File ? field.value : null}
                  onChange={(file) => field.onChange(file)}
                  error={fieldState.error?.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center gap-3 rounded-xl border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-white px-4 py-3 text-sm dark:border-blue-900/40 dark:from-blue-950/40 dark:to-slate-800/40">
        <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400" />
        <span className="font-medium text-blue-700 dark:text-blue-300">
          Files are encrypted and stored securely
        </span>
      </div>
    </div>
  );
}
