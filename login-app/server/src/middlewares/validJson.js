import express from "express";

export const validJson = [
  express.json(),
  (err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      return res.status(400).json({ error: "Invalid or missing JSON payload" });
    }
    next(err);
  },
];
