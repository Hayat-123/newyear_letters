import { AdeyFall } from './components/AdeyFall';
import { Closing } from './components/Closing';
import { Hero } from './components/Hero';
import { Projects } from './components/Projects';
import { Presenter } from './components/Presenter';
import { Services } from './components/Services';

export default function Page() {
  return (
    <main className="relative">
      <AdeyFall />
      <Hero />
      <Services />
      <Projects />
      <Presenter />
      <Closing />
    </main>
  );
}
