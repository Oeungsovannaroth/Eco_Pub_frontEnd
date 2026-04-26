import React from 'react';

function About() {
  return (
    <div className="min-h-screen bg-[#0e0c0a] text-white">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34b4?q=80&w=2070')",
            filter: "brightness(0.65)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black/90" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6">
            ABOUT <span className="text-amber-400">CLOUD9 PUB</span>
          </h1>
          <p className="text-xl text-zinc-300 max-w-2xl mx-auto">
            Where great food, good drinks, and unforgettable moments come together.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-white mb-8 tracking-tight">
                Our Story
              </h2>
              <div className="space-y-6 text-zinc-300 leading-relaxed text-lg">
                <p>
                  Founded in 2022, Cloud9 Pub was born from a simple idea — to create a warm, 
                  welcoming space where people can escape the hustle and truly relax.
                </p>
                <p>
                  We believe that great moments happen around good food, great drinks, and even better company. 
                  That's why every corner of Cloud9 is designed to make you feel at home.
                </p>
                <p>
                  From our carefully crafted menu featuring local ingredients to our cozy ambiance 
                  with soft lighting and chill music, every detail is meant to help you unwind and enjoy the moment.
                </p>
              </div>
            </div>

            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1514933651103-005eec06c7a0?q=80&w=2071" 
                alt="Cloud9 Pub Interior"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-amber-500 text-black p-8 rounded-3xl max-w-xs">
                <p className="font-semibold text-2xl">"A place to chill, connect, and create memories."</p>
                <p className="text-sm mt-3 text-black/70">- The Cloud9 Team</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-20 bg-zinc-950">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-16">What We Stand For</h2>
          
          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                title: "Quality First",
                desc: "We source the finest ingredients and serve drinks with passion and precision."
              },
              {
                title: "Warm Atmosphere",
                desc: "Our space is designed to make every guest feel comfortable and welcome."
              },
              {
                title: "Community Hub",
                desc: "More than just a pub — we're a place where friendships grow and memories are made."
              }
            ].map((value, i) => (
              <div key={i} className="bg-zinc-900 p-10 rounded-3xl border border-zinc-800 hover:border-amber-400/50 transition-all">
                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">★</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{value.title}</h3>
                <p className="text-zinc-400 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Come Visit Us</h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
            Whether you're stopping by for a casual drink, a delicious meal, or a special celebration, 
            we can't wait to welcome you at Cloud9 Pub.
          </p>

          <div className="grid md:grid-cols-2 gap-8 text-left max-w-2xl mx-auto">
            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h4 className="font-semibold text-amber-400 mb-3">LOCATION</h4>
              <p className="text-zinc-300">123 Riverside Avenue<br />Phnom Penh, Cambodia</p>
            </div>
            <div className="bg-zinc-900 p-8 rounded-3xl">
              <h4 className="font-semibold text-amber-400 mb-3">HOURS</h4>
              <p className="text-zinc-300">
                Monday - Thursday: 4:00 PM - 12:00 AM<br />
                Friday - Sunday: 3:00 PM - 2:00 AM
              </p>
            </div>
          </div>

          <button 
            onClick={() => window.open('https://maps.google.com', '_blank')}
            className="mt-12 bg-amber-500 hover:bg-amber-400 text-black font-semibold px-12 py-4 rounded-2xl text-lg transition-all"
          >
            Get Directions
          </button>
        </div>
      </section>
    </div>
  );
}

export default About;