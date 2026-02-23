import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { EyeIcon, EyeOffIcon, ArrowRightIcon, FileKeyIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldError } from "@/components/ui/field"
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupButton} from "@/components/ui/input-group"
import { Separator } from "@/components/ui/separator"


const unlockSchema = z.object({
    password: z.string().min(1, "Master password is required to unlock the vault."),
    keyFile: z.string().optional()
})

type UnlockFormValues = z.infer<typeof unlockSchema>

export const UnlockVault = () => {

    const [showPassword, setShowPassword] = useState(false)

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

    const onSubmit = (data: UnlockFormValues) => {
        console.log("Valid data ready to be sent to backend:", data)
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex max-w-sm flex-col gap-4">
            
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
                            <span className="text-xs text-muted-foreground">{field.value ? `Selected: ${field.value}` : "No key file selected"}</span>
                        </div>
                        <Button variant="secondary" size="sm" className="min-w-0" type="button" onClick={() => field.onChange("C:\\Keys\\dummy-key.keyx")}>
                            <FileKeyIcon className="w-4 h-4" />
                            <span>Browse</span>
                        </Button>
                    </Field>
                )}
            />

        </form>
    )
}