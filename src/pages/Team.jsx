import { Users, Zap, Heart, Sparkles } from 'lucide-react'
import { assets } from '../data/images'

const coreValues = [
  {
    icon: Users,
    title: 'Connection Over Competition',
    description:
      'The win happens when people stay after the whistle or when a youth athlete finds a mentor.',
  },
  {
    icon: Zap,
    title: 'Professional-Grade Execution',
    description:
      'We leverage our day-job expertise to deliver a product that is exciting and impactful.',
  },
  {
    icon: Heart,
    title: 'Community Stewardship',
    description:
      "We invest in Brooklyn's spaces and leave a lasting positive impact on the next generation.",
  },
  {
    icon: Sparkles,
    title: 'Radical Authenticity',
    description:
      'Brooklyn-based and player-focused. We stay grounded in local culture and real relationships.',
  },
]

const team = [
  { name: 'Alex', role: 'Product' },
  { name: 'Jason', role: 'Technology' },
  { name: 'Jarrett', role: 'Operations' },
  { name: 'Keith', role: 'Fitness & Nutrition' },
  { name: 'Wanemi', role: 'Legal & Compliance' },
  { name: 'Will', role: 'Media & Branding' },
  { name: 'Kianna', role: 'Creative Strategy & Content' },
  { name: 'Georgia', role: 'Culture & Impact' },
  { name: 'Lonnie', role: 'Finance' },
]

export default function Team() {
  return (
    <div>
      <section className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-6">
        <div className="mx-auto w-full max-w-2xl shrink-0 lg:mx-0 lg:flex lg:min-h-0">
          <div className="relative w-full overflow-hidden rounded-ui border border-border shadow-lg lg:h-full lg:min-h-0">
            <img
              src={assets.foundersHero}
              alt=""
              className="founders-hero-image block w-full object-contain object-top lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-contain lg:object-top"
              style={{ objectPosition: 'center top' }}
            />
            <div className="founders-hero-overlay absolute inset-0" aria-hidden />
            <p className="absolute bottom-0 left-0 right-0 z-10 bg-accent/85 px-4 py-3 text-center text-sm italic leading-snug text-white">
              The vision began on the fields of Brooklyn. From players to founders, we&apos;re building the league we always wanted.
            </p>
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="kicker">Our mission</p>
          <h2 className="heading-display mt-3 text-xl sm:text-2xl">
            Rebuild the social fabric
          </h2>
          <p className="mt-2 text-base leading-snug text-muted lg:text-lg">
            To rebuild the social fabric of our city through the power of sports. We provide high-quality youth development and adult social sports that prioritize genuine human connection over the transactional nature of corporate leagues. We aren&apos;t just a sports provider; we are a community architect.
          </p>
          <h3 className="heading-display mt-6 text-lg">
            Core Values
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {coreValues.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-ui border border-border bg-white p-3 transition-all duration-200 ease-in-out hover:border-forest/30"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-ui bg-forest text-white">
                  <Icon size={14} />
                </div>
                <h4 className="heading-display mt-2 text-sm leading-snug">
                  {title}
                </h4>
                <p className="mt-1 text-xs leading-snug text-muted">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-12 sm:mt-16">
        <p className="kicker justify-center">The team</p>
        <h2 className="heading-display mt-3 text-center text-3xl sm:text-4xl">
          The Super Team
        </h2>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 justify-items-center gap-8 md:grid-cols-3 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.name}
              className="w-full max-w-xs overflow-hidden rounded-ui border border-border bg-white transition-all duration-200 ease-in-out hover:border-forest/40 hover:shadow-sm"
            >
              <div className="aspect-square w-full shrink-0 bg-border">
                <div className="flex h-full w-full items-center justify-center font-util text-xs font-bold text-muted">
                  Headshot
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="heading-display text-lg">
                  {member.name}
                </h3>
                <p className="mt-0.5 font-util text-sm font-bold text-forest">
                  {member.role}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
