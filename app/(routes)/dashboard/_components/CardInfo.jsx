"use client"

import { PiggyBank, ReceiptText, Wallet } from "lucide-react"
import { useEffect, useState } from "react"


function CardInfo({budget}) {
    const [totalBudget, setTotalBudget] = useState(0);
    const [totalSpend, setTotalSpend] = useState(0);
    const [items, setTotalItems] = useState(0);
    useEffect(() => {
        budget&&calculateCardInfo()
    }, [budget])

    const calculateCardInfo = () => {
        console.log(budget)
        let totalBudget_=0;
        let totalSpend_ = 0;
        let totalItems_ = 0
        budget.forEach(element => {
            totalBudget_ = totalBudget_ + Number(element.amount)
            totalSpend_ = totalSpend_ + element.totalSpend
            totalItems_ = totalItems_ + element.totalItem

            setTotalBudget(totalBudget_)
            setTotalSpend(totalSpend_)
            setTotalItems(totalItems_)
        })
        console.log(totalBudget_, totalSpend_)
        
    }
  return (
    <div>
        {budget ?
        (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <div className="p-7 border rounded-lg flex items-center justify-between">
                    <div>   
                    <h2 className="text-sm">Total Budget</h2>
                    <h2 className="font-bold text-2xl">${totalBudget}</h2>
                    </div>
                    <PiggyBank className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="p-7 border rounded-lg flex items-center justify-between">
                    <div>   
                    <h2 className="text-sm">Total Spent</h2>
                    <h2 className="font-bold text-2xl">${totalSpend}</h2>
                    </div>
                    <ReceiptText className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
                <div className="p-7 border rounded-lg flex items-center justify-between">
                    <div>   
                    <h2 className="text-sm">No. of Expenses</h2>
                    <h2 className="font-bold text-2xl">{items}</h2>
                    </div>
                    <Wallet className="bg-primary p-3 h-12 w-12 rounded-full text-white" />
                </div>
            </div> ) 
            
            :

            (
            <div className="mt-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {[1, 2, 3].map((item, index) => (
                <div className="h-[120px] w-full bg-slate-200 rounded-lg animate-pulse">
                    
                </div>
                ))}
            </div>
            )
        }
        </div>
    
  )
}

export default CardInfo
