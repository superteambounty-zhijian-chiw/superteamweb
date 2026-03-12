import React from 'react'

// WelcomeSection renders the hero welcome message over a full-screen background image
export default function WelcomeSection() {
  return (
    <section
      className="relative min-h-[120vh] bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/assets/kl_mosque.jpg')" }}
    >
      {/* <div className="relative z-10 mx-auto max-w-6xl px-4 py-28 sm:px-6 md:py-32">
        <h2 className="font-heading text-center text-3xl font-bold text-foreground sm:text-4xl">
          Welcome to the Solana Community in Malaysia
        </h2>
      </div> */}
    </section>
  )
}