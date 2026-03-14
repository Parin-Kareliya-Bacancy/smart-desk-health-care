"use client";

import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { type Resolver, useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useVitals } from "@/hooks/useVitals";

const patientId = "patient-1";

const toNumber = (value: unknown) => {
  if (value === "" || value === null || value === undefined) {
    return undefined;
  }
  const parsed = typeof value === "string" ? Number(value) : value;
  return Number.isNaN(parsed) ? value : parsed;
};

const numberField = (
  min: number,
  max: number,
  label: string
): z.ZodType<number> =>
  z.preprocess(
    toNumber,
    z
      .number({ message: `${label} must be a number.` })
      .min(min, `${label} must be at least ${min}.`)
      .max(max, `${label} must be at most ${max}.`)
  ) as z.ZodType<number>;

const vitalSchema = z
  .object({
    glucose: numberField(40, 400, "Glucose").optional(),
    bloodPressureSystolic: numberField(70, 240, "Systolic").optional(),
    bloodPressureDiastolic: numberField(40, 140, "Diastolic").optional(),
    heartRate: numberField(30, 220, "Heart rate").optional(),
    weight: numberField(60, 550, "Weight").optional(),
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: "Enter at least one reading.",
    path: ["glucose"],
  })
  .refine(
    (data) =>
      !(data.bloodPressureSystolic && !data.bloodPressureDiastolic),
    {
      message: "Enter a diastolic value.",
      path: ["bloodPressureDiastolic"],
    }
  )
  .refine(
    (data) =>
      !(data.bloodPressureDiastolic && !data.bloodPressureSystolic),
    {
      message: "Enter a systolic value.",
      path: ["bloodPressureSystolic"],
    }
  );

type VitalFormValues = z.infer<typeof vitalSchema>;

type StatusState = { type: "error"; message: string } | null;

const resolver = zodResolver(vitalSchema) as unknown as Resolver<VitalFormValues>;

export function VitalSignForm() {
  const { addVital } = useVitals(patientId);
  const [status, setStatus] = useState<StatusState>(null);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VitalFormValues>({
    resolver,
  });

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const onSubmit = async (values: VitalFormValues) => {
    setStatus(null);

    const tasks: Promise<unknown>[] = [];

    if (values.glucose !== undefined) {
      tasks.push(
        addVital({
          patientId,
          type: "glucose",
          value: values.glucose,
          unit: "mg/dL",
        })
      );
    }

    if (values.heartRate !== undefined) {
      tasks.push(
        addVital({
          patientId,
          type: "heart_rate",
          value: values.heartRate,
          unit: "bpm",
        })
      );
    }

    if (values.weight !== undefined) {
      tasks.push(
        addVital({
          patientId,
          type: "weight",
          value: values.weight,
          unit: "lb",
        })
      );
    }

    if (
      values.bloodPressureSystolic !== undefined &&
      values.bloodPressureDiastolic !== undefined
    ) {
      tasks.push(
        addVital({
          patientId,
          type: "blood_pressure",
          value: values.bloodPressureSystolic,
          unit: "mmHg",
        })
      );
      tasks.push(
        addVital({
          patientId,
          type: "blood_pressure",
          value: values.bloodPressureDiastolic,
          unit: "mmHg",
        })
      );
    }

    try {
      await Promise.all(tasks);
      reset();
      showToast("Vitals recorded successfully.");
    } catch (error) {
      setStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to save vital readings.",
      });
    }
  };

  return (
    <>
      {toast ? (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 shadow-lg">
            {toast}
          </div>
        </div>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Record vital signs</CardTitle>
          <CardDescription>
            Add new readings to keep your care team up to date.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status ? (
            <Alert className="border-red-500 bg-red-50 text-red-900">
              <AlertTitle>Unable to save</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          ) : null}
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="glucose">Glucose (mg/dL)</Label>
                <Input
                  id="glucose"
                  inputMode="decimal"
                  type="number"
                  step="1"
                  placeholder="120"
                  {...register("glucose")}
                />
                {errors.glucose ? (
                  <p className="text-sm text-destructive">{errors.glucose.message}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="heartRate">Heart rate (bpm)</Label>
                <Input
                  id="heartRate"
                  inputMode="decimal"
                  type="number"
                  step="1"
                  placeholder="72"
                  {...register("heartRate")}
                />
                {errors.heartRate ? (
                  <p className="text-sm text-destructive">{errors.heartRate.message}</p>
                ) : null}
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Blood pressure (mmHg)</Label>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    id="bloodPressureSystolic"
                    inputMode="decimal"
                    type="number"
                    step="1"
                    placeholder="Systolic (120)"
                    {...register("bloodPressureSystolic")}
                  />
                  <Input
                    id="bloodPressureDiastolic"
                    inputMode="decimal"
                    type="number"
                    step="1"
                    placeholder="Diastolic (80)"
                    {...register("bloodPressureDiastolic")}
                  />
                </div>
                {errors.bloodPressureSystolic ? (
                  <p className="text-sm text-destructive">
                    {errors.bloodPressureSystolic.message}
                  </p>
                ) : null}
                {errors.bloodPressureDiastolic ? (
                  <p className="text-sm text-destructive">
                    {errors.bloodPressureDiastolic.message}
                  </p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (lb)</Label>
                <Input
                  id="weight"
                  inputMode="decimal"
                  type="number"
                  step="0.1"
                  placeholder="172"
                  {...register("weight")}
                />
                {errors.weight ? (
                  <p className="text-sm text-destructive">{errors.weight.message}</p>
                ) : null}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save vitals"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}



