import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { History as HistoryIcon, Search, Mail, FileText, ListChecks } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — Smart Productivity Hub" },
      { name: "description", content: "Browse previous AI-generated outputs." },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const { emails, meetings, plans } = useStore();
  const [q, setQ] = useState("");
  const f = q.toLowerCase();

  const matchEmail = emails.filter(
    (e) =>
      e.subject.toLowerCase().includes(f) ||
      e.body.toLowerCase().includes(f) ||
      e.audience.toLowerCase().includes(f),
  );
  const matchMeet = meetings.filter(
    (m) =>
      m.title.toLowerCase().includes(f) ||
      m.summary.toLowerCase().includes(f) ||
      m.participants.toLowerCase().includes(f),
  );
  const matchPlan = plans.filter(
    (p) =>
      p.title.toLowerCase().includes(f) ||
      p.tasks.some((t) => t.name.toLowerCase().includes(f)),
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary" className="mb-2">
          <HistoryIcon className="mr-1 h-3 w-3" /> History
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Your history</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Search across past emails, meeting summaries and task plans.
        </p>
      </div>

      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search history…"
          className="pl-9"
        />
      </div>

      <Tabs defaultValue="emails">
        <TabsList>
          <TabsTrigger value="emails">
            <Mail className="mr-2 h-4 w-4" /> Emails
            <Badge variant="secondary" className="ml-2">{matchEmail.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="meetings">
            <FileText className="mr-2 h-4 w-4" /> Meetings
            <Badge variant="secondary" className="ml-2">{matchMeet.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="plans">
            <ListChecks className="mr-2 h-4 w-4" /> Task plans
            <Badge variant="secondary" className="ml-2">{matchPlan.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="emails" className="mt-4 space-y-3">
          {matchEmail.length === 0 ? (
            <EmptyState text="No emails yet." />
          ) : (
            matchEmail.map((e) => (
              <Card key={e.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-base">{e.subject}</CardTitle>
                    <Badge variant="outline">{e.audience}</Badge>
                    <Badge variant="secondary">{e.tone}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 whitespace-pre-line text-sm text-muted-foreground">
                    {e.body}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="meetings" className="mt-4 space-y-3">
          {matchMeet.length === 0 ? (
            <EmptyState text="No meeting summaries yet." />
          ) : (
            matchMeet.map((m) => (
              <Card key={m.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">{m.participants}</p>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{m.summary}</p>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="plans" className="mt-4 space-y-3">
          {matchPlan.length === 0 ? (
            <EmptyState text="No task plans yet." />
          ) : (
            matchPlan.map((p) => (
              <Card key={p.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{p.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {p.tasks.length} tasks · {p.hoursPerDay}h/day
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {p.tasks.slice(0, 5).map((t) => (
                      <Badge key={t.id} variant="outline">{t.name}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <Card>
      <CardContent className="p-8 text-center text-sm text-muted-foreground">{text}</CardContent>
    </Card>
  );
}