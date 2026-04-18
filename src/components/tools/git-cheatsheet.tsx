import { useState, useMemo } from "react";
import { GitBranch, Search, Terminal } from "lucide-react";
import { ToolPanel, CopyButton } from "./shared";

const commands = [
    { group: "Setup", cmd: "git init", desc: "Initialize a new local repository" },
    { group: "Setup", cmd: "git clone <url>", desc: "Clone an existing repository" },
    { group: "Setup", cmd: "git config --global user.name '<name>'", desc: "Set global git username" },

    { group: "Basic", cmd: "git status", desc: "List modified, tracked, and untracked files" },
    { group: "Basic", cmd: "git add .", desc: "Stage all altered files for commit" },
    { group: "Basic", cmd: "git commit -m '<message>'", desc: "Commit staged files with a message" },
    { group: "Basic", cmd: "git push origin <branch>", desc: "Push local commits to remote branch" },

    { group: "Branching", cmd: "git branch", desc: "List all local branches" },
    { group: "Branching", cmd: "git checkout -b <branch>", desc: "Create a new branch and switch to it" },
    { group: "Branching", cmd: "git switch <branch>", desc: "Switch to a specific branch" },
    { group: "Branching", cmd: "git merge <branch>", desc: "Merge specified branch into current branch" },

    { group: "History & Undoing", cmd: "git log", desc: "Show commit history" },
    { group: "History & Undoing", cmd: "git revert <commit>", desc: "Create a new commit that undoes the specified commit" },
    { group: "History & Undoing", cmd: "git reset --hard HEAD", desc: "Discard all local working changes" },
    { group: "History & Undoing", cmd: "git commit --amend -m 'msg'", desc: "Rewrite the last commit message and add staged files" },

    { group: "Advanced", cmd: "git stash", desc: "Temporarily store modified, tracked files" },
    { group: "Advanced", cmd: "git stash pop", desc: "Restore the most recently stashed files" },
    { group: "Advanced", cmd: "git rebase <branch>", desc: "Reapply commits on top of another base tip" },
    { group: "Advanced", cmd: "git cherry-pick <commit>", desc: "Apply the changes introduced by an existing commit" }
];

export function GitCheatsheet() {
    const [search, setSearch] = useState("");

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        if (!q) return commands;
        return commands.filter(c =>
            c.cmd.toLowerCase().includes(q) ||
            c.desc.toLowerCase().includes(q) ||
            c.group.toLowerCase().includes(q)
        );
    }, [search]);

    // Group filtered results
    const grouped = filtered.reduce((acc, curr) => {
        if (!acc[curr.group]) acc[curr.group] = [];
        acc[curr.group].push(curr);
        return acc;
    }, {} as Record<string, typeof commands>);

    return (
        <div className="space-y-6">
            <ToolPanel>
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search commands or descriptions..."
                        className="w-full rounded-md border border-border bg-background py-2.5 pl-9 pr-4 text-sm outline-none transition-colors focus:border-foreground/30"
                    />
                </div>

                {Object.entries(grouped).length === 0 ? (
                    <div className="py-10 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                        No commands match your search.
                    </div>
                ) : (
                    <div className="space-y-8">
                        {Object.entries(grouped).map(([group, cmds]) => (
                            <div key={group}>
                                <h3 className="mb-3 font-display text-lg font-semibold tracking-tight">{group}</h3>
                                <div className="grid gap-2">
                                    {cmds.map(c => (
                                        <div key={c.cmd} className="group relative overflow-hidden rounded-md border border-border bg-muted/10 hover:border-foreground/20 transition-colors">
                                            <div className="flex flex-col sm:flex-row sm:items-center">
                                                <div className="flex-1 p-3">
                                                    <div className="mb-1 font-mono text-sm text-foreground">
                                                        {c.cmd}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">{c.desc}</div>
                                                </div>
                                                <div className="bg-muted/30 p-2 sm:self-stretch sm:border-l sm:border-border sm:p-3 sm:flex sm:items-center">
                                                    <CopyButton value={c.cmd} label="Copy" />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ToolPanel>
        </div>
    );
}
