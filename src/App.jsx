import React from 'react';
import { Helmet } from 'react-helmet';
import { Toaster } from '@/components/ui/toaster';
import ChatLayout from '@/components/Chat/ChatLayout';

function App() {
  return (
    <>
      <Helmet>
        <title>ChatApp - Connect with Friends</title>
        <meta
          name="description"
          content="Modern messaging app for seamless communication with friends and family"
        />
        <meta property="og:title" content="ChatApp - Connect with Friends" />
        <meta
          property="og:description"
          content="Modern messaging app for seamless communication with friends and family"
        />
      </Helmet>
      <main className="w-screen h-screen bg-gray-100">
        <ChatLayout />
      </main>
      <Toaster />
    </>
  );
}

export default App;
