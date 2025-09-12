'use client';

import { useState } from 'react';

import { Checkbox } from '@/components/forms/Checkbox';
import { Input } from '@/components/forms/Input';
import { Select } from '@/components/forms/Select';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      avatar: '',
    },
    notifications: {
      email: true,
      push: false,
      marketing: true,
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: false,
      showPhone: false,
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC',
    },
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences
          </p>
        </div>

        <form className="space-y-8" data-testid="settings-form">
          {/* Profile Settings */}
          <div
            className="bg-card rounded-lg border p-6"
            data-testid="settings-profile"
          >
            <h2 className="mb-4 text-lg font-semibold">Profile Information</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  First Name
                </label>
                <Input
                  value={settings.profile.firstName}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, firstName: e.target.value },
                    }))
                  }
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Last Name
                </label>
                <Input
                  value={settings.profile.lastName}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, lastName: e.target.value },
                    }))
                  }
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  value={settings.profile.email}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      profile: { ...prev.profile, email: e.target.value },
                    }))
                  }
                />
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div
            className="bg-card rounded-lg border p-6"
            data-testid="settings-notifications"
          >
            <h2 className="mb-4 text-lg font-semibold">Notifications</h2>
            <div className="space-y-4">
              <Checkbox
                id="email-notifications"
                label="Email notifications"
                description="Receive notifications via email"
                checked={settings.notifications.email}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      email: e.target.checked,
                    },
                  }))
                }
              />
              <Checkbox
                id="push-notifications"
                label="Push notifications"
                description="Receive push notifications in your browser"
                checked={settings.notifications.push}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      push: e.target.checked,
                    },
                  }))
                }
              />
              <Checkbox
                id="marketing-notifications"
                label="Marketing emails"
                description="Receive promotional emails and updates"
                checked={settings.notifications.marketing}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    notifications: {
                      ...prev.notifications,
                      marketing: e.target.checked,
                    },
                  }))
                }
              />
            </div>
          </div>

          {/* Privacy */}
          <div
            className="bg-card rounded-lg border p-6"
            data-testid="settings-privacy"
          >
            <h2 className="mb-4 text-lg font-semibold">Privacy Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Profile Visibility
                </label>
                <Select
                  value={settings.privacy.profileVisibility}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      privacy: {
                        ...prev.privacy,
                        profileVisibility: e.target.value,
                      },
                    }))
                  }
                  options={[
                    { value: 'public', label: 'Public' },
                    { value: 'private', label: 'Private' },
                    { value: 'friends', label: 'Friends Only' },
                  ]}
                />
              </div>
              <Checkbox
                id="show-email"
                label="Show email publicly"
                checked={settings.privacy.showEmail}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, showEmail: e.target.checked },
                  }))
                }
              />
              <Checkbox
                id="show-phone"
                label="Show phone number publicly"
                checked={settings.privacy.showPhone}
                onChange={e =>
                  setSettings(prev => ({
                    ...prev,
                    privacy: { ...prev.privacy, showPhone: e.target.checked },
                  }))
                }
              />
            </div>
          </div>

          {/* Account */}
          <div
            className="bg-card rounded-lg border p-6"
            data-testid="settings-account"
          >
            <h2 className="mb-4 text-lg font-semibold">Account Settings</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">Theme</label>
                <Select
                  value={settings.preferences.theme}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        theme: e.target.value,
                      },
                    }))
                  }
                  options={[
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                    { value: 'system', label: 'System' },
                  ]}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Language
                </label>
                <Select
                  value={settings.preferences.language}
                  onChange={e =>
                    setSettings(prev => ({
                      ...prev,
                      preferences: {
                        ...prev.preferences,
                        language: e.target.value,
                      },
                    }))
                  }
                  options={[
                    { value: 'en', label: 'English' },
                    { value: 'es', label: 'Spanish' },
                    { value: 'fr', label: 'French' },
                  ]}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" data-testid="save-settings">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}