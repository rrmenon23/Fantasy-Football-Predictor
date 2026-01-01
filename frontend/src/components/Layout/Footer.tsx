const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200 px-4 py-3">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
          <div className="flex items-center space-x-4">
            <span>© {currentYear} Fantasy Football AI</span>
            <span className="hidden sm:inline">|</span>

            <a
              href="https://www.anthropic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 transition-colors"
            >
              Powered by Claude
            </a>

            <span className="hidden sm:inline">|</span>

            <a
              href="https://sleeper.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-600 transition-colors"
            >
              Data by Sleeper
            </a>
          </div>

          <div className="mt-2 sm:mt-0 text-xs text-gray-500">
            Made with ❤️ for fantasy football managers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
