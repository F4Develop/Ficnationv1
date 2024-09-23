'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCamera, FaEdit, FaBook, FaUsers, FaUserFriends } from 'react-icons/fa';

export default function UserProfile() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [language, setLanguage] = useState('es');
  const [profileImage, setProfileImage] = useState('/default-avatar.png');
  const [bannerImage, setBannerImage] = useState('/default-banner.jpg');
  const [isAdjustingBanner, setIsAdjustingBanner] = useState(false);
  const [bannerPosition, setBannerPosition] = useState({ x: 0, y: 0 });
  const [bannerScale, setBannerScale] = useState(1);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState({
    name: 'NombreUsuario',
    bio: 'Escritor apasionado de fanfics de ciencia ficción y fantasía.',
    joinDate: '2023-01-15',
    storiesCount: 12,
    followersCount: 256,
    followingCount: 84,
  });

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, setImage: (url: string) => void) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
      const url = URL.createObjectURL(file);
      setImage(url);
      if (setImage === setBannerImage) {
        setIsAdjustingBanner(true);
        setBannerPosition({ x: 0, y: 0 });
        setBannerScale(1);
      }
    } else {
      alert(language === 'es' ? 'Por favor, selecciona una imagen válida (JPEG, PNG o GIF).' : 'Please select a valid image (JPEG, PNG, or GIF).');
    }
  };

  const handleBannerDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    const startX = e.clientX - bannerPosition.x;
    const startY = e.clientY - bannerPosition.y;

    const onMouseMove = (moveEvent: MouseEvent) => {
      setBannerPosition({
        x: moveEvent.clientX - startX,
        y: moveEvent.clientY - startY,
      });
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const handleScaleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBannerScale(parseFloat(e.target.value));
  };

  const handleUsernameChange = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newUsername = (event.currentTarget.elements.namedItem('username') as HTMLInputElement).value;
    setUser(prevUser => ({ ...prevUser, name: newUsername }));
    setIsEditingUsername(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-purple-400 hover:text-purple-300 transition-colors">Ficnation</Link>
          <nav>
            <button onClick={() => setLanguage(lang => lang === 'es' ? 'en' : 'es')} className="text-gray-300 hover:text-purple-400 transition-colors">
              {language === 'es' ? 'EN' : 'ES'}
            </button>
          </nav>
        </div>
      </header>

      <main className={`container mx-auto mt-4 px-4 transition-all duration-1000 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="relative mb-24">
          <div className={`h-64 overflow-hidden rounded-t-lg relative shadow-xl transition-all duration-1000 delay-300 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div 
              className="absolute top-0 left-0 right-0 bottom-0"
              style={{
                transform: `translate(${bannerPosition.x}px, ${bannerPosition.y}px) scale(${bannerScale})`,
                transformOrigin: 'center',
              }}
            >
              <Image
                src={bannerImage}
                alt="Banner de perfil"
                layout="fill"
                objectFit="contain"
                quality={100}
              />
            </div>
            <button 
              onClick={() => bannerInputRef.current?.click()} 
              className="absolute top-2 right-2 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
            >
              <FaCamera className="text-white" />
            </button>
            <button 
              onClick={() => setIsAdjustingBanner(true)}
              className="absolute bottom-2 right-2 bg-gray-800 bg-opacity-50 p-2 rounded-full hover:bg-opacity-75 transition-all z-10"
            >
              <FaEdit className="text-white" />
            </button>
          </div>
          <input
            type="file"
            ref={bannerInputRef}
            className="hidden"
            onChange={(e) => handleImageUpload(e, setBannerImage)}
            accept="image/jpeg,image/png,image/gif"
          />
          <div className={`absolute -bottom-20 left-8 flex items-end transition-all duration-1000 delay-500 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-gray-900 bg-gray-800 shadow-xl flex-shrink-0 relative">
              <Image
                src={profileImage}
                alt="Foto de perfil"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
              <button 
                onClick={() => profileInputRef.current?.click()} 
                className="absolute bottom-2 right-2 bg-purple-600 p-2 rounded-full hover:bg-purple-700 transition-all"
              >
                <FaCamera className="text-white text-sm" />
              </button>
            </div>
            <input
              type="file"
              ref={profileInputRef}
              className="hidden"
              onChange={(e) => handleImageUpload(e, setProfileImage)}
              accept="image/jpeg,image/png,image/gif"
            />
            <div className="ml-6 mb-2">
              {isEditingUsername ? (
                <form onSubmit={handleUsernameChange} className="flex items-center">
                  <input
                    type="text"
                    name="username"
                    defaultValue={user.name}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                  />
                  <button type="submit" className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded">
                    {language === 'es' ? 'Guardar' : 'Save'}
                  </button>
                </form>
              ) : (
                <h1 className="text-3xl font-bold flex items-center">
                  {user.name}
                  <button 
                    onClick={() => setIsEditingUsername(true)}
                    className="ml-2 text-purple-400 hover:text-purple-300"
                  >
                    <FaEdit />
                  </button>
                </h1>
              )}
              <p className="text-purple-400 text-sm mt-1">
                <FaUsers className="inline mr-2" />
                {language === 'es' ? 'Miembro desde' : 'Member since'} {new Date(user.joinDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className={`bg-gray-800 rounded-lg shadow-xl p-6 mb-6 transition-all duration-1000 delay-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <p className="text-gray-300 mb-4">{user.bio}</p>
          <div className="flex justify-end space-x-6">
            <div className="text-center">
              <p className="text-2xl font-semibold">{user.storiesCount}</p>
              <p className="text-sm text-gray-400 flex items-center justify-center">
                <FaBook className="mr-1" />
                {language === 'es' ? 'Historias' : 'Stories'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{user.followersCount}</p>
              <p className="text-sm text-gray-400 flex items-center justify-center">
                <FaUsers className="mr-1" />
                {language === 'es' ? 'Seguidores' : 'Followers'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-semibold">{user.followingCount}</p>
              <p className="text-sm text-gray-400 flex items-center justify-center">
                <FaUserFriends className="mr-1" />
                {language === 'es' ? 'Siguiendo' : 'Following'}
              </p>
            </div>
          </div>
        </div>

        <div className={`bg-gray-800 rounded-lg shadow-xl p-6 transition-all duration-1000 delay-900 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <FaBook className="mr-2" />
            {language === 'es' ? 'Mis Historias' : 'My Stories'}
          </h2>
          <p className="text-gray-400 text-sm">
            {language === 'es' ? 'Lista de historias del usuario...' : 'User stories list...'}
          </p>
        </div>
      </main>

      {isAdjustingBanner && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-2xl">
            <h3 className="text-xl font-bold mb-4">
              {language === 'es' ? 'Ajustar imagen de banner' : 'Adjust banner image'}
            </h3>
            <div 
              className="relative w-full h-64 overflow-hidden mb-4 border-4 border-purple-500"
            >
              <div
                className="absolute cursor-move"
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `translate(${bannerPosition.x}px, ${bannerPosition.y}px) scale(${bannerScale})`,
                  transformOrigin: 'center',
                }}
                onMouseDown={handleBannerDrag}
              >
                <Image
                  src={bannerImage}
                  alt="Banner preview"
                  layout="fill"
                  objectFit="contain"
                  draggable={false}
                  quality={100}
                />
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="scale-slider" className="block text-sm font-medium text-gray-300 mb-2">
                {language === 'es' ? 'Escala de la imagen' : 'Image scale'}
              </label>
              <input
                id="scale-slider"
                type="range"
                min="0.1"
                max="10"
                step="0.1"
                value={bannerScale}
                onChange={handleScaleChange}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-400 mt-1">
                <span>0.1x</span>
                <span>{bannerScale.toFixed(1)}x</span>
                <span>10x</span>
              </div>
            </div>
            <p className="text-sm mb-4">
              {language === 'es' 
                ? 'Arrastra la imagen para ajustar la posición del banner y usa el deslizador para ajustar la escala.' 
                : 'Drag the image to adjust the banner position and use the slider to adjust the scale.'}
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={() => setIsAdjustingBanner(false)} 
                className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700"
              >
                {language === 'es' ? 'Cerrar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}