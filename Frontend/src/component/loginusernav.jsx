import React from 'react';
import { Link } from 'react-router-dom';
import { Utensils, Menu, User, LogOut } from 'lucide-react'; // Import ไอคอน Globe

const Loginusernav = () => {

  return (
    <>
      <header className='fixed top-0 left-0 w-full z-50 px-16 flex shadow-lg bg-background/55 backdrop-blur supports-[backdrop-filter]:bg-background/60' >
        <div className='container px-2 py-4 flex justify-start items-center'>
          <div className='px-2'>
            <Utensils />
          </div>
          <div className='px-2'>
            <h1>Bazi Resturant</h1>
          </div>
        </div>
      </header>
    </>
  );
};

export default Loginusernav;

