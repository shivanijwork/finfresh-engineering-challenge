export default function Footer() {
  return (
    <footer className="border-t mt-10 bg-white">
      <div className="container py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        
        <p>© {new Date().getFullYear()} FinFresh. All rights reserved.</p>

        
      </div>
    </footer>
  );
}