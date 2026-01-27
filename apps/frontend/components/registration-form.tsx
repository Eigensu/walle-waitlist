"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { PaymentModal } from "@/components/payment-modal";
import { Stepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  createOrder,
  getPlayerDetails,
  registerPlayer,
  updatePlayer,
  verifyPayment,
  type CreateOrderResponse,
} from "@/lib/api";
import { type PlayerFormValues } from "@/lib/validators";
import { PersonalDetailsStep } from "@/components/registration-steps/personal-details-step";
import { CricketDetailsStep } from "@/components/registration-steps/cricket-details-step";
import { JerseyDetailsStep } from "@/components/registration-steps/jersey-details-step";
import { JyplSeasonStep } from "@/components/registration-steps/jypl-season-step";
import { PaymentStep } from "@/components/registration-steps/payment-step";
import { ConfirmationStep } from "@/components/registration-steps/confirmation-step";

const steps = [
  {
    id: "details",
    label: "Personal Details",
    helper: "Your information & documents",
  },
  { id: "cricket", label: "Cricket Details", helper: "Your cricket profile" },
  { id: "jersey", label: "Jersey Details", helper: "Jersey & size info" },
  { id: "jypl7", label: "JYPL 8 Details", helper: "Season 8 history" },
  { id: "payment", label: "Payment", helper: "Complete registration" },
  {
    id: "done",
    label: "Confirmation",
    helper: "You’re all set",
  },
];

type PaymentStatus = "idle" | "processing" | "paid" | "failed";

type StatusMessage = { kind: "success" | "error"; text: string } | null;

export function RegistrationForm({
  resumePlayerId,
}: {
  resumePlayerId?: string | null;
}) {
  const form = useForm<PlayerFormValues>({
    mode: "onChange",
    defaultValues: {
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
  const [registrationStatus, setRegistrationStatus] = useState<string>("PAID");
  const [loadingPlayerData, setLoadingPlayerData] = useState(false);

  // Handle resume payment - load player data and jump to payment step
  useEffect(() => {
    const loadPlayerData = async () => {
      if (!resumePlayerId) return;

      setLoadingPlayerData(true);
      try {
        const playerData = await getPlayerDetails(resumePlayerId);

        // Populate form with player data
        form.reset({
          first_name: playerData.first_name,
          last_name: playerData.last_name,
          email: playerData.email,
          phone: playerData.phone,
          residential_area: playerData.residential_area,
          firm_name: playerData.firm_name,
          designation: playerData.designation,
          batting_type: playerData.batting_type,
          bowling_type: playerData.bowling_type,
          wicket_keeper: playerData.wicket_keeper,
          name_on_jersey: playerData.name_on_jersey,
          tshirt_size: playerData.tshirt_size,
          waist_size: playerData.waist_size,
          played_jypl_s7: playerData.played_jypl_s7,
          jypl_s7_team: playerData.jypl_s7_team,
          photo: playerData.photo_url,
          visiting_card: playerData.visiting_card_url,
        });

        setPlayerId(resumePlayerId);
        setStepIndex(4); // Jump to payment step (index 4)
        setStatusMessage({
          kind: "success",
          text: "Welcome back! Complete your payment to finish registration.",
        });
      } catch (error) {
        setStatusMessage({
          kind: "error",
          text:
            error instanceof Error
              ? error.message
              : "Failed to load player data",
        });
      } finally {
        setLoadingPlayerData(false);
      }
    };

    loadPlayerData();
  }, [resumePlayerId, form]);

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
      if (!values.played_jypl_s7) missing.push("Played JYPL S8");
      if (values.played_jypl_s7 === "yes" && !values.jypl_s7_team) {
        missing.push("JYPL S8 team");
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

      // Check if we're updating an existing player or creating a new one
      let response;
      if (playerId) {
        // Update existing player
        response = await updatePlayer(playerId, formData);
      } else {
        // Register new player
        response = await registerPlayer(formData);
        setPlayerId(response.player_id);
      }

      setStatusMessage({
        kind: "success",
        text: response.message || "Details saved",
      });

      if (response.status === "WAITLIST") {
        setRegistrationStatus("WAITLIST");
        // Skip payment step and go to confirmation
        setStepIndex(steps.length - 1);
      } else {
        setRegistrationStatus("PAID");
        // Advance to payment step
        setStepIndex((prev) => prev + 1);
      }
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
          text: "Please select whether you played in JYPL season 8",
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

    // 1. Disable button immediately for visual feedback
    setSubmitting(true);
    setStatusMessage(null);
    setPaymentStatus("processing");

    try {
      // 2. This is the "3-5 second" wait - user sees spinner on button
      const created = await createOrder(playerId);
      setOrder(created);

      // 3. Reset submitting BEFORE opening modal so button appears normal again
      setSubmitting(false);

      // 4. Modal opens with pre-filled data
      setModalOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unable to create payment order";
      setStatusMessage({ kind: "error", text: message });
      setPaymentStatus("failed");
      // 4. Reset loading state on error so user can retry
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
      setStepIndex(steps.length - 1);
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

  const firstName = form.watch("first_name");
  const lastName = form.watch("last_name");
  const email = form.watch("email");
  const phone = form.watch("phone");

  const summary = useMemo(
    () => ({
      name: `${firstName} ${lastName}`.trim(),
      email,
      phone,
    }),
    [firstName, lastName, email, phone],
  );

  // Show loading state while fetching player data
  if (loadingPlayerData) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Loading your registration details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Stepper steps={steps} activeIndex={displayStepIndex} />

      <Form {...form}>
        <form className="space-y-6" onSubmit={handlePersonalSubmit}>
          {currentStepId === "details" && (
            <PersonalDetailsStep form={form} fieldClass={fieldClass} />
          )}

          {currentStepId === "cricket" && <CricketDetailsStep form={form} />}

          {currentStepId === "jersey" && (
            <JerseyDetailsStep form={form} fieldClass={fieldClass} />
          )}

          {currentStepId === "jypl7" && <JyplSeasonStep form={form} />}

          {currentStepId === "payment" && (
            <PaymentStep
              playerName={summary.name}
              order={order}
              onEditDetails={() => setStepIndex(0)}
            />
          )}

          {currentStepId === "done" && (
            <ConfirmationStep playerId={playerId} status={registrationStatus} />
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
                    className="h-5 w-5 text-green-600"
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
                    className="h-5 w-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
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
              <Button
                type="button"
                onClick={startPayment}
                disabled={submitting || paymentStatus === "processing"}
                className="bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200 disabled:bg-slate-400 disabled:cursor-not-allowed dark:shadow-none dark:disabled:bg-slate-600"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    <span>Processing Order...</span>
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
        onClose={() => {
          setModalOpen(false);
          setPaymentStatus("idle");
          setSubmitting(false);
        }}
        order={order}
        playerName={summary.name}
        contact={{ email: summary.email, phone: summary.phone }}
        onSuccess={handlePaymentSuccess}
        onFailure={(msg) => setStatusMessage({ kind: "error", text: msg })}
        onDismiss={() => {
          setModalOpen(false);
          setPaymentStatus("idle");
          setSubmitting(false);
        }}
      />
    </div>
  );
}
