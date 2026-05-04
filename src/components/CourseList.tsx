import React from 'react';
import { MOCK_ASSIGNMENTS } from '../types';
import { ChevronRight, Clock, Star } from 'lucide-react';

interface CourseListProps {
  onSelectAssignment: (id: string) => void;
  completedIds: string[];
}

export function CourseList({ onSelectAssignment, completedIds }: CourseListProps) {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-12">
        <h1 className="text-huge">TASKS<span className="text-correction underline">.</span></h1>
        <p className="text-sm font-medium text-white/60 uppercase tracking-widest mt-2">选择绘画任务，获取专业AI教员评估。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_ASSIGNMENTS.map((assignment) => {
          const isCompleted = completedIds.includes(assignment.id);
          
          return (
            <div 
              key={assignment.id}
              onClick={() => onSelectAssignment(assignment.id)}
              className="group bg-glass border border-glass rounded-sm overflow-hidden shadow-none hover:border-correction hover:shadow-[0_0_20px_rgba(255,77,0,0.1)] transition-all duration-300 cursor-pointer flex flex-col"
            >
              <div className="h-48 relative overflow-hidden bg-[#0A0A0A] border-b border-glass p-2">
                 <img 
                  src={assignment.coverImage} 
                  className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                  alt={assignment.title}
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <span className="px-4 py-1.5 bg-black text-white border border-glass text-xs lg:text-sm font-black uppercase tracking-widest shadow-lg">
                    {assignment.difficulty}
                  </span>
                </div>
              </div>
              
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <p className="text-xs font-bold uppercase tracking-widest text-correction mb-3 line-clamp-1">{assignment.title.split('：')[0] || '挑战'}</p>
                <h3 className="font-black text-3xl uppercase tracking-tighter mb-4 line-clamp-2 leading-none">
                  {assignment.title.includes('：') ? assignment.title.split('：')[1].trim() : assignment.title}
                </h3>
                <p className="text-sm md:text-base font-medium text-white/50 line-clamp-2 mb-8 flex-1">
                  {assignment.description}
                </p>
                
                <div className="flex items-center justify-between pt-6 border-t border-glass mt-auto">
                  <div className="flex items-center text-xs font-bold uppercase tracking-widest gap-2">
                    {isCompleted ? (
                      <span className="text-correction flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        已完成
                      </span>
                    ) : (
                      <span className="text-white/40 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        待完成
                      </span>
                    )}
                  </div>
                  <div className="w-10 h-10 border border-glass flex items-center justify-center group-hover:bg-correction group-hover:border-correction group-hover:text-black transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
