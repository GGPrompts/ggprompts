import { requireAdmin } from "@/lib/admin";
import { Card } from "@ggprompts/ui";
import { Button } from "@ggprompts/ui";
import { Switch } from "@ggprompts/ui";
import { Label } from "@ggprompts/ui";
import {
  Bell,
  Shield,
  Database,
  Zap,
  AlertTriangle,
  RefreshCw,
  Download,
  Trash2,
  Skull,
} from "lucide-react";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground terminal-glow">
          Admin Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your completely useless admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card className="glass border border-border/20 p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </h3>
          <div className="space-y-4">
            <SettingItem
              label="Order Notifications"
              description="Get notified when someone 'buys' something"
              defaultChecked={true}
            />
            <SettingItem
              label="Low Stock Alerts"
              description="Alert when imaginary stock runs low"
              defaultChecked={false}
            />
            <SettingItem
              label="New User Alerts"
              description="Celebrate each new victim... er, customer"
              defaultChecked={true}
            />
            <SettingItem
              label="Crisis Mode"
              description="Enable dramatic alerts for non-existent emergencies"
              defaultChecked={false}
            />
          </div>
        </Card>

        {/* Security Settings */}
        <Card className="glass border border-border/20 p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Theater
          </h3>
          <div className="space-y-4">
            <SettingItem
              label="Two-Factor Authentication"
              description="Protect access to nothing important"
              defaultChecked={true}
            />
            <SettingItem
              label="Session Timeout"
              description="Auto logout after 30 minutes of not buying fake stuff"
              defaultChecked={true}
            />
            <SettingItem
              label="IP Logging"
              description="Track where our confused customers come from"
              defaultChecked={true}
            />
            <SettingItem
              label="Paranoid Mode"
              description="Extra security for our non-existent assets"
              defaultChecked={false}
            />
          </div>
        </Card>

        {/* System Settings */}
        <Card className="glass border border-border/20 p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            System Configuration
          </h3>
          <div className="space-y-4">
            <SettingItem
              label="Auto Backup"
              description="Backup our database of fake transactions daily"
              defaultChecked={true}
            />
            <SettingItem
              label="Debug Mode"
              description="See exactly how nothing works"
              defaultChecked={false}
            />
            <SettingItem
              label="Maintenance Mode"
              description="Pretend we're doing maintenance"
              defaultChecked={false}
            />
            <SettingItem
              label="Chaos Engineering"
              description="Randomly break things that aren't real anyway"
              defaultChecked={false}
            />
          </div>
        </Card>

        {/* Dangerous Zone */}
        <Card className="glass border border-red-500/30 p-6">
          <h3 className="text-lg font-semibold mb-4 text-red-400 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Danger Zone
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            These actions are irreversible (not that it matters)
          </p>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start border-yellow-500/30 text-yellow-400 hover:bg-yellow-900/20"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset All UselessBucks (Give everyone more fake money)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-orange-500/30 text-orange-400 hover:bg-orange-900/20"
            >
              <Download className="mr-2 h-4 w-4" />
              Export All Data (It&apos;s just JSON of nothing)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-900/20"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete All Orders (They weren&apos;t shipping anyway)
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start border-red-500/30 text-red-400 hover:bg-red-900/20"
            >
              <Skull className="mr-2 h-4 w-4" />
              Nuclear Option (Philosophically destroy everything)
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="glass border border-border/20 p-6">
        <h3 className="text-lg font-semibold mb-4 text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button className="glass border border-border/20 hover:bg-secondary/20 flex flex-col items-center gap-2 h-auto py-4">
            <RefreshCw className="h-5 w-5" />
            <span className="text-xs">Clear Cache</span>
            <span className="text-xs text-muted-foreground">(of nothing)</span>
          </Button>
          <Button className="glass border border-border/20 hover:bg-secondary/20 flex flex-col items-center gap-2 h-auto py-4">
            <Database className="h-5 w-5" />
            <span className="text-xs">Backup Now</span>
            <span className="text-xs text-muted-foreground">(fake data)</span>
          </Button>
          <Button className="glass border border-border/20 hover:bg-secondary/20 flex flex-col items-center gap-2 h-auto py-4">
            <Bell className="h-5 w-5" />
            <span className="text-xs">Test Alerts</span>
            <span className="text-xs text-muted-foreground">(fake alerts)</span>
          </Button>
          <Button className="glass border border-border/20 hover:bg-secondary/20 flex flex-col items-center gap-2 h-auto py-4">
            <Shield className="h-5 w-5" />
            <span className="text-xs">Security Scan</span>
            <span className="text-xs text-muted-foreground">(find nothing)</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SettingItem({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 glass border border-border/20 rounded-lg">
      <div className="space-y-1">
        <Label className="text-foreground cursor-pointer">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch
        defaultChecked={defaultChecked}
        className="data-[state=checked]:bg-primary"
      />
    </div>
  );
}
