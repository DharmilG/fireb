'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dummyUser } from '@/lib/dummy-data';
import { AlertTriangle, Plus, ShieldAlert, Waves } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/auth-context';

const incidents = [
  { id: 1, type: 'Pollution', position: { top: '25%', left: '40%' } },
  { id: 2, type: 'Deforestation', position: { top: '50%', left: '60%' } },
  { id: 3, type: 'Illegal Fishing', position: { top: '65%', left: '30%' } },
];

const IncidentIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'Pollution':
      return <Waves className="h-5 w-5 text-white" />;
    case 'Deforestation':
      return <AlertTriangle className="h-5 w-5 text-white" />;
    default:
      return <ShieldAlert className="h-5 w-5 text-white" />;
  }
};

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
              {incidents.map((incident) => (
                <div
                  key={incident.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: incident.position.top, left: incident.position.left }}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive shadow-lg">
                    <IncidentIcon type={incident.type} />
                  </div>
                </div>
              ))}
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
