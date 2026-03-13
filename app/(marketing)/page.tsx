import { getLandingPageDataFromSanity } from '@/lib/sanity-data'
import { HeroSection } from '@/components/sections/HeroSection'
import { MissionSection } from '@/components/sections/MissionSection'
import { StatsSection } from '@/components/sections/StatsSection'
import { PartnersSection } from '@/components/sections/PartnersSection'
import { MemberSection } from '@/components/sections/MemberSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { JoinCtaSection } from '@/components/sections/JoinCtaSection'
import { FooterSection } from '@/components/sections/FooterSection'
import { EventSection } from '@/components/sections/EventSection'
import { CommunitySection } from '@/components/sections/CommunitySection'
import WelcomeSection from '@/components/sections/welcome'

/**
 * Landing page: all section content is loaded directly from Sanity via getLandingPageDataFromSanity().
 */
export default async function LandingPage() {
  const { landing, partners, members, faq, pastEvents, upcomingEvents } =
    await getLandingPageDataFromSanity()

  return (
    <>
      <HeroSection data={landing} />
      {/* Stacks above fixed hero; no bg here so hero stays visible during scroll transition */}
      <div className="relative z-10">
        {/* Single continuous background for Welcome + Partners */}
        <style>{`
          .mosque-bg {
            background-image: url('/assets/kl_mosque.jpg');
          }
          @media (max-width: 1024px) {
            .mosque-bg {
              background-image: url('/assets/kl_mosque_tablet_view.jpg');
            }
          }
          @media (max-width: 640px) {
            .mosque-bg {
              background-image: url('/assets/kl_mosque_mobile.jpg');
            }
          }
        `}</style>
        <div className="mosque-bg relative bg-cover bg-center bg-no-repeat">
          <WelcomeSection />
          <PartnersSection partners={partners} />
        </div>
        <MissionSection pillars={landing?.missionPillars ?? null} />
        <StatsSection stats={landing?.stats ?? null} />

        <EventSection
          pastEvents={pastEvents}
          upcomingEvents={upcomingEvents}
          viewAllEventsUrl={landing?.viewAllEventsUrl ?? null}
        />

        <MemberSection members={members} />
        <CommunitySection />
        {/* Single continuous background for FAQ, CTA, and Footer */}
        <div
          className="relative bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/assets/kl_view.jpg)',
          }}
        >
          {/* Dark overlay for text readability across all three sections */}
          <div className="absolute inset-0 bg-black/50" aria-hidden />
          <div className="relative">
            <FaqSection items={faq} />
            <JoinCtaSection socialLinks={landing?.socialLinks ?? null} />
            <FooterSection
              footerLinks={landing?.footerLinks ?? null}
              socialLinks={landing?.socialLinks ?? null}
            />
          </div>
        </div>
      </div>
    </>
  )
}
