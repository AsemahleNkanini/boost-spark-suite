import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type EmailItem = {
  id: string;
  createdAt: number;
  purpose: string;
  audience: string;
  tone: string;
  subject: string;
  body: string;
};

export type MeetingItem = {
  id: string;
  createdAt: number;
  title: string;
  participants: string;
  summary: string;
  decisions: string[];
  actionItems: string[];
  deadlines: string[];
  responsible: string[];
};

export type TaskInput = {
  id: string;
  name: string;
  deadline: string;
  priority: "High" | "Medium" | "Low";
};

export type TaskPlanItem = {
  id: string;
  createdAt: number;
  title: string;
  hoursPerDay: number;
  tasks: TaskInput[];
  priorityTasks: TaskInput[];
  dailyPlan: { time: string; task: string }[];
  weeklySchedule: { day: string; tasks: string[] }[];
  tips: string[];
};

export type Settings = {
  darkMode: boolean;
  notifications: boolean;
  aiPreference: "Balanced" | "Creative" | "Precise";
};

type Store = {
  emails: EmailItem[];
  meetings: MeetingItem[];
  plans: TaskPlanItem[];
  settings: Settings;
  addEmail: (e: EmailItem) => void;
  addMeeting: (m: MeetingItem) => void;
  addPlan: (p: TaskPlanItem) => void;
  updateSettings: (s: Partial<Settings>) => void;
};

const StoreContext = createContext<Store | null>(null);

const seedEmails: EmailItem[] = [
  {
    id: "e1",
    createdAt: Date.now() - 1000 * 60 * 60 * 4,
    purpose: "Follow up on the Q3 proposal we shared last week.",
    audience: "Client",
    tone: "Formal",
    subject: "Following Up on Our Q3 Proposal",
    body: "Dear Valued Client,\n\nI hope this message finds you well. I wanted to follow up regarding the Q3 proposal we shared last week. We would appreciate any feedback you may have and remain available to walk through the details at your convenience.\n\nPlease let us know a time that works for a brief call this week.\n\nWarm regards,\nThe Team",
  },
];

const seedMeetings: MeetingItem[] = [
  {
    id: "m1",
    createdAt: Date.now() - 1000 * 60 * 60 * 24,
    title: "Q3 Product Roadmap Sync",
    participants: "Alex, Priya, Marcus, Jen",
    summary:
      "Team aligned on the Q3 product roadmap, prioritizing the analytics revamp and a new onboarding flow. Engineering capacity was discussed and trade-offs agreed upon.",
    decisions: [
      "Ship analytics revamp before onboarding flow",
      "Postpone mobile-only features to Q4",
      "Adopt weekly cross-team demos",
    ],
    actionItems: [
      "Draft analytics spec",
      "Prepare onboarding research brief",
      "Set up weekly demo calendar",
    ],
    deadlines: ["Analytics spec — Friday", "Research brief — next Wednesday"],
    responsible: ["Alex (spec)", "Priya (research)", "Marcus (calendar)"],
  },
];

const seedPlans: TaskPlanItem[] = [
  {
    id: "p1",
    createdAt: Date.now() - 1000 * 60 * 60 * 48,
    title: "Launch Week Plan",
    hoursPerDay: 7,
    tasks: [
      { id: "t1", name: "Finalize landing page copy", deadline: "Mon", priority: "High" },
      { id: "t2", name: "QA checkout flow", deadline: "Tue", priority: "High" },
      { id: "t3", name: "Schedule social posts", deadline: "Wed", priority: "Medium" },
    ],
    priorityTasks: [
      { id: "t1", name: "Finalize landing page copy", deadline: "Mon", priority: "High" },
      { id: "t2", name: "QA checkout flow", deadline: "Tue", priority: "High" },
    ],
    dailyPlan: [
      { time: "9:00 — 11:00", task: "Deep work: landing page copy" },
      { time: "11:15 — 12:30", task: "QA checkout flow" },
      { time: "13:30 — 15:00", task: "Review analytics setup" },
      { time: "15:15 — 16:30", task: "Schedule social posts" },
    ],
    weeklySchedule: [
      { day: "Monday", tasks: ["Landing page copy", "Team standup"] },
      { day: "Tuesday", tasks: ["QA checkout", "Bug triage"] },
      { day: "Wednesday", tasks: ["Schedule social", "Email blast draft"] },
      { day: "Thursday", tasks: ["Final review", "Stakeholder sync"] },
      { day: "Friday", tasks: ["Launch", "Retro"] },
    ],
    tips: [
      "Tackle High priority tasks during your first focus block.",
      "Batch shallow work into the afternoon.",
      "Protect 15-minute buffers between deep-work sessions.",
    ],
  },
];

const defaultSettings: Settings = {
  darkMode: false,
  notifications: true,
  aiPreference: "Balanced",
};

const STORAGE_KEY = "sph-store-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [emails, setEmails] = useState<EmailItem[]>(seedEmails);
  const [meetings, setMeetings] = useState<MeetingItem[]>(seedMeetings);
  const [plans, setPlans] = useState<TaskPlanItem[]>(seedPlans);
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.emails) setEmails(parsed.emails);
        if (parsed.meetings) setMeetings(parsed.meetings);
        if (parsed.plans) setPlans(parsed.plans);
        if (parsed.settings) setSettings({ ...defaultSettings, ...parsed.settings });
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ emails, meetings, plans, settings }),
    );
  }, [emails, meetings, plans, settings, hydrated]);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [settings.darkMode]);

  const value: Store = {
    emails,
    meetings,
    plans,
    settings,
    addEmail: (e) => setEmails((p) => [e, ...p]),
    addMeeting: (m) => setMeetings((p) => [m, ...p]),
    addPlan: (p) => setPlans((prev) => [p, ...prev]),
    updateSettings: (s) => setSettings((prev) => ({ ...prev, ...s })),
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function uid() {
  return Math.random().toString(36).slice(2, 10);
}