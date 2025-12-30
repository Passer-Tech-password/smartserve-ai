// app/features/details/page.tsx

import { motion } from "framer-motion";

export const metadata = {
  title: "Feature Details | SmartServe",
};

export default function FeatureDetailsPage() {
  return (
    <div className="min-h-screen py-20 px-8 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold mb-6"
      >
        Deep Dive into SmartServe Features
      </motion.h1>

      <p className="max-w-3xl text-lg text-gray-600 dark:text-gray-300 mb-12">
        Learn how SmartServe elevates your customer support with powerful
        automation, advanced AI, and data-driven insights.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {[1, 2, 3, 4].map(i => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-2xl font-semibold mb-3">Feature #{i}</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Detailed explanation about how this feature works, why it matters,
              and how it integrates into SmartServe.
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
