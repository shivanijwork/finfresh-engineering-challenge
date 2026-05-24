"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";



export default function Navbar() {

    const router = useRouter();

    const [open, setOpen] = useState(false);

    const [scrolled, setScrolled] = useState(false);

    const [user, setUser] = useState(null);

    useEffect(() => {

        const userData = localStorage.getItem("user");

        if (userData && userData !== "undefined") {

            setUser(JSON.parse(userData));
        }

    }, []);

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

        router.push("/login");
    };

    return (

        <nav
            className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md transition-all duration-300 ${scrolled
                ? "border-b border-orange-100 shadow-sm shadow-orange-50"
                : "border-b border-transparent"
                }`}
        >

            {/* Main row */}
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

                {/* Logo */}
                <Link
                    href="/"
                    className="flex items-center gap-2 flex-shrink-0 group"
                >

                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-black text-sm font-bold shadow-md">
                        F
                    </div>

                    <span className="text-[19px] font-bold tracking-tight text-gray-900">
                        Fin<span className="text-primary">Fresh</span>
                    </span>

                </Link>

                {/* Desktop nav */}
                

                {/* Right side */}
                <div className="hidden md:flex items-center gap-3">

                    {user ? (

                        <>
                            {/* Avatar */}
                            <div className="flex items-center gap-3">

                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-bold text-sm uppercase">
                                    {user?.name?.charAt(0)}
                                </div>

                                <button
                                    onClick={handleLogout}
                                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition cursor-pointer"
                                >
                                    Logout
                                </button>

                            </div>
                        </>

                    ) : (

                        <>
                            <Link
                                href="/login"
                                className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:border-primary hover:text-primary"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/register"
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white"
                            >
                                Get started
                            </Link>
                        </>

                    )}

                </div>

                {/* Mobile Hamburger */}
                <button
                    onClick={() => setOpen(!open)}
                    className="md:hidden flex flex-col justify-center gap-[5px]"
                >

                    <span
                        className={`block h-0.5 w-5 bg-gray-600 transition-transform ${open ? "translate-y-[7px] rotate-45" : ""
                            }`}
                    />

                    <span
                        className={`block h-0.5 w-5 bg-gray-600 ${open ? "opacity-0" : ""
                            }`}
                    />

                    <span
                        className={`block h-0.5 w-5 bg-gray-600 transition-transform ${open ? "-translate-y-[7px] -rotate-45" : ""
                            }`}
                    />

                </button>

            </div>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${open
                    ? "max-h-96 opacity-100 border-t border-orange-100"
                    : "max-h-0 opacity-0"
                    }`}
            >

                <div className="mx-auto max-w-6xl flex flex-col gap-2 px-6 py-4">

                  

                    <div className="h-px bg-orange-100 my-2" />

                    {user ? (

                        <button
                            onClick={handleLogout}
                            className="w-full bg-black text-white py-2 rounded-lg"
                        >
                            Logout
                        </button>

                    ) : (

                        <div className="flex gap-2">

                            <Link
                                href="/login"
                                className="flex-1 border border-gray-200 py-2 rounded-lg text-center"
                            >
                                Login
                            </Link>

                            <Link
                                href="/register"
                                className="flex-1 bg-primary text-white py-2 rounded-lg text-center"
                            >
                                Register
                            </Link>

                        </div>

                    )}

                </div>

            </div>

        </nav>
    );
}