"use client"
import { ArrowLeft } from "lucide-react"
import BudgetList from "./_components/BudgetList"
import { useRouter } from "next/navigation"

function Budget() {
  const route = useRouter();


  return (
    <div className="p-10">
      <div className="flex gap-2 w-48 items-center">
        <ArrowLeft className="cursor-pointer" onClick={() => route.replace('/dashboard')}/>
        <h2 className="font-bold text-3xl">My Budgets</h2>
      </div>
      <BudgetList />
    </div>
  )
}

export default Budget
