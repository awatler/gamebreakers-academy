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

/**
 * The Super-Team: 9 members, each with individual card. Will & Kianna split into distinct roles.
 */
const team = [
  { name: 'Alex', role: 'Product' },
  { name: 'Jason', role: 'Technology' },
  { name: 'Jarrett', role: 'Operations' },
  { name: 'Samora', role: 'Operations' },
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
      {/* Above-the-fold: flex items-stretch so image bottom aligns with Core Values bottom */}
      <section className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:gap-6">
        {/* Left: stretches to match right column; image fills with object-cover object-top (crop from bottom) */}
        <div className="mx-auto w-full max-w-2xl shrink-0 lg:mx-0 lg:flex lg:min-h-0">
          <div className="relative w-full overflow-hidden rounded-lg border border-stone-200 shadow-xl lg:h-full lg:min-h-0">
            <img
              src={assets.foundersHero}
              alt=""
              className="block w-full object-contain object-top founders-hero-image lg:absolute lg:inset-0 lg:h-full lg:w-full lg:object-contain lg:object-top"
              style={{ objectPosition: 'center top' }}
            />
            <div className="founders-hero-overlay absolute inset-0" aria-hidden />
            <p className="absolute bottom-0 left-0 right-0 z-10 bg-[#1B2F1F]/80 px-4 py-3 text-center font-serif text-sm italic leading-snug text-[#FDFCF8]">
              The vision began on the fields of Brooklyn. From players to founders, we&apos;re building the league we always wanted.
            </p>
          </div>
        </div>

        {/* Right: Mission + Core Values — height defines the row */}
        <div className="min-w-0 flex-1">
          <h2 className="font-display text-xl font-bold text-[#1B2F1F]">
            Our Mission
          </h2>
          <p className="mt-2 font-serif text-base font-normal italic leading-snug text-[#1B2F1F] lg:text-lg">
            To rebuild the social fabric of our city through the power of sports. We provide high-quality youth development and adult social sports that prioritize genuine human connection over the transactional nature of corporate leagues. We aren&apos;t just a sports provider; we are a community architect.
          </p>
          <h3 className="mt-4 font-display text-lg font-bold text-[#1B2F1F]">
            Core Values
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {coreValues.map(({ icon: Icon, title, description }) => (
              <article
                key={title}
                className="rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-3 transition-all duration-200 ease-in-out hover:border-[#1B2F1F]/30"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-ui border border-[#E5E5E1] bg-[#1B2F1F] text-[#FDFCF8]">
                  <Icon size={14} />
                </div>
                <h4 className="mt-2 font-display text-sm font-semibold leading-snug text-[#1B2F1F]">
                  {title}
                </h4>
                <p className="mt-1 text-xs leading-snug text-[#1B2F1F]/80">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* The Super Team: breathing room above, centered header */}
      <section className="mt-12 sm:mt-16">
        <h2 className="text-center font-display text-3xl font-bold text-[#1B2F1F] sm:text-4xl">
          The Super Team
        </h2>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 justify-items-center gap-8 md:grid-cols-3 lg:grid-cols-4">
          {team.map((member) => (
            <article
              key={member.name}
              className="w-full max-w-xs rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] overflow-hidden transition-all duration-200 ease-in-out hover:border-[#1B2F1F]/40 hover:shadow-sm"
            >
              <div className="aspect-square w-full bg-[#E5E5E1] shrink-0">
                <div className="flex h-full w-full items-center justify-center text-[#1B2F1F]/40 text-xs font-medium">
                  Headshot
                </div>
              </div>
              <div className="p-4 text-center">
                <h3 className="font-display text-lg font-bold text-[#1B2F1F]">
                  {member.name}
                </h3>
                <p className="mt-0.5 text-sm font-medium text-[#1B2F1F]/80">
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
