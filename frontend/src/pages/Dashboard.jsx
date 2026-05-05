import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Plus, 
    FileText, 
    Trash2, 
    Edit3, 
    Clock, 
    LayoutGrid, 
    List, 
    Search,
    ArrowRight,
    Loader2,
    Calendar,
    ChevronRight
} from 'lucide-react';
import { ResumeContext } from '../context/ResumeContextObject';
import Navbar from '../components/Navbar';

const ResumeCard = ({ resume, onEdit, onDelete, viewMode }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric' 
        }).format(date);
    };

    if (viewMode === 'list') {
        return (
            <div 
                onClick={() => onEdit(resume._id)}
                className="group border-b border-border bg-background hover:bg-surface-highlight transition-colors cursor-pointer flex items-center justify-between px-6 py-4"
            >
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 border border-border flex items-center justify-center text-subtext group-hover:text-primary group-hover:border-primary/30 transition-all">
                        <FileText size={18} />
                    </div>
                    <div>
                        <h3 className="text-xs font-bold text-heading uppercase tracking-widest group-hover:text-primary transition-colors">{resume.title}</h3>
                        <div className="flex items-center gap-2 text-[10px] text-subtext font-medium mt-1">
                            <Clock size={10} />
                            Modified {formatDate(resume.updatedAt)}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(resume._id); }}
                        className="p-2 text-subtext hover:text-red-500 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                    <ChevronRight size={14} className="text-border group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
            </div>
        );
    }

    return (
        <div className="group border border-border bg-surface hover:border-primary transition-all duration-200 flex flex-col overflow-hidden h-full">
            {/* Schematic Mockup */}
            <div 
                onClick={() => onEdit(resume._id)}
                className="h-48 bg-surface-highlight border-b border-border p-4 overflow-hidden relative cursor-pointer"
            >
                <div className="w-full h-full bg-background border border-border shadow-sm p-3 space-y-2 group-hover:scale-[1.02] transition-transform duration-500">
                    <div className="h-2 w-1/3 bg-heading/10 rounded-full" />
                    <div className="h-1.5 w-full bg-subtext/5 rounded-full" />
                    <div className="h-1.5 w-full bg-subtext/5 rounded-full" />
                    <div className="pt-2 flex gap-1">
                        <div className="h-1 w-1/4 bg-primary/20 rounded-full" />
                        <div className="h-1 w-1/4 bg-primary/20 rounded-full" />
                    </div>
                    <div className="pt-2 space-y-1.5">
                        <div className="h-1 w-full bg-subtext/5 rounded-full" />
                        <div className="h-1 w-full bg-subtext/5 rounded-full" />
                        <div className="h-1 w-2/3 bg-subtext/5 rounded-full" />
                    </div>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="px-3 py-1.5 bg-heading text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                        <Edit3 size={12} /> Edit Resume
                    </div>
                </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between mb-1">
                    <h3 className="text-xs font-bold text-heading uppercase tracking-widest truncate max-w-[80%]">{resume.title}</h3>
                    <button 
                        onClick={(e) => { e.stopPropagation(); onDelete(resume._id); }}
                        className="text-subtext hover:text-red-500 transition-colors"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-subtext/80 font-medium mb-4">
                    <Calendar size={10} />
                    {formatDate(resume.updatedAt)}
                </div>
                
                <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    <button 
                        onClick={() => onEdit(resume._id)}
                        className="text-[10px] font-bold text-primary uppercase tracking-widest hover:text-primary-light inline-flex items-center gap-1"
                    >
                        Open <ArrowRight size={10} />
                    </button>
                </div>
            </div>
        </div>
    );
};

