import React, {useState} from 'react'
import Restaurentnav from '../component/restaurentnav';
import { Outlet } from 'react-router-dom'


const Layoutrestaurent = () => {
    const [sideOpen, setSideOpen] = useState(false);
    const toggleSide = () => setSideOpen(prev => !prev);

    return (
        <div className='flex '>
            <Restaurentnav />
             <main className='pt-16 min-h-screen min-w-screen'>
                <Outlet />
            </main>
        </div>
    );
};

export default Layoutrestaurent