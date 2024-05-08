
"use client"
import { db } from "@/utils/dbConfig";
import CreateBudget from "./CreateBudget";
import { desc, eq, getTableColumns, sql } from "drizzle-orm";
import { Budgets, Expenses } from "@/utils/schema";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Budget from "../page";
import BudgetItem from "./BudgetItem";
import { numeric } from "drizzle-orm/pg-core";

  

function BudgetList() {

  const [budgetList, setBudgetList] = useState()
  const [loading, setLoading] = useState()

  //get user
  const {user} = useUser();

  useEffect(() => {
    user&&getBudgetList()
  }, [user])
  //Query table for budget list
  const getBudgetList=async() => {
    setLoading(true)

    const result = await db.select({
      ...getTableColumns(Budgets),
      totalSpend:sql`sum(cast(${Expenses.amount} as float))`.mapWith(Number),
      totalItem: sql `count(${Expenses.id})`.mapWith(Number),
    }).from(Budgets)
    .leftJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
    .where(eq(Budgets.createdBy,user?.primaryEmailAddress?.emailAddress))
    .groupBy(Budgets.id)
    .orderBy(desc(Budgets.id))

    setBudgetList(result)
    console.log(result)
    setLoading(false)
  }

  return (
    <div className="mt-7">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <CreateBudget refreshData={()=>getBudgetList()}/>
            
            {!loading ? budgetList?.map((budget, index) => (
              <BudgetItem key={index} budget={budget} />
            )): [1,2,3,4,5].map((item, index) => (
              <div key={index} className="w-full bg-slate-300 rounded-lg h-[150px] animate-pulse">

              </div>
            ))}
        </div>

        
    </div>
  )
}

export default BudgetList
