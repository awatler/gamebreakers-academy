import { Calendar, MapPin, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { leagues } from '../data/leagues'
import { leagueImages } from '../data/images'

function LeagueCard({ league }) {
  const isOpen = league.status === 'Open'
  const imageUrl = leagueImages[league.id]
  return (
    <article className="rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] overflow-hidden transition-all duration-200 ease-in-out hover:border-[#1B2F1F]/40 hover:shadow-sm">
      {imageUrl && (
        <div className="aspect-[16/10] w-full shrink-0 overflow-hidden border-b border-[#E5E5E1]">
          <img
            src={imageUrl}
            alt=""
            className="h-full w-full object-cover object-center"
            width={400}
            height={250}
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-ui border px-2.5 py-1 text-xs font-medium ${
              isOpen
                ? 'border-[#1B2F1F]/30 bg-[#1B2F1F]/10 text-[#1B2F1F]'
                : 'border-[#E5E5E1] bg-[#E5E5E1] text-[#1B2F1F]/80'
            }`}
          >
            {league.status}
          </span>
          <span className="rounded-ui border border-[#E5E5E1] px-2.5 py-1 text-xs font-medium text-[#1B2F1F]/80">
            {league.vibe}
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-[#1B2F1F]">
          {league.name}
        </h3>
        <p className="mt-1 text-sm text-[#1B2F1F]/80">{league.sport}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-[#1B2F1F]/70">
          <span className="flex items-center gap-1.5">
            <Calendar size={14} />
            {league.month}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={14} />
            {league.location}
          </span>
        </div>
        <Link
          to={`/leagues/${league.id}`}
          className="mt-6 inline-flex items-center gap-1.5 rounded-ui border border-[#000000] bg-[#000000] px-4 py-2.5 text-sm font-medium text-[#FDFCF8] transition-all duration-200 ease-in-out hover:bg-[#1B2F1F] hover:border-[#1B2F1F]"
        >
          View Details
          <ChevronRight size={16} />
        </Link>
      </div>
    </article>
  )
}

export default function Leagues() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-[#1B2F1F] sm:text-3xl">
        Summer ’26 Pilot Programs
      </h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <LeagueCard key={league.id} league={league} />
        ))}
      </div>
    </div>
  )
}
