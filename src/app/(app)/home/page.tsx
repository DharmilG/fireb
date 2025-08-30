import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { dummyUser } from '@/lib/dummy-data';
import { AlertTriangle, Plus, ShieldAlert, Waves } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

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
  return (
    <div className="flex h-full flex-col">
      <header className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="text-2xl font-bold font-headline text-primary">{dummyUser.name}</h1>
          </div>
          <Avatar>
            <AvatarImage src={dummyUser.avatarUrl} alt={dummyUser.name} />
            <AvatarFallback>{dummyUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>
      
      <div className="flex-grow p-4 pt-0">
        <h2 className="text-lg font-semibold font-headline mb-2">Incidents Overview</h2>
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative h-96 w-full">
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
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive shadow-lg animate-pulse">
                    <IncidentIcon type={incident.type} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Link href="/report" passHref className="absolute bottom-20 right-4 z-10">
        <Button size="icon" className="h-14 w-14 rounded-full bg-accent shadow-lg hover:bg-accent/90">
          <Plus className="h-8 w-8" />
        </Button>
      </Link>
    </div>
  );
}
