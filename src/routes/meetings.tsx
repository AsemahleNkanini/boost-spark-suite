import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles, Calendar, CheckCircle2, Users, Target } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { summarizeMeeting } from "@/lib/mock-ai";
import { useStore, uid, type MeetingItem } from "@/lib/store";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Summaries — Smart Productivity Hub" },
      { name: "description", content: "Turn raw meeting notes into structured summaries." },
    ],
  }),
  component: MeetingsPage,
});

const sampleNotes = `Discussed Q3 launch readiness. Marcus agreed to own QA by Friday. Priya will draft customer comms before Monday.
We decided to delay the mobile-only feature to Q4 in favor of analytics revamp.
Action: schedule weekly demos. Risk: limited engineering capacity.`;

function MeetingsPage() {
  const { addMeeting } = useStore();
  const [title, setTitle] = useState("Q3 Launch Sync");
  const [participants, setParticipants] = useState("Alex, Priya, Marcus, Jen");
  const [notes, setNotes] = useState(sampleNotes);
  const [output, setOutput] = useState<MeetingItem | null>(null);
  const [loading, setLoading] = useState(false);

  const run = () => {
    if (!notes.trim()) {
      toast.error("Please paste meeting notes first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const r = summarizeMeeting({ title, participants, notes });
      const item: MeetingItem = {
        id: uid(),
        createdAt: Date.now(),
        title,
        participants,
        ...r,
      };
      setOutput(item);
      addMeeting(item);
      setLoading(false);
      toast.success("Summary ready");
    }, 500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary" className="mb-2">
          <FileText className="mr-1 h-3 w-3" /> Meeting Summaries
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Meeting Notes Summarizer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste raw notes — get a structured executive summary in seconds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Meeting input</CardTitle>
            <CardDescription>Add notes and details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Meeting title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Participants</Label>
              <Input
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Comma-separated"
              />
            </div>
            <div className="space-y-2">
              <Label>Meeting notes</Label>
              <Textarea
                rows={12}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
            <Button onClick={run} disabled={loading} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Summarizing…" : "Summarize notes"}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-3">
          {!output ? (
            <Card>
              <CardContent className="p-10 text-center text-sm text-muted-foreground">
                Your structured summary will appear here.
              </CardContent>
            </Card>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" /> Executive summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">{output.summary}</CardContent>
              </Card>
              <div className="grid gap-4 md:grid-cols-2">
                <SummaryList
                  icon={<CheckCircle2 className="h-4 w-4 text-[color:var(--success)]" />}
                  title="Key decisions"
                  items={output.decisions}
                />
                <SummaryList
                  icon={<Sparkles className="h-4 w-4 text-primary" />}
                  title="Action items"
                  items={output.actionItems}
                />
                <SummaryList
                  icon={<Calendar className="h-4 w-4 text-[color:var(--info)]" />}
                  title="Deadlines"
                  items={output.deadlines}
                />
                <SummaryList
                  icon={<Users className="h-4 w-4 text-[color:var(--warning)]" />}
                  title="Responsible persons"
                  items={output.responsible}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryList({
  icon,
  title,
  items,
}: {
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          {icon} {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {items.map((it, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}