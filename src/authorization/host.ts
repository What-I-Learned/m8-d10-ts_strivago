import createHttpError from "http-errors";
import { Request, Response, NextFunction } from "express";
import { UserDocument } from "../services/user/types";

export const hostOnlyMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req?.user?.role === "Host") {
    next();
  } else {
    next(createHttpError(403, "host Only!"));
  }
};
