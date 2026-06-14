"use client";

import { FormEvent, MouseEvent, useMemo, useState } from "react";

type ContactFormProps = {
  buttonLabel: string;
  successMessage: string;
};

const goals = [
  "Lose body fat",
  "Build strength",
  "Improve energy",
  "Tone and shape",
  "Move without pain",
  "Train for an event",
];

const availability = ["Early morning", "Late morning", "Afternoon", "Evening", "Weekends", "Virtual sessions"];

const supplements = ["None", "Protein", "Creatine", "Pre-workout", "Vitamins", "Other"];

const trainingHistory = [
  "Brand new to training",
  "On and off for years",
  "Consistent but stuck",
  "Coming back after a break",
  "Experienced and want coaching",
];

const preferredStarts = ["This week", "Next week", "This month", "I am exploring options"];

const weeklySessions = ["1 session", "2 sessions", "3 sessions", "4+ sessions"];

const trainingPreferences = ["In-studio 1-on-1", "Virtual coaching", "Either is fine"];

const nutritionSupport = ["Yes, I want help with food habits", "Maybe, I want to learn more", "No, training only for now"];

const readiness = ["I am ready now", "I need a plan and accountability", "I have questions first"];

function checkedValues(formData: FormData, name: string) {
  return formData.getAll(name).map(String).filter(Boolean);
}

function hasValue(formData: FormData, name: string) {
  return String(formData.get(name) || "").trim().length > 0;
}

function hasChecked(formData: FormData, name: string) {
  return checkedValues(formData, name).length > 0;
}

function missingMessages(formData: FormData, step: number) {
  const messages: string[] = [];

  if (step === 0 && !hasChecked(formData, "goals")) {
    messages.push("Select at least one goal.");
  }

  if (step === 1 && !hasValue(formData, "motivation")) {
    messages.push("Answer what would feel different if you reached your goal.");
  }

  if (step === 2) {
    if (!hasValue(formData, "trainingHistory")) messages.push("Choose your fitness background.");
    if (!hasValue(formData, "healthHistory")) messages.push("Enter your health history, or type none.");
    if (!hasValue(formData, "injuries")) messages.push("Enter injuries or limitations, or type none.");
  }

  if (step === 3) {
    if (!hasChecked(formData, "availability")) messages.push("Select at least one available training time.");
    if (!hasValue(formData, "preferredStart")) messages.push("Choose when you want to start.");
    if (!hasValue(formData, "weeklySessions")) messages.push("Choose sessions per week.");
    if (!hasValue(formData, "trainingPreference")) messages.push("Choose a training preference.");
  }

  if (step === 4) {
    if (!hasValue(formData, "nutritionSupport")) messages.push("Choose whether you want nutrition support.");
    if (!hasChecked(formData, "supplements")) messages.push("Select at least one supplement option, including None.");
  }

  if (step === 5) {
    if (!hasValue(formData, "biggestObstacle")) messages.push("Answer what has made consistency hard.");
    if (!hasValue(formData, "readiness")) messages.push("Choose how ready you are to begin.");
    if (!hasValue(formData, "name")) messages.push("Enter your name.");
    if (!hasValue(formData, "phone")) messages.push("Enter your phone number.");
    if (!hasValue(formData, "email")) messages.push("Enter your email address.");
    if (!hasValue(formData, "message")) messages.push("Add anything else you want your trainer to know, or type none.");
  }

  return messages;
}

