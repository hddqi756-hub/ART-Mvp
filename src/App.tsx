import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardOverview } from './components/Dashboard';
import { CourseList } from './components/CourseList';
import { Gallery } from './components/Gallery';
import { KnowledgeBase } from './components/KnowledgeBase';
import { AssignmentDetail } from './components/AssignmentDetail';
import { FeedbackReport } from './components/FeedbackReport';
import { Settings } from './components/Settings';
import { Submission, MOCK_ASSIGNMENTS, DrawingCategory } from './types';
import { Menu } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'assignments' | 'knowledge' | 'submissions' | 'settings'>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [revisingSubmission, setRevisingSubmission] = useState<Submission | null>(null);

  const completedAssignmentIds = submissions.map(sub => sub.assignmentId);

  const handleCreateSubmission = (assignmentId: string, imageUrl: string, category?: DrawingCategory, editMode: 'none' | 'global' | 'local' = 'none', parentSubmissionId?: string) => {
    const parentSub = submissions.find(s => s.id === parentSubmissionId);
    const newSubmission: Submission = {
      id: Math.random().toString(36).substring(7),
      assignmentId,
      imageUrl,
      status: 'pending',
      submittedAt: new Date().toISOString(),
      category,
      editMode,
      parentSubmissionId,
      revisionCount: parentSub ? (parentSub.revisionCount || 0) + 1 : 0
    };
    setSubmissions([newSubmission, ...submissions]);
    setSelectedSubmission(newSubmission);
  };

  const handleUpdateSubmission = (updatedInfo: Submission) => {
    setSubmissions(submissions.map(sub => 
      sub.id === updatedInfo.id ? updatedInfo : sub
    ));
    setSelectedSubmission(updatedInfo);
  };

  const navigateToCourse = (id: string) => {
    setSelectedAssignmentId(id);
    setSelectedSubmission(null);
    setRevisingSubmission(null);
    setActiveTab('assignments');
  };

  const handleTabChange = (tab: 'dashboard' | 'assignments' | 'knowledge' | 'submissions' | 'settings') => {
    setActiveTab(tab);
    setSelectedAssignmentId(null);
    setSelectedSubmission(null);
    setRevisingSubmission(null);
  };

  const renderContent = () => {
    if (selectedSubmission) {
      if (selectedSubmission.status === 'graded' && selectedSubmission.feedback) {
        return (
          <FeedbackReport 
            submission={selectedSubmission} 
            onBack={() => setSelectedSubmission(null)}
            onRevise={() => {
              setRevisingSubmission(selectedSubmission);
              setSelectedAssignmentId(selectedSubmission.assignmentId);
              setSelectedSubmission(null);
            }} 
          />
        );
      }
      return (
        <AssignmentDetail 
          assignment={MOCK_ASSIGNMENTS.find(a => a.id === selectedSubmission.assignmentId)!} 
          onBack={() => setSelectedSubmission(null)}
          onSubmit={(url, category, editMode) => handleCreateSubmission(selectedSubmission.assignmentId, url, category, editMode, selectedSubmission.parentSubmissionId)}
          existingSubmission={selectedSubmission}
          onUpdateSubmission={handleUpdateSubmission}
        />
      );
    }

    if (selectedAssignmentId) {
      return (
        <AssignmentDetail 
          assignment={MOCK_ASSIGNMENTS.find(a => a.id === selectedAssignmentId)!} 
          onBack={() => {
            setSelectedAssignmentId(null);
            setRevisingSubmission(null);
          }}
          onSubmit={(url, category, editMode) => {
            handleCreateSubmission(selectedAssignmentId, url, category, editMode, revisingSubmission?.id);
            setRevisingSubmission(null);
          }}
          parentSubmission={revisingSubmission}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            submissions={submissions}
            onNavigateToGallery={() => setActiveTab('submissions')}
            onNavigateToCourses={() => setActiveTab('assignments')}
            onSelectSubmission={(sub) => setSelectedSubmission(sub)}
          />
        );
      case 'assignments':
        return <CourseList onSelectAssignment={navigateToCourse} completedIds={completedAssignmentIds} />;
      case 'submissions':
        return <Gallery submissions={submissions} onSelectSubmission={(sub) => setSelectedSubmission(sub)} onNavigateToCourses={() => setActiveTab('assignments')} />;
      case 'knowledge':
        return <KnowledgeBase />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#0A0A0A] text-white overflow-hidden selection:bg-correction selection:text-black">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <main className="flex-1 overflow-y-auto relative flex flex-col">
         {/* Mobile Header for Sidebar Toggle */}
         <div className="lg:hidden flex items-center justify-between p-4 border-b border-glass sticky top-0 bg-[#0A0A0A] z-10 block">
            <span className="font-black text-xl tracking-tighter italic">ART.AI.CLASS</span>
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 border border-glass">
              <Menu className="w-5 h-5 text-white" />
            </button>
         </div>

         <div className="p-4 md:p-8 lg:p-12 relative flex-1">
           <div className="absolute top-0 right-0 p-8 flex items-center justify-end z-40 pointer-events-none">
               <div className="px-5 py-3 bg-glass border border-glass text-xs font-mono tracking-widest backdrop-blur-md opacity-30 hidden lg:block shadow-xl">
                 STATUS: ONLINE // ENV: PROD
               </div>
           </div>
           {renderContent()}
         </div>
      </main>
    </div>
  );
}

