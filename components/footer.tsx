import Link from "next/link";
import { Youtube, Github, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t py-4">
      <div className="container flex items-center justify-between px-4 md:px-6">
        <div className="w-28"> {/* Spacer to help with centering */}</div>
        <Link
          href="https://youtube.com/@yourchannel"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-red-400 hover:bg-red-500 px-4 py-2 text-sm text-white transition-transform hover:scale-105 duration-300"
        >
          <Youtube className="h-4 w-4" />
          <span>Watch me build this</span>
        </Link>
        <div className="flex items-center gap-4 w-28">
          <Link
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://twitter.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
