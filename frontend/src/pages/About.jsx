import React from 'react';
import { Heart, Sparkles, Award, GraduationCap, Coins, MapPin } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-brand-creamlight min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Banner Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sm font-bold text-brand-bronze uppercase tracking-widest">Our Story & Inspiration</span>
          <h1 className="text-4xl font-extrabold text-brand-dark mt-2">The Heart Behind Amigos Snacks</h1>
          <p className="text-sm text-gray-500 mt-4 leading-relaxed">
            Every bite of Amigos Snacks is seasoned with a student's dream, a grandmother's secret recipe, and the rich heritage of the Godavari riverbed.
          </p>
        </div>

        {/* Narrative Section - Meet the Founder */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-brand-cream/30 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          
          {/* Left Column: Founder Photo & Brand Logo */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[320px] aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-xl shadow-brand-dark/15 bg-brand-cream/20">
              <img
                src="/assets/images/akash_founder.png"
                alt="Akash - Founder of Amigos Snacks"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-white p-1.5 rounded-full shadow-md border border-brand-cream">
                <img
                  src="/assets/images/logo.png"
                  alt="Amigos Logo"
                  className="h-12 w-12 rounded-full object-cover"
                />
              </div>
            </div>
            <div className="text-center mt-4">
              <h3 className="text-lg font-black text-brand-dark">Akash</h3>
              <p className="text-xs text-brand-light font-bold flex items-center justify-center space-x-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                <span>Godavari District, AP</span>
              </p>
            </div>
          </div>

          {/* Right Column: Founder's Story */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-brand-cream/60 px-3 py-1.5 rounded-full text-xs font-bold text-brand-bronze">
              <GraduationCap className="h-4 w-4" />
              <span>B.Tech Final Year Student Startup</span>
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-brand-dark leading-snug">
              A Journey of Hard Work, Family, and Traditional Flavors
            </h2>

            <div className="text-sm text-gray-500 space-y-4 leading-relaxed">
              <p>
                Hello, my name is <strong>Akash</strong>. I am a final-year B.Tech engineering student from the beautiful <strong>Godavari district</strong> of Andhra Pradesh. Like many students, as I approached my final year, I felt a deep urge to stand on my own two feet. I wanted to pay for my final college fees, support my family, and secure my future. I decided that instead of waiting for opportunities, I would create one through sheer, honest hard work.
              </p>
              <p>
                Growing up on the banks of the Godavari, I was surrounded by the rich aromas of traditional cooking. The local homemakers and grandmothers in our neighborhood prepared the most delicious, mouth-watering snacks like Murukulu and Chekkalu. However, their culinary magic remained locked in small kitchens.
              </p>
              <p>
                That is when the spark for <strong>Amigos Snacks</strong> was born. I realized I could share these healthy, homemade Andhra delicacies with the rest of the world. By doing so, I could generate income to support my education while providing local women with a platform to earn fair wages for their expertise.
              </p>
              <p className="font-semibold text-brand-dark italic bg-brand-cream/30 p-4 rounded-xl border-l-4 border-brand-bronze">
                "Every packet of snacks you purchase from Amigos Snacks is not just a savory treat; it is a step toward supporting a student's dream, empowering local kitchen chefs, and keeping the authentic homemade taste of Andhra alive. Thank you for being a part of my journey."
              </p>
            </div>
          </div>
        </div>

        {/* Brand Promises Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-brand-cream/20 shadow-inner flex flex-col items-center text-center">
            <div className="bg-brand-cream/40 p-3.5 rounded-full mb-4">
              <Heart className="h-6 w-6 text-brand-bronze" />
            </div>
            <h3 className="font-bold text-brand-dark text-base mb-2">100% Homemade</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Hand-prepared by home chefs from Godavari using traditional family recipes and measurements.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-cream/20 shadow-inner flex flex-col items-center text-center">
            <div className="bg-brand-cream/40 p-3.5 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-brand-bronze" />
            </div>
            <h3 className="font-bold text-brand-dark text-base mb-2">Student Passion</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Driven by a student's dedication to quality, cleanliness, and hard work to build a genuine brand.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-cream/20 shadow-inner flex flex-col items-center text-center">
            <div className="bg-brand-cream/40 p-3.5 rounded-full mb-4">
              <Award className="h-6 w-6 text-brand-bronze" />
            </div>
            <h3 className="font-bold text-brand-dark text-base mb-2">Purity Promise</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Deep fried in clean, double-refined sunflower oil. No preservatives, artificial colors, or additives.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-cream/20 shadow-inner flex flex-col items-center text-center">
            <div className="bg-brand-cream/40 p-3.5 rounded-full mb-4">
              <Coins className="h-6 w-6 text-brand-bronze" />
            </div>
            <h3 className="font-bold text-brand-dark text-base mb-2">Empowering Locals</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Directly supports local women and home chefs in Andhra Pradesh by sharing our proceeds.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};

export default About;
