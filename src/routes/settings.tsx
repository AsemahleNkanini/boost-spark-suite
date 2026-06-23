import { createFileRoute } from "@tanstack/react-router";
import { Settings as SettingsIcon, Moon, Bell, Brain } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore, type Settings } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Smart Productivity Hub" },
      { name: "description", content: "Manage preferences and AI behavior." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { settings, updateSettings } = useStore();

  const set = (patch: Partial<Settings>, msg: string) => {
    updateSettings(patch);
    toast.success(msg);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <Badge variant="secondary" className="mb-2">
          <SettingsIcon className="mr-1 h-3 w-3" /> Settings
        </Badge>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Preferences</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Customize your workspace and AI behavior.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Light or dark mode.</CardDescription>
        </CardHeader>
        <CardContent>
          <Row
            icon={<Moon className="h-4 w-4" />}
            title="Dark mode"
            desc="Use a darker color palette."
          >
            <Switch
              checked={settings.darkMode}
              onCheckedChange={(v) =>
                set({ darkMode: v }, v ? "Dark mode on" : "Light mode on")
              }
            />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <Row
            icon={<Bell className="h-4 w-4" />}
            title="In-app notifications"
            desc="Show toasts when AI tasks complete."
          >
            <Switch
              checked={settings.notifications}
              onCheckedChange={(v) =>
                set({ notifications: v }, "Preferences saved")
              }
            />
          </Row>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI behavior</CardTitle>
          <CardDescription>How the model should respond.</CardDescription>
        </CardHeader>
        <CardContent>
          <Row
            icon={<Brain className="h-4 w-4" />}
            title="AI preference"
            desc="Tune outputs toward your style."
          >
            <div className="w-40">
              <Select
                value={settings.aiPreference}
                onValueChange={(v) =>
                  set(
                    { aiPreference: v as Settings["aiPreference"] },
                    "AI preference updated",
                  )
                }
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(["Balanced", "Creative", "Precise"] as const).map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </Row>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({
  icon,
  title,
  desc,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-muted">
          {icon}
        </div>
        <div className="min-w-0">
          <Label className="text-sm font-medium">{title}</Label>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}