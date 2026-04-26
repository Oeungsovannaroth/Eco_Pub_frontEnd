import { Outlet, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useState } from "react";

function PublicLayout() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[#0e0c0a] border-t border-amber-800/50 text-white overflow-hidden mt-auto">
        <div className="mx-auto max-w-7xl px-6 pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3 mb-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-3xl font-bold text-black shadow-xl shadow-amber-500/40">
                  C
                </div>
                <div>
                  <h2 className="text-3xl uppercase font-bold tracking-tighter text-white">
                    Cloud9 Pub
                  </h2>
                  <p className="text-xs text-amber-400 tracking-[3px] -mt-1">
                    RESTAURANT • BAR • EVENTS
                  </p>
                </div>
              </div>

              <p className="text-gray-400 max-w-md text-[15px] leading-relaxed mb-8">
                Experience the perfect blend of craft cocktails, gourmet cuisine, 
                and unforgettable nights in the heart of Phnom Penh.
              </p>

              {/* Social Icons */}
              <div className="flex gap-4">
                {["Facebook", "Instagram", "Twitter", "TikTok"].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-11 w-11 items-center justify-center rounded-full border border-amber-800/50 hover:border-amber-500 transition-all duration-300 hover:scale-110 hover:bg-amber-500/10"
                    onMouseEnter={() => setHoveredLink(social)}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    <span className="text-amber-400 group-hover:text-amber-300 transition-colors text-xl font-medium">
                      {social[0]}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-semibold text-amber-400 mb-6 tracking-wider">
                EXPLORE
              </h3>
              <ul className="space-y-4 text-gray-300">
                {[
                  { name: "Home", to: "/" },
                  { name: "About Us", to: "/about" },
                  { name: "Our Menu", to: "/menu" },
                  { name: "reviews", to: "reviews" },
                  { name: "Reservations", to: "/reserve" },
                ].map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-[15px] hover:text-amber-400 transition-all duration-200"
                    >
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Hours */}
            <div className="lg:col-span-4">
              <h3 className="text-lg font-semibold text-amber-400 mb-6 tracking-wider">
                CONTACT US
              </h3>

              <div className="space-y-6 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Location</p>
                  <p className="text-white">123 Riverside Road, Phnom Penh, Cambodia</p>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Opening Hours</p>
                  <div className="text-white space-y-1">
                    <p>Mon - Thu: 4:00 PM - 12:00 AM</p>
                    <p>Fri - Sun: 4:00 PM - 2:00 AM</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 mb-1">Get in Touch</p>
                  <div className="space-y-1">
                    <p>+855 23 456 789</p>
                    <p 
                      className="text-amber-400 hover:text-amber-300 cursor-pointer transition-colors"
                    >
                      Cloud9pub@pub.com
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-16 pt-8 border-t border-amber-800/30 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© {currentYear} Cloud9 Pub. All Rights Reserved.</p>

            <div className="flex gap-6 text-xs">
              <Link to="/privacy" className="hover:text-amber-400 transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="hover:text-amber-400 transition-colors">
                Terms of Service
              </Link>
            </div>

            <p className="text-xs">Made with for good vibes and great nights</p>
          </div>
        </div>

        {/* Decorative Bottom Glow */}
        <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent"></div>
      </footer>
    </div>
  );
}

export default PublicLayout;