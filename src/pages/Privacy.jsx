const LAST_UPDATED = 'August 16, 2026'
const CONTACT_EMAIL = 'info@brooklyngamebreakers.com'

const linkClass = 'font-semibold text-forest transition-colors hover:text-green-deep'

function Section({ title, children }) {
  return (
    <section className="mt-8">
      <h2 className="heading-display text-lg sm:text-xl">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  )
}

export default function Privacy() {
  return (
    <div className="max-w-3xl">
      <p className="kicker">Legal</p>
      <h1 className="heading-display mt-3 text-2xl sm:text-3xl md:text-4xl">Privacy Policy</h1>
      <p className="mt-3 font-util text-xs font-bold text-muted">
        Last updated: {LAST_UPDATED}
      </p>

      <p className="mt-4 text-sm leading-relaxed text-muted">
        Brooklyn Gamebreakers (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) runs youth
        sports and creative programming in Brooklyn, New York. This policy explains what
        information we collect through brooklyngamebreakers.com, how we use it, and the choices
        you have. By using our site or joining our interest list, you agree to the practices
        described here.
      </p>

      <Section title="Information You Give Us">
        <p>
          When you join our interest list through the signup form, we ask for your name and email
          address, and optionally your phone number and zip code. We also ask whether you are a
          parent, player, coach, or community partner, and the ages of the children you are signing
          up. We only collect what we need to plan programs and let you know when they open.
        </p>
        <p>
          You can also reach us directly by email. Anything you send us that way is kept with our
          regular correspondence.
        </p>
      </Section>

      <Section title="Information Collected Automatically">
        <p>
          Like most websites, we collect limited technical information when you visit — things like
          your approximate location (city or region), device and browser type, the pages you view,
          how you arrived at our site, and how long you stay. This is collected through cookies and
          similar technologies, and we use it in aggregate to understand what is useful to our
          community.
        </p>
        <p>
          We do not collect precise location data, and we do not sell any of this information.
        </p>
      </Section>

      <Section title="How We Use Your Information">
        <ul className="list-disc space-y-1 pl-5">
          <li>To tell you about upcoming clinics, programs, and Gamebreakers news</li>
          <li>To plan age groups, group sizes, and locations for our programming</li>
          <li>To answer your questions and respond to your messages</li>
          <li>To understand how our site is used so we can improve it</li>
          <li>To meet legal, permitting, and insurance obligations for our programs</li>
        </ul>
        <p>
          We do not sell, rent, or trade your personal information, and we do not use it for
          advertising targeted at you or your children.
        </p>
      </Section>

      <Section title="Email Communications">
        <p>
          If you join our interest list, we will email you about new programs and organizational
          news. Every email includes an unsubscribe link, and you can opt out at any time by
          clicking it or by emailing us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>
          . We will still respond to direct questions you send us after you unsubscribe.
        </p>
      </Section>

      <Section title="Cookies and Analytics">
        <p>
          We use Google Analytics to measure site traffic and understand which pages people find
          valuable. Google Analytics sets cookies that help it recognize returning visitors and
          measure sessions. You can learn how Google handles this data at{' '}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Google&apos;s partner sites policy
          </a>
          .
        </p>
        <p>
          If you would rather not be counted, you can install the{' '}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            Google Analytics opt-out browser add-on
          </a>
          , block cookies in your browser settings, or use your browser&apos;s private browsing
          mode. Our site works fine either way.
        </p>
      </Section>

      <Section title="Who We Share Information With">
        <p>
          We share information only with service providers who help us operate, and only as much as
          they need to do their job:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>
            <span className="font-semibold text-ink">Mailchimp</span> stores our interest list and
            sends our emails
          </li>
          <li>
            <span className="font-semibold text-ink">Google Analytics</span> provides aggregate site
            traffic reporting
          </li>
          <li>
            <span className="font-semibold text-ink">Vercel</span> hosts this website
          </li>
        </ul>
        <p>
          We may also disclose information if the law requires it, or if we need to protect the
          safety of our participants, staff, or organization. If we ever partner with another
          organization on a program, we will tell you before sharing your information with them.
        </p>
      </Section>

      <Section title="Children's Privacy">
        <p>
          Our programs serve children, but this website is written for parents and guardians. We do
          not knowingly collect personal information directly from children under 13. Information
          about a child — such as their age — should be provided only by a parent or legal guardian,
          and we use it solely to place children in appropriate age groups and to plan our
          programming.
        </p>
        <p>
          If you believe a child has given us information without a parent&apos;s involvement,
          please email{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>{' '}
          and we will delete it promptly.
        </p>
      </Section>

      <Section title="Data Retention and Security">
        <p>
          We keep interest list information for as long as you want to hear from us, and program
          records for as long as we need them for organizational and legal purposes. We use
          reputable service providers and take reasonable steps to protect your information, but no
          method of transmission or storage over the internet is completely secure, so we cannot
          guarantee absolute security.
        </p>
      </Section>

      <Section title="Your Choices">
        <p>
          You can ask us to see, correct, or delete the personal information we hold about you or
          your child at any time by emailing{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>
          . Depending on where you live, you may have additional rights under your local privacy
          laws. We honor those requests regardless of where you are.
        </p>
      </Section>

      <Section title="Links to Other Sites">
        <p>
          Our site links to services we do not control, including Instagram and Venmo. Those
          services have their own privacy policies, and we are not responsible for their practices.
          We encourage you to review them before sharing information there.
        </p>
      </Section>

      <Section title="Changes to This Policy">
        <p>
          We may update this policy as our programs and tools change. When we do, we will revise the
          &ldquo;last updated&rdquo; date above. If the changes are significant, we will let our
          interest list know by email.
        </p>
      </Section>

      <Section title="Contact Us">
        <p>
          Questions about this policy or your information? Email us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className={linkClass}>
            {CONTACT_EMAIL}
          </a>{' '}
          and we will get back to you.
        </p>
      </Section>
    </div>
  )
}
