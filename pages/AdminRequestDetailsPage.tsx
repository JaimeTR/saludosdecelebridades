
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '../components/common/PageContainer';
import { getRequestById, updateRequestStatus } from '../services/shoutoutService';
import { ShoutoutRequest, ShoutoutRequestStatus } from '../types';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { Textarea } from '../components/common/Input';
import { generateImageWithImagen, generarSugerenciasAdmin, AdminSuggestions } from '../services/geminiService';
import { SparklesIcon, translateShoutoutRequestStatus, GiftIcon } from '../constants'; // Added GiftIcon

const AdminRequestDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<ShoutoutRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [celebrityMessageToFan, setCelebrityMessageToFan] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [isGeneratingAISuggestions, setIsGeneratingAISuggestions] = useState(false);
  const [aiSuggestions, setAISuggestions] = useState<AdminSuggestions | null>(null);
  const [parsedScriptSuggestions, setParsedScriptSuggestions] = useState<string[]>([]);
  const [parsedAdminNoteSuggestions, setParsedAdminNoteSuggestions] = useState<string[]>([]);
  const [generatedImageConceptUrl, setGeneratedImageConceptUrl] = useState<string | null>(null); // Stores the image URL generated in *this session*
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const parseSuggestions = (text: string | undefined): string[] => {
    if (!text) return [];
    return text.split(/\n-\s*/).map(idea => idea.trim()).filter(idea => idea.length > 0 && idea !== "-");
  };

  const fetchRequestDetails = useCallback(async () => {
    if (!id) {
      setError("ID de solicitud faltante.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const reqData = await getRequestById(id);
      if (reqData) {
        setRequest(reqData);
        setAdminNotes(reqData.adminNotes || '');
        setCelebrityMessageToFan(reqData.celebrityMessageToFan || '');
        setVideoUrl(reqData.videoUrl || '');
        // Do not set generatedImageConceptUrl from reqData here, as it's for the current session's generation.
        // reqData.aiImageConceptUrl is the one already saved for the fan.
      } else {
        setError('Solicitud no encontrada.');
      }
    } catch (err: any) {
      setError(err.message || 'Error al cargar detalles de la solicitud.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetails();
  }, [id, fetchRequestDetails]);

  useEffect(() => {
    if (aiSuggestions?.videoScriptSuggestion) {
        setParsedScriptSuggestions(parseSuggestions(aiSuggestions.videoScriptSuggestion));
    } else {
        setParsedScriptSuggestions([]);
    }
    if (aiSuggestions?.adminNoteSuggestion) {
        setParsedAdminNoteSuggestions(parseSuggestions(aiSuggestions.adminNoteSuggestion));
    } else {
        setParsedAdminNoteSuggestions([]);
    }
  }, [aiSuggestions]);


  const handleUpdateStatus = async (newStatus: ShoutoutRequestStatus) => {
    if (!id || !request) return;
    setIsUpdating(true);
    setError(null);
    try {
      // If completing request and an image concept was generated in this session, pass its URL.
      const imageConceptUrlToSave = (newStatus === ShoutoutRequestStatus.COMPLETED && generatedImageConceptUrl) 
                                      ? generatedImageConceptUrl 
                                      : request.aiImageConceptUrl; // Preserve existing if not overridden

      const updatedRequest = await updateRequestStatus(
        id, 
        newStatus, 
        adminNotes, 
        videoUrl, 
        celebrityMessageToFan,
        imageConceptUrlToSave 
      );
      setRequest(updatedRequest);
      if (newStatus === ShoutoutRequestStatus.COMPLETED && generatedImageConceptUrl) {
        // If we just completed and sent the generated image, clear the session's generated image
        // to avoid resending it if admin makes further non-complete updates then re-completes.
        // Or, rely on the fact that `imageConceptUrlToSave` logic will use `request.aiImageConceptUrl`
        // which is now populated. For clarity, perhaps best to leave generatedImageConceptUrl as is,
        // it represents what admin *currently* sees as generated.
      }
      // Optionally show a success message
    } catch (err: any) {
      setError(err.message || 'Error al actualizar estado.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleGenerateAISuggestions = async () => {
    if (!request) return;
    setIsGeneratingAISuggestions(true);
    setAISuggestions(null);
    try {
      const suggestions = await generarSugerenciasAdmin(request.occasion, request.recipientName, request.messageDetails);
      setAISuggestions(suggestions);
    } catch (error) {
      console.error("Error al generar sugerencias IA para admin:", error);
      setAISuggestions({ videoScriptSuggestion: "Error al generar.", adminNoteSuggestion: "Error al generar."});
    } finally {
      setIsGeneratingAISuggestions(false);
    }
  };
  
  const handleGenerateImageConcept = async () => {
    if(!request) return;
    setIsGeneratingImage(true);
    setGeneratedImageConceptUrl(null); // Clear previous session-generated image
    setError(null);
    try {
      const prompt = `Concepto de imagen para un saludo de ${request.occasion} para ${request.recipientName}. Mensaje clave: ${request.messageDetails.substring(0,100)}`;
      const imageUrl = await generateImageWithImagen(prompt);
      setGeneratedImageConceptUrl(imageUrl); // Store the newly generated image URL in state
    } catch (err: any) {
       setError(err.message || "Error al generar concepto de imagen.");
       console.error("Error generando imagen:", err);
    } finally {
        setIsGeneratingImage(false);
    }
  };


  if (loading) {
    return <PageContainer title="Detalles de Solicitud"><LoadingSpinner message="Cargando detalles de la solicitud..." /></PageContainer>;
  }

  if (error && !request) { 
    return <PageContainer title="Detalles de Solicitud"><p className="text-red-500 text-center">{error}</p></PageContainer>;
  }
  
  if (!request) {
    return <PageContainer title="Detalles de Solicitud"><p className="text-center">Solicitud no encontrada.</p></PageContainer>;
  }


  const availableStatuses = Object.values(ShoutoutRequestStatus);
  // Display either the image generated in this session, or the one already saved with the request
  const displayImageConceptUrl = generatedImageConceptUrl || request.aiImageConceptUrl;

  return (
    <PageContainer title={`Detalles de Solicitud: ${request.id.substring(0,8)}...`}>
      <div className="bg-white shadow-xl rounded-lg p-8">
        {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div><strong className="text-gray-600">Destinatario:</strong> <span className="text-gray-800 text-lg">{request.recipientName}</span></div>
          <div><strong className="text-gray-600">Ocasión:</strong> <span className="text-gray-800">{request.occasion}</span></div>
          <div><strong className="text-gray-600">Solicitado Por:</strong> <span className="text-gray-800">{request.userName} ({request.userId})</span></div>
          <div><strong className="text-gray-600">Paquete:</strong> <span className="text-gray-800">{request.packageName} (${request.packagePrice.toFixed(2)})</span></div>
          <div><strong className="text-gray-600">Solicitado el:</strong> <span className="text-gray-800">{new Date(request.requestedAt).toLocaleString('es-ES')}</span></div>
          <div><strong className="text-gray-600">Estado Actual:</strong> <span className="font-semibold text-indigo-600">{translateShoutoutRequestStatus(request.status)}</span></div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Detalles del Mensaje del Fan:</h4>
          <p className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">{request.messageDetails}</p>
        </div>
        
        {request.status === ShoutoutRequestStatus.COMPLETED && request.videoUrl && (
           <div className="mt-6 pt-6 border-t">
             <h4 className="text-lg font-semibold text-gray-700 mb-2">URL del Video:</h4>
             <a href={request.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">{request.videoUrl}</a>
           </div>
        )}
         {request.status === ShoutoutRequestStatus.COMPLETED && request.aiImageConceptUrl && !generatedImageConceptUrl && (
           <div className="mt-6 pt-6 border-t">
             <h4 className="text-lg font-semibold text-gray-700 mb-2">Imagen Conceptual Enviada al Fan:</h4>
             <img src={request.aiImageConceptUrl} alt="Concepto visual enviado" className="rounded-md shadow-md max-w-xs mt-2"/>
           </div>
        )}


        <div className="mt-6 pt-6 border-t">
          <h4 className="text-lg font-semibold text-gray-700 mb-1">Asistencia IA para Admin</h4>
           <div className="flex space-x-2 mb-3">
            <Button
                type="button"
                onClick={handleGenerateAISuggestions}
                isLoading={isGeneratingAISuggestions}
                variant="ghost"
                size="sm"
                leftIcon={<SparklesIcon className="w-4 h-4 text-yellow-500" />}
            >
                {isGeneratingAISuggestions ? 'Generando...' : 'Sugerencias de Guion/Notas'}
            </Button>
            <Button
                type="button"
                onClick={handleGenerateImageConcept}
                isLoading={isGeneratingImage}
                variant="ghost"
                size="sm"
                leftIcon={<SparklesIcon className="w-4 h-4 text-purple-500" />}
            >
                {isGeneratingImage ? 'Creando...' : 'Idea Visual (Imagen IA)'}
            </Button>
          </div>
          {aiSuggestions && (
            <div className="mt-2 p-3 bg-indigo-50 border border-indigo-200 rounded-md text-sm text-indigo-800 space-y-3">
              {parsedScriptSuggestions.length > 0 && (
                <div>
                  <p className="font-semibold mb-1">Sugerencias de Guion:</p>
                  <ul className="space-y-2 pl-2">
                    {parsedScriptSuggestions.map((idea, index) => (
                      <li key={`script-${index}`} className="flex items-start justify-between">
                        <span className="flex-1 mr-2">- {idea}</span>
                        <Button
                          type="button"
                          onClick={() => setCelebrityMessageToFan(idea)}
                          size="sm" variant="secondary" className="px-2 py-1 text-xs whitespace-nowrap"
                          leftIcon={<GiftIcon className="w-3 h-3"/>}
                        >
                          Usar para Fan
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {parsedAdminNoteSuggestions.length > 0 && (
                 <div>
                  <p className="font-semibold mb-1">Sugerencias de Nota Administrativa:</p>
                   <ul className="space-y-2 pl-2">
                    {parsedAdminNoteSuggestions.map((idea, index) => (
                      <li key={`note-${index}`} className="flex items-start justify-between">
                        <span className="flex-1 mr-2">- {idea}</span>
                        <Button
                          type="button"
                          onClick={() => setAdminNotes(idea)}
                          size="sm" variant="secondary" className="px-2 py-1 text-xs whitespace-nowrap"
                          leftIcon={<GiftIcon className="w-3 h-3"/>}
                        >
                          Usar para Admin
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
               {(parsedScriptSuggestions.length === 0 && parsedAdminNoteSuggestions.length === 0 && aiSuggestions.videoScriptSuggestion && aiSuggestions.videoScriptSuggestion !== "Error al generar." ) && (
                  <p className="whitespace-pre-line">{aiSuggestions.videoScriptSuggestion} <br/> {aiSuggestions.adminNoteSuggestion}</p> // Fallback for non-parsed
               )}
            </div>
          )}
          {generatedImageConceptUrl && ( // Show the image generated in THIS session
             <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-md">
                <p className="font-semibold text-purple-700">Concepto Visual Generado (en esta sesión):</p>
                <img src={generatedImageConceptUrl} alt="Concepto visual generado por IA en esta sesión" className="rounded-md shadow-md max-w-xs mt-2"/>
                <p className="text-xs text-purple-600 mt-1">Esta imagen se incluirá para el fan si completas la solicitud ahora.</p>
             </div>
          )}
        </div>


        <div className="mt-6 pt-6 border-t">
          <h4 className="text-lg font-semibold text-gray-700 mb-2">Acciones Administrativas:</h4>
          <div className="space-y-4">
            <Textarea
              label="Notas Administrativas (Internas)"
              name="adminNotes"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Notas internas sobre esta solicitud..."
            />
             <Textarea
              label="Mensaje del Famoso para el Fan (Visible al completar)"
              name="celebrityMessageToFan"
              value={celebrityMessageToFan}
              onChange={(e) => setCelebrityMessageToFan(e.target.value)}
              placeholder="Mensaje especial que verá el fan junto al video..."
            />
            {/* Only allow editing videoURL if status is not yet COMPLETED, or if it is COMPLETED (to allow correction) */}
            {/* Or, simplify: always allow editing, but it only matters for COMPLETED status. */}
            <Textarea
              label="URL del Video (al completar)"
              name="videoUrl"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://ejemplo.com/video.mp4"
              disabled={isUpdating}
            />
            
            <div className="flex flex-wrap gap-3">
              {availableStatuses.map(status => (
                <Button
                  key={status}
                  onClick={() => handleUpdateStatus(status)}
                  isLoading={isUpdating && request.status !== status} // Show loading only on the button being processed
                  disabled={isUpdating} // Disable all status buttons during an update
                  variant={request.status === status ? 'primary' : 'ghost'}
                >
                  Marcar como: {translateShoutoutRequestStatus(status)}
                </Button>
              ))}
            </div>
            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </div>
        </div>

        <div className="mt-8 text-right">
          <Button variant="secondary" onClick={() => navigate('/admin/dashboard')}>
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default AdminRequestDetailsPage;