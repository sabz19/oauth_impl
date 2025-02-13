import { UUID } from "crypto";
import AuthProfile from "../routes/auth/authprofile";

class UserProfile{
    private username: string;
    private userid: UUID;
    private clientProfile: AuthProfile;

    constructor(username:string, userid: UUID, clientProfile: AuthProfile){
        this.username = username;
        this.userid = userid;
        this.clientProfile = this.clientProfile;
    }
}

export default UserProfile;