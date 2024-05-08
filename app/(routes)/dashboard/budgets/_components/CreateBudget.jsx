
"use client"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog"
import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner"
import { ArrowLeft, Loader } from "lucide-react";





function CreateBudget({refreshData}) {
    const[emoji, setEmoji] = useState('🙂');
    const [openEmojiDialog, setOpenEmojiDialog] = useState(false)
    const [loading, setLoading] = useState(false)

    const [name,setName]=useState();
    const [amount,setAmount]=useState();
    //get user
    const {user}=useUser();
    //On Submit create a new budget
    const onCreateBudget = async() => {
        setLoading(true)
        const result = await db.insert(Budgets)
        .values({
            name:name,
            amount:amount,
            createdBy:user?.primaryEmailAddress?.emailAddress,
            icon:emoji
        }).returning({insertedId:Budgets.id})

        if(result) {
            setLoading(false)
            refreshData()
            toast('New Budget Created!')
        }
        setLoading(false)
    }
  return (
    <div>
        
        <Dialog>
            <DialogTrigger asChild>
                <div className="bg-slate-100 p-10 rounded-md items-center flex flex-col border border-dashed cursor-pointer hover:shadow-md">
                    <h2 className="text-3xl">+</h2>
                    <h2>Create New Budget</h2>
                </div>
            </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                <DialogTitle>Create New Budget</DialogTitle>
                <DialogDescription>
                    <div className="mt-5">
                        <Button variant='outline' onClick={() => setOpenEmojiDialog(!openEmojiDialog)}
                        size='lg'
                        className='text-lg'>{emoji}</Button>
                    </div>
                    
                    <div className="absolute">
                        <EmojiPicker 
                        open={openEmojiDialog}
                        onEmojiClick={(e) => {
                        setEmoji(e.emoji)
                        setOpenEmojiDialog(false)
                        }}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Budget Name</h2>
                        <Input placeholder='e.g Home Decor'
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Budget Amount</h2>
                        <Input placeholder='e.g 5000'
                        type='number'
                        onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                    
                </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button disabled={!(name&&amount)||loading} className='mt-5 w-full'
                    onClick={() => onCreateBudget()}
                    >{loading ? <Loader className="animate-spin"/> : 'Create Budget'}</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    </div>
  )
}

export default CreateBudget
