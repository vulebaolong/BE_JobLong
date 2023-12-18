import { Injectable } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class FilesService {
    constructor(private readonly firebaseService: FirebaseService) {}

    upload(file: Express.Multer.File, folder: string) {
        return this.firebaseService.upload(file, folder);
    }

    remove(name: string) {
        return this.firebaseService.remove(name);
    }
}
