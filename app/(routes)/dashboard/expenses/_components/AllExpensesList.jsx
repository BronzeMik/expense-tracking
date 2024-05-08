"use client"
import { db } from "@/utils/dbConfig"
import { Budgets, Expenses } from "@/utils/schema"
import { useUser } from "@clerk/nextjs"
import { desc, eq } from "drizzle-orm"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"



function AllExpenseList({expenseList, refreshData}) {

    const [expenses, setExpenses] = useState()
    const {user} = useUser();
    useEffect(() => {
        getAllExpenses()
    }, [])
    // Get all expenses belonging to user
  const getAllExpenses = async() => {
    const result = await db.select({
      id: Expenses.id,
      name:Expenses.name,
      amount:Expenses.amount,
      createdAt:Expenses.createdAt
    }).from(Budgets)
    .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .orderBy(desc(Expenses.id))
    
    if(result) {
      setExpenses(result)
      return result
    }    
  }
    const deleteExpense = async(expense) => {
        const result = await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))

        if(result) {
            getAllExpenses()
            if(refreshData) {
                refreshData()
            }
            toast('Expense deleted!')
            
        } 
    }
  return (
    <div className="mt-3">
        <div className="grid grid-cols-4 bg-slate-200 p-2">
            <h2 className="font-bold">Name</h2>
            <h2 className="font-bold">Amount</h2>
            <h2 className="font-bold">Date</h2>
            <h2 className="font-bold">Action</h2>
        </div>
        {expenses?.map((expense, index) => 
            <div className="grid grid-cols-4 bg-slate-50 p-2">
                <h2>{expense.name}</h2>
                <h2>${parseFloat(expense.amount).toFixed(2)}</h2>
                <h2>{expense.createdAt}</h2>
                <h2>
                    <Trash 
                    className="text-black hover:text-red-600 cursor-pointer" 
                    onClick={(() => deleteExpense(expense))}
                    />
                </h2>
            </div>
        )}
    </div>
  )
}

export default AllExpenseList
