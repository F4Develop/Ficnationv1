'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from '@/components/Login';
import Register from '@/components/Register';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpenIcon, SparklesIcon } from '@heroicons/react/24/solid';

export default function Home() {
  const [showLogin, setShowLogin] = useState(true);
  const router = useRouter();

  const handleRegisterSuccess = () => {
    router.push('/dashboard');
  };

  const handleLoginSuccess = () => {
    router.push('/dashboard');
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-900 flex flex-col items-center justify-center text-white relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute top-10 left-10 opacity-20">
        <SparklesIcon className="h-20 w-20 text-purple-300 animate-pulse" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-20">
        <SparklesIcon className="h-20 w-20 text-purple-300 animate-pulse" />
      </div>
      
      {/* Contenido principal */}
      <div className="z-10 bg-gray-800 bg-opacity-50 p-8 rounded-lg shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-center mb-8">
          <BookOpenIcon className="h-12 w-12 text-purple-400 mr-4" />
          <h1 className="text-5xl font-bold text-purple-400">Ficnation</h1>
        </div>
        <div className="w-96">
          <AnimatePresence mode="wait">
            {showLogin ? (
              <motion.div
                key="login"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Login onLoginSuccess={handleLoginSuccess} />
                <p className="mt-4 text-center">
                  ¿No tienes cuenta?
                  <button 
                    onClick={() => setShowLogin(false)}
                    className="ml-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Regístrate
                  </button>
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="register"
                variants={formVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <Register onRegisterSuccess={handleRegisterSuccess} />
                <p className="mt-4 text-center">
                  ¿Ya tienes cuenta?
                  <button 
                    onClick={() => setShowLogin(true)}
                    className="ml-2 text-purple-400 hover:text-purple-300 transition-colors duration-300"
                  >
                    Inicia sesión
                  </button>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Pie de página */}
      <footer className="absolute bottom-4 text-center text-sm text-gray-400">
        © 2023 Ficnation. Todos los derechos reservados.
      </footer>
    </div>
  );
}