export default function Footer() {
  return (
    <footer className="bg-white border-t py-4">
      <div className="max-w-7xl mx-auto px-6 text-center text-[#636669]">
        © {new Date().getFullYear()} alumnAI. All rights reserved.
      </div>
    </footer>
  );
}