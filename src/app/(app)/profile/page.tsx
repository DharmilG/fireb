import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dummyUser } from '@/lib/dummy-data';
import { Star, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  return (
    <div className="p-4">
      <header className="flex flex-col items-center text-center pt-8 pb-6">
        <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
          <AvatarImage src={dummyUser.avatarUrl} alt={dummyUser.name} />
          <AvatarFallback className="text-3xl">
            {dummyUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <h1 className="text-2xl font-bold font-headline">{dummyUser.name}</h1>
        <p className="text-muted-foreground">{dummyUser.email}</p>
      </header>

      <Card className="mb-4 text-center shadow-md">
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Total Points</p>
          <div className="flex items-center justify-center gap-2">
            <Star className="h-6 w-6 text-yellow-400 fill-current" />
            <p className="text-3xl font-bold font-headline text-primary">
              {dummyUser.points.toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="font-headline text-lg">My Badges</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            {dummyUser.badges.map((badge) => (
              <div key={badge.name} className="flex flex-col items-center gap-2">
                <div className="relative h-16 w-16">
                  <Image src={badge.iconUrl} alt={badge.name} fill />
                </div>
                <p className="text-xs font-medium text-muted-foreground">{badge.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Link href="/login" passHref>
          <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
        </Link>
      </div>
    </div>
  );
}
