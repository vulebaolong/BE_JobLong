import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import fs from 'fs';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import slugify from 'slugify';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
    getRootPath = () => {
        return process.cwd();
    };
    ensureExists(targetDirectory: string) {
        fs.mkdir(targetDirectory, { recursive: true }, (error) => {
            if (!error) {
                console.log('Directory successfully created, or it already exists.');
                return;
            }
            switch (error.code) {
                case 'EEXIST':
                    // Error:
                    // Requested location already exists, but it's not a directory.
                    break;
                case 'ENOTDIR':
                    // Error:
                    // The parent hierarchy contains a file with the same name as the dir
                    // you're trying to create.
                    break;
                default:
                    // Some other error like permission denied.
                    console.error(error);
                    break;
            }
        });
    }

    // activated createMulterOptions where file.module.ts imports
    createMulterOptions(): MulterModuleOptions {
        return {
            storage: diskStorage({
                destination: (req, file, cb) => {
                    const folder = req?.headers?.folder_type ?? 'default';
                    this.ensureExists(`public/images/${folder}`);
                    cb(null, join(this.getRootPath(), `public/images/${folder}`));
                },
                filename: (req, file, cb) => {
                    //get image extension
                    const extName = path.extname(file.originalname);

                    //get image's name (without extension)
                    const baseName = path.basename(file.originalname, extName);

                    const finalName = `${slugify(baseName)}-${Date.now()}${extName}`;
                    cb(null, finalName);
                },
            }),
            fileFilter: (req, file, cb) => {
                const allowedFileTypes = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx'];

                const originalname = file.originalname;
                const extName = originalname.substring(originalname.lastIndexOf('.') + 1);
                const isValidFileType = allowedFileTypes.includes(extName);
                if (!isValidFileType) {
                    cb(
                        new HttpException('Invalid file type', HttpStatus.UNPROCESSABLE_ENTITY),
                        null,
                    );
                } else cb(null, true);
            },
            limits: {
                fileSize: 1024 * 1024 * 1, // 1MB
            },
        };
    }
}
