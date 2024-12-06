import { diskStorage } from 'multer';
import { Request } from 'express';

export const multerOptions = {
  storage: diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
      const fileTypesToFolderName = {
        'image/jpeg': 'uploads/images',
        'image/png': 'uploads/images',
        'application/pdf': 'uploads/documents',
      };

      const destinationFolder =
        fileTypesToFolderName[file.mimetype] || 'uploads/others';

      cb(null, destinationFolder);
    },
    filename: (req: Request, file: Express.Multer.File, cb) => {
      const fileExtension = file.originalname.split('.').pop();
      const fileName = `${file.fieldname}-${Date.now()}.${fileExtension}`;
      cb(null, fileName);
    },
  }),
};
