export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  profilePic?: File;
  [key: string]: any;
}
