import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { db } from "@/utils/dbConfig"
import { Budgets, Expenses } from "@/utils/schema"
import { useState } from "react"
import { toast } from "sonner"
import dateFormat, { masks } from "dateformat";
import { Loader } from "lucide-react"


function AddExpense({budgetId,user,refreshData}) {
    const [name, setName] = useState('')
    const [amount, setAmount] = useState('')
    const [loading, setLoading] = useState(false)

    const addNewExpense = async() => {
        setLoading(true)
        const now = new Date()
        const result = await db.insert(Expenses).values({
            name: name,
            amount: parseFloat(amount).toFixed(2),
            budgetId: budgetId,
            createdAt: dateFormat(now, "dddd, mmmm dS, yyyy")
        }).returning({insertedId:Budgets.id})

        console.log(result)

        if(result) {
            setAmount('')
            setName('')
            setLoading(false)
            refreshData() 
            toast('New Expense Added!')
        }
        setLoading(false)
    }
  return (
    <div className="border p-5 rounded-lg">
        <h2 className="font-bold text-lg">Add Expense</h2>
        <div>
            <div className="mt-2">
                <h2 className="text-black font-medium my-1">Expense Name</h2>
                <Input value={name} placeholder='e.g Home Decor' onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="mt-2">
                <h2 className="text-black font-medium my-1">Expense Amount</h2>
                <Input value={amount} placeholder='e.g 1000' onChange={(e) => setAmount(e.target.value)} />
            </div>
        </div>
        <Button disabled={!(name&&amount)||loading} className="mt-3 w-full"
        onClick={()=>addNewExpense()}
        >{loading? <Loader className="animate-spin"/> : 'Add Expense'}</Button>
    </div>
  )
}

export default AddExpense
