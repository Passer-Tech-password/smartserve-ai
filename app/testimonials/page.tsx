

// =====================================================
// 4. TESTIMONIALS / CASE STUDIES
// =====================================================
export function TestimonialsPage() {
const testimonials = [
{
name: "Sarah - Retail Manager",
message: "SmartServe cut our response time by 60%! Customers are happier than ever.",
icon: <Star className="w-6 h-6 text-yellow-400" />,
},
{
name: "David - SaaS Founder",
message: "The AI suggestions helped our support team handle twice as many tickets.",
icon: <TrendingUp className="w-6 h-6 text-green-400" />,
},
{
name: "Amina - Customer Service Lead",
message: "Sentiment detection is a game changer. We know exactly when to escalate.",
icon: <Users className="w-6 h-6 text-blue-400" />,
}
];


return (
<div className="min-h-screen py-20 px-8 bg-gray-50 dark:bg-gray-900">
<h1 className="text-4xl font-bold text-center mb-12">What Our Users Say</h1>


<div className="grid grid-cols-1 md:grid-cols-3 gap-10">
{testimonials.map((t, i) => (
<motion.div
key={i}
initial={{ opacity: 0, y: 40 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.6 }}
className="p-8 rounded-2xl shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
>
<div className="mb-3">{t.icon}</div>
<p className="text-gray-700 dark:text-gray-300 mb-4">“{t.message}”</p>
<h3 className="font-semibold text-lg">— {t.name}</h3>
</motion.div>
))}
</div>
</div>
);
}