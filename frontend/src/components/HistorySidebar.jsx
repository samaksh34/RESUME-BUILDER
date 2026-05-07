import React, { useContext } from 'react';
import { useResumeData } from '../hooks/useResumeData';
import { AuthContext } from '../context/AuthContext';
import { 
    Clock, 
    FileText, 
    Trash2, 
    Plus, 
    X, 
    Loader2,
    Calendar,
    ChevronRight,
    Search
} from 'lucide-react';
import { format } from 'date-fns';

const HistorySidebar = ({ isOpen, onClose }) => {
    const { 
        userResumes, 
        isLoadingResumes, 
        loadResume, 
        createNewResume, 
        deleteResume,
        activeResumeId
    } = useResumeData();
    const { user } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredResumes = userResumes.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLoad = async (id) => {
        const success = await loadResume(id);
        if (success) onClose();
    };

    const handleCreate = async () => {
        const id = await createNewResume();
        if (id) onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-heading/40 backdrop-blur-sm transition-opacity" 
                onClick={onClose}
            />
            
            {/* Sidebar */}
            <div className="relative w-full max-w-sm bg-background border-l border-border shadow-2xl flex flex-col animate-slide-in-right h-full">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-surface-highlight/30">
                    <div>
                        <h3 className="text-xs font-black text-heading uppercase tracking-[0.2em]">Resume History</h3>
                        <p className="text-[10px] text-subtext mt-1 uppercase tracking-widest font-bold">Account: {user?.email}</p>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 text-subtext hover:text-heading transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Actions & Search */}
                <div className="p-6 space-y-4">
                    <button 
                        onClick={handleCreate}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-lg shadow-primary/20"
                    >
                        <Plus size={14} /> Create New Draft
                    </button>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-subtext/40" size={14} />
                        <input 
                            type="text"
                            placeholder="SEARCH DRAFTS..."
                            className="w-full bg-surface-highlight border border-border pl-10 pr-4 py-2.5 text-[10px] font-bold uppercase tracking-widest outline-none focus:border-primary transition-colors placeholder:text-subtext/30"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
                    {isLoadingResumes ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 size={24} className="animate-spin text-primary" />
                            <p className="text-[10px] font-bold text-subtext uppercase tracking-widest">Retrieving archives...</p>
                        </div>
                    ) : filteredResumes.length > 0 ? (
                        <div className="space-y-3">
                            {filteredResumes.map((resume) => (
                                <div 
                                    key={resume._id}
                                    className={`group relative border transition-all duration-300 ${
                                        activeResumeId === resume._id 
                                            ? 'border-primary bg-primary/5' 
                                            : 'border-border hover:border-primary/40 bg-surface/50'
                                    }`}
                                >
                                    <div 
                                        className="p-4 cursor-pointer"
                                        onClick={() => handleLoad(resume._id)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h4 className={`text-[11px] font-black uppercase tracking-widest truncate ${
                                                    activeResumeId === resume._id ? 'text-primary' : 'text-heading'
                                                }`}>
                                                    {resume.title || 'Untitled Resume'}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-2 text-[9px] text-subtext font-bold uppercase tracking-tighter">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar size={10} /> 
                                                        {format(new Date(resume.updatedAt), 'MMM d, yyyy')}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-border" />
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} />
                                                        {format(new Date(resume.updatedAt), 'HH:mm')}
                                                    </span>
                                                </div>
                                            </div>
                                            {activeResumeId === resume._id && (
                                                <div className="px-2 py-0.5 bg-primary text-white text-[8px] font-black uppercase tracking-tighter rounded">
                                                    Active
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (window.confirm('Are you sure you want to delete this draft?')) {
                                                    deleteResume(resume._id);
                                                }
                                            }}
                                            className="p-2 text-subtext hover:text-red-500 transition-colors"
                                            title="Delete Draft"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                        <ChevronRight size={14} className="text-primary" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 border border-dashed border-border">
                            <FileText size={32} className="mx-auto text-subtext/20 mb-4" />
                            <p className="text-[10px] font-bold text-subtext uppercase tracking-widest px-10">
                                {searchQuery ? 'No matching drafts found' : 'No previous records found in your account'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-border bg-surface-highlight/30">
                    <p className="text-[9px] text-subtext/60 font-bold uppercase tracking-[0.2em] text-center">
                        Engineered for continuity.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HistorySidebar;
