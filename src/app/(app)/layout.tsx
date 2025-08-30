import { BottomNav } from '@/components/bottom-nav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-neutral-900 p-4">
      <div className="relative h-[844px] w-full max-w-[420px] overflow-hidden rounded-[2.5rem] border-[10px] border-black bg-background shadow-2xl">
        <div className="absolute top-0 left-1/2 z-20 h-7 w-40 -translate-x-1/2 rounded-b-xl bg-black">
          <div className="absolute left-4 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gray-800"></div>
        </div>
        <main className="h-full overflow-y-auto pt-7 pb-16">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
