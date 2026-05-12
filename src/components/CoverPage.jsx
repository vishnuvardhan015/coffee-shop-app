import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import caffeMochaImage from '../assets/images/Caffe Mocha.jpeg';

const coffeeSplashImage = `${import.meta.env.BASE_URL}images/coffee_splash.png`;

const CoverPage = ({ onGetStarted }) => (
  <main className="hidden lg:flex fixed inset-0 z-50 overflow-hidden bg-[#131313] text-white">
    <motion.img
      src={coffeeSplashImage}
      alt="Fresh coffee"
      className="absolute inset-0 w-full h-full object-cover"
      initial={{ scale: 1.08 }}
      animate={{ scale: 1 }}
      transition={{ duration: 5.5, ease: 'easeOut' }}
    />
    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/10" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

    <section className="relative z-10 min-h-screen w-full px-12 xl:px-20 2xl:px-28 py-10 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="flex items-center justify-between"
      >
        <div>
          <p className="text-[#B7B7B7] text-[12px] mb-1 font-medium">Location</p>
          <p className="font-semibold text-white text-[15px]">Beggur-koppa Road, Banglore</p>
        </div>
        <div className="h-10 px-4 rounded-full bg-white/10 border border-white/10 backdrop-blur-md flex items-center text-[13px] font-semibold text-white/90">
          Premium Coffee
        </div>
      </motion.div>

      <div className="flex-1 grid grid-cols-[minmax(0,0.92fr)_minmax(360px,0.48fr)] gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 34 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
          className="max-w-[820px]"
        >
          <span className="inline-flex items-center rounded-[6px] bg-[#ED5151] text-white text-[13px] font-bold px-3 py-1 mb-6 shadow-sm">
            Freshly Brewed
          </span>
          <h1 className="text-[76px] xl:text-[92px] 2xl:text-[108px] leading-[0.96] font-semibold tracking-tight mb-7">
            Fall in Love with Coffee in Blissful Delight
          </h1>
          <p className="text-[#A3A3A3] text-[18px] xl:text-[20px] leading-[1.7] max-w-[620px] mb-10">
            Discover crafted espresso, creamy lattes, and signature brews made for calm mornings and focused days.
          </p>

          <motion.button
            type="button"
            onClick={onGetStarted}
            whileHover={{ scale: 1.025, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="group h-[58px] px-7 rounded-[16px] bg-[#C67C4E] hover:bg-[#b06f48] text-white text-[16px] font-semibold shadow-lg shadow-[#C67C4E]/30 inline-flex items-center gap-3 transition-colors"
          >
            Get Started
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
          </motion.button>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 36, scale: 0.98 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.28, ease: 'easeOut' }}
          className="rounded-[24px] border border-white/10 bg-white/10 backdrop-blur-xl p-5 shadow-2xl shadow-black/30"
        >
          <img
            src={caffeMochaImage}
            alt="Caffe Mocha"
            className="w-full aspect-square rounded-[18px] object-cover mb-5"
          />
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-[24px] font-bold text-white mb-1">Caffe Mocha</h2>
              <p className="text-[#B7B7B7] text-[14px]">Deep Foam</p>
            </div>
            <p className="text-[#C67C4E] text-[26px] font-bold">$ 4.53</p>
          </div>
        </motion.aside>
      </div>
    </section>
  </main>
);

export default CoverPage;
