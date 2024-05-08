"use client"
import { db } from '@/utils/dbConfig';
import { Budgets, Expenses } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { desc, eq, getTableColumns, sql } from 'drizzle-orm';
import { useEffect, useState } from 'react';
import CardInfo from './_components/CardInfo';
import BarChartDashboard from './_components/BarChartDashboard';
import BudgetItem from './budgets/_components/BudgetItem';
import ExpenseList from './expenses/_components/ExpenseList';
import AllExpenseList from './expenses/_components/AllExpensesList';


function Dashboard() {
  const [summary, setSummary] = useState();
  const [expenses, setExpenses] = useState();
  const {user} = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBudgetList().then(() => console.log(summary))
    
  }, [user])

  
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
    .then((data) => setSummary(data))
    if(summary?.length>0) {
      
      setLoading(false)
      return result
    }
    
    setLoading(false)
    
  }

  


  return (
    <div className='mt-5'>
        <div className='p-5'>
            <div className='p-5'>
                <h2 className='font-bold text-3xl'>Hi, {user?.fullName}✌️</h2>
                <h2>See what's going on with your money. Let's save more with your budgets!</h2>
            </div>
            <CardInfo budget={summary} />
            <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
              <div className='md:col-span-2'>
                <BarChartDashboard budget={summary}/>
                <h2 className='font-bold text-lg mt-5'>All Expenses</h2>
                <AllExpenseList
                expensesList={expenses}
                refreshData={()=>getBudgetList()}
                />
              </div>
              <div className='flex flex-col gap-3 mt-5'>
                <h2 className='font-bold text-lg'>Latest Budgets</h2>
              {!loading ? summary?.map((budget, index) => (
              <BudgetItem key={index} budget={budget} />
            )): [1,2,3,4,5].map((item, index) => (
              <div key={index} className="w-full bg-slate-300 rounded-lg h-[150px] animate-pulse">

              </div>
            ))}
              </div>
            </div>
        </div>
    </div>
  )
}

export default Dashboard
