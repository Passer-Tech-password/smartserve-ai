"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import NavLink from "./NavLink";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full py-6 px-8 flex items-center justify-between 
      bg-white/70 dark:bg-gray-800/50 backdrop-blur-md 
      shadow-sm sticky top-0 z-50 transition-colors">

      {/* Logo */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-2xl font-bold text-blue-600 dark:text-blue-400"
      >
        <Link href="/">SmartServe</Link>
      </motion.h1>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-8 font-medium">
        <NavLink href="/#features">Features</NavLink>
        <NavLink href="/#ai">AI</NavLink>
        <NavLink href="/#contact">Contact</NavLink>
      </nav>

      {/* Desktop actions */}
      <div className="hidden md:flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="px-3 py-2 rounded-xl border border-gray-300 dark:border-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          🌙
        </button>

        <Link
          href="/login"
          className="px-5 py-2 bg-blue-600 text-white rounded-xl shadow 
            hover:bg-blue-700 transition"
        >
          Login
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 
          flex flex-col items-start p-6 shadow-md border-t dark:border-gray-800 md:hidden"
        >
          <NavLink href="/#features">Features</NavLink>
          <NavLink href="/#ai">AI</NavLink>
          <NavLink href="/#contact">Contact</NavLink>

          <button
            onClick={toggleTheme}
            className="mt-4 px-3 py-2 w-full border rounded-xl border-gray-300 
              dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            Toggle Theme
          </button>

          <Link
            href="/login"
            className="w-full mt-4 px-5 py-2 text-center bg-blue-600 text-white rounded-xl 
              shadow hover:bg-blue-700 transition"
          >
            Login
          </Link>
        </motion.div>
      )}
    </header>
  );
}
