'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  User,
  Settings,
  ShoppingBag,
  ChevronRight,
  Wallet,
  Skull,
  Trophy
} from 'lucide-react';
import { Card } from '@ggprompts/ui';
import { cn } from '@ggprompts/ui';
import { useSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

const accountNav = [
  {
    href: '/account/profile',
    label: 'Profile',
    sublabel: 'Your regret portfolio',
    icon: User,
  },
  {
    href: '/account/orders',
    label: 'Order History',
    sublabel: 'Hall of shame',
    icon: ShoppingBag,
  },
  {
    href: '/account/achievements',
    label: 'Achievements',
    sublabel: 'Badges of dishonor',
    icon: Trophy,
  },
  {
    href: '/account/settings',
    label: 'Settings',
    sublabel: 'Customize your suffering',
    icon: Settings,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();

  // Redirect to login if not authenticated
  if (!isPending && !session?.user) {
    redirect('/login?callbackUrl=/account/profile');
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Skull className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-primary terminal-glow">
              Account
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage your profile, view your questionable purchase history, and configure your experience
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="glass-dark border-primary/30 overflow-hidden">
              <div className="p-4 border-b border-primary/20">
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-muted-foreground">
                    Navigation
                  </span>
                </div>
              </div>
              <nav className="p-2 space-y-1">
                {accountNav.map((item, index) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-3 rounded-lg transition-all group",
                          "hover:bg-primary/10",
                          isActive && "bg-primary/20 border border-primary/50"
                        )}
                      >
                        <Icon className={cn(
                          "w-5 h-5 transition-colors",
                          isActive ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                        )} />
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-medium text-sm truncate",
                            isActive ? "text-primary" : "text-foreground"
                          )}>
                            {item.label}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {item.sublabel}
                          </p>
                        </div>
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Fun footer message */}
              <div className="p-4 border-t border-primary/20">
                <p className="text-xs text-muted-foreground text-center italic">
                  "We value your privacy*"
                </p>
                <p className="text-[10px] text-muted-foreground/50 text-center mt-1">
                  *not really
                </p>
              </div>
            </Card>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
