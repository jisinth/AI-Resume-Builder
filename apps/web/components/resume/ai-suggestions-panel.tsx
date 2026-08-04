'use client';

import { useState } from 'react';
import { Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { ResumeSuggestion } from '@ai-resume-builder/types';
import { Badge, type BadgeTone } from '@/components/shared/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSuggestions } from '@/hooks/use-ai';

const SEVERITY_TONE: Record<ResumeSuggestion['severity'], BadgeTone> = {
  high: 'danger',
  medium: 'warning',
  low: 'neutral',
};

export function AiSuggestionsPanel({ resumeId }: { resumeId: string }) {
  const suggestions = useSuggestions();
  const [results, setResults] = useState<ResumeSuggestion[] | null>(null);

  async function handleGetSuggestions() {
    try {
      const response = await suggestions.mutateAsync({ resumeId });
      setResults(response.suggestions);
    } catch {
      toast.error('Failed to get AI suggestions. Save your resume first.');
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Lightbulb className="h-4 w-4" /> AI Suggestions
        </CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={handleGetSuggestions}
          disabled={suggestions.isPending}
        >
          {suggestions.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Analyze resume
        </Button>
      </CardHeader>
      <CardContent>
        {results === null ? (
          <p className="text-muted-foreground text-sm">
            Save your resume, then analyze it for weak bullets, missing metrics, and other issues.
          </p>
        ) : results.length === 0 ? (
          <p className="text-muted-foreground text-sm">No issues found — nice work!</p>
        ) : (
          <ul className="space-y-3">
            {results.map((suggestion, index) => (
              <li key={index} className="rounded-md border p-3 text-sm">
                <div className="mb-1 flex items-center gap-2">
                  <Badge tone={SEVERITY_TONE[suggestion.severity]}>{suggestion.severity}</Badge>
                  <span className="font-medium">{suggestion.issue}</span>
                </div>
                <p className="text-muted-foreground">{suggestion.suggestion}</p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
