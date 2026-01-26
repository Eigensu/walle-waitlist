import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type PlayerFormValues } from "@/lib/validators";

type JyplSeasonStepProps = {
  form: UseFormReturn<PlayerFormValues>;
};

export function JyplSeasonStep({ form }: JyplSeasonStepProps) {
  const yesNoOptions = ["Yes", "No"];
  const jyplTeams = [
    "Auric Allstars",
    "Jewelhouse Heroes",
    "SS Lions",
    "BVC Champions",
    "Aspect India",
    "Aarya 24kt Royal Rangers",
    "Presto Gems Rising Stars",
    "MK Shershahs",
    "Lotus Bullion Kings",
    "JewelBuzz Sunrisers",
    "AX Logistics",
    "Mantr Mavericks",
    "Skygold Risers",
    "Shanti Hallmakers 11",
    "VMC Titans",
    "DJ Warriors",
    "RCB",
    "Dintara Diamonds",
    "Sheaura Stars",
    "Shankesh Superkings",
  ];

  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="played_jypl_s7"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-base font-semibold">
              Have you played in season 8, 2025?
            </FormLabel>
            <FormControl>
              <div className="grid gap-3 sm:grid-cols-2">
                {yesNoOptions.map((option) => (
                  <div
                    key={option}
                    className={`cursor-pointer rounded-lg border-2 px-4 py-3 text-center transition-all ${
                      field.value === option.toLowerCase()
                        ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100"
                        : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-600"
                    }`}
                    onClick={() => field.onChange(option.toLowerCase())}
                  >
                    <input
                      type="radio"
                      id={`played_${option}`}
                      value={option.toLowerCase()}
                      checked={field.value === option.toLowerCase()}
                      onChange={field.onChange}
                      className="sr-only"
                    />
                    <label
                      htmlFor={`played_${option}`}
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

      {form.watch("played_jypl_s7") === "yes" && (
        <FormField
          control={form.control}
          name="jypl_s7_team"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                If yes, which team?
              </FormLabel>
              <FormControl>
                <div className="grid gap-3 sm:grid-cols-2">
                  {jyplTeams.map((team) => (
                    <div
                      key={team}
                      className={`cursor-pointer rounded-lg border-2 px-4 py-3 transition-all ${
                        field.value === team
                          ? "border-blue-600 bg-blue-50 text-blue-900 dark:border-blue-500 dark:bg-blue-950/40 dark:text-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-300 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-blue-600"
                      }`}
                      onClick={() => field.onChange(team)}
                    >
                      <input
                        type="radio"
                        id={`team_${team}`}
                        value={team}
                        checked={field.value === team}
                        onChange={field.onChange}
                        className="sr-only"
                      />
                      <label
                        htmlFor={`team_${team}`}
                        className="cursor-pointer text-slate-700 dark:text-slate-300"
                      >
                        {team}
                      </label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
