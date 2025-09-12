import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';

import { Label } from './label';
import { Switch } from './switch';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A toggle switch component for boolean settings and preferences.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The checked state of the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    onCheckedChange: {
      description: 'Callback fired when the checked state changes',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Basic switch
 */
export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="default-switch" />
      <Label htmlFor="default-switch">Enable notifications</Label>
    </div>
  ),
};

/**
 * Different switch states
 */
export const States: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="unchecked" checked={false} />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="checked" checked={true} />
        <Label htmlFor="checked">Checked</Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="disabled-unchecked" disabled checked={false} />
        <Label htmlFor="disabled-unchecked" className="text-muted-foreground">
          Disabled (unchecked)
        </Label>
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch id="disabled-checked" disabled checked={true} />
        <Label htmlFor="disabled-checked" className="text-muted-foreground">
          Disabled (checked)
        </Label>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Different states of the switch component.',
      },
    },
  },
};

/**
 * Interactive switch
 */
export const Interactive: Story = {
  render: () => {
    const [isEnabled, setIsEnabled] = useState(false);
    
    return (
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch 
            id="interactive-switch" 
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
          />
          <Label htmlFor="interactive-switch">
            {isEnabled ? 'Notifications enabled' : 'Notifications disabled'}
          </Label>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Current state: {isEnabled ? 'ON' : 'OFF'}
        </p>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive switch with dynamic label and state display.',
      },
    },
  },
};

/**
 * Settings panel
 */
export const SettingsPanel: Story = {
  render: () => {
    const [settings, setSettings] = useState({
      notifications: true,
      emailUpdates: false,
      darkMode: true,
      analytics: false,
      autoSave: true,
    });
    
    const updateSetting = (key: keyof typeof settings) => {
      setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };
    
    return (
      <div className="w-[400px] space-y-6">
        <h3 className="text-lg font-semibold">Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="notifications" className="text-base">
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Receive push notifications for important updates
              </p>
            </div>
            <Switch 
              id="notifications"
              checked={settings.notifications}
              onCheckedChange={() => updateSetting('notifications')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email" className="text-base">
                Email Updates
              </Label>
              <p className="text-sm text-muted-foreground">
                Get weekly email summaries
              </p>
            </div>
            <Switch 
              id="email"
              checked={settings.emailUpdates}
              onCheckedChange={() => updateSetting('emailUpdates')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="dark-mode" className="text-base">
                Dark Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Use dark theme for better viewing in low light
              </p>
            </div>
            <Switch 
              id="dark-mode"
              checked={settings.darkMode}
              onCheckedChange={() => updateSetting('darkMode')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="analytics" className="text-base">
                Analytics
              </Label>
              <p className="text-sm text-muted-foreground">
                Help improve our service by sharing usage data
              </p>
            </div>
            <Switch 
              id="analytics"
              checked={settings.analytics}
              onCheckedChange={() => updateSetting('analytics')}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save" className="text-base">
                Auto-save
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically save your work every few minutes
              </p>
            </div>
            <Switch 
              id="auto-save"
              checked={settings.autoSave}
              onCheckedChange={() => updateSetting('autoSave')}
            />
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Settings panel with multiple switches for different preferences.',
      },
    },
  },
};

/**
 * Form integration
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      subscribe: false,
      terms: false,
      marketing: false,
    });
    
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const newErrors: Record<string, string> = {};
      
      if (!formData.terms) {
        newErrors.terms = 'You must accept the terms and conditions';
      }
      
      setErrors(newErrors);
      
      if (Object.keys(newErrors).length === 0) {
        console.log('Form submitted:', formData);
      }
    };
    
    return (
      <form onSubmit={handleSubmit} className="w-[400px] space-y-6">
        <h3 className="text-lg font-semibold">Sign Up</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              id="subscribe"
              checked={formData.subscribe}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, subscribe: checked }))
              }
            />
            <Label htmlFor="subscribe">
              Subscribe to newsletter
            </Label>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch 
                id="terms"
                checked={formData.terms}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, terms: checked }))
                }
              />
              <Label htmlFor="terms">
                I accept the terms and conditions *
              </Label>
            </div>
            {errors.terms && (
              <p className="text-sm text-red-600">{errors.terms}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch 
              id="marketing"
              checked={formData.marketing}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, marketing: checked }))
              }
            />
            <Label htmlFor="marketing">
              Send me marketing emails (optional)
            </Label>
          </div>
        </div>
        
        <button 
          type="submit"
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
        >
          Sign Up
        </button>
      </form>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Switches used in form validation scenarios with error handling.',
      },
    },
  },
};

/**
 * Compact layout
 */
export const Compact: Story = {
  render: () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="wifi" className="text-sm">Wi-Fi</Label>
        <Switch id="wifi" checked={true} />
      </div>
      
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="bluetooth" className="text-sm">Bluetooth</Label>
        <Switch id="bluetooth" checked={false} />
      </div>
      
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="location" className="text-sm">Location Services</Label>
        <Switch id="location" checked={true} />
      </div>
      
      <div className="flex items-center justify-between py-2">
        <Label htmlFor="airplane" className="text-sm">Airplane Mode</Label>
        <Switch id="airplane" checked={false} />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Compact switch layout similar to mobile settings.',
      },
    },
  },
};

/**
 * Feature toggles
 */
export const FeatureToggles: Story = {
  render: () => {
    const [features, setFeatures] = useState({
      betaFeatures: false,
      experimentalUI: true,
      advancedMode: false,
      debugMode: false,
    });
    
    const toggleFeature = (feature: keyof typeof features) => {
      setFeatures(prev => ({ ...prev, [feature]: !prev[feature] }));
    };
    
    return (
      <div className="w-[400px] space-y-4">
        <h3 className="text-lg font-semibold">Developer Settings</h3>
        
        <div className="space-y-3">
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="beta" className="font-medium">
                Beta Features
              </Label>
              <Switch 
                id="beta"
                checked={features.betaFeatures}
                onCheckedChange={() => toggleFeature('betaFeatures')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enable access to experimental features that are still in development
            </p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="experimental" className="font-medium">
                Experimental UI
              </Label>
              <Switch 
                id="experimental"
                checked={features.experimentalUI}
                onCheckedChange={() => toggleFeature('experimentalUI')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Try out new interface designs before they're released
            </p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="advanced" className="font-medium">
                Advanced Mode
              </Label>
              <Switch 
                id="advanced"
                checked={features.advancedMode}
                onCheckedChange={() => toggleFeature('advancedMode')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Show advanced options and detailed technical information
            </p>
          </div>
          
          <div className="p-3 border rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="debug" className="font-medium">
                Debug Mode
              </Label>
              <Switch 
                id="debug"
                checked={features.debugMode}
                onCheckedChange={() => toggleFeature('debugMode')}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Enable debugging tools and verbose logging (affects performance)
            </p>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Feature toggle switches for development and experimental settings.',
      },
    },
  },
};