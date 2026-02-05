import React, {useState} from 'react'
import Adminnav from '../component/adminnav';
import { Outlet } from 'react-router-dom'

const Layoutadmin = () => {
    const [sideOpen, setSideOpen] = useState(false);
    const toggleSide = () => setSideOpen(prev => !prev);

    return (
        <div className='flex'>
            <Adminnav />
             <main className='pt-16 min-h-screen min-w-screen'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layoutadmin