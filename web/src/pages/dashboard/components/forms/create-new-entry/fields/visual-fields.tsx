import { type Control, Controller } from "react-hook-form"
import { PaletteIcon, StarIcon, TagsIcon } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Toggle } from "@/components/ui/toggle"
import { ColorSelector } from "@/components/blocks/color-selector"
import { IconSelector } from "@/components/blocks/icon-selector"
import { TagInput } from "@/components/blocks/tag-input"

export const VisualFields = ({ control }: { control: Control<any> }) => {
    return (
        <div className="bg-muted/30 rounded-xl border p-4 space-y-4">

            <div className="flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-2">
                    <PaletteIcon className="size-4" /> Visuals
                </span>
                <Controller name="is_favorite" control={control} render={({ field }) => (
                    <Toggle pressed={field.value} onPressedChange={field.onChange} size="sm" variant="outline" className="data-[state=on]:text-yellow-500">
                        <StarIcon className={`size-4 ${field.value ? "fill-current" : ""}`} /> 
                        <span>Favorite</span>
                    </Toggle>
                )} />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Controller name="color" control={control} render={({ field }) => (<ColorSelector value={field.value} onChange={field.onChange} />)} />
                <Controller name="icon" control={control} render={({ field }) => (<IconSelector value={field.value} onChange={field.onChange} />)} />
            </div>

            <Controller name="tags" control={control} render={({ field }) => (
                <Field>
                    <FieldLabel className="text-xs uppercase flex items-center gap-2">
                        <TagsIcon className="size-3" /> Tags
                    </FieldLabel>
                    <TagInput value={field.value} onChange={field.onChange} placeholder="Type and press Enter..." />
                </Field>
            )} />

        </div>
    )
}