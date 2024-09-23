'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface RegisterProps {
  onRegisterSuccess: () => void;
}

export default function Register({ onRegisterSuccess }: RegisterProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('Debes aceptar los términos y condiciones para registrarte.');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, username, birthdate }),
      });
      const data = await res.json();
      if (data.success) {
        alert('Registro exitoso');
        onRegisterSuccess();
      } else {
        alert(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Ocurrió un error durante el registro');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Nombre de usuario"
        required
        className="w-full p-2 bg-gray-700 rounded text-white"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
        className="w-full p-2 bg-gray-700 rounded text-white"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        required
        className="w-full p-2 bg-gray-700 rounded text-white"
      />
      <input
        type="date"
        value={birthdate}
        onChange={(e) => setBirthdate(e.target.value)}
        required
        className="w-full p-2 bg-gray-700 rounded text-white"
      />
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="terms" className="text-sm">
          Acepto los <a href="/terms" className="text-purple-400 hover:underline">términos y condiciones</a>
        </label>
      </div>
      <button 
        type="submit" 
        className="w-full p-2 bg-purple-600 rounded hover:bg-purple-500 text-white transition-colors duration-300"
        disabled={!acceptTerms}
      >
        Registrarse
      </button>
    </form>
  );
}