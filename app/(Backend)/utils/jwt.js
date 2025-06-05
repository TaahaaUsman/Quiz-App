import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export const createToken = (userId) => {
  return jwt.sign({ id: userId }, secret, {
    expiresIn: "30d", // Keep user logged in for 30 days
  });
};

export const verifyToken = (token) => {
  if (!token) {
    return "No Token Found";
  }
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.log("Error While verifying Token", error);
  }
};
