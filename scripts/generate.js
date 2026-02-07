import fs from "fs";
import path from "path";

const name = process.argv[2];

if (!name) {
  console.error("❌ Please provide module name");
  process.exit(1);
}

const moduleName = name.toLowerCase();
const ModuleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);

const basePath = path.join("src/modules", moduleName);

if (fs.existsSync(basePath)) {
  console.error("❌ Module already exists");
  process.exit(1);
}

fs.mkdirSync(basePath, { recursive: true });

const files = {
  "service.ts": serviceTemplate(ModuleName, moduleName),
  "routes.ts": routesTemplate(ModuleName, moduleName),
  "dto.ts": dtoTemplate(ModuleName),
  "validation.ts": validationTemplate(ModuleName),
  "index.ts": indexTemplate(moduleName),
};

Object.entries(files).forEach(([file, content]) => {
  fs.writeFileSync(path.join(basePath, `${moduleName}.${file}`), content);
});

console.log(`✅ ${ModuleName} module generated successfully`);

const serviceTemplate = (ModuleName, moduleName) => `
import { Response } from "express";
import { RequestAuth } from "../middlewares/auth.middleware";
import * as DTO from "../dtos/${moduleName}.dto";
import prisma from "../lib/prisma";
import ApiError from "../utils/ApiError";
import sendSuccess from "../utils/successResponse";

export const create${ModuleName} = async (req: RequestAuth, res: Response) => {
  const data: DTO.Create${ModuleName}Dto = req;
  const { name } = data.body;

  // مثال تحقق duplicate (حسب الحقل اللي Unique)
  const exists = await prisma.${moduleName}.findUnique({
    where: { name }
  });
  if (exists) throw ApiError.Conflict("${ModuleName} مسجل بالفعل");

  const result = await prisma.${moduleName}.create({
    data,
  });

  return sendSuccess(res, result, "${ModuleName} تم إنشاؤه بنجاح");
};

export const update${ModuleName} = async (req: RequestAuth, res: Response) => {
  const data: DTO.Update${ModuleName}Dto = req;
  const { id } = data.params;
  const { name } = data.body;

  const existing = await prisma.${moduleName}.findUnique({ where: { id } });
  if (!existing) throw ApiError.NotFound("${ModuleName} مش موجود");

  const duplicate = await prisma.${moduleName}.findUnique({
    where: { name, NOT: { id } }
  });
  if (duplicate) throw ApiError.Conflict("${ModuleName} مسجل بالفعل");

  const result = await prisma.${moduleName}.update({
    where: { id },
    data: data.body,
  });

  return sendSuccess(res, result, "${ModuleName} تم التعديل بنجاح");
};

export const delete${ModuleName} = async (req: RequestAuth, res: Response) => {
  const data: DTO.Update${ModuleName}Dto = req;
  const { id } = data.params;

  const existing = await prisma.${moduleName}.findUnique({ where: { id } });
  if (!existing) throw ApiError.NotFound("${ModuleName} مش موجود");

  await prisma.${moduleName}.delete({
    where: { id },
  });

  return sendSuccess(res, null, "${ModuleName} تم الحذف بنجاح");
};

export const get${ModuleName}ById = async (req: RequestAuth, res: Response) => {
  const data: DTO.Update${ModuleName}Dto = req;
  const { id } = data.params;

  const result = await prisma.${moduleName}.findUnique({
    where: { id },
  });

  if (!result) throw ApiError.NotFound("${ModuleName} مش موجود");

  return sendSuccess(res, result);
};
`;