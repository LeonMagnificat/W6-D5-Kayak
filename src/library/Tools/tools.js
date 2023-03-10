import jwt from "jsonwebtoken";

export const createAccessToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(payload, "mySecret", { expiresIn: "1 week" }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    })
  );

export const verifyAccessToken = (token) =>
  new Promise((resolve, reject) =>
    jwt.verify(token, "mySecret", (err, originalPayload) => {
      if (err) reject(err);
      else resolve(originalPayload);
    })
  );
