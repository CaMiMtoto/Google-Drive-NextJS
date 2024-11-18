"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { createAccount } from "@/lib/actions/user.actions";
import OptModal from "@/components/OPTModal";

type FormType = "sign-in" | "sign-up" | "forgot-password";
const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === "sign-up"
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [accountId, setAccountId] = useState("");
  const formSchema = authFormSchema(type);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setIsLoading(true);
    setErrorMessage("");
    try {
      const user = await createAccount({
        fullName: values.fullName || "",
        email: values.email,
      });
      setAccountId(user.accountId);
    } catch (error) {
      console.log(error);
      setErrorMessage("Failed to create account with the provided details");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className="form-title">
            {type === "sign-in"
              ? "Sign In"
              : type === "sign-up"
                ? "Sign Up"
                : "Forgot Password"}
          </h1>
          {type === "sign-up" && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className={"shad-form-item"}>
                    <FormLabel className={"shad-form-label"}>
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        className={"shad-input"}
                        {...field}
                      />
                    </FormControl>
                  </div>
                  <FormMessage className={"shad-form-message"} />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className={"shad-form-item"}>
                  <FormLabel className={"shad-form-label"}>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Email address"
                      className={"shad-input"}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage className={"shad-form-message"} />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={"form-submit-button"}
            disabled={isLoading}
          >
            {type === "sign-in"
              ? "Sign In"
              : type === "sign-up"
                ? "Sign Up"
                : "Send Reset Link"}

            {isLoading && (
              <Image
                src={"/assets/icons/loader.svg"}
                alt={"Loading"}
                width={24}
                height={24}
                className="ml-2 animate-spin"
              />
            )}
          </Button>
          {errorMessage && <p className="error-message">*{errorMessage}</p>}
          <div className={"body-2 flex justify-center"}>
            <p className={"text-light-100"}>
              {type === "sign-in"
                ? "Don't have an account?"
                : "Already have an account?"}
              <Link
                href={type === "sign-in" ? "/sign-up" : "/sign-in"}
                className={"ml-1 font-medium text-brand"}
              >
                {type === "sign-in" ? "Sign Up" : "Sign In"}
              </Link>
            </p>
          </div>
        </form>
      </Form>

      {/* OTP verification modal */}
      {accountId && (
        <OptModal email={form.getValues("email")} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
