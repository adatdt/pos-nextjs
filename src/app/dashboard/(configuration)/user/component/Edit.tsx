'use client'
import { BtnCancel, BtnSave } from "@/components/Button";
import { toast } from "sonner";
import { useState } from "react";
import type {GetData} from "../type/type"
import { useRefreshStore } from "../service/useRefresh";
import { BlockUI } from '@/components/BlockUi';

export default function Edit({title, handlingModal, dataDetail}:Readonly<GetData>) {
    const [formData, setFormData] = useState({
    name: dataDetail?.name,
    address: dataDetail?.address,
    phoneNumber: dataDetail?.phoneNumber,
    id: dataDetail?.id,
    username: dataDetail?.username,
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
        const response = await fetch('/dashboard/user/api/updateData', {
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
            handlingModal?.(false, "edit", {}); 
        }, 300);
  }
    return (
        
                 <div className={`fixed inset-0 z-50 flex justify-center items-start bg-black/50 overflow-y-auto p-4 py-10  ${modalAnimated?"":"animate-fade-out"} `} >
                    <BlockUI isOpen={isLoading} />
                   <div className={`w-full max-w-4xl rounded-2xl bg-slate-800 p-6  shadow-xl border border-slate-600 ${modalAnimated?"animate-modal-in":"animate-modal-out"}`}>
                    <h2 className="text-xl font-bold text-white border-b-2 border-gray-800 pb-4 ">Edit  {title}</h2>
                    <div className="mt-2 text-gray-600 rounded-2xl  bg-slate-100 px-4 py-4">
                    
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name"  className="block text-sm font-medium text-gray-900 mb-1">Nama Lengkap</label>
                                <input type="text" id="name" name="name" onChange={handleChange} placeholder="Masukkan nama"  value={formData?.name}
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>
                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-900 mb-1">Username</label>
                                <input id="username" name="username" onChange={handleChange} type="text" placeholder="@username" value={formData?.username}
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>

                            <div>
                                <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-1">Alamat</label>
                                <textarea 
                                    id="address" 
                                    name="address" 
                                    rows={3} 
                                    placeholder="Alamat lengkap"                                  
                                    value={formData?.address ?? ""} 
                                    onChange={handleChange} 
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                    /> 
                            </div>

                            <div>
                                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-900 mb-1">Nomor Telepon (Opsional)</label>
                                <input id="phoneNumber" name="phoneNumber" onChange={handleChange} type="text" placeholder="0812xxxx" value={formData?.phoneNumber ?? ""}
                                    className="w-full px-2 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition" />
                            </div>

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