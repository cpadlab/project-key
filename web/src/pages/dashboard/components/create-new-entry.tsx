import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

import { backendAPI as backend } from "@/lib/api"
import type { GroupModel } from "@/global"

const entrySchema = z.object({
    title: z.string().min(1, "Title is required").max(100),
    username: z.string().optional().nullable(),
    password: z.string().min(1, "Password is required"),
    url: z.string().optional().nullable(),
    notes: z.string().optional().nullable(),
    group: z.string().default("Personal"),
    color: z.string().optional().nullable(),
    icon: z.number().optional().nullable(),
    tags: z.array(z.string()).default([]),
    is_favorite: z.boolean().default(false),
})

type EntryFormData = z.infer<typeof entrySchema>

interface CreateNewEntryDialogProps {
    children: React.ReactNode
}

export const CreateNewEntryDialog = ({ children }: CreateNewEntryDialogProps) => {
    
    const [open, setOpen] = useState(false)
    const [groups, setGroups] = useState<GroupModel[]>([])
    const [isLoadingGroups, setIsLoadingGroups] = useState(false)

    const form = useForm<EntryFormData>({
        resolver: zodResolver(entrySchema),
        defaultValues: {
            title: "",
            username: "",
            password: "",
            url: "",
            notes: "",
            group: "Personal",
            color: null,
            icon: 0,
            tags: [],
            is_favorite: false,
        },
    })

    const fetchGroups = async () => {
        setIsLoadingGroups(true)
        try {
            const data = await backend.listGroups()
            setGroups(data)
        } catch (error) {
            console.error("Error loading groups:", error)
            toast.error("Could not load groups list")
        } finally {
            setIsLoadingGroups(false)
        }
    }

    // Recargar grupos cada vez que se abre el diálogo
    useEffect(() => {
        if (open) {
            fetchGroups()
        }
    }, [open])

    const onSubmit = async (data: EntryFormData) => {
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-150 max-h-[90vh] overflow-y-auto">
                
                <DialogHeader>
                    <DialogTitle>Add New Entry</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your new password entry.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 border-2 border-dashed border-muted rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                    Form fields will be added in Phase 2
                </div>

            </DialogContent>
        </Dialog>
    )
}