"use client";

import { useMemo, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useForm } from "react-hook-form";

import { PaymentModal } from "@/components/payment-modal";
import { RulesNotice } from "@/components/rules-notice";
import { Stepper } from "@/components/stepper";
import { FileUpload } from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createOrder,
  registerPlayer,
  verifyPayment,
  type CreateOrderResponse,
} from "@/lib/api";
import { fileConstraints, type PlayerFormValues } from "@/lib/validators";

const steps = [
  {
    id: "details",
    label: "Personal Details",
    helper: "Your information & documents",
  },
  { id: "cricket", label: "Cricket Details", helper: "Your cricket profile" },
  { id: "jersey", label: "Jersey Details", helper: "Jersey & size info" },
  { id: "jypl7", label: "JYPL 7 Details", helper: "Season 7 history" },
  { id: "payment", label: "Payment", helper: "Complete registration" },
  {
    id: "done",
    label: "Confirmation",
    helper: "You’re all set",
  },
];

type PaymentStatus = "idle" | "processing" | "paid" | "failed";

type StatusMessage = { kind: "success" | "error"; text: string } | null;

export function RegistrationForm() {
  const form = useForm<PlayerFormValues>({
    mode: "onChange",
    defaultValues: {
      played_before: "",
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      residential_area: "",
      firm_name: "",
      designation: "",
      batting_type: "",
      bowling_type: "",
      wicket_keeper: "",
      name_on_jersey: "",
      tshirt_size: "",
      waist_size: 0,
      played_jypl_s7: "",
      jypl_s7_team: "",
      photo: null,
      visiting_card: null,
    },
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [order, setOrder] = useState<CreateOrderResponse | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<StatusMessage>(null);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle");
  const [submitting, setSubmitting] = useState(false);

  const displayStepIndex = Math.min(stepIndex, steps.length - 1);
  const currentStepId =
    stepIndex >= steps.length ? "done" : steps[stepIndex].id;
  const fieldClass =
    "h-12 rounded-lg border-slate-200 bg-white/80 px-4 text-slate-900 placeholder:text-slate-400 shadow-sm focus-visible:border-blue-400 focus-visible:ring-blue-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-white dark:placeholder:text-slate-400 dark:focus-visible:border-blue-500 dark:focus-visible:ring-blue-900/40";

  const handlePersonalSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    const values = form.getValues();

    const missing = [] as string[];
    if (!values.played_before) missing.push("Played before");
    if (!values.first_name) missing.push("First name");
    if (!values.last_name) missing.push("Last name");
    if (!values.email) missing.push("Email");
    if (!values.phone) missing.push("Phone");
    if (!values.residential_area) missing.push("Residential area");
    if (!values.firm_name) missing.push("Firm name");
    if (!values.designation) missing.push("Designation");
    if (!(values.photo instanceof File)) missing.push("Photo");
    if (!(values.visiting_card instanceof File)) missing.push("Visiting card");

    if (missing.length) {
      setStatusMessage({
        kind: "error",
        text: `Please fill: ${missing.join(", ")}`,
      });
      return;
    }

    setStepIndex((prev) => prev + 1);
  };

  const submitDetails = async () => {
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const values = form.getValues();

      // Validate all required fields before saving to DB
      const missing = [] as string[];
      // Personal
      if (!values.played_before) missing.push("Played before");
      if (!values.first_name) missing.push("First name");
      if (!values.last_name) missing.push("Last name");
      if (!values.email) missing.push("Email");
      if (!values.phone) missing.push("Phone");
      if (!values.residential_area) missing.push("Residential area");
      if (!values.firm_name) missing.push("Firm name");
      if (!values.designation) missing.push("Designation");
      if (!(values.photo instanceof File)) missing.push("Photo");
      if (!(values.visiting_card instanceof File))
        missing.push("Visiting card");
      // Cricket
      if (!values.batting_type) missing.push("Batting type");
      if (!values.bowling_type) missing.push("Bowling type");
      if (!values.wicket_keeper) missing.push("Wicket keeper");
      // Jersey
      if (!values.name_on_jersey) missing.push("Name on jersey");
      if (!values.tshirt_size) missing.push("T-shirt size");
      if (
        !values.waist_size ||
        values.waist_size < 20 ||
        values.waist_size > 60
      ) {
        missing.push("Waist size (20-60)");
      }
      // JYPL7
      if (!values.played_jypl_s7) missing.push("Played JYPL S7");
      if (values.played_jypl_s7 === "yes" && !values.jypl_s7_team) {
        missing.push("JYPL S7 team");
      }

      if (missing.length) {
        setStatusMessage({
          kind: "error",
          text: `Please fill: ${missing.join(", ")}`,
        });
        setSubmitting(false);
        return;
      }

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value === null || value === undefined) return; // skip empty optional fields
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const response = await registerPlayer(formData);
      setPlayerId(response.player_id);
      setStatusMessage({
        kind: "success",
        text: response.message || "Details saved",
      });
      // Advance to payment step after successful submission
      setStepIndex((prev) => prev + 1);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to submit details";
      setStatusMessage({ kind: "error", text: message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleNextStep = () => {
    setStatusMessage(null);
    // Validate current step before proceeding
    const values = form.getValues();
    let isStepValid = true;

    if (currentStepId === "cricket") {
      if (!values.batting_type) {
        setStatusMessage({
          kind: "error",
          text: "Please select your batting type",
        });
        isStepValid = false;
      } else if (!values.bowling_type) {
        setStatusMessage({
          kind: "error",
          text: "Please select your bowling type",
        });
        isStepValid = false;
      } else if (!values.wicket_keeper) {
        setStatusMessage({
          kind: "error",
          text: "Please select whether you can keep wickets",
        });
        isStepValid = false;
      }
    } else if (currentStepId === "jersey") {
      if (!values.name_on_jersey) {
        setStatusMessage({ kind: "error", text: "Name on jersey is required" });
        isStepValid = false;
      } else if (!values.tshirt_size) {
        setStatusMessage({
          kind: "error",
          text: "Please select a t-shirt size",
        });
        isStepValid = false;
      } else if (
        !values.waist_size ||
        values.waist_size < 20 ||
        values.waist_size > 60
      ) {
        setStatusMessage({
          kind: "error",
          text: "Waist size must be between 20-60",
        });
        isStepValid = false;
      }
    } else if (currentStepId === "jypl7") {
      if (!values.played_jypl_s7) {
        setStatusMessage({
          kind: "error",
          text: "Please select whether you played in JYPL season 7",
        });
        isStepValid = false;
      } else if (values.played_jypl_s7 === "yes" && !values.jypl_s7_team) {
        setStatusMessage({ kind: "error", text: "Please select a team" });
        isStepValid = false;
      }
    }

    if (isStepValid) {
      setStepIndex((prev) => prev + 1);
    }
  };

  const startPayment = async () => {
    if (!playerId) return;
    setSubmitting(true);
    setStatusMessage(null);
    setPaymentStatus("processing");

    try {
      const created = await createOrder(playerId);
      setOrder(created);
      setModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create payment order";
      setStatusMessage({ kind: "error", text: message });
      setPaymentStatus("failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (payload: {
    razorpay_payment_id: string;
    razorpay_order_id: string;
    razorpay_signature: string;
  }) => {
    if (!playerId) return;
    setSubmitting(true);
    setStatusMessage(null);

    try {
      const result = await verifyPayment({ player_id: playerId, ...payload });
      setStatusMessage({ kind: "success", text: result.message });
      setPaymentStatus("paid");
      setStepIndex(2);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Payment verification failed";
      setStatusMessage({ kind: "error", text: message });
      setPaymentStatus("failed");
    } finally {
      setSubmitting(false);
      setModalOpen(false);
    }
  };

  const resetForm = () => {
    form.reset();
    setStepIndex(0);
    setPlayerId(null);
    setOrder(null);
    setPaymentStatus("idle");
    setStatusMessage(null);
  };

  const isCurrentStepValid = () => {
    const values = form.getValues();

    if (currentStepId === "details") {
      return (
        values.played_before &&
        values.first_name &&
        values.last_name &&
        values.email &&
        values.phone &&
        values.residential_area &&
        values.firm_name &&
        values.designation &&
        (values.photo instanceof File || !!values.photo) &&
        (values.visiting_card instanceof File || !!values.visiting_card)
      );
    } else if (currentStepId === "cricket") {
      return values.batting_type && values.bowling_type && values.wicket_keeper;
    } else if (currentStepId === "jersey") {
      return (
        values.name_on_jersey &&
        values.tshirt_size &&
        values.waist_size &&
        values.waist_size >= 20 &&
        values.waist_size <= 60
      );
    } else if (currentStepId === "jypl7") {
      return (
        values.played_jypl_s7 &&
        (values.played_jypl_s7 === "no" ||
          (values.played_jypl_s7 === "yes" && values.jypl_s7_team))
      );
    }
    return true;
  };

  // Keep CTA clickable unless actually submitting to avoid dead-buttons.
  const isStepDisabled = submitting;

  const summary = useMemo(
    () => ({
      name: `${form.watch("first_name")} ${form.watch("last_name")}`.trim(),
      email: form.watch("email"),
      phone: form.watch("phone"),
    }),
    [form],
  );

  return (
    <div className="space-y-8">
      <Stepper steps={steps} activeIndex={displayStepIndex} />

      <Form {...form}>
        <form className="space-y-6" onSubmit={handlePersonalSubmit}>
          {currentStepId === "details" && (
            <div className="space-y-6">
              <RulesNotice />
              <FormField
                control={form.control}
                name="played_before"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Have you played at JYPL before?
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id="yes"
                            value="yes"
                            checked={field.value === "yes"}
                            onChange={() => field.onChange("yes")}
                            className="h-5 w-5 cursor-pointer border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="yes"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id="no"
                            value="no"
                            checked={field.value === "no"}
                            onChange={() => field.onChange("no")}
                            className="h-5 w-5 cursor-pointer border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="no"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input
                          className={fieldClass}
                          placeholder="John"
                          {...field}
                        />
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
                        <Input
                          className={fieldClass}
                          placeholder="Doe"
                          {...field}
                        />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          className={fieldClass}
                          placeholder="+919876543210"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        E.164 format (country code required)
                      </FormDescription>
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
                          placeholder="Bandra West, Mumbai"
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
                      <FormLabel>Firm / company</FormLabel>
                      <FormControl>
                        <Input
                          className={fieldClass}
                          placeholder="Acme Corporation"
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
                      <FormLabel>Designation</FormLabel>
                      <FormControl>
                        <Input
                          className={fieldClass}
                          placeholder="Senior Manager"
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
                          label="Photo (JPG/PNG)"
                          description="Max 5MB"
                          accept={fileConstraints.photoMimes.join(",")}
                          value={field.value ?? null}
                          onChange={(file) => field.onChange(file)}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
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
                          label="Visiting card (JPG/PNG/PDF)"
                          description="Max 5MB"
                          accept={fileConstraints.cardMimes.join(",")}
                          value={field.value ?? null}
                          onChange={(file) => field.onChange(file)}
                          error={fieldState.error?.message}
                        />
                      </FormControl>
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
          )}

          {currentStepId === "cricket" && (
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="right_hand"
                            checked={field.value === "right"}
                            onChange={() =>
                              field.onChange(
                                field.value === "right" ? "" : "right",
                              )
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="right_hand"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Right Hand Batsman
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="left_hand"
                            checked={field.value === "left"}
                            onChange={() =>
                              field.onChange(
                                field.value === "left" ? "" : "left",
                              )
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="left_hand"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Left Hand Batsman
                          </label>
                        </div>
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="right_arm"
                            checked={field.value === "right"}
                            onChange={() =>
                              field.onChange(
                                field.value === "right" ? "" : "right",
                              )
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="right_arm"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Right Arm
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="left_arm"
                            checked={field.value === "left"}
                            onChange={() =>
                              field.onChange(
                                field.value === "left" ? "" : "left",
                              )
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="left_arm"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Left Arm
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="not_applicable"
                            checked={field.value === "not_applicable"}
                            onChange={() =>
                              field.onChange(
                                field.value === "not_applicable"
                                  ? ""
                                  : "not_applicable",
                              )
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="not_applicable"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Not Applicable
                          </label>
                        </div>
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
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="wk_yes"
                            checked={field.value === "yes"}
                            onChange={() =>
                              field.onChange(field.value === "yes" ? "" : "yes")
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="wk_yes"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="wk_no"
                            checked={field.value === "no"}
                            onChange={() =>
                              field.onChange(field.value === "no" ? "" : "no")
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="wk_no"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStepId === "jersey" && (
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
                      <select
                        {...field}
                        className={fieldClass + " cursor-pointer"}
                      >
                        <option value="">Select size</option>
                        <option value="xs">XS</option>
                        <option value="s">S</option>
                        <option value="m">M</option>
                        <option value="l">L</option>
                        <option value="xl">XL</option>
                        <option value="xxl">XXL</option>
                      </select>
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
                      <input
                        {...field}
                        type="number"
                        placeholder="e.g., 42"
                        min="20"
                        max="60"
                        className={fieldClass}
                      />
                    </FormControl>
                    <FormDescription>In inches (20-60)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {currentStepId === "jypl7" && (
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="played_jypl_s7"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-semibold">
                      Have you played in JYPL season 7, 2024?
                    </FormLabel>
                    <FormControl>
                      <div className="flex gap-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="jypl7_yes"
                            checked={field.value === "yes"}
                            onChange={() =>
                              field.onChange(field.value === "yes" ? "" : "yes")
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="jypl7_yes"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            Yes
                          </label>
                        </div>
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="jypl7_no"
                            checked={field.value === "no"}
                            onChange={() =>
                              field.onChange(field.value === "no" ? "" : "no")
                            }
                            className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
                          />
                          <label
                            htmlFor="jypl7_no"
                            className="cursor-pointer text-slate-700 dark:text-slate-300"
                          >
                            No
                          </label>
                        </div>
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
                        <div className="space-y-3">
                          {[
                            "Aarya 24kt Royal Rangers",
                            "Abhushan Warriors",
                            "Auric Allstars",
                            "AX Logistics",
                            "BVC Champions",
                            "Bullion India",
                            "DJ Warriors",
                            "Jewel House Heroes",
                            "Jewelbuzz Sunrisers",
                            "Mantr Mavericks",
                            "Master Blasters",
                          ].map((team) => (
                            <div key={team} className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                id={`team_${team}`}
                                checked={field.value === team}
                                onChange={() =>
                                  field.onChange(
                                    field.value === team ? "" : team,
                                  )
                                }
                                className="h-5 w-5 cursor-pointer rounded border-2 border-slate-300 accent-blue-600 dark:border-slate-600"
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
          )}

          {currentStepId === "payment" && (
            <div className="space-y-6">
              <div className="rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6 shadow-lg dark:border-blue-900/40 dark:from-blue-950/20 dark:via-slate-800/30 dark:to-slate-800/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-white">
                      Player Name
                    </p>
                    <p className="mt-1 text-lg font-semibold text-blue-900 dark:text-white">
                      {summary.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-white">
                      Registration Fee
                    </p>
                    <p className="mt-1 text-3xl font-bold text-blue-900 dark:text-white">
                      ₹
                      {order ? (order.amount / 100).toLocaleString() : "12,500"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border-2 border-blue-200 bg-blue-50/50 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white dark:bg-blue-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div className="text-sm">
                    <p className="font-semibold text-blue-900 dark:text-white">
                      Ready to complete payment
                    </p>
                    <p className="mt-1 text-blue-700 dark:text-white">
                      Click proceed to open the secure Razorpay checkout. You
                      will return here for confirmation after payment.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStepId === "done" && (
            <div className="rounded-2xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-6 shadow-lg dark:border-green-900/40 dark:from-green-950/20 dark:to-slate-800/30">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-green-600 text-white shadow-lg shadow-green-200 dark:shadow-green-950/60">
                  <svg
                    className="h-8 w-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold text-green-900 dark:text-white">
                    Payment Confirmed!
                  </p>
                  <p className="mt-1 text-green-700 dark:text-white">
                    Thank you for registering with Walle Arena. Your spot is
                    confirmed and we've received your payment.
                  </p>
                  <p className="mt-3 text-sm text-green-600 dark:text-white">
                    Player ID:{" "}
                    <span className="font-mono font-semibold">{playerId}</span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {statusMessage ? (
            <div
              className={`rounded-xl border-2 px-4 py-3 text-sm font-medium ${
                statusMessage.kind === "success"
                  ? "border-green-200 bg-green-50 text-green-900"
                  : "border-red-200 bg-red-50 text-red-900"
              }`}
            >
              <div className="flex items-center gap-2">
                {statusMessage.kind === "success" ? (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                )}
                <span>{statusMessage.text}</span>
              </div>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-4 pt-4">
            {(currentStepId === "details" ||
              currentStepId === "cricket" ||
              currentStepId === "jersey" ||
              currentStepId === "jypl7") && (
              <>
                {stepIndex > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStepIndex(stepIndex - 1)}
                    className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 dark:shadow-none"
                  >
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 17l-5-5m0 0l5-5m-5 5h12"
                      />
                    </svg>
                    Back
                  </Button>
                )}
                <Button
                  type={currentStepId === "details" ? "submit" : "button"}
                  onClick={
                    currentStepId === "details"
                      ? undefined
                      : currentStepId === "jypl7"
                        ? submitDetails
                        : handleNextStep
                  }
                  disabled={isStepDisabled}
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      <span>
                        {currentStepId === "details"
                          ? "Saving..."
                          : "Loading..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentStepId === "jypl7"
                          ? "Complete & Continue to Payment"
                          : "Next"}
                      </span>
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </>
                  )}
                </Button>
              </>
            )}

            {currentStepId === "payment" && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStepIndex(3)}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 dark:shadow-none"
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 17l-5-5m0 0l5-5m-5 5h12"
                    />
                  </svg>
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={startPayment}
                  disabled={submitting || paymentStatus === "processing"}
                  className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>Proceed to Payment</span>
                      <svg
                        className="ml-2 h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </>
                  )}
                </Button>
              </>
            )}

            {currentStepId === "done" && (
              <Button
                type="button"
                onClick={resetForm}
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 dark:shadow-none"
              >
                Register Another Player
              </Button>
            )}
          </div>
        </form>
      </Form>

      <PaymentModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        order={order}
        playerName={summary.name}
        contact={{ email: summary.email, phone: summary.phone }}
        onSuccess={handlePaymentSuccess}
        onFailure={(msg) => setStatusMessage({ kind: "error", text: msg })}
      />
    </div>
  );
}
