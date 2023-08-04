import z from "zod";

const loginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    })
    .email(),
  password: z
    .string()
    .min(8)
});

const signupSchema = z.object({
  fullName: z
    .string({
      invalid_type_error: "Full name must be a string",
      required_error: "Full name is required",
    })
    .min(1)
    .max(100),
  email: z
    .string({
      invalid_type_error: "Email must be a string",
      required_error: "Email is required",
    })
    .email(),
  password: z
    .string()
    .min(8)
    .regex(/.*\d.*/),
});

export const validateSignUpSchema = (object) => signupSchema.safeParse(object);
export const validateLoginSchema = (object) => loginSchema.safeParse(object);
