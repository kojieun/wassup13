import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10">
            <AlertCircle className="h-7 w-7 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">오류 발생</CardTitle>
          <CardDescription>인증 과정에서 문제가 발생했습니다</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            인증 링크가 만료되었거나 유효하지 않습니다.
            <br />
            다시 시도해주세요.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild>
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/auth/sign-up">회원가입</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
