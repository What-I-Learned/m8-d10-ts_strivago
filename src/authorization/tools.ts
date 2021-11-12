import jwt from "jsonwebtoken";
import { UserDocument } from "../services/user/types";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

export const JWTAuthenticate = async (user: UserDocument) => {
  const accessToken = await generateJWT({ _id: user._id });
  return accessToken;
};

export const generateJWT = (payload: any) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 week" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const generateTemporaryJWT = (payload: string) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.JWT_SECRET!,
      { expiresIn: "1 day" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

export const verifyJWT = (token: string) =>
  new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    });
  });
