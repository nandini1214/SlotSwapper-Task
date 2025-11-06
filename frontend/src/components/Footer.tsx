import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 py-4 text-center text-gray-500 text-sm mt-auto">
      © {new Date().getFullYear()} SlotSwapper • Built with ❤️ using React + FastAPI
    </footer>
  );
};

export default Footer;
