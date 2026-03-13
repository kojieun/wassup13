import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, AlertTriangle, Lightbulb, Info, CheckCircle } from 'lucide-react'
import { markNotificationAsRead, markAllNotificationsAsRead } from './actions'
import { Button } from '@/components/ui/button'
import type { Notification } from '@/lib/types'

function getNotificationIcon(type: string) {
  switch (type) {
    case 'EXPIRY':
      return <AlertTriangle className="h-5 w-5 text-warning" />
    case 'TIP':
      return <Lightbulb className="h-5 w-5 text-primary" />
    case 'NOTICE':
    default:
      return <Info className="h-5 w-5 text-muted-foreground" />
  }
}

function getNotificationBadge(type: string) {
  switch (type) {
    case 'EXPIRY':
      return <Badge variant="outline" className="bg-warning/10 text-warning-foreground">유통기한</Badge>
    case 'TIP':
      return <Badge variant="outline" className="bg-primary/10 text-primary">팁</Badge>
    case 'NOTICE':
    default:
      return <Badge variant="outline">공지</Badge>
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}분 전`
  if (diffHours < 24) return `${diffHours}시간 전`
  if (diffDays < 7) return `${diffDays}일 전`
  return date.toLocaleDateString('ko-KR')
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', user!.id)
    .order('sent_at', { ascending: false })
    .limit(50)

  const items = (notifications || []) as Notification[]
  const unreadCount = items.filter((n) => !n.is_read).length

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Bell className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">알림</h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount}개의 새 알림</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <form action={markAllNotificationsAsRead}>
            <Button variant="ghost" size="sm" type="submit">
              모두 읽음
            </Button>
          </form>
        )}
      </div>

      {/* Notifications List */}
      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {items.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      )}
    </div>
  )
}

async function NotificationCard({ notification }: { notification: Notification }) {
  return (
    <form action={markNotificationAsRead.bind(null, notification.id)}>
      <button type="submit" className="w-full text-left">
        <Card
          className={`transition-colors hover:bg-accent/50 ${
            !notification.is_read ? 'border-primary/50 bg-accent/30' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0 pt-0.5">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  {getNotificationBadge(notification.type)}
                  {!notification.is_read && (
                    <span className="h-2 w-2 rounded-full bg-primary" />
                  )}
                </div>
                <h3 className="font-medium text-foreground">{notification.title}</h3>
                {notification.content && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {notification.content}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatDate(notification.sent_at)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </button>
    </form>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
        <CheckCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">
        새로운 알림이 없어요
      </h3>
      <p className="text-sm text-muted-foreground">
        유통기한 임박, 요리 완료 등의
        <br />
        알림이 여기에 표시됩니다
      </p>
    </div>
  )
}
