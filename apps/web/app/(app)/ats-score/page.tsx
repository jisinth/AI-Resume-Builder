'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { AtsScoreResponse } from '@ai-resume-builder/types';
import { Badge } from '@/components/shared/badge';
import { ScoreRing } from '@/components/shared/score-ring';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useResumes } from '@/hooks/use-resumes';
import { useAtsScore } from '@/hooks/use-ai';
import { ApiError } from '@/lib/api-client';

export default function AtsScorePage() {
  const { data: resumes } = useResumes();
  const [resumeId, setResumeId] = useState<string>('');
  const [jobDescription, setJobDescription] = useState('');
  const [result, setResult] = useState<AtsScoreResponse | null>(null);
  const atsScore = useAtsScore();

  async function handleAnalyze() {
    if (!resumeId) {
      toast.error('Select a resume first');
      return;
    }
    try {
      const response = await atsScore.mutateAsync({ resumeId, jobDescription });
      setResult(response);
    } catch (error) {
      toast.error(error instanceof ApiError ? error.message : 'Failed to analyze resume');
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">ATS Score</h1>
        <p className="text-muted-foreground">
          Compare a resume against a job description and see exactly what to fix.
        </p>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="space-y-2">
            <Label>Resume</Label>
            <Select value={resumeId} onValueChange={setResumeId}>
              <SelectTrigger className="max-w-sm">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {(resumes ?? []).map((resume) => (
                  <SelectItem key={resume.id} value={resume.id}>
                    {resume.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Job description</Label>
            <Textarea
              rows={8}
              placeholder="Paste the full job description here..."
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
            />
          </div>
          <Button onClick={handleAnalyze} disabled={atsScore.isPending}>
            {atsScore.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Analyze
          </Button>
        </CardContent>
      </Card>

      {result ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Score breakdown</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-8">
              <ScoreRing score={result.score.overall} label="Overall" size={120} />
              <ScoreRing score={result.score.formatting} label="Formatting" />
              <ScoreRing score={result.score.keywords} label="Keywords" />
              <ScoreRing score={result.score.experience} label="Experience" />
              <ScoreRing score={result.score.skills} label="Skills" />
            </CardContent>
          </Card>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Matched keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.matchedKeywords.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No keyword matches found.</p>
                ) : (
                  result.matchedKeywords.map((keyword) => (
                    <Badge key={keyword} tone="success">
                      {keyword}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Missing keywords</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {result.missingKeywords.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Nothing missing — great match!</p>
                ) : (
                  result.missingKeywords.map((keyword) => (
                    <Badge key={keyword} tone="danger">
                      {keyword}
                    </Badge>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                {result.suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
