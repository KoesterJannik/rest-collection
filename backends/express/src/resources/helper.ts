import { Request, Response } from "express";
import { z } from "zod";

export const tryCatchZodErrorWrapper = async (
  req: Request,
  res: Response,
  callback: () => any
) => {
  try {
    const result = await callback(); // Wait for the callback function to complete
    return result; // Return the result
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.flatten().fieldErrors;
      console.log(errorMessage);
      return res.status(400).json({ message: errorMessage });
    }
    return res.status(400).json({ message: "Something went wrong" });
  }
};
