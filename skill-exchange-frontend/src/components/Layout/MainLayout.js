import React, { useState } from 'react';
import Sidebar from '../SidebarComponent/Sidebar';
import { Outlet } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      <Sidebar isOpen={isOpen} />
      <button
        className="toggle-sidebar-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '❌' : '☰'}
      </button>
      <div className={`main-content ${isOpen ? 'with-sidebar' : ''}`}>
        <Outlet />
      </div>
    </>
  );
};

export default MainLayout;
