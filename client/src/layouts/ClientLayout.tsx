import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

const ClientLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen bg-white dark:bg-gray-950">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default ClientLayout;
