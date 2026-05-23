export type SavedProject = {
  id: string;
  name: string;
  createdAt: string;
  clipCount: number;
  gradient: string;
  videoId?: string | null;
};

const STORAGE_KEY = "trendify-saved-projects";

function isValidProject(item: unknown): item is SavedProject {
  if (!item || typeof item !== "object") return false;
  const p = item as Record<string, unknown>;
  return (
    typeof p.id === "string" &&
    typeof p.name === "string" &&
    typeof p.createdAt === "string" &&
    typeof p.clipCount === "number" &&
    typeof p.gradient === "string"
  );
}

export function loadSavedProjects(): SavedProject[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidProject);
  } catch {
    return [];
  }
}

function persist(projects: SavedProject[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

export function saveProject(
  input: Omit<SavedProject, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  }
): SavedProject {
  const projects = loadSavedProjects();
  const existing = input.videoId
    ? projects.find((p) => p.videoId === input.videoId)
    : undefined;

  const project: SavedProject = {
    id: existing?.id ?? input.id ?? crypto.randomUUID(),
    name: input.name.trim() || "Projeto sem nome",
    createdAt: existing?.createdAt ?? input.createdAt ?? new Date().toISOString(),
    clipCount: input.clipCount,
    gradient: input.gradient,
    videoId: input.videoId ?? null,
  };

  const next = existing
    ? projects.map((p) => (p.id === existing.id ? project : p))
    : [project, ...projects];

  persist(next);
  return project;
}

export function deleteProject(id: string): void {
  const projects = loadSavedProjects().filter((p) => p.id !== id);
  persist(projects);
}

export function formatProjectDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
