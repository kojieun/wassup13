import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogOut, ChevronRight, Leaf } from 'lucide-react'
import { signout } from '@/app/auth/actions'
import type { Profile } from '@/lib/types'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  const userProfile = profile as Profile | null

  return (
    <div className="container mx-auto max-w-lg px-4 py-6">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <User className="h-5 w-5 text-primary-foreground" />
        </div>
        <h1 className="text-xl font-bold text-foreground">설정</h1>
      </div>

      {/* Profile Card */}
      <Card className="mb-6">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-foreground">
              {userProfile?.nickname || '사용자'}
            </h2>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
          </div>
        </CardContent>
      </Card>

      {/* Profile Info */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">프로필 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <SettingRow label="닉네임" value={userProfile?.nickname || '-'} />
          <SettingRow
            label="가구 인원수"
            value={userProfile?.household_size ? `${userProfile.household_size}인 가구` : '-'}
          />
          <SettingRow
            label="알러지 정보"
            value={
              userProfile?.allergy_info && userProfile.allergy_info.length > 0
                ? userProfile.allergy_info.join(', ')
                : '없음'
            }
          />
          <SettingRow
            label="식이 제한"
            value={userProfile?.dietary_preference || '없음'}
          />
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">계정</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={signout}>
            <Button
              variant="ghost"
              className="w-full justify-between text-destructive hover:bg-destructive/10 hover:text-destructive"
              type="submit"
            >
              <span className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                로그아웃
              </span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* App Info */}
      <div className="text-center text-xs text-muted-foreground">
        <p>냉부해 v1.0.0</p>
        <p className="mt-1">음식물 쓰레기를 줄이는 스마트 냉장고 관리</p>
      </div>
    </div>
  )
}

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  )
}
