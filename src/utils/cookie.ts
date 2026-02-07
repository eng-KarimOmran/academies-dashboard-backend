import env from "../config/env";

const cookieOptions: any = {
  httpOnly: true,
  secure: env.app.nodeEnv === "production",
  sameSite: "Lax",
};

export const cookieRefresh: any = {
  ...cookieOptions,
  maxAge: env.token.REFRESH_EXPIRATION,
};

export const cookieAccess: any = {
  ...cookieOptions,
  maxAge: env.token.ACCESS_EXPIRATION,
};
