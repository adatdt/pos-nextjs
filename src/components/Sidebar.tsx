'use client'
import Link from 'next/link';
import { Fragment } from 'react/jsx-runtime';
import type {MenuItem} from "@/lib/type/type"
import { useState } from 'react';
import { BurgerIcon, ChartShop } from './icon';

interface NavProps {
  dataMenu: MenuItem[];
}
export default function Sidebar({dataMenu}:Readonly<NavProps>) {
    const[openSide, setOpenSide]=useState(true)
    const mainMenu =()=>{
        return (
            <nav className="space-y-2 p-4">
                {dataMenu.map((element)=>(
                    element.child?.length && element.child.length > 0?(
                        <Fragment  key={element.id}>
                        <Link 
                            href="#" 
                            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
                            >
                            {element.name}
                            </Link>
                            {childMenu(element.child)}
                            
                        </Fragment>
                    ):(
                        <Link key={element.id}
                        href="/dashboard" 
                        className="block rounded-xl px-4 py-3 hover:bg-slate-800"
                        >
                        {element.name}
                        </Link>

                    )
                   

                ))}
        </nav>
        )
    }
    
    const childMenu =(dataChild:MenuItem[])=>{
        return(<div  className="ml-4 mt-2 space-y-1">
                    
                {dataChild.map(element=>(
                    element.child?.length && element.child.length > 0?(
                        <Fragment  key={element.id}>
                        <Link 
                            href="#" 
                            className="block rounded-xl px-4 py-3 hover:bg-slate-800"
                            >
                            {element.name}
                            </Link>
                             {childMenu(element.child)}
                            
                        </Fragment>
                    ):(
                        <Link key={element.id}
                        href={element.slug??"#"}
                        className="block rounded-xl px-4 py-3 hover:bg-slate-800"
                        >
                        {element.name}
                        </Link>

                    )))}

                    </div>)

    }

  return (
    <aside id="sidebar" className={`${openSide?"w-64":"w-14"}  bg-slate-900 text-white transition-all duration-300`}>
        <div className="flex items-center justify-between w-full border-b  px-3 pb-3 ">
  
            <div className={`${openSide?"inline-flex":"hidden"}   items-center justify-center p-2`}>
                Happy Shop &nbsp;
              <ChartShop  className='text-white -rotate-12 transform ' size={25} />
            </div>

                <button   
                onClick={()=>setOpenSide(!openSide)}
                className="rounded-lg px-2 py-2 hover:bg-gray-100">
                    <BurgerIcon size={24}/>
                </button>
	
        </div>
        {openSide&&(mainMenu())}
    </aside>
  )
}