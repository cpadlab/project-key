import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { EyeIcon, EyeOffIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Field, FieldLabel, FieldError, FieldDescription } from "@/components/ui/field"


const formSchema = z.object({
    password: z
        .string()
        .min(8, "The password must be at least 8 characters long."),
    confirmPassword: z
        .string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
})

type FormData = z.infer<typeof formSchema>

interface CreateNewVaultDialogProps {
    children: React.ReactNode;
}

export const CreateNewVaultDialog = ({ children }: CreateNewVaultDialogProps) => {
    
    const [open, setOpen] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            console.log("Master Password valid:", data.password)
            toast.success("Vault created successfully!")
            form.reset()
            setOpen(false)
        } catch (error) {
            toast.error("Error creating the vault.")
        }
    }

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen)
        if (!isOpen) {
            form.reset()
            setShowPassword(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>

            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Create New Vault</DialogTitle>
                    <DialogDescription>
                        Set a strong master password for your new KDBX database. 
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                    
                    <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="password">Master Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput {...field} id="password" type={showPassword ? "text" : "password"} placeholder="Enter your master password" aria-invalid={fieldState.invalid} />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"}>
                                            {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>Must be at least 8 characters.</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <Controller name="confirmPassword" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput {...field} id="confirmPassword" type={showPassword ? "text" : "password"} placeholder="Repeat your password" aria-invalid={fieldState.invalid} />
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />

                    <div className="flex justify-end pt-4">
                        <Button type="submit">
                            <SaveIcon className="w-4 h-4" />
                            <span>Save Vault</span>
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}