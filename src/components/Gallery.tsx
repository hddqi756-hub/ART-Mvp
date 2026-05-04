import React from 'react';
import { Submission, MOCK_ASSIGNMENTS } from '../types';
import { formatDate } from '../lib/utils';
import { ImageIcon } from 'lucide-react';

interface GalleryProps {
  submissions: Submission[];
  onSelectSubmission: (sub: Submission) => void;
  onNavigateToCourses: () => void;
}

export function Gallery({ submissions, onSelectSubmission, onNavigateToCourses }: GalleryProps) {
  if (submissions.length === 0) {
    return (
       <div className="max-w-5xl mx-auto text-center py-20 flex flex-col items-center">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6 border border-glass">
            <ImageIcon className="w-10 h-10 text-white/20" />
          </div>
          <h2 className="text-6xl font-black uppercase tracking-tighter mb-4">暂无档案<span className="text-correction">.</span></h2>
          <p className="text-xs md:text-sm font-bold uppercase tracking-widest text-white/40 max-w-md mt-4 mb-8">完成相应的课程任务后，您的画作档案与评估诊断都将保存在这里。</p>
          <button 
            onClick={onNavigateToCourses}
            className="px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-widest transition-all hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
          >
            去接取新任务
          </button>
       </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-12">
        <h1 className="text-huge">GALLERY<span className="text-correction underline">.</span></h1>
        <p className="text-sm font-medium text-white/60 uppercase tracking-widest mt-2">见证您的每一次进步记录与AI导师评估。</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {submissions.slice().reverse().map(sub => {
          const assignment = MOCK_ASSIGNMENTS.find(a => a.id === sub.assignmentId);
          return (
            <div 
              key={sub.id} 
              onClick={() => onSelectSubmission(sub)}
              className="bg-glass border border-glass rounded-sm overflow-hidden shadow-none hover:border-correction hover:shadow-[0_0_20px_rgba(255,77,0,0.1)] transition-all cursor-pointer group flex flex-col"
            >
              <div className="aspect-square relative overflow-hidden bg-[#0A0A0A] border-b border-glass p-2">
                <img 
                  src={sub.imageUrl} 
                  alt="Submission" 
                  className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-80 group-hover:scale-105 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
                />
                {sub.feedback && (
                  <div className="absolute top-4 right-4 bg-black text-white px-3 py-2 border border-glass flex items-center justify-center">
                    <span className="font-black text-correction text-sm tracking-widest">{sub.feedback.score}</span>
                  </div>
                )}
                {sub.revisionCount && sub.revisionCount > 0 && (
                  <div className="absolute top-4 left-4 bg-correction text-black px-3 py-1.5 text-xs font-black tracking-widest z-10 shadow-lg">
                    REV {sub.revisionCount}
                  </div>
                )}
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <p className="text-xs font-bold uppercase tracking-widest text-correction mb-3">{formatDate(sub.submittedAt)}</p>
                <h3 className="font-black text-2xl text-white uppercase tracking-tighter leading-none mb-1 line-clamp-2 flex-1">
                  {assignment?.title.includes('：') ? assignment.title.split('：')[1].trim() : assignment?.title}
                </h3>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
