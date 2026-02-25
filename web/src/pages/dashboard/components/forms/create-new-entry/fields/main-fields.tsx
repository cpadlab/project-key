import { type Control, Controller } from "react-hook-form"
import { EyeIcon, EyeOffIcon, FolderIcon } from "lucide-react"
import { useState } from "react"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { GroupModel } from "@/global"
import { useGroup } from "@/contexts/group-context"

interface Props {
    control: Control<any>
    groups: GroupModel[]
}

export const MainFields = ({ control, groups }: Props) => {

    const { activeGroup } = useGroup()
    const [showPassword, setShowPassword] = useState(false)

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller name="title" control={control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="title">Title</FieldLabel>
                        <Input {...field} id="title" placeholder="Service name..." aria-invalid={fieldState.invalid} />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )} />
                
                <Controller name="group" defaultValue={activeGroup} control={control} render={({ field }) => (
                    <Field>
                        <FieldLabel htmlFor="group">Group</FieldLabel>
                        <Select onValueChange={field.onChange} value={field.value || activeGroup}>
                            <SelectTrigger id="group">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {groups.map(g => (
                                    <SelectItem key={g.name} value={g.name}>
                                        <div className="flex items-center gap-2">
                                            <FolderIcon className="size-3.5 opacity-70" />
                                            {g.name}
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </Field>
                )} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller name="username" control={control} render={({ field }) => (
                    <Field>
                        <FieldLabel htmlFor="username">Username</FieldLabel>
                        <Input {...field} id="username" placeholder="user@example.com" />
                    </Field>
                )} />
                
                <Controller name="password" control={control} render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <InputGroup>
                            <InputGroupInput {...field} id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" aria-invalid={fieldState.invalid} />
                            <InputGroupAddon align="inline-end">
                                <InputGroupButton type="button" variant="ghost" size="icon-xs" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                                </InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                )} />
            </div>
        </>
    )
}