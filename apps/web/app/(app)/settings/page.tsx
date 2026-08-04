'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AiProviderId } from '@ai-resume-builder/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/shared/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuthStore } from '@/lib/auth-store';
import { useAiSettings, useUpdateAiSettings } from '@/hooks/use-user';
import { ApiError } from '@/lib/api-client';

const PROVIDER_LABELS: Record<AiProviderId, string> = {
  [AiProviderId.MOCK]: 'Built-in (no key required)',
  [AiProviderId.OPENAI]: 'OpenAI',
  [AiProviderId.ANTHROPIC]: 'Anthropic',
  [AiProviderId.GEMINI]: 'Google Gemini',
  [AiProviderId.DEEPSEEK]: 'DeepSeek',
};

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const { data: aiSettings } = useAiSettings();
  const updateAiSettings = useUpdateAiSettings();

  const [provider, setProvider] = useState<AiProviderId>(AiProviderId.MOCK);
  const [keys, setKeys] = useState({
    openaiApiKey: '',
    anthropicApiKey: '',
    geminiApiKey: '',
    deepseekApiKey: '',
  });

  const effectiveProvider = aiSettings?.preferredProvider ?? provider;

  async function handleSaveAiSettings() {
    try {
      await updateAiSettings.mutateAsync({
        preferredProvider: provider,
        ...Object.fromEntries(Object.entries(keys).filter(([, value]) => value.trim().length > 0)),
      });
      setKeys({ openaiApiKey: '', anthropicApiKey: '', geminiApiKey: '', deepseekApiKey: '' });
      toast.success('AI settings saved');
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to save settings');
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and AI provider preferences.</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="ai">AI Provider</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Your basic account information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input defaultValue={user?.name} disabled />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input defaultValue={user?.email} disabled />
              </div>
              <p className="text-muted-foreground text-xs">
                Profile editing is coming soon — tracked in ROADMAP.md.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>AI Provider</CardTitle>
              <CardDescription>
                Use the free built-in engine, or bring your own API key for a real LLM provider.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preferred provider</Label>
                <Select
                  value={effectiveProvider}
                  onValueChange={(value) => setProvider(value as AiProviderId)}
                >
                  <SelectTrigger className="max-w-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(AiProviderId).map((id) => (
                      <SelectItem key={id} value={id}>
                        {PROVIDER_LABELS[id]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <ApiKeyField
                label="OpenAI API key"
                configured={aiSettings?.hasOpenaiKey}
                value={keys.openaiApiKey}
                onChange={(value) => setKeys((prev) => ({ ...prev, openaiApiKey: value }))}
              />
              <ApiKeyField
                label="Anthropic API key"
                configured={aiSettings?.hasAnthropicKey}
                value={keys.anthropicApiKey}
                onChange={(value) => setKeys((prev) => ({ ...prev, anthropicApiKey: value }))}
              />
              <ApiKeyField
                label="Gemini API key"
                configured={aiSettings?.hasGeminiKey}
                value={keys.geminiApiKey}
                onChange={(value) => setKeys((prev) => ({ ...prev, geminiApiKey: value }))}
              />
              <ApiKeyField
                label="DeepSeek API key"
                configured={aiSettings?.hasDeepseekKey}
                value={keys.deepseekApiKey}
                onChange={(value) => setKeys((prev) => ({ ...prev, deepseekApiKey: value }))}
              />

              <Button onClick={handleSaveAiSettings} disabled={updateAiSettings.isPending}>
                Save AI settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApiKeyField({
  label,
  configured,
  value,
  onChange,
}: {
  label: string;
  configured?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label>{label}</Label>
        {configured ? <Badge tone="success">Configured</Badge> : null}
      </div>
      <Input
        type="password"
        placeholder={configured ? 'Enter a new key to replace the current one' : 'sk-...'}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
