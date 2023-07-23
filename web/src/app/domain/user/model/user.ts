import {FileModel} from './file-model';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  profilePic: FileModel;
  createdOn: string;
}
