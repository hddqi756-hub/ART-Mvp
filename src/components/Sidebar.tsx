import React from 'react';
import { BookOpen, Home, Image as ImageIcon, Menu, PenTool, X, Library, Settings } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: 'dashboard' | 'assignments' | 'knowledge' | 'submissions' | 'settings';
  onTabChange: (tab: 'dashboard' | 'assignments' | 'knowledge' | 'submissions' | 'settings') => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function Sidebar({ activeTab, onTabChange, isOpen, setIsOpen }: SidebarProps) {
  const tabs = [
    { id: 'dashboard', label: '数据看板', icon: Home },
    { id: 'assignments', label: '课程任务', icon: PenTool },
    { id: 'knowledge', label: '理论体系知识库', icon: Library },
    { id: 'submissions', label: '个人成长档案', icon: ImageIcon },
    { id: 'settings', label: '系统设置', icon: Settings },
  ] as const;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black/80 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-30 w-64 transform bg-[#0A0A0A] border-r border-glass text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center px-6 gap-3 border-b border-glass">
          <span className="font-black text-xl tracking-tighter italic">ART.AI.CLASS</span>
        </div>
        
        <nav className="flex flex-col gap-3 p-6">
          <h2 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">SYSTEM NAVIGATION</h2>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  onTabChange(tab.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "flex items-center gap-4 rounded-sm px-5 py-4 text-sm md:text-base font-bold transition-all uppercase tracking-tight",
                  isActive 
                    ? "bg-glass border border-glass text-correction shadow-lg" 
                    : "text-white/60 border border-transparent hover:border-glass hover:bg-glass hover:text-white"
                )}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-glass bg-[#0A0A0A]">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 text-sm rounded-full border border-glass bg-white/10 flex items-center justify-center font-black">
              C
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold uppercase text-white/40 tracking-widest">CURRENT USER</span>
              <span className="text-base font-bold">画师同学 (LV.1)</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
