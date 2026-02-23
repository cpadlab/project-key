import { FolderIcon, KeyIcon, GlobeIcon, MailIcon, CreditCardIcon, SmartphoneIcon, MonitorIcon, WifiIcon, BriefcaseIcon, HeartIcon, ShieldIcon, StarIcon} from "lucide-react"

export const DEFAULT_ICONS = [
    { id: 48, icon: FolderIcon },
    { id: 0, icon: KeyIcon },
    { id: 1, icon: GlobeIcon },
    { id: 19, icon: MailIcon },
    { id: 54, icon: CreditCardIcon },
    { id: 64, icon: SmartphoneIcon },
    { id: 15, icon: MonitorIcon },
    { id: 50, icon: WifiIcon },
    { id: 60, icon: BriefcaseIcon },
    { id: 62, icon: HeartIcon },
    { id: 58, icon: ShieldIcon },
    { id: 59, icon: StarIcon }
]

export interface IconSelectorProps {
    value?: number;
    onChange: (iconId: number) => void;
}

export const IconSelector = ({ value, onChange }: IconSelectorProps) => {
    return (
        <div className="grid grid-cols-6 gap-2 p-2 border border-border rounded-md bg-muted/20">
            {DEFAULT_ICONS.map((item) => {
                
                const IconComponent = item.icon
                const isSelected = value === item.id
                
                return (
                    <button key={item.id} type="button" onClick={() => onChange(item.id)} className={`flex items-center justify-center p-2 rounded-md transition-all hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring ${isSelected ? 'bg-orange-500 text-white shadow-md' : 'text-muted-foreground'}`} aria-label={`Select icon ${item.id}`} aria-pressed={isSelected}>
                        <IconComponent className="w-5 h-5" />
                    </button>
                )
            })}
        </div>
    )
}