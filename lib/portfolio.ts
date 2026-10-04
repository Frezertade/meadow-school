export interface PortfolioLesson {
  title: string;
  subject: string;
  minutes: number;
  paSubjects: string[];
  status: 'finished' | 'started';
}

export interface PortfolioSkill {
  label: string;
  level: 'solid' | 'practicing' | 'new';
  seen: number;
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * One-tap PA portfolio: finished/started lessons with statute tags,
 * skill levels, and recent log lines. Printed or saved as PDF.
 */
export function buildPortfolioHtml(args: {
  childName: string;
  bandLabel: string;
  lessons: PortfolioLesson[];
  skills: PortfolioSkill[];
  logLines: string[];
  generatedAt: string;
}): string {
  const lessonRows = args.lessons
    .map(
      (l) => `<tr><td>${esc(l.title)}</td><td>${esc(l.subject)}</td><td>${l.minutes} min</td>` +
        `<td>${esc(l.paSubjects.join('; '))}</td><td>${l.status}</td></tr>`
    )
    .join('\n');
  const skillRows = args.skills
    .map(
      (s) => `<tr><td>${esc(s.label)}</td><td>${s.level}</td><td>${s.seen}×</td></tr>`
    )
    .join('\n');
  const logs = args.logLines.map((l) => `<li>${esc(l)}</li>`).join('\n');

  return `<!doctype html><html><head><meta charset="utf-8" />
<title>Meadow School portfolio — ${esc(args.childName)}</title>
<style>
body { font-family: Georgia, serif; color: #1a2e24; max-width: 720px; margin: 32px auto; padding: 0 16px; }
h1 { font-size: 28px; } h2 { font-size: 20px; margin-top: 28px; }
table { border-collapse: collapse; width: 100%; font-size: 14px; }
th, td { border: 1px solid #999; padding: 6px 8px; text-align: left; }
.meta { color: #555; } ul { font-size: 14px; }
.note { font-size: 13px; color: #555; margin-top: 24px; }
</style></head><body>
<h1>Home education portfolio — ${esc(args.childName)}</h1>
<p class="meta">${esc(args.bandLabel)} · Meadow School · Generated ${esc(args.generatedAt)}</p>
<h2>Lessons (${args.lessons.length})</h2>
<table><tr><th>Lesson</th><th>Subject</th><th>Time</th><th>PA statute subjects</th><th>Status</th></tr>
${lessonRows}</table>
<h2>Skills</h2>
<table><tr><th>Skill</th><th>Level</th><th>Practiced</th></tr>
${skillRows}</table>
<h2>Recent learning log</h2>
<ul>${logs}</ul>
<p class="note">Lessons tag Pennsylvania statute subjects (24 P.S. § 13-1327.1) so this
portfolio stays honest. This app helps you document learning; it does not replace
filing a home-education affidavit with your district when compulsory attendance applies.</p>
</body></html>`;
}
