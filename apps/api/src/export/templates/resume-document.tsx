import { Document, Link, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import type { Resume } from '@ai-resume-builder/types';
import { formatDateRange } from '@ai-resume-builder/utils';
import { getTemplatePreset } from './style-presets';

interface ResumeDocumentProps {
  resume: Resume;
}

export function ResumeDocument({ resume }: ResumeDocumentProps) {
  const preset = getTemplatePreset(resume.templateSlug);
  const styles = createStyles(preset);

  const sidebarInfo = (
    <View>
      <Text style={styles.name}>{resume.personalInfo.fullName}</Text>
      {resume.personalInfo.headline ? (
        <Text style={styles.headline}>{resume.personalInfo.headline}</Text>
      ) : null}
      <View style={styles.contactBlock}>
        <Text style={styles.contactLine}>{resume.personalInfo.email}</Text>
        {resume.personalInfo.phone ? (
          <Text style={styles.contactLine}>{resume.personalInfo.phone}</Text>
        ) : null}
        {resume.personalInfo.location ? (
          <Text style={styles.contactLine}>{resume.personalInfo.location}</Text>
        ) : null}
        {resume.personalInfo.website ? (
          <Link src={resume.personalInfo.website} style={styles.contactLine}>
            {resume.personalInfo.website}
          </Link>
        ) : null}
        {resume.personalInfo.linkedin ? (
          <Link src={resume.personalInfo.linkedin} style={styles.contactLine}>
            {resume.personalInfo.linkedin}
          </Link>
        ) : null}
        {resume.personalInfo.github ? (
          <Link src={resume.personalInfo.github} style={styles.contactLine}>
            {resume.personalInfo.github}
          </Link>
        ) : null}
      </View>
    </View>
  );

  const skillsBlock =
    resume.skills.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.heading}>Skills</Text>
        <Text style={styles.skillsText}>
          {resume.skills.map((skill) => skill.name).join('  •  ')}
        </Text>
      </View>
    ) : null;

  const educationBlock =
    resume.education.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.heading}>Education</Text>
        {resume.education.map((item) => (
          <View key={item.id} style={styles.entry}>
            <Text style={styles.entryTitle}>{item.degree}</Text>
            <Text style={styles.entrySubtitle}>
              {item.institution}
              {item.fieldOfStudy ? ` — ${item.fieldOfStudy}` : ''}
            </Text>
            <Text style={styles.entryMeta}>
              {formatDateRange(item.startDate, item.endDate, false)}
            </Text>
          </View>
        ))}
      </View>
    ) : null;

  const certificatesBlock =
    resume.certificates.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.heading}>Certificates</Text>
        {resume.certificates.map((item) => (
          <Text key={item.id} style={styles.entrySubtitle}>
            {item.name} — {item.issuer}
          </Text>
        ))}
      </View>
    ) : null;

  const summaryBlock = resume.personalInfo.summary ? (
    <View style={styles.section}>
      <Text style={styles.heading}>Summary</Text>
      <Text style={styles.bodyText}>{resume.personalInfo.summary}</Text>
    </View>
  ) : null;

  const experienceBlock =
    resume.experience.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.heading}>Experience</Text>
        {resume.experience.map((item) => (
          <View key={item.id} style={styles.entry}>
            <View style={styles.entryHeaderRow}>
              <Text style={styles.entryTitle}>
                {item.title} · {item.company}
              </Text>
              <Text style={styles.entryMeta}>
                {formatDateRange(item.startDate, item.endDate, item.isCurrent)}
              </Text>
            </View>
            {item.bullets.map((bullet, index) => (
              <Text key={index} style={styles.bullet}>
                • {bullet}
              </Text>
            ))}
          </View>
        ))}
      </View>
    ) : null;

  const projectsBlock =
    resume.projects.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.heading}>Projects</Text>
        {resume.projects.map((item) => (
          <View key={item.id} style={styles.entry}>
            <Text style={styles.entryTitle}>{item.name}</Text>
            {item.technologies.length > 0 ? (
              <Text style={styles.entryMeta}>{item.technologies.join(', ')}</Text>
            ) : null}
            {item.bullets.map((bullet, index) => (
              <Text key={index} style={styles.bullet}>
                • {bullet}
              </Text>
            ))}
          </View>
        ))}
      </View>
    ) : null;

  const achievementsBlock =
    resume.achievements.length > 0 ? (
      <View style={styles.section}>
        <Text style={styles.heading}>Achievements</Text>
        {resume.achievements.map((item) => (
          <Text key={item.id} style={styles.bullet}>
            • {item.title}
            {item.description ? ` — ${item.description}` : ''}
          </Text>
        ))}
      </View>
    ) : null;

  if (preset.layout === 'sidebar') {
    return (
      <Document title={`${resume.personalInfo.fullName} — ${resume.title}`}>
        <Page size="A4" style={styles.page}>
          <View style={styles.sidebarColumn}>
            {sidebarInfo}
            {skillsBlock}
            {educationBlock}
            {certificatesBlock}
          </View>
          <View style={styles.mainColumn}>
            {summaryBlock}
            {experienceBlock}
            {projectsBlock}
            {achievementsBlock}
          </View>
        </Page>
      </Document>
    );
  }

  return (
    <Document title={`${resume.personalInfo.fullName} — ${resume.title}`}>
      <Page size="A4" style={styles.page}>
        <View style={styles.singleColumn}>
          {sidebarInfo}
          {summaryBlock}
          {experienceBlock}
          {educationBlock}
          {projectsBlock}
          {skillsBlock}
          {achievementsBlock}
          {certificatesBlock}
        </View>
      </Page>
    </Document>
  );
}

