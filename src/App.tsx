import React, { useState } from "react";
import { Loader2, Github, Search } from "lucide-react";
import { Input } from "./components/Input";
import { Button } from "./components/Button";
import { EmailFinding } from "./components/EmailFinding";
import { Finding } from "./types";
import { scanUserEmails } from "./utils/githubApi";

export default function App() {
  const [user, setUser] = useState("");
  const [busy, setBusy] = useState(false);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onScan() {
    if (!user || busy) return;
    
    setBusy(true);
    setError(null);
    setInfo(null);
    setFindings([]);
    
    try {
      const collected = await scanUserEmails(user, setInfo);
      setFindings(collected);
      
      if (collected.length === 0) {
        setError("Nenhum e-mail público encontrado.");
      }
    } catch (e: any) {
      setError(e.message || String(e));
    } finally {
      setBusy(false);
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onScan();
    }
  };

  return (
    <div className="relative min-h-screen bg-[#07070A] text-white overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_white_1px,transparent_1px)] [background-size:20px_20px] opacity-5 pointer-events-none z-0"></div>

      <div className="relative max-w-2xl mx-auto p-6 space-y-6 z-10">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Github className="w-6 h-6" /> GitHub Email Finder
        </h1>
        <p className="text-sm text-white/60">
          Descubra e-mails públicos a partir de um usuário do GitHub (via eventos e commits).
        </p>

        <div className="space-y-4">
          <div className="flex gap-3">
            <Input 
              placeholder="Digite o usuário do GitHub" 
              value={user} 
              onChange={(e) => setUser(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={onScan} 
              disabled={busy || !user} 
              className={user ? "bg-indigo-600 hover:bg-indigo-500" : "bg-indigo-500"}
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} 
              {busy ? "Buscando…" : "Buscar"}
            </Button>
          </div>

          {info && <div className="text-xs text-white/50">{info}</div>}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500/30 rounded text-sm">
              {error}
            </div>
          )}

          <div className="grid gap-3">
            {findings.map((finding, i) => (
              <EmailFinding key={i} finding={finding} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
