"use client"
import { db } from "@/utils/dbConfig"
import { Expenses } from "@/utils/schema"
import { eq } from "drizzle-orm"
import { Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"



function ExpenseList({expenseList, refreshData}) {
    
    

    const deleteExpense = async(expense) => {
        const result = await db.delete(Expenses)
        .where(eq(Expenses.id,expense.id))

        if(result) {
            refreshData()
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
        {expenseList?.map((expense, index) => 
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

export default ExpenseList
