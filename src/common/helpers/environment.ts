import { DEVELOPMENT, PRODUCTION } from "@/common/constants/environment";

export const isProduction = () => process.env.NODE_ENV === PRODUCTION;
export const isDevelopment = () => process.env.NODE_ENV === DEVELOPMENT;