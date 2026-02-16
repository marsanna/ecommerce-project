import { Link } from "react-router";

function Footer() {
  return (
    <footer className="mt-10 bg-gray-900 py-10 text-center text-gray-300">
      <Link to="/contact" className="transition hover:text-gray-400">
        Contact
      </Link>
      <div className="text-center text-sm text-gray-500">
        © 2026 My Shop. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
