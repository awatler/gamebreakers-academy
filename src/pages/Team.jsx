import { Users, Zap, Heart, Sparkles } from 'lucide-react'

import { assets } from '../data/images'



const coreValues = [

  {

    icon: Users,

    title: 'Connection Over Competition',

    description:

      'The real wins happen through the relationships built on the field.',

  },

  {

    icon: Zap,

    title: 'Leave It All Out On The Field',

    description:

      'Go above and beyond to create a high-quality, memorable experience for every kid.',

  },

  {

    icon: Heart,

    title: 'Community Based and Focused',

    description:

      "Invest in Brooklyn's spaces and offer low/no cost programs to make our impact as accessible as possible.",

  },

  {

    icon: Sparkles,

    title: 'By Athletes, For Athletes',

    description:

      'Combine deep sports knowledge with character development to mold the next generation.',

  },

]



const team = [
  'Alex',
  'Jason',
  'Jarrett',
  'Keith',
  'Wanemi',
  'Will',
  'Kianna',
  'Georgia',
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

              The vision began on the fields of Brooklyn. From players to founders, we&apos;re building the programs we always dreamed of when we were kids.

            </p>

          </div>

        </div>



        <div className="min-w-0 flex-1">

          <h3 className="heading-display text-center text-xl sm:text-2xl">

            Core Values

          </h3>

          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">

            {coreValues.map(({ icon: Icon, title, description }) => (

              <article

                key={title}

                className="rounded-ui border border-border bg-white p-3 text-center transition-all duration-200 ease-in-out hover:border-forest/30"

              >

                <div className="mx-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-ui bg-forest text-white">

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

        <p className="kicker kicker-centered justify-center">The team</p>

        <h2 className="heading-display mt-3 text-center text-3xl sm:text-4xl">

          Gamebreakers

        </h2>

        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-1 justify-items-center gap-8 md:grid-cols-3 lg:grid-cols-4">

          {team.map((name) => (

            <article

              key={name}

              className="w-full max-w-xs overflow-hidden rounded-ui border border-border bg-white transition-all duration-200 ease-in-out hover:border-forest/40 hover:shadow-sm"

            >

              <div className="aspect-square w-full shrink-0 bg-border">

                <div className="flex h-full w-full items-center justify-center font-util text-xs font-bold text-muted">

                  Headshot

                </div>

              </div>

              <div className="p-4 text-center">
                <h3 className="heading-display text-lg">
                  {name}
                </h3>
              </div>

            </article>

          ))}

        </div>

      </section>

    </div>

  )

}

