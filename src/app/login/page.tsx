'use client'
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Login() {
     const [formData, setFormData] = useState({
        pass: "",
        username: "",
      });
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>)=> {
    event.preventDefault(); // Stop page reload
        let isSuccess = false;
        try {
        const response = await fetch('/login/api/login', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        const getResponse = await response.json()
        
            if(getResponse.code == 1)
            {
                getResponse.message.forEach((msg:string[]) => {
                    toast.success(msg);
                });
                isSuccess = true;
            }
            else
            {
                getResponse.message.forEach((msg:string[]) => {
                    toast.error(msg);
                });
            }
        
        } catch (error) {
            console.error("Gagal:", error);
            toast.error("Silahkan Hubungi Aministrator");
        } 
          if (isSuccess) {
            redirect("/dashboard/user");
        }
    }
    return (
        <div className="min-h-screen bg-slate-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-slate-200 py-8 px-4 shadow-xl rounded-2xl sm:px-10 border border-gray-100">
                    <div className="flex justify-center">
                        <div className="bg-slate-800 p-3 rounded-xl shadow-lg">
                            <svg 
                            className="h-10 w-10 text-white" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24" 
                            xmlns="http://w3.org"
                            >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                            />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center pb-5 text-3xl font-extrabold text-gray-900">
                        Masuk ke Akun Anda
                    </h2>
                    <form className="space-y-6" action="#" method="POST" autoComplete="off" onSubmit={handleSubmit}>
                        {/* <!-- Input Username/Email --> */}
                        <div>
                            <label htmlFor="username" className="block text-md font-medium text-gray-700">
                            Username
                            </label>
                            <div className="mt-1">
                            <input id="username" name="username" type="text" required   placeholder="Username" onChange={handleChange} 
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-200 text-gray-700" />
                            </div>
                        </div>

                        {/* <!-- Input Password --> */}
                        <div>
                            <label htmlFor="password" className="block text-md font-medium text-gray-700">
                            Kata Sandi
                            </label>
                            <div className="mt-1">
                            <input id="pass" name="pass" type="password" required  onChange={handleChange}  placeholder="Kata Sandi"
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm transition duration-200 text-gray-700" />
                            </div>
                        </div>

                        {/* <div className="flex items-center justify-between">
                            <div className="flex items-center">
                            <input id="remember-me" name="remember-me" type="checkbox" 
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded transition duration-200" />
                            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                Ingat saya
                            </label>
                            </div>

                            <div className="text-sm">
                            <button className="font-medium text-green-700 hover:text-green-600 transition duration-200">
                                Lupa sandi?
                            </button>
                            </div>
                        </div> */}

                    {/* <!-- Submit Button --> */}
                        <div>
                            <button type="submit" 
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-200 transform active:scale-95">
                            Masuk Sekarang
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>

    )
}