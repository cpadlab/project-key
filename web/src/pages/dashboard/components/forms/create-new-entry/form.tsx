import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { SaveIcon } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"


import { backendAPI as backend } from "@/lib/api"
import { MainFields } from "./fields/main-fields"
import { VisualFields } from "./fields/visual-fields"
import { ExtraFields } from "./fields/extra-fields"
import { useGroup } from "@/contexts/group-context"

const entrySchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    username: z.string(),
    password: z.string().min(1, "Password is required"),
    url: z.string(),
    notes: z.string(),
    group: z.string().min(1, "Please select a group"),
    color: z.string().optional().nullable(),
    icon: z.number().optional().nullable(),
    tags: z.array(z.string()),
    is_favorite: z.boolean(),
})

type EntryFormData = z.infer<typeof entrySchema>

export const CreateNewEntryDialog = ({ children }: { children: React.ReactNode }) => {
    
    const [open, setOpen] = useState(false)
    const { groups } = useGroup();

    const form = useForm<EntryFormData>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "", username: "", password: "", url: "",
            notes: "", group: "Personal", color: null, icon: 0,
            tags: [], is_favorite: false,
        },
    })

    const onSubmit = async (data: EntryFormData) => {
        const loadingId = toast.loading("Saving new entry...")
        try {
            const success = await backend.addEntry(data)
            if (success) {
                toast.success("Entry added successfully!", { id: loadingId })
                window.dispatchEvent(new CustomEvent('vault-changed'))
                setOpen(false)
            } else {
                toast.error("Failed to add entry. Vault might be locked.", { id: loadingId })
            }
        } catch (error) {
            toast.error("An unexpected error occurred", { id: loadingId })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) form.reset(); }}>
            
            <DialogTrigger asChild>{children}</DialogTrigger>
            
            <DialogContent className="sm:max-w-162.5 max-h-[95vh] overflow-hidden">
                <ScrollArea className="sm:max-w-162.5 max-h-[95vh] overflow-y-auto pb-8">

                    <DialogHeader>
                        <DialogTitle>Create New Entry</DialogTitle>
                        <DialogDescription>Add a new set of credentials to your vault.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <MainFields control={form.control} groups={groups} />
                        <Separator />
                        <ExtraFields control={form.control} />
                        <Separator />
                        <VisualFields control={form.control} />
                        <div className="flex justify-end gap-3 pt-4 border-t sticky bottom-0 bg-background pb-2">
                            <Button type="submit" className="w-full sm:w-auto">
                                <SaveIcon className="size-4 mr-2" /> Create Entry
                            </Button>
                        </div>
                    </form>

                </ScrollArea>
            </DialogContent>

        </Dialog>
    )
}