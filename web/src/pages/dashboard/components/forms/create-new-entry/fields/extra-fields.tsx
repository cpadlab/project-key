import { type Control, Controller } from "react-hook-form"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export const ExtraFields = ({ control }: { control: Control<any> }) => {
    return (
        <div className="space-y-4">

            <Controller name="url" control={control} render={({ field }) => (
                <Field>
                    <FieldLabel htmlFor="url">URL</FieldLabel>
                    <Input {...field} id="url" type="url" placeholder="https://example.com" />
                </Field>
            )} />

            <Controller name="notes" control={control} render={({ field }) => (
                <Field>
                    <FieldLabel htmlFor="notes">Notes</FieldLabel>
                    <Textarea {...field} id="notes" placeholder="Additional information..." className="min-h-20 resize-none" />
                </Field>
            )} />
        </div>
    )
}