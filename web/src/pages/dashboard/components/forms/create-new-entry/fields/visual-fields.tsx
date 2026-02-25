import { type Control, Controller } from "react-hook-form"
import { PaletteIcon } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { ColorSelector } from "@/components/blocks/color-selector"
import { IconSelector } from "@/components/blocks/icon-selector"
import { TagInput } from "@/components/blocks/tag-input"

export const VisualFields = ({ control }: { control: Control<any> }) => {
    return (
        <>
        <p className="text-sm font-semibold flex items-center gap-2">
            <PaletteIcon className="size-4" />
            <span>Visuals</span>
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
            <Controller name="color" control={control} render={({ field }) => (<ColorSelector value={field.value} onChange={field.onChange} />)} />
            <Controller name="icon" control={control} render={({ field }) => (<IconSelector value={field.value} onChange={field.onChange} />)} />
        </div>

        <Controller name="tags" control={control} render={({ field }) => (
                <Field className="px-1">
                    <FieldLabel className="text-xs uppercase flex items-center gap-2">Tags</FieldLabel>
                    <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter..." />
                </Field>
            )} />
        </>
    )
}