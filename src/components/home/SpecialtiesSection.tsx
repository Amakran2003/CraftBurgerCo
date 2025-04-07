/**
 * SpecialtiesSection Component
 * 
 * Displays a horizontally scrollable list of restaurant specialties.
 * Features:
 * - Interactive card animations with mouse position-based 3D effects
 * - Responsive design with different layouts for mobile and desktop
 * - Navigation arrows for desktop and indicator dots for mobile
 * - Links to the relevant menu items
 * 
 * Imported by:
 * - Home.tsx
 */
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { specialties } from '../../data/menuData';
import { useTheme } from '../../context/ThemeContext';

export default function SpecialtiesSection() {
  const { themeColors, theme } = useTheme();
  const specialtiesRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Define a consistent underline style for titles - updated to use yellow in both themes
  const underlineStyle = {
    backgroundColor: '#f8c136' // Yellow color for both light and dark modes
  };

  const checkScrollability = () => {
    if (specialtiesRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = specialtiesRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Improved calculation for active index, especially for the last item
      const lastPossibleScrollPosition = scrollWidth - clientWidth;
      const scrollRatio = scrollLeft / lastPossibleScrollPosition;
      const totalItems = specialties.length;
      
      let newActiveIndex;
      
      // Check if we're at or very near the end of scroll
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // If we're at the end, set to the last item
        newActiveIndex = totalItems - 1;
      } else {
        // Otherwise calculate based on scroll position
        // This maps the scroll ratio to the item index range
        newActiveIndex = Math.min(
          Math.round(scrollRatio * (totalItems - 1)),
          totalItems - 1
        );
      }

      if (newActiveIndex !== activeIndex) {
        setActiveIndex(newActiveIndex);
      }
    }
  };

  // Enhance the scroll detection
  useEffect(() => {
    const scrollContainer = specialtiesRef.current;
    if (scrollContainer) {
      const handleScroll = () => {
        checkScrollability();
        // Add a second check after a short delay to catch the end of momentum scrolling
        setTimeout(checkScrollability, 200);
      };
      
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      // Also run checkScrollability when the component mounts
      checkScrollability();
      
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (specialtiesRef.current) {
      const scrollAmount = 320;
      const currentScroll = specialtiesRef.current.scrollLeft;
      specialtiesRef.current.scrollTo({
        left: direction === 'left' 
          ? currentScroll - scrollAmount 
          : currentScroll + scrollAmount,
        behavior: 'smooth',
      });
      
      // Small timeout to let the scroll happen before checking
      setTimeout(checkScrollability, 300);
    }
  };

  // Animation pour les éléments qui suivent la souris
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <motion.section 
      className="py-16 sm:py-20 relative" 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background décoration */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-40 -right-20 w-40 h-40 rounded-full border-4"
          style={{ borderColor: `${themeColors.heading}10` }}
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 -left-10 w-20 h-20 rounded-full border-4"
          style={{ borderColor: `${themeColors.secondary}10` }}
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-0">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold relative z-10"
                style={{ color: themeColors.heading }}>
              Nos Spécialités
            </h2>
            <motion.div 
              className="absolute -bottom-2 left-0 h-2 w-full rounded-lg" 
              style={underlineStyle} // Use the consistent underline style
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              transition={{ delay: 0.4, duration: 0.8 }}
              viewport={{ once: true }}
            />
          </motion.div>
          
          <div className="hidden md:flex space-x-2">
            <motion.button
              onClick={() => scroll('left')}
              className={`p-2 rounded-full ${!canScrollLeft && 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
              style={{ 
                backgroundColor: canScrollLeft ? themeColors.primary : undefined,
                color: canScrollLeft ? '#ffffff' : undefined 
              }}
              whileHover={canScrollLeft ? { scale: 1.1 } : {}}
              whileTap={canScrollLeft ? { scale: 0.9 } : {}}
              disabled={!canScrollLeft}
            >
              <ChevronLeft size={20} />
            </motion.button>
            <motion.button
              onClick={() => scroll('right')}
              className={`p-2 rounded-full ${!canScrollRight && 'bg-gray-200 text-gray-400 dark:bg-gray-700 dark:text-gray-500 cursor-not-allowed'}`}
              style={{ 
                backgroundColor: canScrollRight ? themeColors.primary : undefined,
                color: canScrollRight ? '#ffffff' : undefined 
              }}
              whileHover={canScrollRight ? { scale: 1.1 } : {}}
              whileTap={canScrollRight ? { scale: 0.9 } : {}}
              disabled={!canScrollRight}
            >
              <ChevronRight size={20} />
            </motion.button>
          </div>
        </div>
        
        <div 
          className="relative pt-6 pb-4" 
          onMouseEnter={checkScrollability}
          style={{ zIndex: 1 }}
        >
          <div 
            ref={specialtiesRef} 
            className="flex space-x-4 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory relative"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none'
            }}
            onScroll={checkScrollability}
          >
            {specialties.map((specialty, index) => (
              <div
                key={specialty.id}
                className="flex-shrink-0 w-[250px] sm:w-[280px] snap-center relative"
                style={{ isolation: 'isolate' }}
              >
                <Link 
                  to={`/menu?category=${specialty.menuCategory}&item=${specialty.menuItemId}`}
                  className="block h-full rounded-xl"
                  style={{ position: 'relative', zIndex: 10, transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ 
                      y: -5, 
                      zIndex: 999, 
                      boxShadow: theme === 'light' 
                        ? "0 15px 30px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" 
                        : "0 15px 30px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.25)",
                      rotateY: mousePosition.x > window.innerWidth / 2 ? -5 : 5,
                      rotateX: mousePosition.y > window.innerHeight / 2 ? 5 : -5
                    }}
                    whileTap={{ scale: 0.98 }}
                    className="rounded-xl overflow-hidden h-full"
                    style={{
                      backgroundColor: theme === 'light' ? '#ffffff' : '#2d2d2d',
                      willChange: 'transform',
                      position: 'relative',
                      transformOrigin: 'center center',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      borderRadius: '0.75rem',
                      boxShadow: theme === 'light' 
                        ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
                        : "0 4px 8px rgba(0, 0, 0, 0.4), 0 2px 4px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    <div className="relative overflow-hidden rounded-t-xl">
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 z-10 flex items-end p-4">
                        <p className="text-white text-xs font-medium">Découvrir</p>
                      </motion.div>
                      <motion.img 
                        src={specialty.image} 
                        alt={specialty.name} 
                        className="w-full h-36 sm:h-48 object-cover"
                        style={{ 
                          transform: 'translateZ(0)',
                          borderTopLeftRadius: '0.75rem',
                          borderTopRightRadius: '0.75rem',
                        }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.4 }}
                      />
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 flex items-center"
                          style={{ 
                            color: themeColors.heading,
                            textShadow: theme === 'dark' ? "0px 1px 1px rgba(0, 0, 0, 0.5)" : "none" 
                          }}>
                        {specialty.name}
                      </h3>
                      <p className="text-xs sm:text-sm"
                         style={{ 
                           color: theme === 'light' ? '#4b5563' : '#e5e7eb',
                         }}>
                        {specialty.description}
                      </p>
                      <span 
                        className="mt-3 sm:mt-4 inline-block text-xs sm:text-sm font-medium hover:underline transition-colors duration-200"
                        style={{ color: themeColors.heading }}
                      >
                        Voir sur le menu 
                        <motion.span 
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                          className="inline-block ml-1"
                        >
                          →
                        </motion.span>
                      </span>
                    </div>
                  </motion.div>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Mobile indicator dots */}
          <div className="flex justify-center space-x-2 mt-4 md:hidden">
            {specialties.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full ${index !== activeIndex && 'bg-gray-300 dark:bg-gray-600'}`}
                style={{ 
                  backgroundColor: index === activeIndex ? themeColors.heading : undefined,
                  cursor: 'pointer',
                  boxShadow: index === activeIndex ? '0 0 3px rgba(0, 0, 0, 0.3)' : 'none'
                }}
                animate={{ scale: index === activeIndex ? 1.2 : 1 }}
                transition={{ duration: 0.2 }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  )
}
