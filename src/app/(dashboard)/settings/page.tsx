'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  Building2,
  Bell,
  Link2,
  Trash2,
  Loader2,
  Save,
  Github,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

interface UserProfile {
  fullName: string;
  email: string;
  avatarUrl: string;
}

interface OrganizationSettings {
  companyName: string;
  companyLogo: string;
}

interface NotificationSettings {
  emailBuilds: boolean;
  emailUpdates: boolean;
  emailMarketing: boolean;
}

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    email: '',
    avatarUrl: '',
  });

  const [organization, setOrganization] = useState<OrganizationSettings>({
    companyName: '',
    companyLogo: '',
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailBuilds: true,
    emailUpdates: true,
    emailMarketing: false,
  });

  const [connectedAccounts, setConnectedAccounts] = useState({
    github: false,
  });

  useEffect(() => {
    async function loadUserData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        setProfile({
          fullName: user.user_metadata?.full_name || '',
          email: user.email || '',
          avatarUrl: user.user_metadata?.avatar_url || '',
        });

        // Load saved settings from user metadata
        const savedOrg = user.user_metadata?.organization || {};
        setOrganization({
          companyName: savedOrg.companyName || '',
          companyLogo: savedOrg.companyLogo || '',
        });

        const savedNotifications = user.user_metadata?.notifications || {};
        setNotifications({
          emailBuilds: savedNotifications.emailBuilds ?? true,
          emailUpdates: savedNotifications.emailUpdates ?? true,
          emailMarketing: savedNotifications.emailMarketing ?? false,
        });

        // Check connected accounts
        const providers = user.app_metadata?.providers || [];
        setConnectedAccounts({
          github: providers.includes('github'),
        });
      }

      setIsLoading(false);
    }

    loadUserData();
  }, []);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: profile.fullName,
          avatar_url: profile.avatarUrl,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveOrganization = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          organization: {
            companyName: organization.companyName,
            companyLogo: organization.companyLogo,
          },
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving organization:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          notifications: notifications,
        },
      });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving notifications:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConnectGitHub = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/settings`,
        scopes: 'repo',
      },
    });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') return;

    try {
      const supabase = createClient();

      // Sign out and redirect to home
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Profile</CardTitle>
          </div>
          <CardDescription>
            Your personal information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <div>
              <Button variant="outline" size="sm">
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground mt-1">
                JPG, PNG up to 1MB
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={profile.fullName}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, fullName: e.target.value }))
                }
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Contact support to change email
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveProfile} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Organization Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Organization</CardTitle>
          </div>
          <CardDescription>
            Your company or business information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={organization.companyName}
              onChange={(e) =>
                setOrganization((prev) => ({ ...prev, companyName: e.target.value }))
              }
              placeholder="Your company name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyLogo">Company Logo URL</Label>
            <Input
              id="companyLogo"
              value={organization.companyLogo}
              onChange={(e) =>
                setOrganization((prev) => ({ ...prev, companyLogo: e.target.value }))
              }
              placeholder="https://example.com/logo.png"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveOrganization} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </CardFooter>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Notifications</CardTitle>
          </div>
          <CardDescription>
            Manage your email notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Build Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Receive emails when your builds complete or fail
              </p>
            </div>
            <Switch
              checked={notifications.emailBuilds}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, emailBuilds: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Product Updates</Label>
              <p className="text-sm text-muted-foreground">
                News about new features and improvements
              </p>
            </div>
            <Switch
              checked={notifications.emailUpdates}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, emailUpdates: checked }))
              }
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Marketing Emails</Label>
              <p className="text-sm text-muted-foreground">
                Tips, tutorials, and promotional content
              </p>
            </div>
            <Switch
              checked={notifications.emailMarketing}
              onCheckedChange={(checked) =>
                setNotifications((prev) => ({ ...prev, emailMarketing: checked }))
              }
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSaveNotifications} disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Preferences
          </Button>
        </CardFooter>
      </Card>

      {/* Connected Accounts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Connected Accounts</CardTitle>
          </div>
          <CardDescription>
            Connect external services to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                <Github className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="font-medium">GitHub</p>
                <p className="text-sm text-muted-foreground">
                  {connectedAccounts.github
                    ? 'Connected - Import repos and deploy'
                    : 'Connect to import repositories'}
                </p>
              </div>
            </div>
            {connectedAccounts.github ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                <span className="text-sm font-medium">Connected</span>
              </div>
            ) : (
              <Button variant="outline" onClick={handleConnectGitHub}>
                Connect
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 dark:border-red-900">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-500">Danger Zone</CardTitle>
          </div>
          <CardDescription>
            Irreversible actions for your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20">
              <div>
                <p className="font-medium text-red-600 dark:text-red-400">
                  Delete Account
                </p>
                <p className="text-sm text-red-500/80">
                  Permanently delete your account and all projects
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>
          ) : (
            <div className="p-4 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 space-y-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Are you absolutely sure?
                  </p>
                  <p className="text-sm text-red-500/80 mt-1">
                    This action cannot be undone. This will permanently delete your
                    account and remove all your projects from our servers.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deleteConfirm" className="text-red-600">
                  Type DELETE to confirm
                </Label>
                <Input
                  id="deleteConfirm"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="max-w-xs"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmText !== 'DELETE'}
                >
                  Yes, Delete My Account
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDeleteConfirm(false);
                    setDeleteConfirmText('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
