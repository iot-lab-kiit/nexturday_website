import { Mail, Globe, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black text-white mt-20 border-t border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-4 text-white">Nexterday</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your one-stop destination for discovering and participating in
              exciting college events.
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Quick Links
            </h4>
            <ul className="space-y-3 text-gray-300">
              <li>
                <a
                  href="/"
                  className="hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="h-[1px] w-0 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>
                  Events
                </a>
              </li>
              <li>
                <a
                  href="https://iotkiit.in"
                  target="_blank"
                  className="hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="h-[1px] w-0 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://iotkiit.in/contact"
                  target="_blank"
                  className="hover:text-purple-400 transition-all duration-300 flex items-center gap-2 group"
                >
                  <span className="h-[1px] w-0 bg-purple-400 group-hover:w-4 transition-all duration-300"></span>
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-semibold mb-4 text-white">
              Contact Us
            </h4>
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3 group cursor-pointer">
                <Mail className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="mailto:iot.lab@kiit.ac.in"
                  className="hover:text-purple-400 transition-colors"
                >
                  iot.lab@kiit.ac.in
                </a>
              </div>
              <div className="flex items-center gap-3 group cursor-pointer">
                <Globe className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <a
                  href="https://iotkiit.in"
                  target="_blank"
                  className="hover:text-purple-400 transition-colors"
                >
                  iotkiit.in
                </a>
              </div>
              <a
                href="https://maps.app.goo.gl/K2hVdXF2YmG5gXFz7"
                target="_blank"
                className="flex items-center gap-3 group">
                <MapPin className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform duration-300" />
                <span>Campus 15, KIIT, Bhubaneswar</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-zinc-800/50 text-center">
          <p className="text-gray-300 text-sm">
            Made with <span className="text-red-500 animate-pulse">♥</span> &{" "}
            <span className="text-amber-600 animate-pulse">☕</span> by{" "}
            <a
              href="https://iotkiit.in"
              target="_blank"
              className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
            >
              IoT Lab
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
