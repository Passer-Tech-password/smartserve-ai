// app/pricing/page.tsx

import { motion } from "framer-motion";

export const metadata = {
  title: "Pricing | SmartServe",
};

export default function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "$9/mo",
      features: ["Basic AI Chat", "Email Support", "Up to 500 tickets"],
    },
    {
      name: "Pro",
      price: "$29/mo",
      features: [
        "Advanced AI",
        "Smart Routing",
        "5,000 tickets",
        "Analytics Dashboard",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: [
        "Full automation suite",
        "Unlimited tickets",
        "Dedicated support",
      ],
    },
  ];

  return (
    <div className="min-h-screen py-20 px-8 bg-gray-50 dark:bg-gray-900 text-gray-100">
      <h1 className="text-4xl font-bold text-center mb-14">Pricing Plans</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {plans.map((p, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-10 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold mb-3 text-blue-600 dark:text-blue-400">
              {p.name}
            </h2>

            <p className="text-3xl font-bold mb-6">{p.price}</p>

            <ul className="space-y-3">
              {p.features.map((f, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
