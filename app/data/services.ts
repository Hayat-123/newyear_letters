/**
 * What Zemenay actually sells, as shown in the "what we do" section. Titles,
 * links and substance all track the live site at zemenaytech.com so a partner
 * clicking through lands somewhere that says the same thing.
 *
 * This is the counterpart to `projects.ts`: the projects show what got built,
 * these show what you can hire.
 */
export type Service = {
  id: string;
  title: string;
  blurb: string;
  href: string;
};

const SITE = 'https://zemenaytech.com';

export const SERVICES: Service[] = [
  {
    id: 'recruitment',
    title: 'International Recruitment',
    blurb:
      'We run the full search and hand you a shortlist. You hire the person direct, with no monthly staffing markup in between.',
    href: `${SITE}/recruitment`,
  },
  {
    id: 'eor',
    title: 'Contractor Payments & EOR',
    blurb:
      'We stand as the legal employer in your target country, so you can put someone on payroll without incorporating there.',
    href: `${SITE}/contractor-payments-and-eor`,
  },
  {
    id: 'tech',
    title: 'Tech Outsourcing',
    blurb:
      'Hire by tech stack rather than job title. One team owns it from first conversation to launch day, deployment included.',
    href: `${SITE}/hire-by-tech-stack`,
  },
  {
    id: 'call-center',
    title: 'Call Center',
    blurb:
      'Agents trained on your goals, your audience and your scripts before the first call goes out, working inside your CRM.',
    href: `${SITE}/call-center`,
  },
  {
    id: 'customer-care',
    title: 'Customer Care',
    blurb:
      'Chat, email, phone and social handled together, so a customer gets the same answer whichever door they knock on.',
    href: `${SITE}/customer-care`,
  },
  {
    id: 'va',
    title: 'Virtual Assistance',
    blurb:
      'Assistants who take ownership rather than waiting to be asked, and who already know the tools your business runs on.',
    href: `${SITE}/virtual-assistance`,
  },
];
