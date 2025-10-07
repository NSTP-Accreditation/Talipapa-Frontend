import React from 'react';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#1b4c2e' }} className="text-white py-12 px-6">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-green-800 pt-6">
        <div>
          <h3 className="mb-4">Barangay Talipapa</h3>
          <p className="text-[#cfead6] text-sm leading-relaxed">
           A progressive community fostering environmental sustainability and unity in Quezon City, Philippines.
          </p>
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              title="Facebook"
              className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white/60 ring-offset-2 ring-offset-green-800 hover:opacity-90 focus:outline-none"
            >
              {/* Facebook SVG - switched to contact green */}
              <svg className="w-4 h-4" style={{ color: '#cfead6' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M22 12.07C22 6.48 17.52 2 11.93 2S1.86 6.48 1.86 12.07C1.86 17.06 5.86 21.18 10.64 21.98v-6.99H8.08v-2.92h2.56V9.41c0-2.53 1.5-3.93 3.8-3.93 1.1 0 2.25.2 2.25.2v2.47h-1.27c-1.25 0-1.64.78-1.64 1.58v1.9h2.8l-.45 2.92h-2.35V21.98C20.14 21.18 22 17.06 22 12.07z" />
              </svg>
            </a>

            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              title="YouTube"
              className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white/60 ring-offset-2 ring-offset-green-800 hover:opacity-90 focus:outline-none"
            >
              {/* YouTube SVG - switched to contact green */}
              <svg className="w-4 h-4" style={{ color: '#cfead6' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M23.5 6.2s-.2-1.6-.8-2.3c-.8-.9-1.7-.9-2.1-1C16.7 2.5 12 2.5 12 2.5h-.1s-4.7 0-8.5.3c-.4 0-1.4.1-2.1 1C.7 4.6.5 6.2.5 6.2S.2 8 .2 9.9v1.9c0 1.9.3 3.7.3 3.7s.2 1.6.8 2.3c.8.9 1.8.9 2.3 1 1.7.2 7.4.3 7.4.3s4.7 0 8.5-.3c.4 0 1.4-.1 2.1-1 .6-.7.8-2.3.8-2.3s.3-1.8.3-3.7V9.9c0-1.9-.3-3.7-.3-3.7zM9.6 14.6V7.4l6.4 3.6-6.4 3.6z" />
              </svg>
            </a>

            <a
              href="https://talipapa.gov.ph"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Official website"
              title="Official website"
              className="w-8 h-8 rounded-full flex items-center justify-center ring-2 ring-white/60 ring-offset-2 ring-offset-green-800 hover:opacity-90 focus:outline-none"
            >
              {/* Globe SVG (official website) - switched to contact green */}
              <svg className="w-4 h-4" style={{ color: '#cfead6' }} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.93 6h-2.54c-.2-2.1-.77-3.83-1.39-5.03C18.42 4.57 20.37 6.63 16.93 8zM12 4.07c.5 1.01 1 2.69 1.28 4.93H10.72C11 6.76 11.5 5.07 12 4.07zM4.07 12c0-.98.17-1.92.48-2.78C7.03 9.27 9.42 8.54 12 8.54c2.58 0 4.97.73 7.45.68.31.86.48 1.8.48 2.78s-.17 1.92-.48 2.78C16.97 14.73 14.58 15.46 12 15.46c-2.58 0-4.97-.73-7.45-.68-.31-.86-.48-1.8-.48-2.78zM4.98 17.71C6.01 16.42 8.27 15.76 12 15.76c3.73 0 5.99.66 7.02 1.95-2.52.84-5.33 1.04-7.02 1.04-1.69 0-4.5-.2-7.02-1.04z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h3 className="mb-4">Contact Information</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center text-[#cfead6]">
              {/* Location icon */}
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#cfead6' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
              </svg>
              <span className="text-sm">506 Quirino Hwy, Novaliches, Quezon City, 1116</span>
            </li>

            <li className="flex items-center text-[#cfead6]">
              {/* Phone icon */}
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#cfead6' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.62 10.79a15.46 15.46 0 006.59 6.59l2.2-2.2a1 1 0 01.95-.27c1.06.27 2.2.42 3.38.42a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.18.15 2.32.42 3.38a1 1 0 01-.27.95l-2.03 2.46z" />
              </svg>
              <span className="text-sm">Desk Office: (63) 0917-5586735</span>
            </li>

            <li className="flex items-center text-[#cfead6]">
              {/* Phone icon */}
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#cfead6' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6.62 10.79a15.46 15.46 0 006.59 6.59l2.2-2.2a1 1 0 01.95-.27c1.06.27 2.2.42 3.38.42a1 1 0 011 1V20a1 1 0 01-1 1C10.07 21 3 13.93 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.18.15 2.32.42 3.38a1 1 0 01-.27.95l-2.03 2.46z" />
              </svg>
              <span className="text-sm">Admin Office: (63) 8-7110745</span>
            </li>

            <li className="flex items-center text-[#cfead6]">
              {/* Email icon */}
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" style={{ color: '#cfead6' }} xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
              <a className="text-sm hover:underline" href="mailto:barangay.talipapa2018@gmail.com">barangay.talipapa2018@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
