import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signup } from '../actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Leaf } from 'lucide-react'

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/fridge')
  }

  const params = await searchParams
  const error = params.error

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">회원가입</CardTitle>
          <CardDescription>냉부해와 함께 식재료를 관리하세요</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <form action={signup} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="email@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="6자 이상 입력하세요"
                minLength={6}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="household_size">가구 인원수</Label>
              <Select name="household_size" defaultValue="1">
                <SelectTrigger>
                  <SelectValue placeholder="인원수 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1인 가구</SelectItem>
                  <SelectItem value="2">2인 가구</SelectItem>
                  <SelectItem value="3">3인 가구</SelectItem>
                  <SelectItem value="4">4인 가구</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" className="w-full">
              가입하기
            </Button>
          </form>
          <div className="mt-6 text-center text-sm text-muted-foreground">
            이미 계정이 있으신가요?{' '}
            <Link href="/auth/login" className="text-primary hover:underline font-medium">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
