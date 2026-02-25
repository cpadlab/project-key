
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { SaveIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputGroup, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"

import { backendAPI as backend } from "@/lib/api"
import { ColorSelector } from "@/components/blocks/color-selector"
import { IconSelector } from "@/components/blocks/icon-selector"
import { type GroupModel } from "@/global"

const groupSchema = z.object({
    name: z.string().min(1, "The group name is required.").max(50, "Name is too long."),
    icon: z.number().optional(),
    color: z.string().optional()
})

type GroupFormData = z.infer<typeof groupSchema>

interface GroupFormDialogProps {
    children?: React.ReactNode;
    mode?: "create" | "edit";
    initialData?: GroupModel;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export const GroupFormDialog = ({ 
    children, 
    mode = "create", 
    initialData,
    open: externalOpen,
    onOpenChange: externalOnOpenChange
}: GroupFormDialogProps) => {
    
    const [internalOpen, setInternalOpen] = useState(false)
    const open = externalOpen ?? internalOpen
    const setOpen = externalOnOpenChange ?? setInternalOpen

    const isEdit = mode === "edit"

    const form = useForm<GroupFormData>({
        resolver: zodResolver(groupSchema),
        defaultValues: {
            name: initialData?.name || "",
            icon: initialData?.icon ?? 48,
            color: initialData?.color || undefined
        },
    })

    const onSubmit = async (data: GroupFormData) => {
        const actionText = isEdit ? "Updating" : "Creating"
        const loadingId = toast.loading(`${actionText} group...`)
        
        try {
            let success = false
            
            if (isEdit && initialData) {
                success = await backend.updateGroup(initialData.name, data.name, data.icon || 48, data.color);
            } else {
                success = await backend.createGroup(data.name, data.icon || 48, data.color);
            }

            if (success) {
                toast.success(`Group ${isEdit ? 'updated' : 'created'} successfully!`, { id: loadingId })
                window.dispatchEvent(new CustomEvent('vault-changed'));
                if (!isEdit) form.reset()
                setOpen(false)
            } else {
                toast.error(`Failed to ${isEdit ? 'update' : 'create'} the group`, { id: loadingId })
            }
        } catch (error) {
            toast.error("An unexpected error occurred", { id: loadingId })
        }
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { setOpen(val); if(!val && !isEdit) form.reset(); }}>
            {children && <DialogTrigger asChild>{children}</DialogTrigger>}
            
            <DialogContent className="sm:max-w-md overflow-hidden p-0">
                <ScrollArea className="max-h-[90vh]">
                    <div className="p-6">
                        <DialogHeader>
                            <DialogTitle>{isEdit ? "Modify Group" : "Create New Group"}</DialogTitle>
                            <DialogDescription>
                                {isEdit 
                                    ? `Update the properties for "${initialData?.name}".` 
                                    : "Organize your vault by creating a new category group."}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
                            <div className="space-y-4 pb-4">
                                <Controller name="name" control={form.control} render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="name">Group Name</FieldLabel>
                                        <InputGroup>
                                            <InputGroupInput {...field} id="name" placeholder="e.g. Social Media..." />
                                        </InputGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                    </Field>
                                )} />

                                <Controller name="color" control={form.control} render={({ field }) => (
                                    <Field>
                                        <FieldLabel>Group Color (Optional)</FieldLabel>
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
                                    {isEdit ? <SaveIcon className="w-4 h-4" /> : <SaveIcon className="w-4 h-4" />}
                                    <span>{isEdit ? "Save Changes" : "Create Group"}</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    )
}