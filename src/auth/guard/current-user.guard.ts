import { AuthGuard } from "@nestjs/passport";

export class CurrentUserGuard extends AuthGuard('jwt'){
    handelRequest(err:any,user:any){
        if(user) return user;
        return null;
    }
}