export default function ContactForm({ buttonLabel, successMessage }: ContactFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);

  const steps = useMemo(
    () => [
      "Your goals",
      "Your reason",
      "Your history",
      "Schedule",
      "Support",
      "Contact",
    ],
    [],
  );

  function validateStep(form: HTMLFormElement, step = currentStep) {
    const formData = new FormData(form);
    const missing = missingMessages(formData, step);
    const email = form.elements.namedItem("email");

    if (missing.length) {
      setStatus("error");
      setMessage(missing.join(" "));
      return false;
    }

    if (step === 5 && email instanceof HTMLInputElement && !email.checkValidity()) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return false;
    }

    setStatus("idle");
    setMessage("");
    return true;
  }

  function goNext(event: MouseEvent<HTMLButtonElement>) {
    const form = event.currentTarget.form;
    if (!form || !validateStep(form)) return;
    setCurrentStep((step) => Math.min(step + 1, steps.length - 1));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    for (let index = 0; index < steps.length; index += 1) {
      if (!validateStep(form, index)) {
        setCurrentStep(index);
        return;
      }
    }

    setStatus("sending");
    setMessage("");

    const formData = new FormData(form);

    const details = {
      contactName: formData.get("name"),
      contactPhone: formData.get("phone"),
      contactEmail: formData.get("email"),
      goals: checkedValues(formData, "goals"),
      motivation: formData.get("motivation"),
      trainingHistory: formData.get("trainingHistory"),
      healthHistory: formData.get("healthHistory"),
      injuries: formData.get("injuries"),
      availability: checkedValues(formData, "availability"),
      preferredStart: formData.get("preferredStart"),
      weeklySessions: formData.get("weeklySessions"),
      trainingPreference: formData.get("trainingPreference"),
      nutritionSupport: formData.get("nutritionSupport"),
      supplements: checkedValues(formData, "supplements"),
      biggestObstacle: formData.get("biggestObstacle"),
      readiness: formData.get("readiness"),
      trainerNotes: formData.get("message"),
    };

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        message: formData.get("message"),
        details,
      }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setStatus("error");
      setMessage(body?.error || "Something went wrong. Please try again.");
      return;
    }

    form.reset();
    setCurrentStep(0);
    setStatus("sent");
    setMessage(successMessage);
  }

  return (
    <form className="form intakeForm" onSubmit={handleSubmit}>
      <div className="intakeProgress" aria-label="Intake progress">
        {steps.map((step, index) => (
          <div
            aria-current={currentStep === index ? "step" : undefined}
            className={currentStep === index ? "active" : ""}
            key={step}
          >
            <span>{index + 1}</span>
            <strong>{step}</strong>
          </div>
        ))}
      </div>

      <fieldset className={currentStep === 0 ? "activeStep" : ""} hidden={currentStep !== 0}>
        <legend>What do you want to change?</legend>
        <p className="stepPrompt">Choose everything that feels true right now.</p>
        <div className="choiceGrid">
          {goals.map((goal) => (
            <label className="choiceCard" key={goal}>
              <input type="checkbox" name="goals" value={goal} />
              <span>{goal}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={currentStep === 1 ? "activeStep" : ""} hidden={currentStep !== 1}>
        <legend>What would feel different if you reached this goal?</legend>
        <p className="stepPrompt">A sentence or two is enough. This helps your trainer understand the real reason.</p>
        <textarea aria-label="Motivation" name="motivation" placeholder="Example: I want more energy, less pain, and confidence that I am training the right way." rows={6} />
      </fieldset>

      <fieldset className={currentStep === 2 ? "activeStep" : ""} hidden={currentStep !== 2}>
        <legend>Your fitness background</legend>
        <p className="stepPrompt">Pick the closest match, then add anything important about health or injuries.</p>
        <div className="choiceGrid">
          {trainingHistory.map((option) => (
            <label className="choiceCard" key={option}>
              <input type="radio" name="trainingHistory" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <textarea aria-label="Health history" name="healthHistory" placeholder="Anything in your health history we should know? Type none if not." rows={3} />
        <textarea aria-label="Injuries" name="injuries" placeholder="Past injuries, pain, surgeries, limitations, or movements you avoid. Type none if not." rows={3} />
      </fieldset>

      <fieldset className={currentStep === 3 ? "activeStep" : ""} hidden={currentStep !== 3}>
        <legend>Schedule and training style</legend>
        <p className="stepPrompt">Select the times that could realistically work for you.</p>
        <div className="choiceGrid">
          {availability.map((slot) => (
            <label className="choiceCard" key={slot}>
              <input type="checkbox" name="availability" value={slot} />
              <span>{slot}</span>
            </label>
          ))}
        </div>
        <p className="questionLabel">When do you want to start?</p>
        <div className="choiceGrid compactChoices">
          {preferredStarts.map((option) => (
            <label className="choiceCard" key={option}>
              <input type="radio" name="preferredStart" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <p className="questionLabel">Sessions per week</p>
        <div className="choiceGrid compactChoices">
          {weeklySessions.map((option) => (
            <label className="choiceCard" key={option}>
              <input type="radio" name="weeklySessions" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <p className="questionLabel">Training preference</p>
        <div className="choiceGrid compactChoices">
          {trainingPreferences.map((option) => (
            <label className="choiceCard" key={option}>
              <input type="radio" name="trainingPreference" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={currentStep === 4 ? "activeStep" : ""} hidden={currentStep !== 4}>
        <legend>Nutrition, supplements, and support</legend>
        <p className="questionLabel">Do you want nutrition support?</p>
        <div className="choiceGrid">
          {nutritionSupport.map((option) => (
            <label className="choiceCard" key={option}>
              <input type="radio" name="nutritionSupport" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <p className="questionLabel">Supplements you use or want to discuss</p>
        <div className="choiceGrid">
          {supplements.map((item) => (
            <label className="choiceCard" key={item}>
              <input type="checkbox" name="supplements" value={item} />
              <span>{item}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className={currentStep === 5 ? "activeStep" : ""} hidden={currentStep !== 5}>
        <legend>Last step: where should we reach you?</legend>
        <p className="stepPrompt">Almost done. Add your contact details so Phoenix Fitness can follow up.</p>
        <textarea aria-label="Biggest obstacle" name="biggestObstacle" placeholder="What has made this hard to stick with in the past?" rows={3} />
        <p className="questionLabel">How ready are you to begin?</p>
        <div className="choiceGrid">
          {readiness.map((option) => (
            <label className="choiceCard" key={option}>
              <input type="radio" name="readiness" value={option} />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <div className="formRow">
          <input aria-label="Name" name="name" placeholder="Name" />
          <input aria-label="Phone" name="phone" placeholder="Phone" />
        </div>
        <input aria-label="Email" name="email" type="email" placeholder="Email" />
        <textarea aria-label="Message" name="message" placeholder="Anything else you want your trainer to know?" rows={4} />
      </fieldset>

      <div className="intakeActions">
        <button
          className="secondaryFormButton"
          disabled={currentStep === 0 || status === "sending"}
          onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
          type="button"
        >
          Back
        </button>
        {currentStep < steps.length - 1 ? (
          <button onClick={goNext} type="button">
            Continue
          </button>
        ) : (
          <button type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : buttonLabel}
          </button>
        )}
      </div>
      {message ? <p className={`formStatus ${status}`} role={status === "error" ? "alert" : "status"}>{message}</p> : null}
    </form>
  );
}
