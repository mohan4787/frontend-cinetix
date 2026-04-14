
import {  useParams } from "react-router";
import { Spinner } from "../../components/loading/Spinner";
import { toast } from "sonner";
import { useEffect } from "react";
import authSvc from "../../services/auth.service";
import type { SuccessResponse } from "../../config/axios.config";


const ActivateUser = () => {
  const params = useParams()
  const activateUserProfile = async () => {
    try {
      const token = params.token
      const response = await authSvc.activateUserProfile(token as string) as unknown as SuccessResponse
      toast.success("Account Activatedddd!! please login to aceess website!",{description:response.message});
      window.location.href = `${import.meta.env.VITE_APP_NEXTJS_URL}/login`;
    } catch (exception:any) {
      toast.error("Account Activated!!",{description:exception?.message})
      window.location.href = `${import.meta.env.VITE_APP_NEXTJS_URL}/login`;
    }
  }
  useEffect(() => {
    activateUserProfile()
  },[])
  return (
    <>
      <div className="flex w-full h-16 justify-center items-center"><Spinner/></div>
    </>
  );
};

export default ActivateUser;
