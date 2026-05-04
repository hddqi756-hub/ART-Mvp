import React from 'react';
import { Submission, MOCK_ASSIGNMENTS } from '../types';
import { Palette, TrendingUp, CheckCircle, Clock, Compass, Play } from 'lucide-react';
import { formatDate } from '../lib/utils';

interface DashboardOverviewProps {
  submissions: Submission[];
  onNavigateToGallery: () => void;
  onNavigateToCourses: () => void;
  onSelectSubmission: (sub: Submission) => void;
}

export function DashboardOverview({ submissions, onNavigateToGallery, onNavigateToCourses, onSelectSubmission }: DashboardOverviewProps) {
  
  const gradedStr = submissions.filter(s => s.status === 'graded');
  const totalScore = gradedStr.reduce((sum, s) => sum + (s.feedback?.score || 0), 0);
  const avgScore = gradedStr.length > 0 ? Math.round(totalScore / gradedStr.length) : 0;
  
  const completionRate = MOCK_ASSIGNMENTS.length > 0 
    ? Math.round((submissions.length / MOCK_ASSIGNMENTS.length) * 100) 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col gap-2 relative">
        <h1 className="text-huge">DASHBOARD<span className="text-correction underline">.</span></h1>
        <p className="text-sm md:text-base font-bold text-white/60 uppercase tracking-widest">欢迎回来，画师同学。以下是您的近期数据。</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="bg-glass p-8 rounded-sm border border-glass flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40 mb-3">平均得分 (AI评估)</p>
              <h3 className="text-7xl font-black">{avgScore || '-'}</h3>
            </div>
            <div className="p-4 bg-white/5 border border-glass text-correction rounded-full">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          {gradedStr.length > 0 && <p className="text-xs uppercase font-bold text-white/60 border-t border-glass pt-5 mt-auto">基于 {gradedStr.length} 份批改记录计算</p>}
        </div>

        <div className="bg-glass p-8 rounded-sm border border-glass flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40 mb-3">已完成任务数</p>
              <h3 className="text-7xl font-black text-correction">{submissions.length} <span className="text-3xl text-white/20 font-black">/ {MOCK_ASSIGNMENTS.length}</span></h3>
            </div>
            <div className="p-4 bg-white/5 border border-glass text-correction rounded-full">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
          <div className="w-full bg-white/10 h-2 mt-auto relative">
            <div className="bg-correction h-full absolute top-0 left-0" style={{ width: `${completionRate}%` }} />
          </div>
        </div>

        <div className="bg-[#FF4D00] p-8 rounded-sm border border-glass text-black shadow-none relative overflow-hidden group flex flex-col justify-between">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <p className="text-xs lg:text-sm font-black uppercase tracking-widest text-black/60 mb-3">成长阶段</p>
              <h3 className="text-4xl lg:text-5xl font-black leading-none uppercase tracking-tighter">LV.1 新手</h3>
            </div>
            <button 
              onClick={onNavigateToCourses}
              className="w-full py-5 bg-black text-white font-black text-sm uppercase tracking-widest mt-10 border border-transparent shadow-xl group-hover:bg-zinc-900 transition-colors"
            >
              继续绘画练习
            </button>
          </div>
          <Palette className="absolute -bottom-10 -right-10 w-48 h-48 text-black opacity-10" />
        </div>
      </div>

      {/* Recent Submissions */}
      <div className="bg-glass rounded-sm border border-glass overflow-hidden">
        <div className="p-6 md:p-8 border-b border-glass flex justify-between items-center">
          <h2 className="text-sm md:text-base font-black uppercase tracking-widest text-white">近期批改记录</h2>
          <button onClick={onNavigateToGallery} className="text-xs font-bold uppercase text-white/50 hover:text-white tracking-widest">
            查看全部档案 →
          </button>
        </div>
        
        {submissions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center text-white/40">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-glass">
              <Clock className="w-8 h-8 opacity-50" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest">暂无记录</p>
            <button 
              onClick={onNavigateToCourses}
              className="mt-6 px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-tighter hover:bg-gray-200"
            >
              浏览所有任务
            </button>
          </div>
        ) : (
          <div className="divide-y divide-glass">
            {submissions.slice().reverse().slice(0, 3).map((sub) => {
              const assignment = MOCK_ASSIGNMENTS.find(a => a.id === sub.assignmentId);
              return (
                <div 
                  key={sub.id} 
                  onClick={() => onSelectSubmission(sub)}
                  className="p-6 flex items-center gap-6 hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <div className="relative w-24 h-24 shrink-0 rounded-sm overflow-hidden bg-[#0A0A0A] border border-glass">
                    <img src={sub.imageUrl} className="w-full h-full object-cover" alt="Thumbnail" />
                    {sub.revisionCount && sub.revisionCount > 0 && (
                      <div className="absolute top-0 left-0 bg-correction text-black px-1.5 py-0.5 text-[8px] font-black z-10">
                        REV {sub.revisionCount}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs tracking-widest uppercase font-bold text-white/40 mb-2">{formatDate(sub.submittedAt)}</p>
                    <h4 className="font-black text-2xl lg:text-3xl uppercase tracking-tight line-clamp-1">{assignment?.title}</h4>
                  </div>
                  <div className="text-right">
                    {sub.feedback ? (
                      <div className="flex flex-col items-center bg-glass border border-glass py-4 px-6 min-w-24">
                        <span className="text-3xl lg:text-4xl font-black text-correction">{sub.feedback.score}</span>
                        <span className="text-xs uppercase font-bold text-white/40 tracking-widest mt-1">分数</span>
                      </div>
                    ) : (
                      <span className="text-xs font-black uppercase text-black bg-white px-4 py-2 shadow-xl">评估中...</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  );
}
