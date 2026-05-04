import React, { useCallback, useState } from 'react';
import { UploadCloud, FileImage, Loader2, AlertCircle, RefreshCw, ChevronDown, CheckSquare, Square, CheckSquare2 } from 'lucide-react';
import { Assignment, Submission, DrawingCategory, EditMode } from '../types';
import { gradeDrawing, generateEditedImage } from '../lib/gemini';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface AssignmentDetailProps {
  assignment: Assignment;
  onBack: () => void;
  onSubmit: (imageUrl: string, category: DrawingCategory, editMode: EditMode) => void;
  existingSubmission?: Submission;
  parentSubmission?: Submission | null; // For revisions
  onUpdateSubmission?: (sub: Submission) => void;
}

const CATEGORIES: DrawingCategory[] = ['二次元/日系', '厚涂/写实', '半厚涂', '赛璐璐', '概念原画', '速写/线稿', '素描', '水彩', '人体结构', '肌肉解剖'];

export function AssignmentDetail({ assignment, onBack, onSubmit, existingSubmission, parentSubmission, onUpdateSubmission }: AssignmentDetailProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(existingSubmission?.imageUrl || null);
  const [category, setCategory] = useState<DrawingCategory>('二次元/日系');
  const [editMode, setEditMode] = useState<EditMode>('none');
  const [isGrading, setIsGrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      handleFileSelection(droppedFile);
    }
  }, []);

  const handleFileSelection = (selectedFile: File) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleUploadClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files?.[0]) {
        handleFileSelection(target.files[0]);
      }
    };
    input.click();
  };

  const handleSubmit = async () => {
    if (!preview) return;
    
    setIsGrading(true);
    setError(null);
    
    const pendingSubmission: Submission = {
      id: Math.random().toString(36).substring(7),
      assignmentId: assignment.id,
      imageUrl: preview,
      category,
      editMode,
      status: 'grading',
      submittedAt: new Date().toISOString(),
      parentSubmissionId: parentSubmission?.id,
      revisionCount: parentSubmission?.id ? (parentSubmission?.revisionCount || 0) + 1 : 0
    };
    
    // We notify the parent that grading started
    if (existingSubmission && onUpdateSubmission) {
      onUpdateSubmission({ ...pendingSubmission, id: existingSubmission.id });
    } else {
      onSubmit(preview, category, editMode);
    }
    
    try {
      const feedback = await gradeDrawing(preview, assignment, category, editMode);
      
      let finalFeedback = { ...feedback };
      if (editMode !== 'none' && feedback.editSuggestions) {
        try {
           setIsGrading(true); // Still grading, but generating image
           const editedImage = await generateEditedImage(preview, feedback.editSuggestions);
           finalFeedback.editedImageUrl = editedImage;
        } catch (imgError) {
           console.error("生成改图失败", imgError);
           // We don't fail the whole submission if image editing fails
        }
      }

      const gradedSubmission: Submission = {
        ...(existingSubmission ? existingSubmission : pendingSubmission),
        status: 'graded',
        feedback: finalFeedback,
      };
      
      if (onUpdateSubmission) {
        onUpdateSubmission(gradedSubmission);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '测评过程中出现未知错误，请重试');
      setIsGrading(false);
    }
  };

  if (existingSubmission?.status === 'graded' && !parentSubmission) {
    return (
      <div className="flex flex-col h-full items-center justify-center text-center p-8 border border-glass bg-glass">
        <div className="w-20 h-20 border border-[#FF4D00] text-[#FF4D00] flex items-center justify-center mb-6">
          <FileImage className="w-8 h-8" />
        </div>
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">该任务已完成</h2>
        <p className="text-white/60 mb-8 max-w-md font-bold text-sm tracking-widest uppercase">您已经提交过此任务并获得了AI导师的评估，请前往成长档案查看详情。</p>
        <button 
          onClick={onBack}
          className="px-8 py-4 bg-white text-black font-black text-xs uppercase tracking-tighter hover:bg-gray-200 transition-colors"
        >
          返回任务列表
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <button 
        onClick={onBack}
        className="text-xs lg:text-sm font-bold uppercase tracking-widest text-white/40 hover:text-white flex items-center gap-2 mb-8"
      >
        ← 返回
      </button>

      <div className="bg-[#0A0A0A] border border-glass overflow-hidden rounded-sm">
        {assignment.coverImage && (
          <div className="h-64 w-full relative border-b border-glass p-2 bg-glass">
            <div className="absolute inset-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
            <img 
              src={assignment.coverImage} 
              alt={assignment.title} 
              className="w-full h-full object-cover grayscale mix-blend-luminosity opacity-80"
            />
            <div className="absolute bottom-6 left-8 z-20">
              <span className="px-4 py-1.5 bg-black border border-white/20 text-white text-xs lg:text-sm uppercase font-black tracking-widest mb-4 inline-block shadow-lg">
                {assignment.difficulty}
              </span>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-tight">{assignment.title}</h1>
            </div>
          </div>
        )}

        <div className="p-8 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Criteria Panel */}
            <div className="flex flex-col">
              <h3 className="text-xs lg:text-sm font-black uppercase tracking-widest text-white/40 border-b border-glass pb-4 mb-6">任务大纲</h3>
              <p className="text-white/80 font-medium leading-relaxed mb-8 text-base lg:text-lg">
                {assignment.description}
              </p>
              
              <h4 className="text-xs lg:text-sm font-black uppercase tracking-widest text-white/40 mb-4">评分标准:</h4>
              <ul className="space-y-4 flex-1 mb-8">
                {assignment.criteria.map((c, i) => (
                  <li key={i} className="flex gap-4 text-base md:text-lg font-bold text-white bg-glass p-5 border border-glass">
                    <span className="text-correction font-black">{String(i + 1).padStart(2, '0')}</span>
                    {c}
                  </li>
                ))}
              </ul>
              
              {parentSubmission?.feedback && (
                <div className="bg-correction/10 border border-correction/30 p-8 flex flex-col mt-auto shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <AlertCircle className="w-5 h-5 text-correction" />
                    <h4 className="text-sm font-black uppercase tracking-widest text-correction">修图指南 (基于上次提交)</h4>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <span className="text-xs font-bold text-white/40 uppercase mb-2 block tracking-widest">上次导师建议:</span>
                      <p className="text-sm md:text-base text-white/80 leading-relaxed font-bold">"{parentSubmission.feedback.overall}"</p>
                    </div>
                    {parentSubmission.feedback.weaknesses.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-white/40 uppercase mb-2 block tracking-widest">重点改进项:</span>
                        <ul className="list-disc pl-5 space-y-2">
                          {parentSubmission.feedback.weaknesses.map((w, i) => (
                            <li key={i} className="text-sm md:text-base text-white/80 font-bold leading-relaxed">{w}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Upload Area */}
            <div className="flex flex-col">
              <h3 className="text-xs lg:text-sm font-black uppercase tracking-widest text-white/40 border-b border-glass pb-4 mb-6">提交评估 {parentSubmission ? '(二次修改提交)' : ''}</h3>
              
              <div className="mb-6 space-y-6">
                <div>
                  <label className="text-xs lg:text-sm font-bold text-white/60 uppercase tracking-widest mb-3 block">绘画风格类别</label>
                  <div className="relative">
                    <select 
                      value={category}
                      onChange={(e) => setCategory(e.target.value as DrawingCategory)}
                      className="w-full appearance-none bg-glass border border-glass text-white px-5 py-4 rounded-sm font-bold text-base tracking-widest focus:outline-none focus:border-correction"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-zinc-900">{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="text-xs lg:text-sm font-bold text-white/60 uppercase tracking-widest mb-3 block">附加AI导师服务 (消耗更多积分/算力)</label>
                  <div className="grid grid-cols-1 gap-3">
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <label className={cn("flex justify-between items-center p-4 lg:p-5 border cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden", editMode === 'none' ? 'border-white bg-white/10' : 'border-glass bg-glass')}>
                        {editMode === 'none' && <motion.div layoutId="editModeIndicator" className="absolute top-0 left-0 w-1.5 h-full bg-white" />}
                        <span className={cn("text-sm lg:text-base font-bold uppercase tracking-widest ml-3", editMode === 'none' ? "text-white" : "text-white/60")}>仅测评分析 (纯文本诊断)</span>
                        <input type="radio" className="sr-only" checked={editMode === 'none'} onChange={() => setEditMode('none')} />
                        {editMode === 'none' ? <CheckSquare className="w-5 h-5 text-white" /> : <Square className="w-5 h-5 text-white/20" />}
                      </label>
                    </motion.div>
                    
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <label className={cn("flex justify-between items-center p-4 lg:p-5 border cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden", editMode === 'global' ? 'border-correction bg-correction/10 shadow-[0_0_15px_rgba(255,77,0,0.15)]' : 'border-glass bg-glass')}>
                        {editMode === 'global' && <motion.div layoutId="editModeIndicator" className="absolute top-0 left-0 w-1.5 h-full bg-correction" />}
                        <span className={cn("text-sm lg:text-base font-bold uppercase tracking-widest ml-3", editMode === 'global' ? "text-correction" : "text-white/60")}>请求全局红笔改图 (大透视/构图调整)</span>
                        <input type="radio" className="sr-only" checked={editMode === 'global'} onChange={() => setEditMode('global')} />
                        {editMode === 'global' ? <CheckSquare className="w-5 h-5 text-correction" /> : <Square className="w-5 h-5 text-white/20" />}
                      </label>
                    </motion.div>
                    
                    <motion.div whileTap={{ scale: 0.98 }}>
                      <label className={cn("flex justify-between items-center p-4 lg:p-5 border cursor-pointer hover:bg-white/5 transition-colors relative overflow-hidden", editMode === 'local' ? 'border-[#FFB000] bg-[#FFB000]/10 shadow-[0_0_15px_rgba(255,176,0,0.15)]' : 'border-glass bg-glass')}>
                        {editMode === 'local' && <motion.div layoutId="editModeIndicator" className="absolute top-0 left-0 w-1.5 h-full bg-[#FFB000]" />}
                        <span className={cn("text-sm lg:text-base font-bold uppercase tracking-widest ml-3", editMode === 'local' ? "text-[#FFB000]" : "text-white/60")}>请求局部精确改图 (针对性细节修复)</span>
                        <input type="radio" className="sr-only" checked={editMode === 'local'} onChange={() => setEditMode('local')} />
                        {editMode === 'local' ? <CheckSquare className="w-5 h-5 text-[#FFB000]" /> : <Square className="w-5 h-5 text-white/20" />}
                      </label>
                    </motion.div>
                  </div>
                </div>
              </div>

              {!preview ? (
                <div 
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={handleUploadClick}
                  className="flex-1 min-h-[300px] border border-glass bg-glass flex flex-col items-center justify-center text-white/40 hover:bg-white/5 hover:border-white/20 transition-all cursor-pointer group"
                >
                  <UploadCloud className="w-16 h-16 mb-6 group-hover:text-correction transition-colors" />
                  <p className="text-sm font-black uppercase tracking-widest text-white mb-3">点击或拖拽上传作品</p>
                  <p className="text-xs font-mono tracking-wider opacity-60">JPG, PNG, WEBP (最大10MB)</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-6">
                  <div className="relative group w-full aspect-square border border-glass bg-[#0A0A0A] p-2">
                    <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                    {!isGrading && (
                      <div className="absolute inset-2 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center border border-white/10 backdrop-blur-sm">
                        <button 
                          onClick={handleUploadClick}
                          className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-tighter hover:bg-gray-200 flex items-center gap-2 shadow-2xl"
                        >
                          <RefreshCw className="w-4 h-4" /> 更换图片
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {error && (
                    <div className="w-full p-4 bg-[#FF4D00]/10 text-[#FF4D00] border border-[#FF4D00]/30 flex gap-3 text-xs font-bold uppercase tracking-widest items-start">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <p>{error}</p>
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isGrading}
                    className="w-full py-6 mt-4 bg-white text-black font-black text-sm uppercase tracking-tighter hover:bg-gray-200 transition-all disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed flex justify-center items-center gap-3 relative overflow-hidden group shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                  >
                    {isGrading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        <span>AI 教员评估中...</span>
                        <motion.div 
                          className="absolute bottom-0 left-0 h-1.5 bg-correction" 
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 15, ease: 'linear' }}
                        />
                      </>
                    ) : (
                      <>
                        {parentSubmission ? '提交修订版本' : '提交评估 (请求批改)'}
                      </>
                    )}
                  </button>
                  <p className="text-xs lg:text-sm text-white/40 uppercase tracking-widest font-bold mt-4 text-center">AI导师将结合你选择的【{category}】风格进行针对性评价。</p>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
