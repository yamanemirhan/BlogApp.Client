import SignUpForm from "@/components/auth/SignUpForm";
import React from "react";

const SignUpPage = () => {
  return (
    <div className="text-white max-w-[90%] mx-auto gap-8 rounded-lg flex items-center justify-center h-[calc(100vh-124px)]">
      <div className="flex-1 h-full">
        <img
          className="h-full object-contain md:object-cover"
          src="https://static.vecteezy.com/system/resources/previews/003/689/228/non_2x/online-registration-or-sign-up-login-for-account-on-smartphone-app-user-interface-with-secure-password-mobile-application-for-ui-web-banner-access-cartoon-people-illustration-vector.jpg"
        />
      </div>
      <div className="flex-1">
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
