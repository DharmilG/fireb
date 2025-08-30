export type Report = {
  id: string;
  title: string;
  type: 'Pollution' | 'Deforestation' | 'Illegal Fishing' | 'Other';
  status: 'Pending' | 'In Review' | 'Resolved';
  imageUrl: string;
  location: string;
  date: string;
};

export type LeaderboardUser = {
  rank: number;
  name: string;
  avatarUrl: string;
  points: number;
};

export type User = {
  name: string;
  email: string;
  avatarUrl: string;
  points: number;
  badges: {
    name: string;
    iconUrl: string;
  }[];
};

export const dummyReports: Report[] = [
  {
    id: '1',
    title: 'Oil Spill near Sunrise Beach',
    type: 'Pollution',
    status: 'Resolved',
    imageUrl: 'https://picsum.photos/400/300?random=1',
    location: 'Sunrise Beach',
    date: '2023-10-15',
  },
  {
    id: '2',
    title: 'Illegal logging in coastal forest',
    type: 'Deforestation',
    status: 'In Review',
    imageUrl: 'https://picsum.photos/400/300?random=2',
    location: 'Greenwood Reserve',
    date: '2023-10-28',
  },
  {
    id: '3',
    title: 'Plastic waste accumulation',
    type: 'Pollution',
    status: 'Pending',
    imageUrl: 'https://picsum.photos/400/300?random=3',
    location: 'Turtle Cove',
    date: '2023-11-02',
  },
];

export const dummyLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Eco Warrior', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d', points: 1250 },
  { rank: 2, name: 'Jane Doe', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026705d', points: 1100 },
  { rank: 3, name: 'Ocean Protector', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026706d', points: 980 },
  { rank: 4, name: 'Alex Smith', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026707d', points: 850 },
  { rank: 5, name: 'Sam Wilson', avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026708d', points: 720 },
];

export const dummyUser: User = {
  name: 'John Doe',
  email: 'john.doe@email.com',
  avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026709d',
  points: 450,
  badges: [
    { name: 'First Report', iconUrl: '/badge-first-report.svg' },
    { name: 'Cleanup Champion', iconUrl: '/badge-cleanup.svg' },
    { name: 'Top Contributor', iconUrl: '/badge-top-contributor.svg' },
  ],
};
