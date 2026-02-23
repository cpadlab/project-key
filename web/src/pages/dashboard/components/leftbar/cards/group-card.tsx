import { type GroupModel } from "@/global"

interface GroupCardProps {
  data: GroupModel;
}

function GroupCard({ data }: GroupCardProps) {
    return (
        <div style={{ color: data.color || 'inherit' }}>
            <span>Icon ID: {data.icon}</span>
            <h3>{data.name}</h3>
        </div>
    )
}

export default GroupCard