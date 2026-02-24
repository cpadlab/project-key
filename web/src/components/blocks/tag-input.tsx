import { useState, type KeyboardEvent } from "react"
import { XIcon, TagIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
    value: string[]
    onChange: (tags: string[]) => void
    placeholder?: string
}

export function TagInput({ value, onChange, placeholder = "Add tag..." }: TagInputProps) {

    const [inputValue, setInputValue] = useState("")

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
            const tag = inputValue.trim().toLowerCase()
            if (tag && !value.includes(tag)) {
                onChange([...value, tag])
                setInputValue("")
            }
        }
    }

    const removeTag = (tagToRemove: string) => {
        onChange(value.filter((t) => t !== tagToRemove))
    }

    return (
        <div className="flex flex-wrap gap-2 p-2 min-h-11 border rounded-md bg-transparent focus-within:ring-1 focus-within:ring-primary/50 transition-all">
            {value.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1 pl-2">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive transition-colors" >
                        <XIcon className="size-3" />
                    </button>
                </Badge>
            ))}
            <div className="flex-1 min-w-30 flex items-center">
                <TagIcon className="size-3.5 text-muted-foreground mr-2" />
                <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={handleKeyDown} placeholder={value.length === 0 ? placeholder : ""} className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground"/>
            </div>
        </div>
    )
}