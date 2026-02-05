import React, {useState} from 'react'
import Usernav from '../component/usernav'
import { Outlet } from 'react-router-dom'


const Layoutuser = () => {
    const [sideOpen, setSideOpen] = useState(false);
    const toggleSide = () => setSideOpen(prev => !prev);

    return (
        <div className='flex'>
            <Usernav />
             <main className='pt-16 min-h-screen min-w-screen'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layoutuser