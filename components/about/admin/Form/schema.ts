import * as z from "zod";

import { aboutEntryTuple, cityTuple, countryTuple } from "@/interfaces/_common-data-types";

export const Entry_FormSchemaGenerator = (messages?: string[]) =>
  z.object({
    title: z.string().min(4, {
      message: messages?.[0],
    }),
    description: z.string().min(10, {
      message: messages?.[1],
    }),
    country: z.enum(countryTuple, {
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          default:
            return { message: String(messages?.[2]) };
        }
      },
    }),
    city: z.enum(cityTuple, {
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          default:
            return { message: String(messages?.[3]) };
        }
      },
    }),
    dateFrom: z.coerce.date({
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          default:
            return { message: String(messages?.[4]) };
        }
      },
    }),
    dateTo: z.coerce
      .date({
        errorMap: (issue, _ctx) => {
          switch (issue.code) {
            default:
              return { message: String(messages?.[5]) };
          }
        },
      })
      .optional(),
    entryType: z.enum(aboutEntryTuple, {
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          default:
            return { message: String(messages?.[6]) };
        }
      },
    }),
    visibility: z.boolean({
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          default:
            return { message: String(messages?.[7]) };
        }
      },
    }),
    // This will be an Image (GridFS document) Id as a string
    attachment: z
      .string({
        errorMap: (issue, _ctx) => {
          switch (issue.code) {
            default:
              return { message: String(messages?.[8]) };
          }
        },
      })
      .optional(),
    tags: z.array(z.string()).refine((tags) => tags.length > 0, {
      message: String(messages?.[9]),
    }),
    gallery: z.array(z.string(), {
      errorMap: (issue, _ctx) => {
        switch (issue.code) {
          default:
            return { message: String(messages?.[10]) };
        }
      },
    }),
  });

export const Entry_FormSchema = Entry_FormSchemaGenerator();
export type Entry_FormSchema = z.infer<typeof Entry_FormSchema>;
