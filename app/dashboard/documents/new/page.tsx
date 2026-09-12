"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewDocumentPage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);
    // UUID mockado do Business que inserimos anteriormente no banco
    formData.append('businessId', 'f47ac10b-58cc-4372-a567-0e02b2c3d479');

    try {
      const response = await fetch('http://localhost:3001/documents/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Falha ao fazer upload do documento.');
      }

      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-gray-800">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Enviar Base de Conhecimento (PDF)</h1>
      
      {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">PDF enviado com sucesso! Redirecionando...</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Selecione o Arquivo PDF</label>
          <input 
            type="file" 
            accept="application/pdf"
            required
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !file}
          className="bg-blue-600 text-white font-medium px-4 py-2 rounded hover:bg-blue-700 w-full disabled:opacity-50 transition-colors"
        >
          {loading ? 'Enviando...' : 'Fazer Upload'}
        </button>
      </form>
    </div>
  );
}
