
import React, { useState } from 'react';
import {
  Upload,
  FileText,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Database
} from 'lucide-react';
import { financialRecordService, categoryService, userService } from '../services/api';

export const ImportCSV: React.FC = () => {
  const [step, setStep] = useState(1);
  const [csvPreview, setCsvPreview] = useState<string[][]>([]);
  const [importStatus, setImportStatus] = useState<'IDLE' | 'PROCESSING' | 'SUCCESS'>('IDLE');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(',')).filter(r => r.length > 1);
      setCsvPreview(rows);
      setStep(2);
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    setImportStatus('PROCESSING');
    const recordsToImport = csvPreview.slice(1);
    const cats = await categoryService.getAll();
    const defaultCat = cats[0];
    const user = (await userService.getUsers())[0];

    for (const row of recordsToImport) {
      await financialRecordService.create({
        type: parseFloat(row[1]) < 0 ? 'EXPENSE' : 'INCOME',
        amount: Math.abs(parseFloat(row[1]) || 0),
        date: new Date().toISOString().split('T')[0],
        description: `Importado: ${row[2]}`,
        categoryId: defaultCat.id,
        householdId: 1,
        payerUserId: user.id
      });
    }

    setTimeout(() => {
      setImportStatus('SUCCESS');
      setStep(3);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Importar Extrato Bancário</h1>
        <p className="text-gray-500 mt-2">Carregue o ficheiro CSV do seu banco para categorizar movimentos.</p>
      </div>

      <div className="flex items-center gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= i ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>{i}</div>
            {i < 3 && <ChevronRight className="text-gray-300" size={16} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="bg-white p-12 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center"><Upload size={32} /></div>
          <div>
            <h3 className="text-lg font-bold">Selecione o Ficheiro CSV</h3>
            <p className="text-gray-500">Os dados são processados apenas localmente.</p>
          </div>
          <input type="file" id="csv-upload" accept=".csv" className="hidden" onChange={handleFileUpload} />
          <label htmlFor="csv-upload" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 cursor-pointer">Escolher Ficheiro</label>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white rounded-2xl border overflow-hidden shadow-sm">
          <div className="p-6 border-b flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2"><FileText size={20} /> Pré-visualização</h3>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full uppercase">Mapeamento Padrão</span>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="border-b">
                  {csvPreview[0].map((h, i) => <th key={i} className="px-4 py-3 font-semibold">{h}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y">
                {csvPreview.slice(1, 10).map((row, i) => (
                  <tr key={i}>{row.map((cell, j) => <td key={j} className="px-4 py-3 text-gray-500">{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-6 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-500">{csvPreview.length - 1} transações encontradas.</p>
            <button onClick={processImport} disabled={importStatus === 'PROCESSING'} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold">
              {importStatus === 'PROCESSING' ? 'A Processar...' : 'Confirmar Importação'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white p-12 rounded-2xl border text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 size={40} /></div>
          <h2 className="text-2xl font-bold">Importação Concluída!</h2>
          <div className="flex gap-4 justify-center">
            <button onClick={() => window.location.hash = '#/records'} className="bg-gray-100 px-6 py-3 rounded-xl font-bold">Ver Registos</button>
            <button onClick={() => setStep(1)} className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold">Nova Importação</button>
          </div>
        </div>
      )}
    </div>
  );
};
