import { type Control, Controller } from "react-hook-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Toggle } from "@/components/ui/toggle"
import { StarIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export const ExtraFields = ({ control }: { control: Control<any> }) => {
    return (
        <div className="space-y-4">
            
            <div className="flex md:flex-row flex-col gap-4">
                
                <div className="flex items-center justify-between">
                    <Controller name="is_favorite" control={control} render={({ field }) => (
                        <Field>
                            <FieldLabel className="text-nowrap pr-12" htmlFor="bookmarks">Add to Bookmarks</FieldLabel>
                            <Toggle id="bookmarks" pressed={field.value} onPressedChange={field.onChange} variant="outline" className="data-[state=on]:text-yellow-500">
                                <StarIcon className={`size-4 ${field.value ? "fill-current" : ""}`} /> 
                                <span>Favorite</span>
                            </Toggle>
                        </Field>
                    )} />
                </div>

                <Controller name="url" control={control} render={({ field }) => (
                    <Field>
                        <FieldLabel htmlFor="url">URL</FieldLabel>
                        <Input {...field} id="url" type="text" placeholder="https://example.com" />
                    </Field>
                )} />

            </div>

            <Controller name="notes" control={control} render={({ field }) => (
                <Field>
                    <FieldLabel htmlFor="notes">Notes</FieldLabel>
                    <Textarea {...field} id="notes" placeholder="Additional information..." className="min-h-20 resize-none" />
                </Field>
            )} />
        </div>
    )
}