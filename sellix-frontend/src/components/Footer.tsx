import { useTranslation } from 'react-i18next';

function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 text-gray-700 text-sm shadow-inner mt-12 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        
        <p className="text-center md:text-left transition duration-300">
          © {new Date().getFullYear()} <span className="font-semibold text-blue-600">Sellix</span>. {t("footer.rights")}
        </p>
        
        <p className="text-center md:text-right flex items-center gap-1 transition duration-300">
          <span className="animate-pulse text-pink-500">❤</span>
          {t("footer.createdBy")}{" "}
          <a
            href="https://www.linkedin.com/in/ionut-copos/"
            className="font-semibold text-blue-600 hover:text-purple-600 transition duration-300 hover:underline"
          >
            Ionuț Copos
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;