function createStyles(preset: ReturnType<typeof getTemplatePreset>) {
  const headingTransform = preset.headingCase === 'uppercase' ? ('uppercase' as const) : undefined;

  return StyleSheet.create({
    page: {
      flexDirection: preset.layout === 'sidebar' ? 'row' : 'column',
      fontFamily: preset.fontFamily,
      fontSize: 10,
      color: preset.textColor,
      padding: preset.layout === 'sidebar' ? 0 : 32,
    },
    sidebarColumn: {
      width: '32%',
      backgroundColor: '#F3F4F6',
      padding: 20,
    },
    mainColumn: {
      width: '68%',
      padding: 24,
    },
    singleColumn: {
      width: '100%',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 2,
      color: preset.accentColor,
    },
    headline: {
      fontSize: 11,
      color: preset.mutedColor,
      marginBottom: 8,
    },
    contactBlock: {
      marginTop: 8,
    },
    contactLine: {
      fontSize: 9,
      color: preset.mutedColor,
      marginBottom: 3,
    },
    section: {
      marginBottom: 12,
    },
    heading: {
      fontSize: 11,
      fontWeight: 'bold',
      color: preset.accentColor,
      marginBottom: 6,
      textTransform: headingTransform,
      borderBottomWidth: 1,
      borderBottomColor: preset.accentColor,
      borderBottomStyle: 'solid',
      paddingBottom: 2,
    },
    bodyText: {
      fontSize: 10,
      lineHeight: 1.4,
      color: preset.textColor,
    },
    entry: {
      marginBottom: 8,
    },
    entryHeaderRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    entryTitle: {
      fontSize: 10.5,
      fontWeight: 'bold',
    },
    entrySubtitle: {
      fontSize: 9.5,
      color: preset.mutedColor,
      marginBottom: 2,
    },
    entryMeta: {
      fontSize: 9,
      color: preset.mutedColor,
    },
    bullet: {
      fontSize: 9.5,
      lineHeight: 1.4,
      marginBottom: 2,
    },
    skillsText: {
      fontSize: 9.5,
      lineHeight: 1.5,
    },
  });
}
