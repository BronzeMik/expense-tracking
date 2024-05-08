"use client"
import { Button } from "@/components/ui/button"
import { UserButton, useUser } from "@clerk/nextjs"
import { Link } from "lucide-react"
import Image from "next/image"
import img from '../../public/logo.png'

import { useRouter } from "next/navigation"

function Header() {
    const {user, isSignedIn} = useUser()
    const route = useRouter();
  return (
    <div className="p-5 flex justify-between items-center border shadow-md">
        <Image 
        src={img}
        alt='logo'
        width={160}
        height={100}
        />

        {isSignedIn ? 
        <div className="flex gap-2 p-2">
          <Button className="bg-primary hover:bg-white hover:text-primary hover:border-primary" onClick={() => route.replace('/dashboard')}>Dashboard</Button>
          <UserButton />
        </div>
         : 
        <a href={'/sign-in'}>
            <Button
            variant='outline'
            >Get Started</Button>
        </a>
        }
        
    </div>
  )
}

export default Header
