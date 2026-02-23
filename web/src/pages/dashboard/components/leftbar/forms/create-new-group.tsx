import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SaveIcon } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"

import { ColorSelector } from "@/components/blocks/color-selector"
import { IconSelector } from "@/components/blocks/icon-selector"
import { Separator } from "@/components/ui/separator"

const groupSchema = z.object({
    name: z.string().min(1, "The group name is required.").max(50, "Name is too long."),
    icon: z.number().optional(),
    color: z.string().optional()
})

type GroupFormData = z.infer<typeof groupSchema>

interface CreateGroupDialogProps {
    children: React.ReactNode;
}

export const CreateGroupDialog = ({ children }: CreateGroupDialogProps) => {
    
    const [open, setOpen] = useState(false)

    const form = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: "",
            icon: 48,
            color: undefined
        },
    })

    const onSubmit = async (data: GroupFormData) => {
        try {
            console.log("Datos del nuevo grupo listos para Python:", data)
            toast.success("Group created successfully!")
            form.reset()
            setOpen(false)
        } catch (error) {
            console.error("Error creating group:", error)
            toast.error("An unexpected error occurred.")
        }
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
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Group</DialogTitle>
                    <DialogDescription>
                        Organize your vault by creating a new category group.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="space-y-6 pt-2 pb-4">
                            
                        <Controller name="name" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="name">Group Name</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput {...field} id="name" placeholder="e.g. Social Media, Banking..." aria-invalid={fieldState.invalid}/>
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )} />

                        <Controller name="color" control={form.control} render={({ field }) => (
                            <Field>
                                <FieldLabel>Group Color (Optional)</FieldLabel>
                                <FieldDescription>A custom color makes the group easier to spot.</FieldDescription>
                                <ColorSelector value={field.value} onChange={field.onChange} />
                            </Field>
                        )} />

                        <Controller name="icon" control={form.control} render={({ field }) => (
                            <Field>
                                <FieldLabel>Group Icon</FieldLabel>
                                <IconSelector value={field.value} onChange={field.onChange} />
                            </Field>
                        )} />

                    </div>

                    <Separator />
 
                    <div className="flex justify-end pt-4">
                        <Button type="submit">
                            <SaveIcon className="w-4 h-4" />
                            <span>Create Group</span>
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}