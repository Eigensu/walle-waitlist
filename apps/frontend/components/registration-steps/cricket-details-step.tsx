import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type PlayerFormValues } from "@/lib/validators";

type CricketDetailsStepProps = {
  form: UseFormReturn<PlayerFormValues>;
};

export function CricketDetailsStep({ form }: CricketDetailsStepProps) {
  const battingTypes = ["Right-Hand", "Left-Hand"];
  const bowlingTypes = [
    "Right Arm Fast",
    "Left Arm Fast",
    "Right Arm Medium",
    "Left Arm Medium",
    "Right Arm Spin (Off)",
    "Right Arm Spin (Leg)",
    "Left Arm Spin (Orthodox)",
    "Left Arm Spin (Chinaman)",
    "Non-Bowler",
  ];
  const wicketKeeperOptions = ["Yes", "No"];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="batting_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Batting Type
            </FormLabel>
            <FormControl>
              <div className="grid gap-3 sm:grid-cols-2">
                {battingTypes.map((type) => (
                  <div
                    key={type}
                    className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-all ${
                      field.value === type
                        ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-600"
                    }`}
                    onClick={() => field.onChange(type)}
                  >
                    <input
                      type="radio"
                      id={`batting_${type}`}
                      value={type}
                      checked={field.value === type}
                      onChange={field.onChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`batting_${type}`}
                      className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                    >
                      {type}
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
        name="bowling_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Bowling Type
            </FormLabel>
            <FormControl>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {bowlingTypes.map((type) => (
                  <div
                    key={type}
                    className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-all ${
                      field.value === type
                        ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-600"
                    }`}
                    onClick={() => field.onChange(type)}
                  >
                    <input
                      type="radio"
                      id={`bowling_${type}`}
                      value={type}
                      checked={field.value === type}
                      onChange={field.onChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`bowling_${type}`}
                      className="cursor-pointer text-sm font-medium text-slate-700 dark:text-slate-300"
                    >
                      {type}
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
        name="wicket_keeper"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Wicket Keeper
            </FormLabel>
            <FormControl>
              <div className="grid gap-3 sm:grid-cols-2">
                {wicketKeeperOptions.map((option) => (
                  <div
                    key={option}
                    className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-all ${
                      field.value === option
                        ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-600"
                    }`}
                    onClick={() => field.onChange(option)}
                  >
                    <input
                      type="radio"
                      id={`keeper_${option}`}
                      value={option}
                      checked={field.value === option}
                      onChange={field.onChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`keeper_${option}`}
                      className="cursor-pointer font-medium text-slate-700 dark:text-slate-300"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
