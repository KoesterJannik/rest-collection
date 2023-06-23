import { NextFunction, Request, Response } from "express";
import { getJwtFromRequest, verifyAccessToken } from "../utils/auth";

export function attachUserToRequestOrThrowError(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const tokenFromHeader = getJwtFromRequest(req);
    if (!tokenFromHeader)
      return res.status(401).json({ message: "Unauthorized" });
    const user = verifyAccessToken(tokenFromHeader);
    console.log(user);

    // Initialize req.user if it doesn't exist
    if (!req.user) {
      req.user = {};
    }

    // Set user properties
    req.user.email = user.email;
    req.user.id = user.id;

    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