const Dashboard = () => {
    const { 
        userResumes, 
        isLoadingResumes, 
        fetchUserResumes, 
        loadResume, 
        createNewResume, 
        deleteResume 
    } = useContext(ResumeContext);
    
    const navigate = useNavigate();
    const [viewMode, setViewMode] = useState('grid');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchUserResumes();
    }, []);

    const handleCreateNew = async () => {
        const id = await createNewResume();
        if (id) navigate('/editor');
    };

    const handleEdit = async (id) => {
        const success = await loadResume(id);
        if (success) navigate('/editor');
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this resume?')) {
            await deleteResume(id);
        }
    };

    const filteredResumes = useMemo(() => 
        userResumes.filter(resume => 
            resume.title.toLowerCase().includes(searchQuery.toLowerCase())
        ), [userResumes, searchQuery]
    );

    return (
        <div className="min-h-screen bg-background font-sans text-text">
            <Navbar />
            
            <main className="max-w-[1200px] mx-auto px-6 py-16">
                <header className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-6 h-[1px] bg-primary" />
                            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em]">History</span>
                        </div>
                        <h1 className="text-4xl font-bold text-heading tracking-tight mb-4">My Resumes.</h1>
                        <p className="text-sm text-subtext max-w-xl leading-relaxed">
                            Access and manage your professional history. 
                            Every version is saved and optimized for high-density 
                            ATS-ready applications.
                        </p>
                    </div>
                    
                    <button 
                        onClick={handleCreateNew}
                        className="px-8 py-3 bg-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-primary-dark transition-all flex items-center gap-3"
                    >
                        <Plus size={16} />
                        New Document
                    </button>
                </header>

                {/* Toolbar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-12 py-4 border-y border-border">
                    <div className="relative w-full sm:max-w-md">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-subtext" size={14} />
                        <input 
                            type="text"
                            placeholder="SEARCH DOCUMENTS..."
                            className="w-full bg-transparent border-none py-2 pl-6 pr-4 text-[11px] font-bold uppercase tracking-widest focus:ring-0 outline-none transition-all placeholder:text-subtext/60"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="h-4 w-[1px] bg-border mx-2 hidden sm:block" />
                        <button 
                            onClick={() => setViewMode('grid')}
                            className={`p-1.5 transition-all ${viewMode === 'grid' ? 'text-primary' : 'text-subtext hover:text-heading'}`}
                        >
                            <LayoutGrid size={16} />
                        </button>
                        <button 
                            onClick={() => setViewMode('list')}
                            className={`p-1.5 transition-all ${viewMode === 'list' ? 'text-primary' : 'text-subtext hover:text-heading'}`}
                        >
                            <List size={16} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                {isLoadingResumes ? (
                    <div className="flex flex-col items-center justify-center py-32 gap-4">
                        <Loader2 size={32} className="text-primary animate-spin" strokeWidth={1.5} />
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-subtext">Syncing Documents...</p>
                    </div>
                ) : filteredResumes.length > 0 ? (
                    viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-px bg-border border border-border">
                            {filteredResumes.map((resume) => (
                                <ResumeCard 
                                    key={resume._id} 
                                    resume={resume} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete}
                                    viewMode="grid"
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="border border-border">
                            {filteredResumes.map((resume) => (
                                <ResumeCard 
                                    key={resume._id} 
                                    resume={resume} 
                                    onEdit={handleEdit} 
                                    onDelete={handleDelete}
                                    viewMode="list"
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 border border-dashed border-border/80">
                        <div className="w-16 h-16 border border-border/80 flex items-center justify-center mb-8">
                            <FileText size={24} className="text-subtext/60" />
                        </div>
                        <h2 className="text-sm font-bold text-heading mb-2 uppercase tracking-widest">No Documents Found</h2>
                        <p className="text-[11px] text-subtext text-center max-w-xs mb-8 font-medium">
                            Your professional history will appear here. Start your first document to begin.
                        </p>
                        <button 
                            onClick={handleCreateNew}
                            className="px-8 py-3 border border-heading text-heading text-[10px] font-bold uppercase tracking-widest hover:bg-surface transition-all flex items-center gap-2"
                        >
                            <Plus size={14} />
                            Create Now
                        </button>
                    </div>
                )}
            </main>

            <footer className="border-t border-border py-12 mt-20">
                <div className="max-w-[1200px] mx-auto px-6 text-center">
                    <p className="text-[10px] font-bold text-subtext uppercase tracking-[0.4em]">Optimized for Production</p>
                </div>
            </footer>
        </div>
    );
};

export default Dashboard;
