'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dummyUser } from '@/lib/dummy-data';
import { Plus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';

export default function HomePage() {
  const { user } = useAuth();

  const displayName = user?.displayName || dummyUser.name;
  const displayAvatarUrl = user?.photoURL || dummyUser.avatarUrl;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-3xl font-bold font-headline text-primary">{displayName}</h1>
          </div>
          <Avatar className="h-12 w-12">
            <AvatarImage src={displayAvatarUrl} alt={displayName} />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <div className="mb-8">
        <h2 className="text-2xl font-semibold font-headline mb-4">Incidents Overview</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative aspect-[4/3] w-full">
              <Image
                src="https://picsum.photos/800/600"
                data-ai-hint="coastline aerial"
                alt="Coastal map"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Link href="/report" passHref className="fixed bottom-24 right-6 z-10">
        <Button size="icon" className="h-16 w-16 rounded-full bg-accent shadow-lg hover:bg-accent/90">
          <Plus className="h-9 w-9" />
        </Button>
      </Link>
    </div>
  );
}
