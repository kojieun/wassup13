'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Refrigerator, ChefHat, Bell, User } from 'lucide-react'

const navItems = [
  { href: '/fridge', icon: Refrigerator, label: '냉장고' },
  { href: '/recipes', icon: ChefHat, label: '레시피' },
  { href: '/notifications', icon: Bell, label: '알림' },
  { href: '/settings', icon: User, label: '설정' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
      <div className="mx-auto flex h-16 max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
