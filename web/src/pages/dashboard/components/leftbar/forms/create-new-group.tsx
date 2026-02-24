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
import { Separator } from "@/components/ui/separator"

import { backendAPI as backend } from "@/lib/api"
import { ColorSelector } from "@/components/blocks/color-selector"
import { IconSelector } from "@/components/blocks/icon-selector"

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
        const loadingId = toast.loading("Creating group...")
        try {
            const success = await backend.createGroup(
                data.name, 
                data.icon || 48, 
                data.color
            );

            if (success) {
                toast.success("Group created successfully!", { id: loadingId })
                window.dispatchEvent(new CustomEvent('vault-changed'));
                form.reset()
                setOpen(false)
            } else {
                toast.error("Failed to create the group", { id: loadingId })
            }
        } catch (error) {
            toast.error("An unexpected error occurred", { id: loadingId })
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
                    <div className="space-y-4 pt-2 pb-4">
                            
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