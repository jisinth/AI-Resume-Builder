import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    slug: 'modern' as const,
    name: 'Modern',
    description: 'Clean two-tone layout with a sidebar for skills and contact details.',
    isPremium: false,
  },
  {
    slug: 'minimal' as const,
    name: 'Minimal',
    description: 'Distraction-free, whitespace-forward layout that keeps focus on content.',
    isPremium: false,
  },
  {
    slug: 'corporate' as const,
    name: 'Corporate',
    description: 'Traditional single-column layout favored by finance and consulting roles.',
    isPremium: false,
  },
  {
    slug: 'ats_friendly' as const,
    name: 'ATS Friendly',
    description: 'Pure single-column, no tables or graphics — maximizes ATS parser compatibility.',
    isPremium: false,
  },
];

async function main() {
  for (const template of templates) {
    await prisma.template.upsert({
      where: { slug: template.slug },
      create: template,
      update: template,
    });
  }
  console.log(`Seeded ${templates.length} templates.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
