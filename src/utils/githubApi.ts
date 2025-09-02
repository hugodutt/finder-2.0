import { Finding } from '../types';
import { classify, isRoutable } from './emailUtils';

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN || '';

export function buildHeaders(extra?: Record<string, string>) {
  const h: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (GITHUB_TOKEN.trim()) h.Authorization = `Bearer ${GITHUB_TOKEN.trim()}`;
  return { ...(extra || {}), ...h };
}

export async function fetchJson(url: string, setInfo: (info: string) => void) {
  const res = await fetch(url, { headers: buildHeaders() });
  
  if (res.status === 403) {
    const rl = res.headers.get("x-ratelimit-remaining");
    const reset = res.headers.get("x-ratelimit-reset");
    const when = reset ? new Date(parseInt(reset, 10) * 1000).toLocaleTimeString() : "";
    throw new Error(`403 — possivelmente rate limit. Restante: ${rl ?? "?"}${when ? `, reseta às ${when}` : ""}. Adicione um token para aumentar o limite.`);
  }
  
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  
  setInfo(
    `Limite: ${res.headers.get("x-ratelimit-remaining") ?? "?"}/${res.headers.get("x-ratelimit-limit") ?? "?"}`
  );
  
  return res.json();
}

export async function scanUserEmails(user: string, setInfo: (info: string) => void): Promise<Finding[]> {
  const emailMap = new Map<string, Finding>();
  
  try {
    // Step 1: User events
    const events = await fetchJson(`https://api.github.com/users/${user}/events/public?per_page=100`, setInfo);
    for (const ev of events) {
      if (ev.type !== "PushEvent") continue;
      const repo = ev.repo?.name;
      for (const c of ev.payload?.commits || []) {
        const email = c?.author?.email;
        if (email && classify(email) === "real" && isRoutable(email)) {
          if (emailMap.has(email)) {
            // Adiciona informações adicionais ao e-mail existente
            const existing = emailMap.get(email)!;
            if (repo && !existing.repo?.includes(repo)) {
              existing.repo = existing.repo ? `${existing.repo}, ${repo}` : repo;
            }
            if (c.sha && !existing.commit?.includes(c.sha.substring(0, 7))) {
              existing.commit = existing.commit ? `${existing.commit}, ${c.sha.substring(0, 7)}` : c.sha.substring(0, 7);
            }
          } else {
            emailMap.set(email, { 
              email, 
              source: "events", 
              repo: repo || undefined, 
              commit: c.sha ? c.sha.substring(0, 7) : undefined 
            });
          }
        }
      }
    }
    
    if (emailMap.size === 0) {
      // Step 2: Repos + commits (limitados para não estourar rate)
      const repos = await fetchJson(`https://api.github.com/users/${user}/repos?per_page=5&sort=updated`, setInfo);
      for (const r of repos.slice(0, 5)) {
        const commits = await fetchJson(`https://api.github.com/repos/${user}/${r.name}/commits?author=${user}&per_page=3`, setInfo);
        for (const c of commits) {
          const email = c?.commit?.author?.email;
          if (email && classify(email) === "real" && isRoutable(email)) {
            if (emailMap.has(email)) {
              // Adiciona informações adicionais ao e-mail existente
              const existing = emailMap.get(email)!;
              if (r.name && !existing.repo?.includes(r.name)) {
                existing.repo = existing.repo ? `${existing.repo}, ${r.name}` : r.name;
              }
              if (c.sha && !existing.commit?.includes(c.sha.substring(0, 7))) {
                existing.commit = existing.commit ? `${existing.commit}, ${c.sha.substring(0, 7)}` : c.sha.substring(0, 7);
              }
            } else {
              emailMap.set(email, { 
                email, 
                source: "commits", 
                repo: r.name, 
                commit: c.sha ? c.sha.substring(0, 7) : undefined 
              });
            }
          }
        }
      }
    }
    
    if (emailMap.size === 0) {
      // Step 3: Search commits
      const search = await fetchJson(`https://api.github.com/search/commits?q=author:${user}&per_page=3`, setInfo);
      for (const item of search.items || []) {
        const email = item?.commit?.author?.email;
        if (email && classify(email) === "real" && isRoutable(email)) {
          if (emailMap.has(email)) {
            // Adiciona informações adicionais ao e-mail existente
            const existing = emailMap.get(email)!;
            if (item.repository?.name && !existing.repo?.includes(item.repository.name)) {
              existing.repo = existing.repo ? `${existing.repo}, ${item.repository.name}` : existing.repo;
            }
            if (item.sha && !existing.commit?.includes(item.sha.substring(0, 7))) {
              existing.commit = existing.commit ? `${existing.commit}, ${item.sha.substring(0, 7)}` : item.sha.substring(0, 7);
            }
          } else {
            emailMap.set(email, { 
              email, 
              source: "search", 
              repo: item.repository?.name, 
              commit: item.sha ? item.sha.substring(0, 7) : undefined 
            });
          }
        }
      }
    }
    
    return Array.from(emailMap.values());
  } catch (error) {
    throw error;
  }
}
