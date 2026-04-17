import type { IRegisterUser } from "../components/auth/contract";
import type { SuccessResponse } from "../config/axios.config";
import type { ICredentials } from "../pages/home";
import BaseService from "./base.service";

class AuthService extends BaseService {
  async registerUser(data: IRegisterUser) {
    return (await this.postRequest("auth/register", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })) as unknown as SuccessResponse;
  }
  async activateUserProfile(token:any){
    return await this.postRequest('auth/activate/',{token})
  }
  async loginUser(credentials:ICredentials){
    const response = await this.postRequest("auth/login",credentials) as unknown as SuccessResponse;    
    localStorage.setItem("_at_movieticket", response.data.accessToken);
    localStorage.setItem("_rt_movieticket", response.data.refreshToken);
  }
  async getLoggedInUserProfile() {
    return await this.getRequest("/auth/me")
  }
}

const authSvc = new AuthService();
export default authSvc;