import { ColorSwatchPicker, ColorSwatchPickerItem, ColorSwatch } from "@/components/ui/color"

const DEFAULT_COLORS = [
    "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#22c55e", 
    "#06b6d4", "#3b82f6", "#6366f1", "#a855f7", "#ec4899"
]

export interface ColorSelectorProps {
    value?: string;
    onChange: (color?: string) => void;
}

export const ColorSelector = ({ value, onChange }: ColorSelectorProps) => {
    return (
        <div className="pt-1">
            <ColorSwatchPicker value={value} onChange={(color) => onChange(color ? color.toString('hex') : undefined)}>
                {DEFAULT_COLORS.map((hex) => (
                    <ColorSwatchPickerItem key={hex} color={hex}>
                        <ColorSwatch />
                    </ColorSwatchPickerItem>
                ))}
            </ColorSwatchPicker>
        </div>
    )
}