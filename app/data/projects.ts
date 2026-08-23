/**
 * The work shown in the second section, one card each.
 *
 * TO FILL THIS IN
 *   1. Edit the six entries below, or add and remove entries freely. The grid
 *      reflows for any count.
 *   2. Drop a photo for each at  public/projects/<id>.(jpg|png|webp)  and set
 *      `image` to that path. Landscape works best: the card crops to 16:10 and
 *      the shot is centred, so keep the subject away from the very edges.
 *   3. Anything left without an `image` renders a labelled empty frame naming
 *      the file it is waiting for, so a half-filled deck still looks deliberate
 *      rather than broken.
 *
 * `tag` is the small chip over the photo. `detail` and `points` only appear once
 * the card is opened, so they can carry the substance the blurb has no room for.
 * `href` is optional; leave it off and the card simply does not link anywhere.
 */
export type Project = {
  id: string;
  title: string;
  tag: string;
  blurb: string;
  detail: string;
  points: string[];
  image?: string;
  href?: string;
};

export const PROJECTS: Project[] = [
  {
    id: 'project-one',
    title: 'Project one',
    tag: 'Product',
    blurb: 'One line on what it was and who it was for.',
    detail:
      'Two or three sentences on the problem, what we built, and what changed once it shipped. This only shows when the card is open, so it can afford to be specific.',
    points: ['What we delivered', 'The stack it runs on', 'The outcome worth naming'],
    image: '/projects/project-one.jpg',
  },
  {
    id: 'project-two',
    title: 'Project two',
    tag: 'Platform',
    blurb: 'One line on what it was and who it was for.',
    detail:
      'Two or three sentences on the problem, what we built, and what changed once it shipped.',
    points: ['What we delivered', 'The stack it runs on', 'The outcome worth naming'],
    image: '/projects/project-two.jpg',
  },
  {
    id: 'project-three',
    title: 'Project three',
    tag: 'Web',
    blurb: 'One line on what it was and who it was for.',
    detail:
      'Two or three sentences on the problem, what we built, and what changed once it shipped.',
    points: ['What we delivered', 'The stack it runs on', 'The outcome worth naming'],
    image: '/projects/project-three.jpg',
  },
  {
    id: 'project-four',
    title: 'Project four',
    tag: 'Mobile',
    blurb: 'One line on what it was and who it was for.',
    detail:
      'Two or three sentences on the problem, what we built, and what changed once it shipped.',
    points: ['What we delivered', 'The stack it runs on', 'The outcome worth naming'],
    image: '/projects/project-four.jpg',
  },
  {
    id: 'project-five',
    title: 'Project five',
    tag: 'AI',
    blurb: 'One line on what it was and who it was for.',
    detail:
      'Two or three sentences on the problem, what we built, and what changed once it shipped.',
    points: ['What we delivered', 'The stack it runs on', 'The outcome worth naming'],
    image: '/projects/project-five.jpg',
  },
  {
    id: 'project-six',
    title: 'Project six',
    tag: 'Team',
    blurb: 'One line on what it was and who it was for.',
    detail:
      'Two or three sentences on the problem, what we built, and what changed once it shipped.',
    points: ['What we delivered', 'The stack it runs on', 'The outcome worth naming'],
    image: '/projects/project-six.jpg',
  },
];
