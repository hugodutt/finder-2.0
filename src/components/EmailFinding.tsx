import React from "react";
import { Finding } from "../types";

interface EmailFindingProps {
  finding: Finding;
}

export function EmailFinding({ finding }: EmailFindingProps) {
  return (
    <div className="p-4 bg-white/10 border border-white/20 rounded-xl shadow-sm hover:bg-white/15 transition">
      <div className="font-mono text-sm text-indigo-300 mb-2">{finding.email}</div>
      <div className="text-xs text-white/70 space-y-1">
        <div>
          Fonte: <span className="font-medium">{finding.source}</span>
        </div>
        {finding.repo && (
          <div>
            Repositórios: <span className="font-medium">{finding.repo}</span>
          </div>
        )}
        {finding.commit && (
          <div>
            Commits: <span className="font-mono">{finding.commit}</span>
          </div>
        )}
      </div>
    </div>
  );
}
