import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectsApi } from "../lib/api";
import { useAuthStore } from "../stores/auth";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types";

type EditingProject = Partial<Project> & { id?: number };

const FIELDS: Array<{ key: keyof EditingProject; label: string; multiline?: boolean }> = [
  { key: "title", label: "Title" },
  { key: "description", label: "Description", multiline: true },
  { key: "thumbnail_url", label: "Thumbnail URL" },
  { key: "tech_stack", label: "Tech Stack (comma-separated)" },
  { key: "category", label: "Category" },
  { key: "github_url", label: "GitHub URL" },
  { key: "live_url", label: "Live URL" },
];

export default function AdminDashboardPage() {
  const qc = useQueryClient();
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [editingProject, setEditingProject] = useState<EditingProject | null>(null);

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: () => projectsApi.list().then((r) => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => projectsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-projects"] }),
  });

  const saveMutation = useMutation({
    mutationFn: (data: EditingProject) =>
      data.id ? projectsApi.update(data.id, data) : projectsApi.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-projects"] });
      setEditingProject(null);
    },
  });

  const openCreate = () =>
    setEditingProject({
      title: "",
      description: "",
      category: "Full Stack",
      tech_stack: "",
      thumbnail_url: "",
      github_url: "",
      live_url: "",
      is_featured: false,
      is_published: true,
    });

  const handleLogout = () => {
    logout();
    navigate("/admin/signin");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-headline-xl text-on-surface">Channel Dashboard</h1>
        <div className="flex gap-3">
          <button
            onClick={openCreate}
            data-testid="create-project-btn"
            className="flex items-center gap-2 bg-primary-container text-on-primary font-bold px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            CREATE
          </button>
          <button
            onClick={handleLogout}
            data-testid="logout-btn"
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-on-surface">logout</span>
          </button>
        </div>
      </div>

      {editingProject !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container rounded-xl p-6 w-full max-w-lg border border-white/10 max-h-[90vh] overflow-y-auto">
            <h2 className="text-headline-lg text-on-surface mb-4">
              {editingProject.id ? "프로젝트 수정" : "새 프로젝트"}
            </h2>
            <div className="space-y-3">
              {FIELDS.map(({ key, label, multiline }) => (
                <div key={key as string}>
                  <label className="text-body-sm text-on-surface-variant mb-1 block">
                    {label}
                  </label>
                  {multiline ? (
                    <textarea
                      value={(editingProject[key] as string) ?? ""}
                      onChange={(e) =>
                        setEditingProject((p) => ({ ...p, [key]: e.target.value }))
                      }
                      data-testid={`field-${key as string}`}
                      rows={3}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface resize-none outline-none focus:border-primary-container"
                    />
                  ) : (
                    <input
                      value={(editingProject[key] as string) ?? ""}
                      onChange={(e) =>
                        setEditingProject((p) => ({ ...p, [key]: e.target.value }))
                      }
                      data-testid={`field-${key as string}`}
                      className="w-full bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md text-on-surface outline-none focus:border-primary-container"
                    />
                  )}
                </div>
              ))}
              <label className="flex items-center gap-2 text-body-sm text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.is_featured ?? false}
                  onChange={(e) =>
                    setEditingProject((p) => ({ ...p, is_featured: e.target.checked }))
                  }
                  className="rounded"
                />
                Featured Project
              </label>
              <label className="flex items-center gap-2 text-body-sm text-on-surface cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingProject.is_published ?? true}
                  onChange={(e) =>
                    setEditingProject((p) => ({ ...p, is_published: e.target.checked }))
                  }
                  className="rounded"
                />
                Published
              </label>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => saveMutation.mutate(editingProject)}
                disabled={saveMutation.isPending}
                data-testid="save-project-btn"
                className="flex-1 bg-primary-container text-on-primary font-bold py-2 rounded-full hover:opacity-90 disabled:opacity-50"
              >
                {saveMutation.isPending ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingProject(null)}
                className="flex-1 bg-surface-container-high text-on-surface py-2 rounded-full hover:bg-surface-container-highest"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface-container rounded-xl border border-white/5 overflow-hidden">
        <div className="px-6 py-4 border-b border-outline-variant/20 bg-surface-container-low">
          <h2 className="text-headline-lg text-on-surface">Content Projects</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left" data-testid="projects-table">
            <thead>
              <tr className="text-label-sm text-on-surface-variant uppercase tracking-widest border-b border-outline-variant/10">
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Views</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/5">
              {isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant">
                    <span className="material-symbols-outlined animate-spin">autorenew</span>
                  </td>
                </tr>
              )}
              {!isLoading && projects.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-on-surface-variant"
                    data-testid="empty-table"
                  >
                    프로젝트가 없습니다.
                  </td>
                </tr>
              )}
              {projects.map((p) => (
                <tr
                  key={p.id}
                  className="hover:bg-surface-container-high/50 transition-colors"
                  data-testid="project-row"
                >
                  <td className="px-6 py-4 text-body-md font-bold text-on-surface">{p.title}</td>
                  <td className="px-6 py-4 text-body-sm text-on-surface-variant">{p.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-body-sm ${
                        p.is_published ? "text-green-400" : "text-on-surface-variant"
                      }`}
                    >
                      {p.is_published ? "Public" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-body-sm text-on-surface">
                    {p.view_count.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditingProject(p)}
                        data-testid="edit-btn"
                        className="p-2 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-on-surface transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(p.id)}
                        data-testid="delete-btn"
                        className="p-2 hover:bg-surface-container-highest rounded-full text-on-surface-variant hover:text-error transition-all"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
