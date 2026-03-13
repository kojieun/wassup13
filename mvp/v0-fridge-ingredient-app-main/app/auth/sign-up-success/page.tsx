import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Leaf } from 'lucide-react'

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary">
            <Leaf className="h-7 w-7 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">가입 완료!</CardTitle>
          <CardDescription>이메일을 확인해주세요</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent">
            <Mail className="h-8 w-8 text-accent-foreground" />
          </div>
          <p className="text-muted-foreground">
            회원가입이 완료되었습니다.
            <br />
            이메일로 발송된 인증 링크를 클릭하여
            <br />
            계정을 활성화해주세요.
          </p>
          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">로그인 페이지로 돌아가기</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
