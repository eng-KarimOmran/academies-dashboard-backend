interface IEnv {
  app: {
    port: number;
    nodeEnv: string;
    frontend: string;
  };
  db: {
    url: string;
  };
  token: {
    ACCESS_SECRET: string;
    REFRESH_SECRET: string;
    REFRESH_EXPIRATION: number;
    ACCESS_EXPIRATION: number;
  };
  cloudinary: {
    cloud_name: string;
    api_key: string;
    api_secret: string;
  };
}

const env: IEnv = {
  app: {
    port: Number(process.env.PORT),
    nodeEnv: process.env.NODE_ENV!,
    frontend: process.env.FRONT_END!,
  },
  db: {
    url: process.env.DATABASE_URL!,
  },
  token: {
    ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    REFRESH_EXPIRATION: Number(process.env.JWT_REFRESH_EXPIRATION),
    ACCESS_EXPIRATION: Number(process.env.JWT_ACCESS_EXPIRATION),
  },
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
  },
};

export default env;
