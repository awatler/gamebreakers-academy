/**
 * Stock photos from Unsplash (unsplash.com).
 * Free to use under the Unsplash License. No attribution required; optional for prototype.
 * CDN base: https://images.unsplash.com/photo-{id}?w=WIDTH&q=80
 */
const U = (id, w = 1200) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&fit=crop`

export const images = {
  // Basketball (game / court)
  basketball: U('1574629810360-7efbbe195018'),
  basketballGame: U('1546519638-68e109498ffc'),
  // American / flag football
  football: U('1560272564-c83b66b1ad12'),
  footballPlayers: U('1560272564-c83b66b1ad12', 800),
  // Outdoor team / social sport (kickball stand-in)
  outdoorTeam: U('1529900748604-07564a03e7a6'),
  teamSport: U('1511632764652-a85588f18f64'),
}

// Hero: high-quality flag football action (home banner)
export const heroImage = 'https://images.unsplash.com/photo-1628135276936-21c1290a7641?auto=format&fit=crop&q=80&w=2070'
/** Local assets (public folder). Use for team/community imagery. */
export const assets = {
  teamFlagFootball: '/images/team-flag-football.png',
  /** Founders' hero on Meet the Team. */
  foundersHero: '/images/Gamebreakers.jpg',
  /** Outdoor park basketball — Brooklyn vibe, community pickup game. Good for leagues/hero. */
  brooklynBasketballPark: '/images/brooklyn-basketball-park.jpg',
  /** Youth Flag Football — female player running, flag belt, B&W (Leagues card). */
  youthFlagFootball: '/images/youth-flag-football.png',
}

export const leagueImages = {
  'youth-flag-football-26': assets.youthFlagFootball,
  'youth-basketball-26': images.basketballGame,
}
