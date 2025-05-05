"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";

const schema = yup.object({
  createPassword: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export const CreatePassword = () => {
  const initialValues = {
    createPassword: "",
  };

  const handleSubmit = (values: typeof initialValues) => {
    console.log("Form submitted!", values);
  };

  return (
    <div className="max-w-[32.37rem]">
      <Formik
        initialValues={initialValues}
        validationSchema={schema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form className="space-y-10">
            <div className="flex flex-col gap-2">
              <label
                htmlFor="createPassword"
                className="text-base font-medium text-black"
              >
                Create Password
              </label>
              <Field
                type="password"
                name="createPassword"
                id="createPassword"
                className="h-14 w-full border border-[#D9D9D9] px-6 outline-none hover:border-[#3B82F6] focus:border-[#95a3ba]"
              />
              <ErrorMessage
                name="createPassword"
                component="p"
                className="text-sm text-red-500"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-16 w-full rounded-lg bg-[#3B82F6] p-2.5 text-base font-semibold text-white transition duration-150 ease-in-out hover:bg-[#3B82F6]/95"
              >
                Proceed
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};
