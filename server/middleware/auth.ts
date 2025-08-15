import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

// Extend the Express Request type to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: { isAdmin: boolean };
    }
  }
}

export const adminAuthMiddleware: RequestHandler = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: No token provided",
    });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET is not set");
    }
    const decoded = jwt.verify(token, secret);

    if (typeof decoded === "object" && decoded.isAdmin) {
      req.user = { isAdmin: true };
      next();
    } else {
      return res.status(403).json({
        success: false,
        error: "Forbidden: Not an admin",
      });
    }
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: "Unauthorized: Invalid token",
    });
  }
};
