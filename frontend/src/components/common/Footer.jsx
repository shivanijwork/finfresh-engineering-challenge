export default function Footer() {
  return (
    <footer className="border-t mt-10 bg-white">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        
        <p>© {new Date().getFullYear()} FinFresh. All rights reserved.</p>

        <div className="flex gap-4 mt-3 md:mt-0">
          <a href="#" className="hover:text-[var(--primary)]">
            Privacy
          </a>
          <a href="#" className="hover:text-[var(--primary)]">
            Terms
          </a>
          <a href="#" className="hover:text-[var(--primary)]">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}