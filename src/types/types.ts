export type UploadFile = {
  mimetype: string;
  size: number;
};

export interface MulterFilesUser {
  profileImg?: Express.Multer.File[];
  nationalIdFront?: Express.Multer.File[];
  nationalIdBack?: Express.Multer.File[];
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
