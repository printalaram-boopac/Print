import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { asset } from '@/lib/asset';
import { projectStorage } from '@/lib/magazine-editor-new/storage/LocalProjectStorageAdapter';
import { buildDefaultProject } from '@/lib/magazine-editor-new/templateData';
import type { ProjectSummary } from '@/lib/magazine-editor-new/storage/types';
import ProjectCard from '@/components/magazine-editor-new/ProjectCard';

type SortOption = 'updated' | 'name' | 'created';

/** Step 11 §30–45 — a clean project manager for magazine designs, matching
 * the editor's own premium visual language rather than an admin dashboard. */
export default function MyDesigns() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortOption>('updated');
  const [deleteTarget, setDeleteTarget] = useState<ProjectSummary | null>(null);

  const refresh = () => {
    projectStorage.listProjects().then(setProjects).catch(() => setProjects([]));
  };

  useEffect(() => {
    refresh();
  }, []);

  const visible = useMemo(() => {
    if (!projects) return [];
    const query = search.trim().toLowerCase();
    const filtered = query ? projects.filter((p) => p.name.toLowerCase().includes(query)) : projects;
    const sorted = [...filtered];
    if (sort === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === 'created') sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    else sorted.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return sorted;
  }, [projects, search, sort]);

  const createNew = async () => {
    const created = await projectStorage.createProject(buildDefaultProject());
    navigate(`/magazine-maker/${created.id}`);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <header className="h-[68px] bg-white border-b border-[#E7E7E4] flex items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <Link to="/"><img src={asset('logo.png')} alt="PrintAlarm" className="w-8 h-8 rounded-md object-cover" /></Link>
          <h1 className="text-[15px] font-semibold text-[#1C2024]">My Designs</h1>
        </div>
        <button
          type="button"
          onClick={createNew}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" strokeWidth={1.75} /> Create new magazine
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6">
        {projects && projects.length > 0 && (
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1 max-w-xs">
              <Search className="w-4 h-4 text-[#6F7478] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" strokeWidth={1.75} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search designs..."
                className="w-full bg-white border border-[#E7E7E4] rounded-lg pl-9 pr-3 py-2 text-[13px] text-[#1C2024] placeholder:text-[#6F7478] focus:outline-none focus:border-[#B8895A]"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              aria-label="Sort designs"
              className="px-3 py-2 rounded-lg border border-[#E7E7E4] bg-white text-[12px] text-[#6F7478] cursor-pointer"
            >
              <option value="updated">Last edited</option>
              <option value="name">Name</option>
              <option value="created">Created</option>
            </select>
          </div>
        )}

        {projects === null ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-[210/297] rounded-xl bg-white border border-[#E7E7E4] animate-pulse" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <p className="text-[16px] font-medium text-[#1C2024]">Create your first magazine</p>
            <button
              type="button"
              onClick={createNew}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-[#20272C] hover:bg-[#2B333A] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" strokeWidth={1.75} /> Create magazine
            </button>
          </div>
        ) : visible.length === 0 ? (
          <p className="text-[13px] text-[#6F7478] text-center py-16">No designs match your search.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {visible.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onOpen={() => navigate(`/magazine-maker/${p.id}`)}
                onRename={(name) => { projectStorage.renameProject(p.id, name).then(refresh); }}
                onDuplicate={() => { projectStorage.duplicateProject(p.id).then(refresh); }}
                onDelete={() => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}
      </div>

      {deleteTarget && (
        <div className="fixed inset-0 z-[400] bg-black/60 flex items-center justify-center p-6" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-[#1C2024]">Delete "{deleteTarget.name}"?</h3>
            <p className="mt-2 text-[13px] text-[#6F7478] leading-relaxed">This design will be removed from My Designs.</p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button type="button" onClick={() => setDeleteTarget(null)} className="px-4 py-2 rounded-lg text-[13px] font-medium text-[#1C2024] border border-[#E7E7E4] hover:bg-[#F5F5F3] cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={() => { projectStorage.deleteProject(deleteTarget.id).then(refresh); setDeleteTarget(null); }}
                className="px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-red-600 hover:bg-red-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
