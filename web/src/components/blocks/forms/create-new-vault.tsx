import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { EyeIcon, EyeOffIcon, SaveIcon } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { Field, FieldLabel, FieldError, FieldDescription, FieldContent } from "@/components/ui/field"
import { Switch } from "@/components/ui/switch"

import { backendAPI as backend } from "@/lib/api"
import { useAppNavigate } from "@/hooks/use-app-navigate"

const formSchema = z.object({
    filename: z
        .string()
        .min(1, "A name for the vault is required.")
        .max(50, "The name is too long.")
        .regex(/^[a-zA-Z0-9_\-\s]+$/, "Only letters, numbers, spaces, hyphens, and underscores are allowed."),
    password: z
        .string()
        .min(8, "The password must be at least 8 characters long."),
    confirmPassword: z
        .string(),
    useKeyfile: z
        .boolean(),
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

    const { navigate } = useAppNavigate()

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            filename: "",
            password: "",
            confirmPassword: "",
            useKeyfile: false,
        },
    })

    const onSubmit = async (data: FormData) => {
        try {
            
            const kdbxPath = await backend.selectSaveLocation(
                `${data.filename}.kdbx`, 
                "KeePass Database (*.kdbx)"
            )
            
            if (!kdbxPath) return; 
            let keyfilePath = null;

            if (data.useKeyfile) {
                const keyPath = await backend.selectSaveLocation(
                    `${data.filename}.key`, 
                    "KeePass Keyfile (*.key)"
                )
                if (!keyPath) return;
                keyfilePath = await backend.generateKeyfile(keyPath)
                if (!keyfilePath) {
                    toast.error("Failed to generate the keyfile.")
                    return
                }
            }

            const success = await backend.createNewVault(kdbxPath, data.password, keyfilePath)
            
            if (success) {
                toast.success("Vault created successfully!")
                form.reset()
                setOpen(false)
                navigate("/dashboard")
            } else {
                toast.error("Failed to create the vault. Check console for details.")
            }

        } catch (error) {
            console.error("Connection error:", error)
            toast.error("An unexpected error occurred.")
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

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">

                    <Controller name="filename" control={form.control} render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor="filename">Vault Name</FieldLabel>
                                <InputGroup>
                                    <InputGroupInput {...field} id="filename" placeholder="MyPersonalVault" aria-invalid={fieldState.invalid}/>
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>.kdbx</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                                <FieldDescription>The name for your new database file.</FieldDescription>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                            </Field>
                        )}
                    />
                    
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

                    <Controller name="useKeyfile" control={form.control} render={({ field, fieldState }) => (
                            <Field orientation="horizontal" data-invalid={fieldState.invalid} className="mt-2 border rounded-lg p-3">
                                <FieldContent>
                                    <FieldLabel htmlFor="useKeyfile">Generate Keyfile</FieldLabel>
                                    <FieldDescription>Adds an extra layer of security. You will need both the password and this file to unlock the vault.</FieldDescription>
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                </FieldContent>
                                <Switch id="useKeyfile" name={field.name} checked={field.value} onCheckedChange={field.onChange} aria-invalid={fieldState.invalid}/>
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