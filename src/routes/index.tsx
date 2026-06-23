import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Mail,
  FileText,
  ListChecks,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Smart Productivity Hub" },
      {
        name: "description",
        content:
          "AI-powered dashboard for emails, meeting summaries and task planning.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { emails, meetings, plans } = useStore();
  const score = Math.min(
    100,
    40 + emails.length * 6 + meetings.length * 8 + plans.length * 10,
  );

  const stats = [
    {
      label: "Emails Generated",
      value: emails.length,
      icon: Mail,
      accent: "from-violet-500/20 to-fuchsia-500/10",
    },
    {
      label: "Meetings Summarized",
      value: meetings.length,
      icon: FileText,
      accent: "from-sky-500/20 to-cyan-500/10",
    },
    {
      label: "Tasks Planned",
      value: plans.reduce((a, p) => a + p.tasks.length, 0),
      icon: ListChecks,
      accent: "from-emerald-500/20 to-teal-500/10",
    },
    {
      label: "Productivity Score",
      value: `${score}%`,
      icon: TrendingUp,
      accent: "from-amber-500/20 to-orange-500/10",
    },
  ];

  const actions = [
    {
      title: "Generate Email",
      desc: "Craft polished emails in seconds.",
      to: "/email",
      icon: Mail,
    },
    {
      title: "Summarize Notes",
      desc: "Turn raw notes into structured summaries.",
      to: "/meetings",
      icon: FileText,
    },
    {
      title: "Plan Tasks",
      desc: "Get an AI-built daily and weekly plan.",
      to: "/tasks",
      icon: ListChecks,
    },
  ] as const;

  const recent = [
    ...emails.map((e) => ({
      id: e.id,
      type: "Email",
      title: e.subject,
      time: e.createdAt,
    })),
    ...meetings.map((m) => ({
      id: m.id,
      type: "Meeting",
      title: m.title,
      time: m.createdAt,
    })),
    ...plans.map((p) => ({
      id: p.id,
      type: "Plan",
      title: p.title,
      time: p.createdAt,
    })),
  ]
    .sort((a, b) => b.time - a.time)
    .slice(0, 6);

  return (
    <div className="space-y-8 animate-fade-in">
      <section
        className="relative overflow-hidden rounded-2xl border p-6 sm:p-8"
        style={{ background: "var(--gradient-subtle)" }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Badge variant="secondary" className="mb-3">
              <Sparkles className="mr-1 h-3 w-3" /> AI-powered
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Welcome back 👋
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Your AI co-pilot for emails, meetings and tasks. Jump in below.
            </p>
          </div>
          <Button asChild size="lg" className="shrink-0">
            <Link to="/email">
              New email <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {s.label}
                  </div>
                  <div className="mt-1 text-2xl font-bold">{s.value}</div>
                </div>
                <div
                  className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${s.accent} text-foreground`}
                >
                  <s.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Quick actions</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {actions.map((a) => (
            <Card key={a.title} className="group transition-shadow hover:shadow-lg">
              <CardHeader>
                <div
                  className="grid h-10 w-10 place-items-center rounded-lg text-primary-foreground"
                  style={{ background: "var(--gradient-primary)" }}
                >
                  <a.icon className="h-5 w-5" />
                </div>
                <CardTitle className="mt-3">{a.title}</CardTitle>
                <CardDescription>{a.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="secondary" className="w-full">
                  <Link to={a.to}>
                    Open <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent activity</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/history">View all</Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            {recent.length === 0 ? (
              <div className="p-6 text-sm text-muted-foreground">No activity yet.</div>
            ) : (
              <ul className="divide-y">
                {recent.map((r) => (
                  <li key={r.id} className="flex items-center gap-3 px-4 py-3">
                    <Badge variant="outline" className="shrink-0">
                      {r.type}
                    </Badge>
                    <div className="min-w-0 flex-1 truncate text-sm">{r.title}</div>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {timeAgo(r.time)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

function timeAgo(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}
