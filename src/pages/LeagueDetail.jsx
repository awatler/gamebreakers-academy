import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft } from 'lucide-react'
import { leagues } from '../data/leagues'
import { leagueImages } from '../data/images'

export default function LeagueDetail() {
  const { id } = useParams()
  const league = leagues.find((l) => l.id === id)

  if (!league) {
    return (
      <div className="rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-8 text-center">
        <p className="text-[#1B2F1F]/80">League not found.</p>
        <Link
          to="/leagues"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#1B2F1F] transition-colors duration-200 ease-in-out hover:text-[#000000]"
        >
          <ArrowLeft size={16} />
          Back to Leagues
        </Link>
      </div>
    )
  }

  const isOpen = league.status === 'Open'
  const isComingSoon = league.status === 'Coming Soon'
  const imageUrl = leagueImages[league.id]
  const hasPilotGoals = league.primaryGoal && league.secondaryGoal

  return (
    <div className="transition-opacity duration-300 ease-in-out">
      <Link
        to="/leagues"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#1B2F1F]/80 transition-colors duration-200 ease-in-out hover:text-[#000000]"
      >
        <ArrowLeft size={16} />
        Back to Leagues
      </Link>
      <article className="overflow-hidden rounded-ui border border-[#E5E5E1] bg-[#FDFCF8]">
        {imageUrl && (
          <div className="aspect-[21/9] w-full shrink-0 overflow-hidden border-b border-[#E5E5E1] sm:aspect-[3/1]">
            <img
              src={imageUrl}
              alt=""
              className="h-full w-full object-cover object-center"
              width={800}
              height={360}
              loading="eager"
            />
          </div>
        )}
        <div className="p-6 sm:p-8">
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
        <h1 className="mt-4 font-display text-2xl font-bold text-[#1B2F1F] sm:text-3xl">
          {league.name}
        </h1>
        <p className="mt-1 text-[#1B2F1F]/80">{league.sport}</p>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-sm text-[#1B2F1F]/70">
          <span className="flex items-center gap-1.5">
            <Calendar size={16} />
            {league.month}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin size={16} />
            {league.location}
          </span>
        </div>
        <p className="mt-8 text-[#1B2F1F]/80 leading-relaxed">
          {league.description}
        </p>
        {hasPilotGoals && (
          <div className="mt-8 space-y-4 rounded-ui border border-[#E5E5E1] bg-[#FDFCF8] p-6">
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1B2F1F]/80">Primary goal</h3>
              <p className="mt-1 text-sm text-[#1B2F1F]/80">{league.primaryGoal}</p>
            </div>
            <div>
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[#1B2F1F]/80">Secondary goal</h3>
              <p className="mt-1 text-sm text-[#1B2F1F]/80">{league.secondaryGoal}</p>
            </div>
          </div>
        )}
        <div className="mt-8">
          <button
            type="button"
            className="rounded-ui border border-[#000000] bg-[#000000] px-4 py-2.5 text-sm font-medium text-[#FDFCF8] transition-all duration-200 ease-in-out hover:bg-[#1B2F1F] hover:border-[#1B2F1F]"
          >
            {isOpen ? 'Register' : isComingSoon ? 'Get notified' : 'Join Waitlist'}
          </button>
        </div>
        </div>
      </article>
    </div>
  )
}
