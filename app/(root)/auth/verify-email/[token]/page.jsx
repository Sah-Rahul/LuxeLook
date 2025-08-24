"use client";

import { use, useEffect, useState } from 'react';
import axios from 'axios';

const VerificationEmail = ({ params }) => {
  // Fix 1: Use React.use() to unwrap params Promise in Next.js 15
  const { token } = use(params);
  
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verifying token:", token);
        
        const response = await axios.post("/api/auth/verify-email", { 
          token: token 
        });

        if (response.data.success) {
          setIsVerified(true);
        } else {
          setError(response.data.message || "Verification failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        setError(
          error.response?.data?.message || 
          "An error occurred during verification"
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-lg">Verifying your email...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
            <h2 className="font-bold text-xl mb-2">Verification Failed</h2>
            <p>{error}</p>
          </div>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="mt-4 cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (isVerified) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded max-w-md">
            <h2 className="font-bold text-xl mb-2">Email Verified Successfully!</h2>
            <p>Your email has been verified. You can now login to your account.</p>
          </div>
          <button 
            onClick={() => window.location.href = '/auth/login'}
            className="mt-4 cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default VerificationEmail;