'use client';

import { allBadges, dummyUser } from '@/lib/dummy-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Lock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function BadgesPage() {
  const unlockedBadgeIds = new Set(dummyUser.badges.map(b => b.name));

  return (
    <div className="p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold font-headline text-primary">All Badges</h1>
        <p className="text-muted-foreground">View your collection and unlock new achievements.</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {allBadges.map(badge => {
          const isUnlocked = unlockedBadgeIds.has(badge.name);
          return (
            <Card key={badge.name} className={`shadow-md ${!isUnlocked ? 'bg-muted/50' : ''}`}>
              <CardHeader className="flex flex-row items-start gap-4">
                <div className={`relative h-20 w-20 flex-shrink-0 ${!isUnlocked ? 'opacity-40 grayscale' : ''}`}>
                  <Image src={badge.iconUrl} alt={badge.name} fill />
                </div>
                <div className="flex-grow">
                  <CardTitle className="font-headline text-lg mb-1">{badge.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{badge.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                {isUnlocked ? (
                  <Badge variant="secondary" className="border-green-500/50 bg-green-400/10 text-green-700">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Unlocked
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    <Lock className="mr-1 h-3 w-3" />
                    Locked
                  </Badge>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
