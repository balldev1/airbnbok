'use client'

import React from 'react'

interface MenuitemProp {
    onClick: () => void;
    label: string;
}

const Menuitem: React.FC<MenuitemProp> = ({ onClick, label }) => {
    return (
        <div onClick={onClick}
            className='px-4 py-3 hover:bg-neutral-100 transition font-semibold'
        >
            {label}
        </div>
    )
}

export default Menuitem
