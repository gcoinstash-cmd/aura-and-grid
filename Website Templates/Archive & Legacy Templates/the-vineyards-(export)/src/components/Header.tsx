import { Bell, MapPin, Sun, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <header className="border-b border-[#EBE8E0] bg-[#FAF9F6] sticky top-0 z-40 px-6 py-4 md:px-12">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        {/* Left: Brand Header */}
        <div className="flex items-center space-x-4">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-sm bg-[#4A1521] text-white">
            <span className="font-serif text-xl font-bold tracking-wider">P</span>
            <div className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-[#AF9E81] border border-[#FAF9F6]" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-semibold tracking-wide text-[#121212] sm:text-2xl">
              PALMDALE CREST
            </h1>
            <p className="font-sans text-[10px] tracking-widest uppercase text-[#AF9E81] font-medium">
              Premium Townhouse HOA
            </p>
          </div>
        </div>

        {/* Center: Live Eco Stats */}
        <div className="hidden lg:flex items-center space-x-8 text-[#121212] font-sans text-xs">
          <div className="flex items-center space-x-2 border-r border-[#EBE8E0] pr-6">
            <MapPin className="h-4 w-4 text-[#AF9E81]" />
            <span className="text-stone-500">HOA Location:</span>
            <span className="font-medium text-stone-800">Palmdale, CA</span>
          </div>
          <div className="flex items-center space-x-2 border-r border-[#EBE8E0] pr-6">
            <Sun className="h-4 w-4 text-[#AF9E81]" />
            <span className="text-stone-500">Solar Grid:</span>
            <span className="font-medium text-[#4A1521]">98.4% Autonomous</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-[#AF9E81]" />
            <span className="text-stone-500">HOA Period:</span>
            <span className="font-medium text-stone-800">Fiscal Year Q2</span>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          <div className="text-right hidden sm:block">
            <p className="font-mono text-xs font-semibold text-[#121212]">{currentDate}</p>
            <p className="font-sans text-[9px] uppercase tracking-wider text-stone-400 font-medium">UTC SYNC Active</p>
          </div>

          <div className="relative cursor-pointer group">
            <span className="absolute -right-0.5 -top-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4A1521] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4A1521]"></span>
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#EBE8E0] bg-white transition-all hover:bg-[#FAF9F6]">
              <Bell className="h-4 w-4 text-stone-600 transition-colors group-hover:text-[#4A1521]" />
            </div>
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3 pl-2 border-l border-[#EBE8E0]">
            <div className="h-9 w-9 overflow-hidden rounded-full border border-[#EBE8E0] bg-[#FAF9F6]">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
                alt="Resident Avatar"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="text-left hidden md:block">
              <p className="font-sans text-xs font-semibold text-[#121212]">Evelyn Vance</p>
              <p className="font-sans text-[10px] text-stone-400">Owner, Unit 14-B</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
