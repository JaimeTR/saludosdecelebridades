
import React, { useState, useEffect } from 'react';
import { ShoutoutPackage } from '../../types';
import Input, { Textarea } from '../common/Input';
import Button from '../common/Button';
import { PACKAGES } from '../../constants';
import { generateGreetingIdea } from '../../services/geminiService'; 
import { SparklesIcon, GiftIcon } from '../../constants';

interface RequestFormProps {
  selectedPackageId?: string;
  onSubmit: (details: {
    packageId: string;
    recipientName: string;
    occasion: string;
    messageDetails: string;
  }) => Promise<void>;
  isSubmitting: boolean;
}

const RequestForm: React.FC<RequestFormProps> = ({ selectedPackageId, onSubmit, isSubmitting }) => {
  const [packageId, setPackageId] = useState(selectedPackageId || PACKAGES[0]?.id || '');
  const [recipientName, setRecipientName] = useState('');
  const [occasion, setOccasion] = useState('');
  const [messageDetails, setMessageDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isGeneratingIdea, setIsGeneratingIdea] = useState(false);
  const [greetingIdeas, setGreetingIdeas] = useState<string[]>([]);
  const [rawGreetingIdeaText, setRawGreetingIdeaText] = useState('');

  useEffect(() => {
    if (selectedPackageId) {
      setPackageId(selectedPackageId);
    }
  }, [selectedPackageId]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!packageId) newErrors.packageId = 'Por favor selecciona un paquete.';
    if (!recipientName.trim()) newErrors.recipientName = "El nombre del destinatario es requerido.";
    if (!occasion.trim()) newErrors.occasion = 'La ocasión es requerida.';
    if (!messageDetails.trim()) newErrors.messageDetails = 'Los detalles del mensaje son requeridos.';
    else if (messageDetails.trim().length < 10) newErrors.messageDetails = 'Los detalles del mensaje deben tener al menos 10 caracteres.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit({ packageId, recipientName, occasion, messageDetails });
    }
  };

  const parseIdeas = (text: string): string[] => {
    if (!text) return [];
    return text.split(/\n-\s*/).map(idea => idea.trim()).filter(idea => idea.length > 0);
  }

  const handleGenerateIdea = async () => {
    if (!occasion || !recipientName) {
      setRawGreetingIdeaText("Por favor, ingresa el nombre del destinatario y la ocasión primero para obtener una idea.");
      setGreetingIdeas([]);
      return;
    }
    setIsGeneratingIdea(true);
    setRawGreetingIdeaText('');
    setGreetingIdeas([]);
    try {
      const ideaText = await generateGreetingIdea(occasion, recipientName);
      setRawGreetingIdeaText(ideaText);
      setGreetingIdeas(parseIdeas(ideaText));
    } catch (error) {
      console.error("Error al generar idea de saludo:", error);
      setRawGreetingIdeaText("No se pudo generar una idea en este momento. Intenta de nuevo más tarde.");
      setGreetingIdeas([]);
    } finally {
      setIsGeneratingIdea(false);
    }
  };

  const handleUseIdea = (idea: string) => {
    setMessageDetails(idea);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-lg shadow-xl">
      <div>
        <label htmlFor="packageId" className="block text-sm font-medium text-gray-700 mb-1">
          Selecciona Paquete
        </label>
        <select
          id="packageId"
          name="packageId"
          value={packageId}
          onChange={(e) => setPackageId(e.target.value)}
          className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.packageId ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
        >
          {PACKAGES.map(p => (
            <option key={p.id} value={p.id}>
              {p.name} (${p.price.toFixed(2)})
            </option>
          ))}
        </select>
        {errors.packageId && <p className="mt-1 text-sm text-red-600">{errors.packageId}</p>}
      </div>

      <Input
        label="Nombre del Destinatario"
        name="recipientName"
        type="text"
        value={recipientName}
        onChange={(e) => setRecipientName(e.target.value)}
        error={errors.recipientName}
        placeholder="Ej: Juan Pérez"
        required
      />
      <Input
        label="Ocasión"
        name="occasion"
        type="text"
        value={occasion}
        onChange={(e) => setOccasion(e.target.value)}
        error={errors.occasion}
        placeholder="Ej: Cumpleaños, Aniversario, Graduación"
        required
      />
      <Textarea
        label="Detalles del Mensaje"
        name="messageDetails"
        value={messageDetails}
        onChange={(e) => setMessageDetails(e.target.value)}
        error={errors.messageDetails}
        placeholder="Cuéntanos qué te gustaría que dijera el famoso. ¡Sé específico!"
        required
      />
      
      <div className="my-4">
        <Button 
          type="button" 
          onClick={handleGenerateIdea} 
          isLoading={isGeneratingIdea}
          variant="ghost"
          size="sm"
          leftIcon={<SparklesIcon className="w-4 h-4 text-yellow-500" />}
        >
          {isGeneratingIdea ? 'Generando...' : 'Obtener Idea de Mensaje (IA)'}
        </Button>
        {rawGreetingIdeaText && (
          <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-700">
            <p className="font-semibold mb-2">Sugerencia(s) de la IA:</p>
            {greetingIdeas.length > 0 ? (
              <ul className="space-y-2">
                {greetingIdeas.map((idea, index) => (
                  <li key={index} className="flex items-start justify-between">
                    <span className="flex-1 mr-2">- {idea}</span>
                    <Button
                      type="button"
                      onClick={() => handleUseIdea(idea)}
                      size="sm"
                      variant="secondary" // Or another subtle variant
                      className="px-2 py-1 text-xs"
                      leftIcon={<GiftIcon className="w-3 h-3"/>}
                    >
                      Usar
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="whitespace-pre-line">{rawGreetingIdeaText}</p> // Show raw text if parsing fails or one idea
            )}
          </div>
        )}
      </div>

      <Button type="submit" isLoading={isSubmitting} className="w-full" variant="primary" size="lg">
        {isSubmitting ? 'Enviando Solicitud...' : 'Enviar Solicitud'}
      </Button>
    </form>
  );
};

export default RequestForm;
