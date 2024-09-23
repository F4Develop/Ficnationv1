'use client';

import { useState } from 'react';
import { FaUpload, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function FanficEditor() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [isAdult, setIsAdult] = useState(false);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [language, setLanguage] = useState('es');

  const handleCoverImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setCoverImage(file);
    } else {
      alert(language === 'es' ? 'Por favor, selecciona una imagen JPEG o PNG válida.' : 'Please select a valid JPEG or PNG image.');
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Crear un objeto FormData para manejar la imagen
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('genre', genre);
    formData.append('isAdult', isAdult.toString());
    if (coverImage) {
      formData.append('coverImage', coverImage);
    }

    try {
      const response = await fetch('/api/fanfics', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al guardar el fanfic');
      }

      const data = await response.json();
      
      if (data.success) {
        alert(language === 'es' ? 'Fanfic guardado con éxito!' : 'Fanfic saved successfully!');
        // Aquí podrías redirigir al usuario a la página de edición de capítulos
        // router.push(`/editor/chapters/${data.id}`);
      } else {
        throw new Error(data.error || 'Error desconocido');
      }
    } catch (error) {
      console.error(error);
      alert(language === 'es' ? 'Error al guardar el fanfic' : 'Error saving fanfic');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <header className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/dashboard" className="text-2xl font-bold text-purple-400">Ficnation</Link>
          <nav>
            <button onClick={() => setLanguage(lang => lang === 'es' ? 'en' : 'es')} className="text-gray-300 hover:text-purple-400">
              {language === 'es' ? 'EN' : 'ES'}
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto mt-8 px-4">
        <h1 className="text-3xl font-bold mb-8">{language === 'es' ? 'Configurar nuevo fanfic' : 'Configure new fanfic'}</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'es' ? 'Título' : 'Title'}
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'es' ? 'Descripción' : 'Description'}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={3}
            ></textarea>
          </div>

          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'es' ? 'Género' : 'Genre'}
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">{language === 'es' ? 'Selecciona un género' : 'Select a genre'}</option>
              <option value="fantasy">{language === 'es' ? 'Fantasía' : 'Fantasy'}</option>
              <option value="scifi">{language === 'es' ? 'Ciencia Ficción' : 'Sci-Fi'}</option>
              <option value="romance">{language === 'es' ? 'Romance' : 'Romance'}</option>
              <option value="mystery">{language === 'es' ? 'Misterio' : 'Mystery'}</option>
            </select>
          </div>

          <div>
            <label htmlFor="cover-image" className="block text-sm font-medium text-gray-300 mb-2">
              {language === 'es' ? 'Imagen de portada' : 'Cover image'}
            </label>
            <input
              type="file"
              id="cover-image"
              accept="image/jpeg,image/png"
              onChange={handleCoverImageChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isAdult"
              checked={isAdult}
              onChange={(e) => setIsAdult(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="isAdult" className="ml-2 block text-sm text-gray-300">
              {language === 'es' ? 'Contenido para adultos (+18)' : 'Adult content (+18)'}
            </label>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center"
            >
              <FaSave className="mr-2" />
              {language === 'es' ? 'Guardar configuración' : 'Save configuration'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}