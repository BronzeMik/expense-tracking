"use client"
import { ArrowLeft } from "lucide-react"
import AllExpenseList from "./_components/AllExpensesList"
import { useRouter } from "next/navigation"


function Expenses() {
    const route = useRouter();
  return (
    <div className="flex flex-col w-full p-5">
        <div className="flex gap-2 items-center">
        <ArrowLeft className="cursor-pointer" onClick={() => route.replace('/dashboard')}/>
        <h2 className="font-bold text-3xl">My Expenses</h2>
      </div>
        <p className="p-2">View all your expenses</p>
        <AllExpenseList />
    </div>
  )
}

export default Expenses
