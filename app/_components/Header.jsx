"use client"
import { Button } from "@/components/ui/button"
import { UserButton, useUser } from "@clerk/nextjs"
import { Link } from "lucide-react"
import Image from "next/image"

function Header() {
    const {user, isSignedIn} = useUser()
  return (
    <div className="p-5 flex justify-between items-center border shadow-md">
        <Image 
        src='./logo.png'
        alt='logo'
        width={160}
        height={100}
        />

        {isSignedIn ? <UserButton /> : 
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
