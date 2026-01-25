import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type PlayerFormValues } from "@/lib/validators";

type JerseyDetailsStepProps = {
  form: UseFormReturn<PlayerFormValues>;
  fieldClass: string;
};

export function JerseyDetailsStep({
  form,
  fieldClass,
}: JerseyDetailsStepProps) {
  const tshirtSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const waistOptions = [28, 30, 32, 34, 36, 38, 40, 42];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="name_on_jersey"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name on Jersey</FormLabel>
            <FormControl>
              <input
                {...field}
                type="text"
                placeholder="Your jersey name (max 15 chars)"
                maxLength={15}
                className={fieldClass}
              />
            </FormControl>
            <FormDescription>Max 15 characters</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="tshirt_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>T-Shirt Size</FormLabel>
            <FormControl>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                {tshirtSizes.map((size) => (
                  <div
                    key={size}
                    className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-all ${
                      field.value === size
                        ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-600"
                    }`}
                    onClick={() => field.onChange(size)}
                  >
                    <input
                      type="radio"
                      id={`size_${size}`}
                      value={size}
                      checked={field.value === size}
                      onChange={field.onChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`size_${size}`}
                      className="cursor-pointer font-bold text-slate-700 dark:text-slate-300"
                    >
                      {size}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="waist_size"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Waist Size</FormLabel>
            <FormControl>
              <select {...field} className={`${fieldClass} cursor-pointer`}>
                <option value="">Select waist size</option>
                {waistOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormDescription>
              Select from standard sizes (in inches)
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
