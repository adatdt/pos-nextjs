'use client'
import { BtnCancel, BtnSave } from "@/components/Button";
import { toast } from "sonner";
import { useEffect, useMemo, useRef, useState } from "react";
import type {GetData} from "../type/type"
import { useRefreshStore } from "../service/useRefresh";
import { BlockUI } from '@/components/BlockUi';

type Option = {
  label: string;
  value: string;
};

const options: Option[] = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Mango", value: "mango" },
];


export default function Edit({title, handlingModal, dataDetail}:Readonly<GetData>) {
    
    const [selected, setSelected] = useState<Option[]>([]);
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const ref = useRef<HTMLDivElement>(null);

  // close saat klik luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (option: Option) => {
    setSelected((prev) =>
      prev.some((item) => item.value === option.value)
        ? prev.filter((item) => item.value !== option.value)
        : [...prev, option]
    );
  };

  const removeItem = (value: string) => {
    setSelected((prev) => prev.filter((item) => item.value !== value));
  };

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );
   
    const [formData, setFormData] = useState({
    name: dataDetail?.name,
    id: dataDetail?.id,
  });


    const { triggerRefresh } = useRefreshStore();
    const [isLoading, setIsLoading] = useState(false);
    const [modalAnimated, setModalAnimated] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const sendData = async()=>{
        try {
            setIsLoading(true);
        const response = await fetch('/dashboard/action/api/updateData', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const getResponse = await response.json()
        if(getResponse.code == 1)
        {
            toast.success(getResponse.message);
                closeModal()
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

    const closeModal = () =>{
        setModalAnimated(false); 
        setTimeout(() => {
            handlingModal?.(false); 
        }, 300);
    }

    const dropDown =  ()=>{

        return (
        <div ref={ref}>
            {/* BOX */}
            <div className="border rounded-lg p-2 flex flex-wrap gap-2 min-h-[42px]">

            {/* Selected */}
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
                onClick={() => setOpen((prev) => !prev)}
                className="flex-1 text-left outline-none"
            >
                {selected.length === 0 && (
                <span className="text-gray-400">Pilih buah...</span>
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
                {filteredOptions.length === 0 && (
                    <li className="p-2 text-sm text-gray-500">
                    Tidak ditemukan
                    </li>
                )}

                {filteredOptions.map((option) => {
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


    return (
        
                 <div className={`fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto p-4 py-10  ${modalAnimated?"":"animate-fade-out"} `} >
                    <BlockUI isOpen={isLoading} />
                   <div className={`w-full max-w-4xl rounded-2xl bg-slate-800 p-6  shadow-xl border border-slate-600 ${modalAnimated?"animate-modal-in":"animate-modal-out"}`}>
                    <h2 className="text-xl font-bold text-white border-b-2 border-gray-800 pb-4 ">Edit  {title}</h2>
                    <div className="mt-2 text-gray-600 rounded-2xl  bg-slate-100 px-4 py-4">
                    
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name"  className="block text-sm font-medium text-gray-900 mb-1">Nama</label>
                                <input type="text" id="name" name="name" onChange={handleChange} placeholder="Masukkan nama"  value={formData?.name}
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>

{dropDown()}


                        </form>

                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <BtnCancel onClick={()=>closeModal()} />
                        <BtnSave onClick={sendData} />
                    </div>
                    </div>
                </div>
        
        
    )
}