import React from 'react';

const WelcomeScreen = () => {
  return (
    <div className="flex-1 hidden md:flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="w-64 h-64 mx-auto mb-8">
          {/* <img
            className="w-full h-full object-contain"
            alt="Chat illustration"
            src=""
          /> */}
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Welcome to ChatApp</h2>
        <p className="text-gray-600 max-w-md">
          Select a chat from the sidebar to start messaging with your friends and family.
        </p>
      </div>
    </div>
  );
};

export default WelcomeScreen;
