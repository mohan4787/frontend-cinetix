"use client";

import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import authSvc from "../../services/auth.service";

const ActivateUser = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length < 6) {
      return toast.error("Please enter the 6-digit code.");
    }

    try {
      setLoading(true);
      await authSvc.activateUserProfile(otp);
      toast.success("Account activated Successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 2000);
    } catch (error: any) {
      toast.error(error?.data?.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-10 rounded-[2.5rem] shadow-xl max-w-sm w-full text-center">
        <h2 className="text-2xl font-black text-red-600 mb-2 uppercase">Verify Account</h2>
        <p className="text-slate-500 mb-6 text-sm">Enter the 6-digit code sent to your email.</p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            placeholder="000000"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full text-center text-3xl font-mono tracking-[10px] py-4 bg-slate-50 border-2 text-black border-slate-100 rounded-2xl focus:border-red-500 outline-none transition-all"
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-red-600 text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-red-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Verifying..." : "Activate Now"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ActivateUser;