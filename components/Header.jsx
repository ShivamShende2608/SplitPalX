"use client";


import { useStoreUser } from '@/hooks/use-store-user';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Authenticated, Unauthenticated } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { BarLoader } from "react-spinners";
import { Button } from './ui/button';
import { LayoutDashboard } from 'lucide-react';

const Header = () => {

  const {isLoading } = useStoreUser();
  const path = usePathname();



  return (
    <header  className="fixed top-0 w-full border-b bg-white/95 backdrop-blur z-50 supports-[backdrop-filter]:bg-white/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="absolute -top-3 -left-1 p-0 m-0">
  <Link href="/" className="block p-0 m-0">
    <Image
      src="/logos/logo.png"
      alt="SplitPalX Logo"
      width={200}
      height={120}
      className="h-24 w-auto object-contain p-0 m-0"
    />
  </Link>
</div>


       {path==="/" && (
      <div className="hidden md:flex items-center gap-6 absolute top-2.5 left-1/2 transform -translate-x-1/2 p-4">
  <Link href="#features" className="text-sm font-medium hover:text-[#1DA1F2] transition">
    Features
  </Link>
  <Link href="#how-it-works" className="text-sm font-medium hover:text-[#1DA1F2] transition">
    How It Works
  </Link>
</div>


)}  
<div className="flex items-center gap-4">

<Authenticated>
  {/* Desktop version */}
  <div className="hidden md:block absolute top-0 right-12 p-4">
    <Link href="/dashboard">
      <Button
        variant="outline"
        className="inline-flex items-center gap-2 hover:text-[#1DA1F2] hover:border-[#1DA1F2] transition"
      >
        <LayoutDashboard className="h-4 w-4" />
        <span className="text-sm font-medium">Dashboard</span>
      </Button>
    </Link>
  </div>

  {/* Mobile version */}
  <div className="block md:hidden absolute top-0 right-0 p-4">
    <Link href="/dashboard">
      <Button variant="ghost" className="w-10 h-10 p-0 flex items-center justify-center">
        <LayoutDashboard className="h-5 w-5" />
      </Button>
    </Link>
  </div>
   <div className="absolute top-1 right-0 p-4">
    <UserButton />
  </div>
</Authenticated>


  <Unauthenticated>
  <div className="absolute top-0 right-0 flex items-center gap-4 p-4">
    <SignInButton>
      <Button variant="ghost">
        Sign In
      </Button>
    </SignInButton>

    <SignUpButton>
      <Button className="bg-[#1DA1F2] hover:bg-[#1991da] text-white border-none">
        Get Started
      </Button>
    </SignUpButton>
  </div>
</Unauthenticated>

</div>
            </nav>

            { isLoading && <BarLoader width={"100%"} color = "#1E90FF"/>}


    </header>
  )
}

export default Header