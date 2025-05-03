
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center mb-4">
              <span className="text-2xl font-bold text-kuro-500">Kuro</span>
              <span className="text-2xl font-bold">Anime</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your premier destination for HD anime streaming.
              Discover, watch, and enjoy your favorite anime series.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/anime" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Anime
                </Link>
              </li>
              <li>
                <Link to="/seasonal" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Seasonal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/genre/action" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Action
                </Link>
              </li>
              <li>
                <Link to="/genre/romance" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Romance
                </Link>
              </li>
              <li>
                <Link to="/genre/fantasy" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Fantasy
                </Link>
              </li>
              <li>
                <Link to="/genre/comedy" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Comedy
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/dmca" className="text-sm text-muted-foreground hover:text-kuro-400 transition">
                  DMCA
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border text-sm text-center text-muted-foreground">
          <p>© 2025 KuroAnime. All rights reserved. This website is for demonstration purposes only.</p>
          <p className="mt-2">Anime data provided by <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer" className="text-kuro-400 hover:underline">Jikan API</a>.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
