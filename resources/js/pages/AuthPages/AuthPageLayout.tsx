import React from "react";
import newBgImg from "../../assets/images/new-bg-img.webp";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative p-6 bg-white z-1 dark:bg-gray-900 sm:p-0">
      <div 
        className="relative flex flex-col justify-center w-full h-screen bg-cover bg-center bg-no-repeat lg:flex-row dark:bg-gray-900 sm:p-0"
        style={{ backgroundImage: `url(${newBgImg})` }}
      >
        {children}
        <div className="items-center hidden w-full h-full lg:w-1/2 lg:grid py-7 max-w-[704px]">
          <div className="login-image-bg w-full h-full ml-auto">
            <div className="relative flex items-center justify-center z-1">
              <div className="flex flex-col items-center max-w-[540px] mt-[75px]">
                <h2 className="text-white text-[51px] font-extrabold leading-normal">
                Trusted to Deliver. Committed to Precision.
                </h2>
                <p className="text-left text-white">
                Monitor and manage your entire fleet with real-time status updates and analyticsFree and Open-Source Tailwind CSS Admin Dashboard Template
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className="fixed z-50 hidden bottom-6 right-6 sm:block">
          <ThemeTogglerTwo />
        </div> */}
      </div>
    </div>
  );
}
