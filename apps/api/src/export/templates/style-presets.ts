export interface TemplatePreset {
  accentColor: string;
  textColor: string;
  mutedColor: string;
  fontFamily: string;
  layout: 'sidebar' | 'single-column';
  headingCase: 'uppercase' | 'none';
}

export const TEMPLATE_PRESETS: Record<string, TemplatePreset> = {
  modern: {
    accentColor: '#4338CA',
    textColor: '#111827',
    mutedColor: '#4B5563',
    fontFamily: 'Helvetica',
    layout: 'sidebar',
    headingCase: 'uppercase',
  },
  minimal: {
    accentColor: '#111827',
    textColor: '#111827',
    mutedColor: '#6B7280',
    fontFamily: 'Helvetica',
    layout: 'single-column',
    headingCase: 'none',
  },
  corporate: {
    accentColor: '#1E3A8A',
    textColor: '#1F2937',
    mutedColor: '#4B5563',
    fontFamily: 'Times-Roman',
    layout: 'single-column',
    headingCase: 'uppercase',
  },
  'ats-friendly': {
    accentColor: '#000000',
    textColor: '#000000',
    mutedColor: '#333333',
    fontFamily: 'Helvetica',
    layout: 'single-column',
    headingCase: 'uppercase',
  },
};

export function getTemplatePreset(slug: string): TemplatePreset {
  return TEMPLATE_PRESETS[slug] ?? TEMPLATE_PRESETS.modern!;
}
