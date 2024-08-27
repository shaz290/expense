
"use client"
import React, { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import EmojiPicker from 'emoji-picker-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { db } from '@/utils/dbConfig';
import { Budgets } from '@/utils/schema';

const CreateBudget = () => {
    const [emojiIcon, setEmojiIcon] = useState('😊');
    const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const { user } = useUser();

    const onCreateBudget = async () => {
        try {
            console.log('Name:', name);
            console.log('Amount:', amount);
            console.log('CreatedBy:', user?.primaryEmailAddress?.emailAddress);

            const result = await db.insert(Budgets)
                .values({
                    name: name,
                    amount: amount,
                    createdBy: user?.primaryEmailAddress?.emailAddress,
                    icon: emojiIcon
                }).returning('id');

            console.log('Insert result:', result);

            if (result) {
                toast('New Budget Created!');
            } else {
                console.error('Insert operation failed:', result);
            }
        } catch (error) {
            console.error('Error creating budget:', error);
            toast(`An error occurred while creating the budget: ${error.message}`);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='bg-slate-100 p-10 rounded-md item-conter flex flex-col border-2 border-dashed cursor-pointer hover:shadow:md'>
                    <h2 className='text-3xl'>+</h2>
                    <h2>Create New Budget</h2>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Budget</DialogTitle>
                    <DialogDescription>
                        <div className='mt-5'>
                            <Button variant="outline" className='text-lg' onClick={() => setOpenEmojiPicker(!openEmojiPicker)}>
                                {emojiIcon}
                            </Button>
                            {openEmojiPicker && (
                                <div className='absolute'>
                                    <EmojiPicker
                                        onEmojiClick={(e) => {
                                            setEmojiIcon(e.emoji);
                                            setOpenEmojiPicker(false);
                                        }}
                                    />
                                </div>
                            )}
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Name</h2>
                                <Input placeholder="e.g. Home Decor" onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='mt-2'>
                                <h2 className='text-black font-medium my-1'>Budget Amount</h2>
                                <Input
                                    type="number"
                                    placeholder="e.g. 6000₹"
                                    onChange={(e) => setAmount(e.target.value)} />
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button
                            disabled={!(name && amount)}
                            onClick={onCreateBudget}
                            className='mt-5 w-full'
                        >
                            Create Budget
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CreateBudget;
