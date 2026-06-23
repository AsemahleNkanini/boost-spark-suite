import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, RefreshCw, Sparkles } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { generateEmail } from "@/lib/mock-ai";
import { useStore, uid } from "@/lib/store";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Email Generator — Smart Productivity Hub" },
      { name: "description", content: "Generate polished emails with AI." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const { addEmail } = useStore();
  const [purpose, setPurpose] = useState(
    "Follow up on the proposal we shared last week and propose a call.",
  );
  const [audience, setAudience] = useState("Client");
  const [tone, setTone] = useState("Formal");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState<{ subject: string; body: string } | null>(null);
  const [generating, setGenerating] = useState(false);

  const run = () => {
    if (!purpose.trim()) {
      toast.error("Please describe the email purpose.");
      return;
    }
    setGenerating(true);
    setTimeout(() => {
      const result = generateEmail({ purpose, audience, tone, context });
      setOutput(result);
      addEmail({
        id: uid(),
        createdAt: Date.now(),
        purpose,
        audience,
        tone,
        subject: result.subject,
        body: result.body,
      });
      setGenerating(false);
      toast.success("Email generated");
    }, 500);
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary" className="mb-2">
          <Mail className="mr-1 h-3 w-3" /> Email Generator
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Smart Email Generator
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the goal — get a polished draft tailored to your audience and tone.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Compose</CardTitle>
            <CardDescription>Tell the AI what you need.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email purpose</Label>
              <Textarea
                rows={4}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="What should this email accomplish?"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience</Label>
                <Select value={audience} onValueChange={setAudience}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Client", "Manager", "Team", "Customer"].map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Formal", "Informal", "Professional", "Persuasive"].map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Additional context (optional)</Label>
              <Textarea
                rows={3}
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Background details, key points, names…"
              />
            </div>
            <Button onClick={run} disabled={generating} className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? "Generating…" : "Generate email"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated email</CardTitle>
            <CardDescription>Review, copy or regenerate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!output ? (
              <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                Your generated email will appear here.
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <Input readOnly value={output.subject} />
                </div>
                <div className="space-y-2">
                  <Label>Body</Label>
                  <Textarea readOnly rows={12} value={output.body} className="font-mono text-sm" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => copy(`${output.subject}\n\n${output.body}`, "Email")}
                  >
                    <Copy className="mr-2 h-4 w-4" /> Copy
                  </Button>
                  <Button variant="outline" onClick={run}>
                    <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}