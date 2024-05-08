
"use client"


import { useEffect, useState } from "react"
import { Budgets, Expenses } from "@/utils/schema";
import { desc, eq, getTableColumns, isNotNull, sql } from "drizzle-orm";
import { db } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseList from "../_components/ExpenseList";
import { Button } from "@/components/ui/button";
import { ArrowLeft, PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditButton from "../_components/EditButton";


function MyExpenses({params}) {
  const {user} = useUser()
  const [budgetInfo, setBudgetInfo] = useState(null)
  const [expenseInfo, setExpenseInfo] = useState(null)
  const route = useRouter();
  useEffect(() => {
    user&&getBudgetInformation()
  },[params])

  const getBudgetInformation = async() => {
    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql`sum(cast(${Expenses.amount} as float))`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number),
    })
    .from(Budgets)
    .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .where(eq(Budgets.id,params.id))
    .groupBy(Budgets.id)

    setBudgetInfo(result[0])
    getExpensesList()
   
  }

  //Get list of expenses
  const getExpensesList = async() => {
    const result = await db.select().from(Expenses)
    .where(eq(Expenses.budgetId,params.id))
    .orderBy(desc(Expenses.id))
    setExpenseInfo(result)
    
    
  }

  const deleteBudget = async() => {

    //Check if budget has expenses
    const hasExpenses = await db.select().from(Expenses)
    .where(eq(Expenses.budgetId, params.id))
    //if budget has expenses
    if(hasExpenses) {

      //delete expenses from Expenses table
      const deleteCascadeExpense = await db.delete(Expenses)
      .where(eq(Expenses.budgetId, params.id))
      .returning();

      //If expenses successfully delete
      if(deleteCascadeExpense){
        //delete budget from Budgets table
        const result = await db.delete(Budgets)
          .where(eq(Budgets.id,params.id))
          .returning();
          console.log(result)

          //Send result message
          if(result) {
            toast('Budget deleted!')
            route.replace('/dashboard/budgets')
          } else{
            toast('Unable to delete budget, try again')
          }
        } 
    //If no expenses in Expeses table
  } else {
    //Delete budget from Budgets table
    const result = await db.delete(Budgets)
      .where(eq(Budgets.id,params.id))
      .returning();
      console.log(result)

      if(result) {
        toast('Budget deleted!')
        route.replace('/dashboard/budgets')
      } else{
        toast('Unable to delete budget, try again')
      }
  }
    


        
  }
  return (
    <div className="p-10">
      <div className="flex justify-between items-center">
      <div className="flex gap-2 items-center">
        <ArrowLeft className="cursor-pointer" onClick={() => route.replace('/dashboard/budgets')}/>
        <h2 className="font-bold text-3xl">{budgetInfo?.name} Expenses</h2>
      </div>
        <div className="flex gap-2 items-center">
          {/* Edit Budget buton */}
          <EditButton budget={budgetInfo} refreshData={() => getBudgetInformation()}/>
          {/* Alert to delete expense */}
        <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button className='flex gap-2' variant="destructive">
            <Trash />Delete Budget
          </Button>
          </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your current budget along with expenses.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Button
                  onClick={()=>deleteBudget()}
                  >Delete Budget</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        </div>
        

      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 mt-6 gap-5">
        {budgetInfo ? <BudgetItem budget={budgetInfo} /> : <div className="h-[150px] w-full bg-slate-200 rounded-lg animate-pulse"></div>}
        <AddExpense 
        budgetId={params.id} 
        user={user}
        refreshData={()=>getBudgetInformation()}
        />
      </div>
      <div className="mt-4">
        <h2 className="font-bold text-lg">Latest Expenses</h2>
        
        {expenseInfo &&
        <ExpenseList 
        expenseList={expenseInfo}
        refreshData={()=>{
          getBudgetInformation()
        }}
        />}
      </div>
    </div>
  )
}

export default MyExpenses
