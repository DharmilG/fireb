'use client';

import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { dummyUser } from '@/lib/dummy-data';
import { Star, LogOut, Edit } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/auth-context';
import { auth } from '@/lib/firebase';
import { signOut, updateProfile } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [newName, setNewName] = useState(user?.displayName || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);


  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };
  
  const handleProfileUpdate = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateProfile(user, { displayName: newName });
      toast({
        title: 'Profile Updated',
        description: 'Your name has been successfully updated.',
      });
      // This will force a re-render with the new name if the auth context updates
      // Alternatively, you could update state locally.
      setIsDialogOpen(false); 
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.message,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const displayName = user?.displayName || dummyUser.name;
  const displayEmail = user?.email || dummyUser.email;
  const displayAvatarUrl = user?.photoURL || dummyUser.avatarUrl;


  return (
    <div className="p-4">
      <header className="flex flex-col items-center text-center pt-8 pb-6">
        <Avatar className="h-24 w-24 mb-4 border-4 border-primary/50">
          <AvatarImage src={displayAvatarUrl} alt={displayName} />
          <AvatarFallback className="text-3xl">
            {displayName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold font-headline">{displayName}</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Edit className="h-5 w-5 text-muted-foreground" />
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                        <DialogDescription>
                            Make changes to your profile here. Click save when you're done.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input id="name" value={newName} onChange={(e) => setNewName(e.target.value)} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleProfileUpdate} disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        <p className="text-muted-foreground">{displayEmail}</p>
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
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            Log Out
          </Button>
      </div>
    </div>
  );
}
