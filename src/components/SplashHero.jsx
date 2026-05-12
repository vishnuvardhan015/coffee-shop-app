import { motion } from 'framer-motion';

const coffeeSplashImage = `${import.meta.env.BASE_URL}images/coffee_splash.png`;

const SplashHero = ({ onGetStarted }) => {
  return (
    <div className="relative w-full h-[100dvh] bg-black flex flex-col items-center overflow-hidden">


      {/* Hero Image Section */}
      <motion.div 
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="w-full h-[60%] relative"
      >
        <img 
          src={coffeeSplashImage} 
          alt="Coffee Splash" 
          className="w-full h-full object-cover object-center"
        />
        {/* Gradient overlay to smoothly blend image into black background */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black pointer-events-none"></div>
      </motion.div>

      {/* Content Section */}
      <div className="flex-1 w-full flex flex-col items-center px-8 z-10 -mt-12">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-4xl leading-[1.2] font-semibold text-center text-white mb-4 tracking-tight"
        >
          Fall in Love with<br />
          Coffee in Blissful<br />
          Delight!
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[#A3A3A3] text-[15px] leading-relaxed text-center mb-auto max-w-[280px]"
        >
          Welcome to our cozy coffee corner, where
          every cup is a delightful for you.
        </motion.p>

        {/* CTA Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGetStarted}
          className="w-full bg-[#C17C54] hover:bg-[#b06f48] text-white py-[18px] rounded-2xl text-[17px] font-semibold transition-colors shadow-lg shadow-[#C17C54]/20 mb-10"
        >
          Get Started
        </motion.button>
      </div>

      {/* Bottom Home Indicator Mockup */}
      <div className="absolute bottom-2 w-full flex justify-center pb-2 z-20">
        <div className="w-[130px] h-[5px] bg-white/20 rounded-full"></div>
      </div>
    </div>
  );
};

export default SplashHero;
