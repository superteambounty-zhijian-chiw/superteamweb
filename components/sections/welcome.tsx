import React from 'react'

// WelcomeSection: first part of the shared kl_mosque background (background lives on parent wrapper with PartnersSection)
export default function WelcomeSection() {
    return (
        <section className="relative min-h-[120vh]">
            {/* SUPERTEAM MY heading — tablet & mobile only */}
            <div className="lg:hidden relative z-10 pt-56 sm:pt-40 text-center w-full overflow-hidden">
                <h1
                    className="font-extrabold tracking-widest uppercase text-white whitespace-nowrap"
                    style={{
                        fontSize: "clamp(1.5rem, 11vw, 6rem)",
                        textShadow: "0 2px 24px rgba(0,0,0,0.65)",
                    }}
                >
                    SUPERTEAM MY
                </h1>
            </div>

            {/* <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6 md:py-32">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl">
          Welcome to the Solana Community in Malaysia
        </h2>
      </div> */}
        </section>
    )
}