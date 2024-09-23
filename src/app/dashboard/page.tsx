'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaBell, FaUser, FaBook, FaCog, FaPlay, FaPause, FaImage, FaGlobe, FaBookmark } from 'react-icons/fa';

// Definimos una interfaz para nuestros fics
interface Fic {
  id: number;
  title: string;
  author: string;
  coverImage: string;
  reads?: number;
  description?: string;
}

interface Notification {
  id: number;
  message: string;
  date: string;
}

export default function Dashboard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string>('/hero-bg.jpg');
  const [language, setLanguage] = useState('es');
  const [featuredFics, setFeaturedFics] = useState<Fic[]>([]);
  const [popularFics, setPopularFics] = useState<Fic[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'audio/mpeg') {
      setAudioFile(file);
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(file);
      }
    } else {
      alert(language === 'es' ? 'Por favor, selecciona un archivo MP3 válido.' : 'Please select a valid MP3 file.');
    }
  };

  const handleBackgroundChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/png' || file.type === 'image/gif')) {
      setBackgroundImage(URL.createObjectURL(file));
    } else {
      alert(language === 'es' ? 'Por favor, selecciona un archivo PNG o GIF válido.' : 'Please select a valid PNG or GIF file.');
    }
  };

  const toggleLanguage = () => {
    setLanguage(prevLang => prevLang === 'es' ? 'en' : 'es');
  };

  useEffect(() => {
    setIsLoaded(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.1; // Ajusta el volumen inicial (0.1 = 10%)
    }

    // Simulamos la carga de fics desde una base de datos
    const fetchFics = async () => {
      // Simulamos un retraso de red
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulamos los datos de la base de datos
      const mockFeaturedFics: Fic[] = [
        { id: 1, title: "El viaje inesperado", author: "Ana García", coverImage: "/book-cover-1.jpg" },
        { id: 2, title: "Sueños de libertad", author: "Carlos Ruiz", coverImage: "/book-cover-2.jpg" },
        { id: 3, title: "El último suspiro", author: "María López", coverImage: "/book-cover-3.jpg" },
      ];
      
      const mockPopularFics: Fic[] = [
        { id: 1, title: "La ciudad de cristal", author: "Pedro Martínez", coverImage: "/popular-book-1.jpg", reads: 1200000, description: "Una historia épica de superación en un mundo de cristal..." },
        { id: 2, title: "Ecos del pasado", author: "Laura Sánchez", coverImage: "/popular-book-2.jpg", reads: 980000, description: "Un misterio que atraviesa generaciones..." },
        { id: 3, title: "El jardín secreto", author: "Juan Pérez", coverImage: "/popular-book-3.jpg", reads: 850000, description: "Descubre los secretos ocultos en un jardín mágico..." },
      ];

      setFeaturedFics(mockFeaturedFics);
      setPopularFics(mockPopularFics);
    };

    fetchFics();

    // Simular carga de notificaciones
    const mockNotifications: Notification[] = [
      { id: 1, message: "Nuevo capítulo disponible en 'El viaje inesperado'", date: "2023-06-15" },
      { id: 2, message: "Carlos Ruiz ha publicado una nueva historia", date: "2023-06-14" },
      { id: 3, message: "Tu historia 'Sueños de libertad' ha recibido 100 me gusta", date: "2023-06-13" },
    ];
    setNotifications(mockNotifications);

    // Cerrar el menú de notificaciones al hacer clic fuera de él
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-3">
                <FaBook className="h-8 w-8 text-purple-400" />
                <span className="hidden font-bold text-xl sm:inline-block text-purple-400">Ficnation</span>
              </Link>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <Link href="/explore" className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium">
                  {language === 'es' ? 'Descubrir' : 'Explore'}
                </Link>
                <Link href="../editor" className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium">
                  {language === 'es' ? 'Crear' : 'Create'}
                </Link>
                <Link href="/library" className="text-gray-300 hover:text-purple-400 px-3 py-2 text-sm font-medium">
                  <FaBookmark className="inline-block mr-1" />
                  {language === 'es' ? 'Biblioteca' : 'Library'}
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  className="w-full md:w-64 pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-full text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder={language === 'es' ? 'Buscar' : 'Search'}
                  type="search"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              <div className="relative" ref={notificationRef}>
                <button 
                  className="p-2 text-gray-400 hover:text-purple-400"
                  onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                >
                  <FaBell className="h-6 w-6" />
                  <span className="sr-only">{language === 'es' ? 'Notificaciones' : 'Notifications'}</span>
                </button>
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg py-1 z-50"
                    >
                      <div className="px-4 py-2 text-sm font-semibold text-gray-200 border-b border-gray-700">
                        {language === 'es' ? 'Notificaciones' : 'Notifications'}
                      </div>
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div key={notification.id} className="px-4 py-2 hover:bg-gray-700">
                            <p className="text-sm text-gray-300">{notification.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-400">
                          {language === 'es' ? 'No hay notificaciones' : 'No notifications'}
                        </div>
                      )}
                      <div className="px-4 py-2 text-xs text-center border-t border-gray-700">
                        <Link href="/notifications" className="text-purple-400 hover:underline">
                          {language === 'es' ? 'Ver todas las notificaciones' : 'View all notifications'}
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <button onClick={() => setIsSettingsOpen(true)} className="p-2 text-gray-400 hover:text-purple-400">
                <FaCog className="h-6 w-6" />
                <span className="sr-only">{language === 'es' ? 'Configuración' : 'Settings'}</span>
              </button>
              <button onClick={toggleLanguage} className="p-2 text-gray-400 hover:text-purple-400">
                <FaGlobe className="h-6 w-6" />
                <span className="sr-only">{language === 'es' ? 'Cambiar idioma' : 'Change language'}</span>
              </button>
              <button className="p-2 text-gray-400 hover:text-purple-400">
              <Link href="../profile" className="p-2 text-gray-400 hover:text-purple-400">
                <FaUser className="h-6 w-6" />
                <span className="sr-only">{language === 'es' ? 'Perfil' : 'Profile'}</span>
                </Link>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center"
          >
            <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">{language === 'es' ? 'Configuración' : 'Settings'}</h2>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="audio-file">
                  {language === 'es' ? 'Seleccionar archivo MP3' : 'Select MP3 file'}
                </label>
                <input
                  id="audio-file"
                  type="file"
                  accept="audio/mpeg"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2" htmlFor="background-file">
                  {language === 'es' ? 'Seleccionar imagen de fondo (PNG o GIF)' : 'Select background image (PNG or GIF)'}
                </label>
                <input
                  id="background-file"
                  type="file"
                  accept="image/png,image/gif"
                  onChange={handleBackgroundChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
                />
              </div>
              <div className="flex justify-between">
                <button
                  onClick={togglePlay}
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                  disabled={!audioFile}
                >
                  {isPlaying ? <FaPause className="inline mr-2" /> : <FaPlay className="inline mr-2" />}
                  {isPlaying ? (language === 'es' ? 'Pausar' : 'Pause') : (language === 'es' ? 'Reproducir' : 'Play')}
                </button>
                <button
                  onClick={() => setIsSettingsOpen(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                >
                  {language === 'es' ? 'Cerrar' : 'Close'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} loop />

      <main className="flex-1">
        <motion.section 
          className="w-full py-12 md:py-24 lg:py-32 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-4 text-center">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
                  {language === 'es' ? 'Descubre historias increíbles' : 'Discover incredible stories'}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-200 md:text-xl">
                  {language === 'es' 
                    ? 'Sumérgete en un mundo de historias escritas por autores de todo el mundo.'
                    : 'Immerse yourself in a world of stories written by authors from all over the world.'}
                </p>
              </motion.div>
              <motion.div 
                className="space-x-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <button className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition duration-300">
                  {language === 'es' ? 'Empezar a leer' : 'Start reading'}
                </button>
                <button className="px-4 py-2 bg-transparent text-purple-400 border border-purple-400 rounded-full hover:bg-purple-400 hover:text-gray-900 transition duration-300">
                  {language === 'es' ? 'Empezar a escribir' : 'Start writing'}
                </button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {featuredFics.length > 0 && (
          <motion.section 
            className="w-full py-12 md:py-24 lg:py-32"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-purple-400">
                {language === 'es' ? 'Historias destacadas' : 'Featured stories'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {featuredFics.map((fic) => (
                  <motion.div key={fic.id} whileHover={{ scale: 1.05 }} className="flex flex-col items-center space-y-2">
                    <Image
                      src={fic.coverImage}
                      alt={`${language === 'es' ? 'Portada de' : 'Cover of'} ${fic.title}`}
                      width={200}
                      height={300}
                      className="aspect-[2/3] overflow-hidden rounded-lg object-cover"
                    />
                    <div className="text-center">
                      <h3 className="font-semibold text-gray-100">{fic.title}</h3>
                      <p className="text-sm text-gray-400">{fic.author}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {popularFics.length > 0 && (
          <motion.section 
            className="w-full py-12 md:py-24 lg:py-32 bg-gray-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 1 }}
          >
            <div className="container px-4 md:px-6">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-8 text-purple-400">
                {language === 'es' ? 'Historias populares' : 'Popular stories'}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {popularFics.map((fic) => (
                  <div key={fic.id} className="flex items-start space-x-4">
                    <Image
                      src={fic.coverImage}
                      alt={`${language === 'es' ? 'Portada de' : 'Cover of'} ${fic.title}`}
                      width={100}
                      height={150}
                      className="aspect-[2/3] overflow-hidden rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-100">{fic.title}</h3>
                      <p className="text-sm text-gray-400">{fic.author}</p>
                      <p className="text-sm text-purple-400">{fic.reads?.toLocaleString()} {language === 'es' ? 'lecturas' : 'reads'}</p>
                      <p className="text-sm text-gray-300">{fic.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-800">
        <p className="text-xs text-gray-400">
          © 2023 Ficnation. {language === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400">
            {language === 'es' ? 'Términos de servicio' : 'Terms of Service'}
          </Link>
          <Link href="/privacy" className="text-xs hover:underline underline-offset-4 text-gray-400 hover:text-purple-400">
            {language === 'es' ? 'Privacidad' : 'Privacy'}
          </Link>
        </nav>
      </footer>
    </div>
  );
}