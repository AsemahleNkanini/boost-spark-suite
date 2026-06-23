import type { TaskInput } from "./store";

export function generateEmail(opts: {
  purpose: string;
  audience: string;
  tone: string;
  context: string;
}) {
  const { purpose, audience, tone, context } = opts;
  const greetings: Record<string, string> = {
    Client: "Dear Valued Client,",
    Manager: "Hi {name},",
    Team: "Hi team,",
    Customer: "Hello,",
  };
  const closings: Record<string, string> = {
    Formal: "Kind regards,\nThe Team",
    Informal: "Cheers,\nThe Team",
    Professional: "Best regards,\nThe Team",
    Persuasive: "Looking forward to your response,\nThe Team",
  };
  const subjectStems: Record<string, string> = {
    Formal: "Regarding",
    Informal: "Quick note:",
    Professional: "Update:",
    Persuasive: "An opportunity:",
  };

  const trimmedPurpose = purpose.trim() || "our recent conversation";
  const shortPurpose =
    trimmedPurpose.length > 60 ? trimmedPurpose.slice(0, 57) + "..." : trimmedPurpose;
  const subject = `${subjectStems[tone] ?? "Regarding"} ${shortPurpose}`;

  const opener =
    tone === "Formal"
      ? "I hope this message finds you well."
      : tone === "Informal"
        ? "Hope you're having a good week!"
        : tone === "Persuasive"
          ? "I wanted to share something I believe will genuinely move things forward."
          : "Thanks for the time you've put into this so far.";

  const body =
    `${greetings[audience] ?? "Hello,"}\n\n` +
    `${opener}\n\n` +
    `I'm reaching out regarding ${trimmedPurpose}. ` +
    (context.trim()
      ? `For context: ${context.trim()} `
      : "") +
    (tone === "Persuasive"
      ? "I'm confident this is the right next step, and I'd love your thoughts on how to move forward together."
      : tone === "Formal"
        ? "Please let me know how you would like to proceed, and I will follow up with the appropriate next steps."
        : "Let me know what you think and we can take it from there.") +
    "\n\n" +
    closings[tone];

  return { subject, body };
}

export function summarizeMeeting(opts: {
  title: string;
  participants: string;
  notes: string;
}) {
  const { title, participants, notes } = opts;
  const sentences = notes
    .split(/[.\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 6);

  const summary =
    sentences.length > 0
      ? `In the "${title || "meeting"}" session with ${participants || "the team"}, the group discussed ${sentences.slice(0, 2).join(". ")}. The conversation aligned on priorities and clarified next steps.`
      : `The team met to discuss "${title || "ongoing work"}" and aligned on the path forward.`;

  const decisions = pickLines(sentences, ["decide", "agree", "approve", "go with", "choose"]) || [
    "Move forward with the proposed approach",
    "Re-evaluate scope at next sync",
  ];
  const actionItems = pickLines(sentences, ["will", "to do", "action", "follow up", "draft", "send"]) || [
    "Share recap with stakeholders",
    "Draft follow-up brief",
  ];
  const deadlines = pickLines(sentences, ["by ", "before", "deadline", "friday", "monday", "next week", "eod"]) || [
    "Next sync — end of week",
  ];
  const participantList = (participants || "Team")
    .split(/[,;]/)
    .map((p) => p.trim())
    .filter(Boolean);
  const responsible = participantList.length
    ? participantList.slice(0, 3).map((p, i) => `${p} — ${actionItems[i] ?? "follow-up"}`)
    : ["Team lead — follow-up"];

  return { summary, decisions, actionItems, deadlines, responsible };
}

function pickLines(lines: string[], keywords: string[]) {
  const matches = lines.filter((l) =>
    keywords.some((k) => l.toLowerCase().includes(k)),
  );
  if (matches.length === 0) return null;
  return matches.slice(0, 4).map((m) => capitalize(m));
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function planTasks(tasks: TaskInput[], hoursPerDay: number) {
  const order = { High: 0, Medium: 1, Low: 2 } as const;
  const sorted = [...tasks].sort((a, b) => order[a.priority] - order[b.priority]);
  const priorityTasks = sorted.filter((t) => t.priority === "High").slice(0, 5);

  const blockHours = Math.max(1, Math.floor(hoursPerDay / Math.max(1, sorted.length)));
  let cursor = 9;
  const dailyPlan = sorted.slice(0, Math.max(1, hoursPerDay)).map((t) => {
    const start = `${pad(cursor)}:00`;
    cursor += blockHours;
    const end = `${pad(cursor)}:00`;
    cursor += 0; // small gap implicit
    return { time: `${start} — ${end}`, task: `${t.priority}: ${t.name}` };
  });

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const weeklySchedule = days.map((day, i) => ({
    day,
    tasks: sorted
      .filter((_, idx) => idx % days.length === i)
      .map((t) => `${t.name} (${t.priority})`),
  }));

  const tips = [
    `Tackle ${priorityTasks[0]?.name ?? "your top priority"} first thing.`,
    `With ${hoursPerDay}h/day, batch similar tasks into single blocks to reduce context switching.`,
    "Reserve the last 30 minutes of the day for review and planning tomorrow.",
    "Protect at least one deep-work block free of meetings.",
  ];

  return { priorityTasks, dailyPlan, weeklySchedule, tips };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}