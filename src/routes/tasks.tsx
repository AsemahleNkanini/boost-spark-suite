import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Plus, Trash2, Sparkles, Calendar, Lightbulb } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { planTasks } from "@/lib/mock-ai";
import { useStore, uid, type TaskInput, type TaskPlanItem } from "@/lib/store";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Planner — Smart Productivity Hub" },
      { name: "description", content: "AI-powered task planning and daily schedule." },
    ],
  }),
  component: TasksPage,
});

const initialTasks: TaskInput[] = [
  { id: uid(), name: "Finalize landing page copy", deadline: "Mon", priority: "High" },
  { id: uid(), name: "QA checkout flow", deadline: "Tue", priority: "High" },
  { id: uid(), name: "Schedule social posts", deadline: "Wed", priority: "Medium" },
];

function priorityVariant(p: TaskInput["priority"]) {
  if (p === "High") return "destructive";
  if (p === "Medium") return "default";
  return "secondary";
}

function TasksPage() {
  const { addPlan } = useStore();
  const [title, setTitle] = useState("This Week");
  const [tasks, setTasks] = useState<TaskInput[]>(initialTasks);
  const [hours, setHours] = useState(7);
  const [plan, setPlan] = useState<TaskPlanItem | null>(null);

  const addTask = () =>
    setTasks((t) => [
      ...t,
      { id: uid(), name: "", deadline: "", priority: "Medium" },
    ]);

  const updateTask = (id: string, patch: Partial<TaskInput>) =>
    setTasks((t) => t.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const removeTask = (id: string) =>
    setTasks((t) => t.filter((x) => x.id !== id));

  const generate = () => {
    const filled = tasks.filter((t) => t.name.trim());
    if (filled.length === 0) {
      toast.error("Add at least one task.");
      return;
    }
    const r = planTasks(filled, hours);
    const item: TaskPlanItem = {
      id: uid(),
      createdAt: Date.now(),
      title,
      hoursPerDay: hours,
      tasks: filled,
      ...r,
    };
    setPlan(item);
    addPlan(item);
    toast.success("Schedule generated");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary" className="mb-2">
          <ListChecks className="mr-1 h-3 w-3" /> Task Planner
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">AI Task Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add your tasks — get a prioritized daily and weekly plan.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your tasks</CardTitle>
          <CardDescription>Add, prioritize and set deadlines.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Plan title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Working hours per day</Label>
              <Input
                type="number"
                min={1}
                max={16}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value) || 0)}
              />
            </div>
          </div>

          <div className="space-y-2">
            {tasks.map((t) => (
              <div
                key={t.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] gap-2 rounded-lg border p-3 sm:grid-cols-[1fr_140px_140px_auto]"
              >
                <Input
                  placeholder="Task name"
                  value={t.name}
                  onChange={(e) => updateTask(t.id, { name: e.target.value })}
                  className="min-w-0"
                />
                <Input
                  placeholder="Deadline"
                  value={t.deadline}
                  onChange={(e) => updateTask(t.id, { deadline: e.target.value })}
                  className="hidden sm:block"
                />
                <Select
                  value={t.priority}
                  onValueChange={(v) =>
                    updateTask(t.id, { priority: v as TaskInput["priority"] })
                  }
                >
                  <SelectTrigger className="hidden sm:flex"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {(["High", "Medium", "Low"] as const).map((p) => (
                      <SelectItem key={p} value={p}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeTask(t.id)}
                  className="shrink-0"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={addTask}>
              <Plus className="mr-2 h-4 w-4" /> Add task
            </Button>
            <Button onClick={generate}>
              <Sparkles className="mr-2 h-4 w-4" /> Generate schedule
            </Button>
          </div>
        </CardContent>
      </Card>

      {plan && (
        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Priority tasks</CardTitle>
              <CardDescription>What to focus on first.</CardDescription>
            </CardHeader>
            <CardContent>
              {plan.priorityTasks.length === 0 ? (
                <p className="text-sm text-muted-foreground">No high-priority tasks.</p>
              ) : (
                <ul className="space-y-2">
                  {plan.priorityTasks.map((t) => (
                    <li key={t.id} className="flex items-center justify-between rounded-md border p-2">
                      <span className="truncate text-sm">{t.name}</span>
                      <Badge variant={priorityVariant(t.priority)}>{t.priority}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-primary" /> Daily plan
              </CardTitle>
              <CardDescription>{plan.hoursPerDay}h focused day.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.dailyPlan.map((b, i) => (
                  <li key={i} className="flex gap-3 rounded-md border p-2">
                    <span className="w-28 shrink-0 font-mono text-xs text-muted-foreground">
                      {b.time}
                    </span>
                    <span className="min-w-0 flex-1">{b.task}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Weekly schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {plan.weeklySchedule.map((d) => (
                  <div key={d.day} className="rounded-lg border p-3">
                    <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {d.day}
                    </div>
                    {d.tasks.length === 0 ? (
                      <p className="text-xs text-muted-foreground">—</p>
                    ) : (
                      <ul className="space-y-1 text-sm">
                        {d.tasks.map((t, i) => (
                          <li key={i} className="truncate">{t}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-[color:var(--warning)]" /> Productivity tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {plan.tips.map((t, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}