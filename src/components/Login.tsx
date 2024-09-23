'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Implementa la lógica de inicio de sesión aquí
    console.log('Login attempt', { email, password });
    onLoginSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Correo electrónico"
          required
          className="w-full p-2 bg-gray-700 rounded text-white transition-all duration-300 focus:ring-2 focus:ring-purple-400 outline-none"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          className="w-full p-2 bg-gray-700 rounded text-white transition-all duration-300 focus:ring-2 focus:ring-purple-400 outline-none"
        />
      </motion.div>
      <motion.button 
        type="submit" 
        className="w-full p-2 bg-purple-600 rounded hover:bg-purple-500 text-white transition-colors duration-300"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Iniciar sesión
      </motion.button>
    </form>
  );
}