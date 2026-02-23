import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { EyeIcon, EyeOffIcon, ArrowRightIcon, FileKeyIcon, XIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

import { backendAPI as backend } from "@/lib/api"


const unlockSchema = z.object({
    password: z.string().min(1, "Master password is required to unlock the vault."),
    keyFile: z.string().optional()
})

type UnlockFormValues = z.infer<typeof unlockSchema>

export const UnlockVault = () => {

    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate()

    const form = useForm<UnlockFormValues>({
        resolver: zodResolver(unlockSchema),
        defaultValues: {
            password: "",
            keyFile: ""
        },
    })

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword)
    }

    const onSubmit = async (data: UnlockFormValues) => {
        const loadingId = toast.loading("Unlocking vault...")
        
        try {
            const success = await backend.unlockVault(data.password, data.keyFile);
            
            if (success) {
                toast.success("Vault unlocked successfully!", { id: loadingId })
                navigate("/dashboard") 
            } else {
                toast.error("Invalid password or key file", { 
                    id: loadingId,
                    description: "Please check your credentials and try again."
                })
                form.setValue("password", "")
            }
        } catch (error) {
            console.error("Unlock error:", error)
            toast.error("An unexpected error occurred", { id: loadingId })
        }
    }

    const handleBrowseKeyFile = async (onChange: (...event: any[]) => void) => {
        const filePath = await backend.selectKeyFile();
        if (filePath) {
            onChange(filePath);
        }
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex md:max-w-sm max-w-xs flex-col gap-4">
            
            <Controller name="password" control={form.control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <div className="flex w-full items-start gap-2">
                            <div className="flex-1 flex flex-col">
                                <InputGroup>
                                    <InputGroupInput {...field} id={field.name} type={showPassword ? "text" : "password"} placeholder="Master password..." aria-invalid={fieldState.invalid} />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={togglePasswordVisibility} aria-label={showPassword ? "Hide password" : "Show password"} >
                                            {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                                        </InputGroupButton>
                                    </InputGroupAddon>
                                </InputGroup>
                                {fieldState.invalid && <FieldError errors={[fieldState.error]} className="mt-1.5" />}
                            </div>
                            <Button type="submit" size="icon">
                                <ArrowRightIcon className="w-4 h-4" />
                            </Button>
                        </div>
                    </Field>
                )}
            />

            <Separator />

            <Controller name="keyFile" control={form.control} render={({ field }) => (
                    <Field className="flex flex-col items-center px-1">
                        <div className="flex text-nowrap flex-col flex-1">
                            <span className="text-sm font-medium">Key File (Optional)</span>
                            <p className="truncate text-xs text-muted-foreground">{field.value ? `Selected: ${field.value}` : "No key file selected"}</p>
                        </div>
                       <div className="flex items-center gap-1 shrink-0">
                            {field.value && (
                                <Button variant="ghost" size="icon" type="button" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => field.onChange("")} aria-label="Clear key file">
                                    <XIcon className="w-4 h-4" />
                                </Button>
                            )}
                            <Button variant="secondary" size="sm" className="flex-1 min-w-0" type="button" onClick={() => handleBrowseKeyFile(field.onChange)}>
                                <FileKeyIcon className="w-4 h-4 mr-1" />
                                <span>Browse</span>
                            </Button>
                        </div>
                    </Field>
                )}
            />

        </form>
    )
}