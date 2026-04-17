import { useState, useRef } from 'react';

export default function CsvImportModal({ isOpen, onClose, onImport, templateUrl, entityName }) {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef();

  if (!isOpen) return null;

  const handleClose = () => {
    setFile(null);
    setResult(null);
    setError('');
    onClose();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0] || null);
    setResult(null);
    setError('');
  };

  const handleDownloadTemplate = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(templateUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al descargar el template');
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'template.csv';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError('No se pudo descargar el template: ' + (err.message || 'Error desconocido'));
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Selecciona un archivo CSV primero.');
      return;
    }
    setIsLoading(true);
    setError('');
    setResult(null);
    try {
      const res = await onImport(file);
      setResult(res?.data || res || {});
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
    } catch (err) {
      setError(err?.message || err?.error || 'Error al importar el archivo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-gray-900">Importar {entityName} desde CSV</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="text-sm text-blue-600 hover:underline"
            >
              Descargar template CSV
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Archivo CSV</label>
            <input
              ref={inputRef}
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full text-sm text-gray-600 border border-gray-300 rounded px-3 py-2 file:mr-3 file:border-0 file:bg-gray-100 file:text-gray-700 file:text-xs file:px-3 file:py-1 file:rounded cursor-pointer"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded px-3 py-2 text-sm text-red-600">
              {error}
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded px-3 py-2 text-sm text-green-700 space-y-1">
              <p className="font-medium">Importacion completada</p>
              {result.imported !== undefined && <p>Importados: {result.imported}</p>}
              {result.skipped !== undefined && <p>Omitidos: {result.skipped}</p>}
              {result.errors && result.errors.length > 0 && (
                <div>
                  <p className="font-medium text-red-600 mt-1">Errores ({result.errors.length}):</p>
                  <ul className="list-disc list-inside text-red-600 text-xs max-h-24 overflow-y-auto">
                    {result.errors.map((e, i) => (
                      <li key={i}>{typeof e === 'string' ? e : JSON.stringify(e)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleImport}
            disabled={isLoading || !file}
            className="bg-honda-red text-white text-sm px-5 py-2 rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Importando...' : 'Importar'}
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="text-sm px-5 py-2 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
