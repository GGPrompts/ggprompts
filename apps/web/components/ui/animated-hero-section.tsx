'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getAvatarUrl } from '@/lib/avatar';
import { createClient } from '@/lib/supabase/client';
import { AnimatedHeroBackground } from './animated-hero-background';

interface AnimatedHeroSectionProps {
  className?: string;
}

interface UserProfile {
  avatar_url: string | null;
  username: string | null;
}

export function AnimatedHeroSection({ className }: AnimatedHeroSectionProps) {
  const { user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  // Fetch user profile to get custom avatar
  useEffect(() => {
    async function fetchProfile() {
      if (!user) {
        setProfile(null);
        return;
      }

      const supabase = createClient();
      const { data } = await supabase
        .from('users')
        .select('avatar_url, username')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
      }
    }

    fetchProfile();
  }, [user]);

  // Get user avatar URL with profile data (profile avatar takes priority)
  const userAvatarUrl = user ? getAvatarUrl(user, profile ?? undefined) : undefined;

  return (
    <section className={`relative h-[400px] md:h-[500px] w-screen left-1/2 -translate-x-1/2 overflow-hidden ${className || ''}`}>
      <AnimatedHeroBackground
        userAvatarUrl={userAvatarUrl}
        logoUrl="/ggprompts-logo.svg"
      />
    </section>
  );
}
