
export class User{
    _id?: string;
    email: string;
    password: string;  
    firstName?: string;
    lastName?: string;
    userPoster?: string;
    userRole?: string;
    sessions: [{}];
}