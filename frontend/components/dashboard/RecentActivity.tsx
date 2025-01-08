import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface RecentActivityProps {
  activities: {
    id: string
    type: string
    user: string
    userInitial: string
    details: string
    time: string
  }[]
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{activity.userInitial}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{activity.user}</p>
            <p className="text-sm text-muted-foreground">
              {activity.details}
            </p>
          </div>
          <div className="ml-auto font-medium text-sm text-muted-foreground">
            {activity.time}
          </div>
        </div>
      ))}
    </div>
  )
} 