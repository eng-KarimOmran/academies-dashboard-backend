export type UploadFile = {
  mimetype: string;
  size: number;
};

export interface MulterFilesUser {
  profileImg?: Express.Multer.File[];
  nationalIdFront?: Express.Multer.File[];
  nationalIdBack?: Express.Multer.File[];
}
