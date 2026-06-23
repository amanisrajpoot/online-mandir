import { Cashfree, CFEnvironment } from "cashfree-pg";

export const cashfree = new Cashfree(
  process.env.CASHFREE_ENVIRONMENT === "PRODUCTION" 
    ? CFEnvironment.PRODUCTION 
    : CFEnvironment.SANDBOX,
  process.env.CASHFREE_APP_ID || "",
  process.env.CASHFREE_SECRET_KEY || ""
);
