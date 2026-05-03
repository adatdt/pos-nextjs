"use client";
import { signOut } from "next-auth/react"; 
import Link from "next/link";
export default function Header() {
return (
	<header className="flex items-center justify-between border-b  bg-slate-900 text-white  px-6 py-2 shadow-sm">
		<div className="flex items-center gap-3">
			
		</div>

		<div className="flex items-center gap-3">
			<Link
			href="#"
			className="flex items-center gap-2 rounded-lg text-sm px-2 py-2 text-white hover:bg-slate-600 transition-all cursor-pointer"
			onClick={(e) => {
			e.preventDefault(); // Mencegah scroll ke atas karena href="#"
			signOut({ callbackUrl: "/login" });
			}}
			>
			{/* Logout SVG Icon */}
				<svg 
				xmlns="http://w3.org" 
				width="14" 
				height="14" 
				viewBox="0 0 24 24" 
				fill="none" 
				stroke="currentColor" 
				strokeWidth="2" 
				strokeLinecap="round" 
				strokeLinejoin="round"
				>
					<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
					<polyline points="16 17 21 12 16 7" />
					<line x1="21" x2="9" y1="12" y2="12" />
				</svg>

				<span className="font-medium text-white">Logout</span>
			</Link>
		</div>
	</header>
)
}
