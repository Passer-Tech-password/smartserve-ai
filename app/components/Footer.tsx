// File: components/Footer.tsx
export default function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 dark:text-gray-400 text-sm">
        © {new Date().getFullYear()} SmartServe — AI Customer Support
        Automation.
      </footer>
    </>
  );
}
