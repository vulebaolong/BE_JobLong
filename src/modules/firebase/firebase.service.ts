import { FirebaseApp, FirebaseOptions, initializeApp } from 'firebase/app';
import {
    FirebaseStorage,
    getStorage,
    uploadBytesResumable,
    ref,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import slugify from 'slugify';

@Injectable()
export class FirebaseService {
    private readonly logger = new Logger(FirebaseService.name);
    private static firebaseApp: FirebaseApp;
    private static storage: FirebaseStorage;

    constructor(private readonly configService: ConfigService) {
        if (!FirebaseService.firebaseApp) {
            const firebaseConfig: FirebaseOptions = {
                apiKey: this.configService.get<string>('FBS_apiKey'),
                appId: this.configService.get<string>('FBS_appId'),
                authDomain: this.configService.get<string>('FBS_authDomain'),
                measurementId: this.configService.get<string>('FBS_measurementId'),
                messagingSenderId: this.configService.get<string>('FBS_messagingSenderId'),
                projectId: this.configService.get<string>('FBS_projectId'),
                storageBucket: this.configService.get<string>('FBS_storageBucket'),
            };
            FirebaseService.firebaseApp = initializeApp(firebaseConfig);

            FirebaseService.storage = getStorage();
        }
    }

    upload = async (file: Express.Multer.File, folder: string) => {
        const originalname = file.originalname;

        const extName = originalname.substring(originalname.lastIndexOf('.') + 1);
        const baseName = originalname.substring(0, originalname.lastIndexOf('.'));
        const mainName = `${slugify(baseName)}-${Date.now()}.${extName}`;
        const finalName = folder ? `${folder}/${mainName}` : mainName;

        const storageRef = ref(FirebaseService.storage, finalName);

        const snapshot = await uploadBytesResumable(storageRef, file.buffer, {
            contentType: file.mimetype,
        });

        const downloadURL = await getDownloadURL(snapshot.ref);

        return {
            finalName,
            downloadURL,
        };
    };

    remove = async (name: string) => {
        try {
            const desertRef = ref(FirebaseService.storage, name);
            await deleteObject(desertRef);

            return `Successfully deleted images ${name} in firebase`;
        } catch (error) {
            this.logger.debug(error);
            throw error;
        }
    };
}
