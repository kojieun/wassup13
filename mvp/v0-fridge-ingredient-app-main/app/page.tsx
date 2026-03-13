import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Leaf, Refrigerator, ChefHat, Bell, ArrowRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/fridge')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">냉부해</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">로그인</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/sign-up">시작하기</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            냉장고를 부탁해
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-pretty text-lg text-muted-foreground md:text-xl">
            냉장고 속 식재료를 똑똑하게 관리하고,
            <br className="hidden sm:block" />
            AI가 추천하는 맞춤 레시피로 음식물 쓰레기를 줄이세요.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                무료로 시작하기
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-card py-20">
          <div className="container mx-auto px-4">
            <h2 className="mb-12 text-center text-3xl font-bold text-foreground">
              주요 기능
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Refrigerator className="h-6 w-6" />}
                title="식재료 관리"
                description="냉장고 속 식재료를 한눈에 파악하고, 유통기한을 손쉽게 관리하세요."
              />
              <FeatureCard
                icon={<ChefHat className="h-6 w-6" />}
                title="AI 레시피 추천"
                description="보유한 식재료를 기반으로 만들 수 있는 레시피를 AI가 추천해드립니다."
              />
              <FeatureCard
                icon={<Bell className="h-6 w-6" />}
                title="유통기한 알림"
                description="유통기한이 임박한 식재료를 미리 알려드려 음식물 쓰레기를 줄여요."
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-3xl font-bold text-foreground">
              지금 바로 시작하세요
            </h2>
            <p className="mx-auto mb-8 max-w-xl text-muted-foreground">
              1~4인 가구를 위한 맞춤형 식재료 관리 서비스로
              <br />
              더 스마트한 주방 생활을 경험하세요.
            </p>
            <Button size="lg" asChild>
              <Link href="/auth/sign-up">
                무료 회원가입
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2026 냉부해. 음식물 쓰레기 줄이기 프로젝트.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
