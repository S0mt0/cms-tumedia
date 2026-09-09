export function normaliseYouTubeUrl(value: string) {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.split("/").filter(Boolean);
    const id = host === "youtu.be"
      ? path[0]
      : host === "youtube.com" || host === "m.youtube.com"
        ? url.searchParams.get("v") ?? ( ["shorts", "embed", "live"].includes(path[0] ?? "") ? path[1] : undefined )
        : undefined;

    return id ? `https://www.youtube.com/watch?v=${encodeURIComponent(id)}` : trimmed;
  } catch {
    return trimmed;
  }
}
