"use client";

import { motion } from "framer-motion";
import { Sparkles, Bot, Ticket, Smile } from "lucide-react";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 transition-colors duration-300 overflow-x-hidden">
      {/* Floating Background Decorations */}
      <motion.div
        className="absolute top-10 left-10 w-40 h-40 bg-blue-200 dark:bg-blue-500/20 rounded-full blur-3xl opacity-40"
        animate={{ x: [0, 20, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-56 h-56 bg-purple-200 dark:bg-purple-500/20 rounded-full blur-3xl opacity-40"
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Navbar */}
     <Navbar/>

      {/* Hero Section */}
      <section className="px-8 pt-28 pb-24 flex flex-col md:flex-row items-center justify-between overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-xl"
        >
          <h2 className="text-5xl font-extrabold leading-tight text-gray-900 dark:text-white">
            Automate Customer Support with AI
          </h2>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            SmartServe uses AI-driven automation, sentiment analysis, and smart
            ticket routing to help businesses deliver modern, fast, and reliable
            support.
          </p>

          <div className="mt-10 flex gap-4">
            <a
              href="/register"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl shadow hover:bg-blue-700 transition"
            >
              Get Started
            </a>

            <a
              href="#features"
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-semibold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              Learn More
            </a>
          </div>
        </motion.div>

        {/* Animated Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-12 md:mt-0 w-full md:w-1/2 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-80 h-80 bg-gradient-to-br from-blue-200/50 to-white dark:from-gray-700 dark:to-gray-800 rounded-3xl shadow-xl flex flex-col items-center justify-center text-gray-500 dark:text-gray-300"
          >
            <Bot size={60} className="text-blue-600 dark:text-blue-400" />
            <p className="mt-4 text-lg font-semibold">AI Customer Assistant</p>
            <p className="text-sm opacity-70">24/7 automated support</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="px-8 py-24 bg-white dark:bg-gray-800 transition-colors"
      >
        <h3 className="text-center text-4xl font-bold text-gray-900 dark:text-white">
          Core Features
        </h3>
        <p className="text-center mt-3 text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
          Powerful AI tools built to supercharge customer support.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {[
            {
              title: "Smart Chatbot",
              icon: (
                <Bot className="text-blue-600 dark:text-blue-400" size={32} />
              ),
              desc: "AI-powered chat that responds instantly to customer needs.",
            },
            {
              title: "Sentiment Analysis",
              icon: (
                <Smile className="text-blue-600 dark:text-blue-400" size={32} />
              ),
              desc: "Detect customer emotions and satisfaction levels.",
            },
            {
              title: "Auto Ticket Routing",
              icon: (
                <Ticket
                  className="text-blue-600 dark:text-blue-400"
                  size={32}
                />
              ),
              desc: "Automatically route issues to the right department.",
            },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="p-8 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow hover:shadow-xl transition"
            >
              <div className="mb-4">{feature.icon}</div>
              <h4 className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                {feature.title}
              </h4>
              <p className="mt-3 text-gray-600 dark:text-gray-300">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <Footer/>
    </div>
  );
}
