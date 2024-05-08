import { Button } from "@/components/ui/button"
import { PenBox } from "lucide-react"
import { useEffect, useState } from "react";
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
  } from "@/components/ui/alert-dialog";
  import EmojiPicker from "emoji-picker-react";
  import { Input } from "@/components/ui/input";
import { useUser } from "@clerk/nextjs";
import { db } from "@/utils/dbConfig";
import { Budgets } from "@/utils/schema";
import { toast } from "sonner";
import { eq } from "drizzle-orm";


function EditButton({budget,refreshData}) {
    const[emoji, setEmoji] = useState();
    const [openEmojiDialog, setOpenEmojiDialog] = useState(false)

    const [name,setName]=useState();
    const [amount,setAmount]=useState();
    const {user} = useUser();

    useEffect(() => {
        if(budget) {
            setEmoji(budget?.icon)
            setName(budget?.name)
            setAmount(budget?.amount)
        }
        
    }, [budget])
    const onUpdateBudget = async() => {
        const result = await db.update(Budgets)
        .set({
            name: name,
            amount: amount,
            icon: emoji
        })
        .where(eq(Budgets.id,budget?.id))

        if(result) {
            refreshData()
            toast('Budget Updated')
        }
    }
  return (
    <div>
        {budget && <AlertDialog>
          <AlertDialogTrigger asChild>
          <Button className="flex gap-2"><PenBox /> Edit
          </Button>
          </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Update Budget</AlertDialogTitle>
                <AlertDialogDescription>
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
                        defaultValue={budget.name}
                        onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mt-2">
                        <h2 className="text-black font-medium my-1">Budget Amount</h2>
                        <Input placeholder='e.g 5000'
                        type='number'
                        defaultValue={budget.amount}
                        onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>
                  <Button
                  onClick={()=>onUpdateBudget()}
                  >Update Budget</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>}
    </div>
  )
}

export default EditButton
