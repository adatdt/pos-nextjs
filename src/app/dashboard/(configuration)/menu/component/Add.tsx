'use client'
import { BtnCancel, BtnSave, BtnAdd } from "@/components/Button";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useRefreshStore } from "../service/useRefresh";
import { BlockUI } from '@/components/BlockUi';
import { MenuItem } from "../type/type";
import { encryptAES } from "@/lib/crypto";

type  getData = {
    title:string
}

type Option = {
  label: string;
  value: string;
};

export default function Add({title}:Readonly<getData>) {
    const { triggerRefresh } = useRefreshStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalAnimated, setModalAnimated] = useState(false);
    const [formData, setFormData] = useState({
    name: "",
  });

   const [isLoading, setIsLoading] = useState(false);
    const [dataGrid, setDataGrid] = useState<MenuItem[]>([]); 
    const [dataGridAction, setDataGridAction] = useState([]); 
    const [selected, setSelected] = useState<Option[]>([]);
    const [open, setOpen] = useState(false);
     const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);
     const [openParent, setOpenParent] = useState(false);
     const [dataParent, setDataParent] = useState({name:"",id:""});
   
    useEffect(() => {
           const fetchData = async () => {
            //    setLoading(true); 
   
               try {
               const response = await fetch('/dashboard/menu/api', {
                   method: 'POST',
                   headers: {
                   'Content-Type': 'application/json',
                   },
                   body: JSON.stringify({globalFilter:'', startPage:0,limitPage:10}),
               });
   
               if (!response.ok) throw new Error("Gagal mengambil data");
   
               const result = await response.json();            
               setDataGrid(result.data);
              
               const dataAction = result.dataAction.map((element: { id: string; name: string }) => ({
                   value: element.id,
                   label: element.name
               }));
                setDataGridAction(dataAction)
   
               } catch (error) {
               console.error("Gagal:", error);
               } finally {
            //    setLoading(false);
               }
           };
   
           fetchData();
    }, []); 

    const showModal =()=>{
        setIsModalOpen(true)
        setModalAnimated(true)
        setSelected([])
        setDataParent({name:"",id:""})
    }
    const closeModal =()=>{
        setModalAnimated(false)
        setTimeout(() => {
            setIsModalOpen(false)
            
        }, 300);
        
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData((prev) => ({ ...prev, [name]: value }));
        };

    const sendData = async()=>{
            try {
            setIsLoading(true);
            const sendData = {...formData, dataAction:selected, parentId:dataParent.id}
            const response = await fetch('/dashboard/menu/api/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sendData),
            });
            const getResponse = await response.json()
            if(getResponse.code == 1)
            {
                closeModal()
                toast.success(getResponse.message);
                triggerRefresh()
            }
            else
            {
                getResponse.error.forEach((msg:string[]) => {
                    toast.error(msg);
                });
            }
        } catch (error) {
            console.error("Gagal:", error);
        } 
        setIsLoading(false);
    }

    const removeItem = (value: string) => {
        setSelected((prev) => prev.filter((item) => item.value !== value));
    }; 
    
    const filteredOptions = dataGridAction?.filter((o:{value:string;label:string}) =>
        o.label.toLowerCase().includes(search.toLowerCase())
    );

    const toggleSelect = (option: Option) => {
        setSelected((prev) =>
        prev.some((item) => item.value === option.value)
            ? prev.filter((item) => item.value !== option.value)
            : [...prev, option]
        );
    };

    const actionSelectParent = (name:string, id:string) => {
        setDataParent({name:name, id:id})
        setOpenParent(false)
    }

    const dropDown =  ()=>{

        return (
        <div ref={ref}>
            {/* BOX */}
             <label htmlFor="drp"  className="block text-sm font-medium text-gray-900 mb-1">Aksi</label>
            <div className="border rounded-lg p-2 flex flex-wrap gap-2 min-h-10.5">

                {selected.map((item) => (
                    <span
                    key={item.value}
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                    {item.label}
                    <button
                        type="button"
                        onClick={(e) => {
                        e.stopPropagation();
                        removeItem(item.value);
                        }}
                        className="ml-1"
                    >
                        ✕
                    </button>
                    </span>
                ))}

                {/* Trigger */}
                <button
                    type="button"
                    name="drp"
                    onClick={() => setOpen((prev) => !prev)}
                    className="flex-1 text-left outline-none"
                >
                    {selected.length === 0 && (
                    <span className="text-gray-400">Pilih</span>
                    )}
                </button>

            </div>

            {/* DROPDOWN */}
            {open && (
                <div className="absolute left-0 mt-1 w-full border rounded-lg bg-white shadow-lg z-10">
                    
                    {/* SEARCH */}
                    <div className="p-2 border-b">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Cari..."
                        className="w-full border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    </div>


                    {/* LIST */}
                    <ul className="max-h-60 overflow-auto">
                    {filteredOptions?.length === 0 && (
                        <li className="p-2 text-sm text-gray-500">
                        Tidak ditemukan
                        </li>
                    )}

                    {filteredOptions?.map((option:{value:string, label:string}) => {
                        const isSelected = selected.some(
                        (item) => item.value === option.value
                        );

                        return (
                        <li key={option.value}>
                            <button
                            type="button"
                            onClick={() => toggleSelect(option)}
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-left"
                            >
                            <span>{option.label}</span>
                            <input
                                type="checkbox"
                                checked={isSelected}
                                readOnly
                                className="accent-blue-500"
                            />
                            </button>
                        </li>
                        );
                    })}
                    </ul>
                    
                </div>
            )}
        </div>
        );


    }
    
    const dropDownParent =  ()=>{

        return (
        <div ref={ref}>
            {/* BOX */}
             <label htmlFor="drp"  className="block text-sm font-medium text-gray-900 mb-1">Parent</label>
                <div className="border rounded-lg p-2 flex flex-wrap gap-2 min-h-10.5">
                
                {dataParent?.name && String(dataParent.name).trim() !== "" &&(
                 <span
                    className="bg-blue-500 text-white px-2 py-1 rounded-full text-sm flex items-center gap-1"
                    >
                    {dataParent.name}
                        <button
                            type="button"
                             onClick={() => actionSelectParent('','')}
                            className="ml-1"
                        >
                            ✕
                        </button>
                    </span>
                )}                

                {/* Trigger */}
                <button
                    type="button"
                    name="drp"
                    onClick={() => setOpenParent((prev) => !prev)}
                    className="flex-1 text-left outline-none"
                >
                    {selected.length === 0 && (
                    <span className="text-gray-400">Pilih Parent...</span>
                    )}
                </button>

            </div>

            {/* DROPDOWN */}
            {openParent && (
                <div className="absolute left-0 mt-1 w-full border rounded-lg bg-white shadow-lg z-10">
                    

                    {/* LIST */}
                    <ul className="max-h-60 overflow-auto">
                        {parentMenu()}
                    </ul>
                    
                </div>
            )}


        </div>
        );


    }

    const parentMenu = ()=>{
            return(
                 <li >
                        {dataGrid?.map((element)=>(
                        element.child?.length && element.child.length > 0?(
                            <ul key={element.id} >
                                <button 
                                type="button"
                                 onClick={() => actionSelectParent(element.name, encryptAES(element.id))}
                                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-left"
                                >
                                <span>{element.name}</span>
                                <input
                                     type="radio"
                                    name="parent"
                                    checked={element.name == dataParent.name}
                                    readOnly
                                    className="accent-blue-500"
                                />
                                </button>                            
                                {childMenu(element.child, 0)}
                            </ul>
                        ):(
                        <button key={element.id}
                        type="button"
                         onClick={() => actionSelectParent(element.name, encryptAES(element.id))}
                        className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-left"
                        >
                        <span>{element.name}</span>
                        <input
                            type="radio"
                            name="parent"
                           
                            checked={element.name == dataParent.name}
                            readOnly
                            className="accent-blue-500"
                        />
                        </button>
    
                        )))}
                    </li>
    
            );
        }
    
    const childMenu = (dataChild:MenuItem[], pad:number)=>{
        const newParamPad = pad + 1
        const newPad = newParamPad * 12

            return(
                <li style={{ paddingLeft: `${newPad}px` }}>
                    {dataChild?.map((element)=>(
                    element.child?.length && element.child.length > 0?(
                        <ul key={element.id}>
                            <button 
                            type="button"
                                onClick={() => actionSelectParent(element.name, encryptAES(element.id))}                           
                            className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-left"
                            >
                            <span>{element.name}</span>
                            <input
                                type="radio"
                                name="parent"
                                checked={element.name == dataParent.name}
                                readOnly
                                className="accent-blue-500"
                            />
                            </button>
                            {childMenu(element.child, newParamPad)}
                        </ul>
                    ):(
                    <button key={element.id}
                    type="button"
                        onClick={() => actionSelectParent(element.name, encryptAES(element.id))}
                    className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 text-left"
                    >
                    <span>{element.name}</span>
                    <input
                        type="radio"
                        name="parent"
                        checked={element.name == dataParent.name}
                        readOnly
                        className="accent-blue-500"
                    />
                    </button>

                    )))}
                </li>

        );
    }

    return (
        <>
            <BtnAdd  onClick={showModal} />
            {isModalOpen&&(
                <div className={`fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto p-4 py-10  ${modalAnimated?"":"animate-fade-out"} `} >
                    <BlockUI isOpen={isLoading} />
                    <div className={`w-full max-w-4xl rounded-2xl bg-slate-800 p-6  shadow-xl border border-slate-600 ${modalAnimated?"animate-modal-in":"animate-modal-out"}`}>
                    <h2 className="text-xl font-bold text-white border-b-2 border-gray-800 pb-4 ">ADD {title}</h2>
                    <div className="mt-2 text-gray-600 rounded-2xl  bg-slate-100 px-4 py-4">
                    
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name"  className="block text-sm font-medium text-gray-900 mb-1">Nama</label>
                                <input type="text" id="name" name="name" onChange={handleChange} placeholder="Masukkan nama" 
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>

                             <div>
                                <label htmlFor="slug"  className="block text-sm font-medium text-gray-900 mb-1">Url</label>
                                <input type="text" id="slug" name="slug" onChange={handleChange} placeholder="Masukkan nama"  
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>       

                             <div>
                                <label htmlFor="number"  className="block text-sm font-medium text-gray-900 mb-1">Urutan</label>
                                <input type="text" id="number" name="number" onChange={handleChange} placeholder="Masukkan Urutan" 
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>      
                            {dropDown()}
                            {dropDownParent()}
                          
                        </form>

                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <BtnCancel onClick={closeModal} />
                        <BtnSave onClick={sendData} />
                    </div>
                    </div>
                </div>
            )  }  
        </>
    )
}