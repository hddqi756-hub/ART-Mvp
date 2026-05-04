import React, { useState } from 'react';
import { Submission, MOCK_ASSIGNMENTS } from '../types';
import { ArrowLeft, Award, CheckCircle2, AlertTriangle, Lightbulb, PenTool, Image as ImageIcon, Eye } from 'lucide-react';
import { formatDate, cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface FeedbackReportProps {
  submission: Submission;
  onBack: () => void;
  onRevise: () => void;
}

export function FeedbackReport({ submission, onBack, onRevise }: FeedbackReportProps) {
  const assignment = MOCK_ASSIGNMENTS.find(a => a.id === submission.assignmentId);
  const feedback = submission.feedback;
  const [showEdited, setShowEdited] = useState(feedback?.editedImageUrl ? true : false);

  if (!assignment || !feedback) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-[1200px] mx-auto pb-12 flex flex-col gap-6"
    >
      <div className="flex justify-between items-end">
        <div className="max-w-2xl">
          <button 
            onClick={onBack}
            className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 mb-4"
          >
            ← 返回档案
          </button>
          <h1 className="text-4xl lg:text-6xl font-black uppercase mb-3">作业批改反馈<span className="text-correction underline">.</span></h1>
          <p className="text-base lg:text-lg font-bold text-white/60 tracking-wider">
            {assignment.title} — 提交于 {formatDate(submission.submittedAt)}
          </p>
        </div>
        <div className="hidden md:flex gap-4">
          <button onClick={onRevise} className="px-8 py-4 bg-correction text-black font-black text-sm uppercase tracking-tighter hover:bg-[#FF4D00]/80 transition-colors shadow-[0_0_20px_rgba(255,77,0,0.3)] hover:shadow-[0_0_30px_rgba(255,77,0,0.5)]">
            针对针对性问题进行二次提交修订
          </button>
          <button onClick={onBack} className="px-8 py-4 bg-white text-black font-black text-sm uppercase tracking-tighter hover:bg-gray-200 transition-colors">
            完成评阅
          </button>
        </div>
      </div>

      <div className="border border-glass bg-glass flex flex-col lg:flex-row h-auto min-h-[600px] rounded-sm">
        
        {/* Left Side: The Image */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col relative border-b lg:border-b-0 lg:border-r border-glass bg-[#0A0A0A]">
          {feedback.editedImageUrl && (
            <div className="flex gap-2 mb-4 border-b border-glass pb-4">
               <button 
                 onClick={() => setShowEdited(false)}
                 className={cn("flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border flex items-center justify-center gap-3", !showEdited ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-[#111] text-white/40 border-glass hover:text-white")}
               >
                 <ImageIcon className="w-5 h-5" />
                 原图 (Original)
               </button>
               <button 
                 onClick={() => setShowEdited(true)}
                 className={cn("flex-1 py-4 text-sm font-bold uppercase tracking-widest transition-colors border flex items-center justify-center gap-3", showEdited ? "bg-correction text-black border-correction shadow-[0_0_20px_rgba(255,77,0,0.3)]" : "bg-[#111] text-white/40 border-glass hover:text-white")}
               >
                 <Eye className="w-5 h-5" />
                 AI导师改图指示 (Edited)
               </button>
            </div>
          )}
          
          <div className="flex-1 border border-glass bg-glass p-2 relative group overflow-hidden flex items-center justify-center">
             <AnimatePresence mode="wait">
               <motion.img 
                 key={showEdited ? 'edited' : 'original'}
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 transition={{ duration: 0.2 }}
                 src={showEdited ? feedback.editedImageUrl! : submission.imageUrl} 
                 alt={showEdited ? "Edited Preview" : "Student Drawing"} 
                 className="max-w-full max-h-[70vh] object-contain relative z-10 shadow-2xl" 
               />
             </AnimatePresence>
             <div className="absolute bottom-6 left-6 flex gap-2 z-20">
                <span className={cn("px-4 py-2 text-sm font-mono border font-bold backdrop-blur-md shadow-2xl", showEdited ? "bg-correction text-black border-correction" : "bg-black/80 text-white border-glass")}>
                  {showEdited ? "AI EDITED" : "ORIGINAL"}
                </span>
             </div>
          </div>
        </div>

        {/* Right Side: The Instructor Report */}
        <div className="w-full lg:w-1/2 p-8 lg:p-10 overflow-y-auto flex flex-col gap-6">
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-glass border border-glass py-6 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-6xl md:text-8xl font-black">{feedback.score}</span>
              <span className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest mt-2 border-t border-glass pt-2 w-1/2">综合评分</span>
              <div className={cn("absolute bottom-0 w-full h-1 md:h-2", feedback.score >= 80 ? "bg-[#FF4D00]" : "bg-white/20")} />
            </div>
            <div className="bg-glass border border-glass py-6 flex flex-col items-center justify-center">
              <span className="text-6xl md:text-8xl font-black text-correction">#AI</span>
              <span className="text-xs md:text-sm font-bold text-white/40 uppercase tracking-widest mt-2 border-t border-glass pt-2 w-1/2">AI教员评估</span>
            </div>
          </div>

          <div className="bg-glass border border-glass p-6 md:p-10 flex flex-col gap-8">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 bg-correction" />
              <h3 className="text-sm md:text-base font-black uppercase tracking-widest">总体评价分析</h3>
            </div>
            <div className="space-y-8">
              
              <div className="pb-8 border-b border-glass">
                <p className="text-base md:text-xl leading-relaxed font-bold text-white/90">
                  "{feedback.overall}"
                </p>
              </div>

              {feedback.editSuggestions && (
                <div className="pb-8 border-b border-glass">
                  <p className="text-xs md:text-sm font-bold text-correction uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border border-correction bg-correction/20" />
                    改图指示 (Edit Suggestions)
                  </p>
                  <p className="text-base font-bold text-white/90 leading-relaxed p-6 bg-correction/10 border border-correction/30">
                    {feedback.editSuggestions}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-8 border-b border-glass">
                <div>
                  <p className="text-xs md:text-sm font-bold text-white/40 uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full border border-white/50" />
                    优点 (Strengths)
                  </p>
                  <ul className="space-y-4">
                    {feedback.strengths.map((s, i) => (
                      <li key={i} className="text-sm md:text-base font-bold leading-relaxed tracking-wide text-white/80">{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs md:text-sm font-bold text-correction uppercase mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-correction" />
                    存在问题 (Needs Work)
                  </p>
                  <ul className="space-y-4">
                    {feedback.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm md:text-base font-bold leading-relaxed tracking-wide text-white/80">{w}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Explanations */}
              {feedback.explanations && feedback.explanations.length > 0 && (
                <div className="pb-8 border-b border-glass">
                  <p className="text-xs md:text-sm font-bold text-white/40 uppercase mb-5">深入讲解答疑 (Explanations)</p>
                  <div className="space-y-5">
                    {feedback.explanations.map((exp, i) => (
                      <div key={i} className="flex gap-4 p-5 md:p-6 border border-glass bg-white/5">
                        <span className="text-correction font-black text-base md:text-xl">{String(i + 1).padStart(2, '0')}</span>
                        <p className="text-sm md:text-base font-bold leading-relaxed tracking-wide text-white/90">{exp}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Knowledge Points */}
              {feedback.knowledgePoints && feedback.knowledgePoints.length > 0 && (
                <div className="pb-8 border-b border-glass">
                  <p className="text-xs md:text-sm font-bold text-white/40 uppercase mb-5">关联知识点 (Knowledge Points)</p>
                  <div className="flex gap-3 flex-wrap">
                    {feedback.knowledgePoints.map((kp, i) => (
                      <span key={i} className="px-4 py-2 border border-white/20 bg-white/5 text-xs md:text-sm font-bold text-white">
                        {kp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Practice Cards */}
              {feedback.practiceCards && feedback.practiceCards.length > 0 && (
                <div className="bg-correction/10 border border-correction/30 p-6 md:p-8 flex flex-col gap-6">
                  <div className="flex items-center gap-3">
                    <PenTool className="w-6 h-6 text-correction" />
                    <h3 className="text-sm md:text-base font-black uppercase tracking-widest text-correction">系统派发作业卡 (PRACTICE CARDS)</h3>
                  </div>
                  <div className="space-y-6 mt-2">
                    {feedback.practiceCards.map((card, idx) => (
                      <div key={idx} className="bg-[#0A0A0A] border border-correction/20 p-6 shadow-xl">
                          <h4 className="font-black text-white mb-3 text-base md:text-xl">{card.title}</h4>
                          <p className="text-sm md:text-base text-white/80 leading-relaxed mb-3"><span className="text-white/40 font-bold uppercase tracking-widest mr-2">任务 / TASK: </span>{card.task}</p>
                          <p className="text-sm md:text-base text-correction leading-relaxed font-bold"><span className="uppercase tracking-widest mr-2 text-correction/60">理由 / WHY: </span>{card.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
          
        </div>
      </div>
      <div className="md:hidden sticky bottom-4 z-50 mt-4 flex gap-2">
         <button onClick={onRevise} className="flex-1 py-4 bg-correction text-black font-black text-xs uppercase tracking-tighter">
            二次提交修订
         </button>
         <button onClick={onBack} className="flex-1 py-4 bg-white text-black font-black text-xs uppercase tracking-tighter shadow-xl">
            完成
         </button>
      </div>
    </motion.div>
  );
}
