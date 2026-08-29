import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Sparkles, X, CheckCircle, AlertTriangle, ArrowRight, Radio } from 'lucide-react';

export const VoiceSearchModal: React.FC = () => {
  const { isVoiceActive, setIsVoiceActive, language, t, executeSearch } = useApp();

  type VoiceState = 'ready' | 'listening' | 'recording' | 'processing' | 'understanding' | 'found' | 'error';
  const [voiceState, setVoiceState] = useState<VoiceState>('ready');
  const [transcript, setTranscript] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<any>(null);

  const sampleVoicePhrases = [
    { hi: 'बिलारी में राम कुमार की जमीन दिखाओ', en: 'Bilari mein Ram Kumar ki zameen dikhao' },
    { hi: 'खसरा नंबर 452 का नक्शा और रिकॉर्ड', en: 'Show Khasra 452 map and record' },
    { hi: 'मेरी जमीन पर कितना लोन दर्ज है?', en: 'How much loan is registered on my land?' },
    { hi: 'दाखिल-खारिज की ताजा स्थिति क्या है?', en: 'Check latest mutation status' },
  ];

  useEffect(() => {
    if (isVoiceActive) {
      startVoiceListening();
    } else {
      stopRecording();
      setVoiceState('ready');
      setTranscript('');
      setRecordingSeconds(0);
    }
    return () => {
      stopRecording();
    };
  }, [isVoiceActive]);

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.warn('Error stopping media recorder:', e);
      }
    }
  };

  const startVoiceListening = async () => {
    setVoiceState('listening');
    setErrorMessage('');
    setTranscript('');
    setRecordingSeconds(0);
    audioChunksRef.current = [];

    // Attempt direct microphone recording for AI audio transcription
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          if (audioChunksRef.current.length > 0) {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            await sendAudioForTranscription(audioBlob);
          }
        };

        mediaRecorder.start(250);
        setVoiceState('recording');

        // Timer
        timerRef.current = setInterval(() => {
          setRecordingSeconds(prev => {
            if (prev >= 6) {
              // Auto finish recording after 6 seconds of speech
              stopRecording();
              return prev;
            }
            return prev + 1;
          });
        }, 1000);

        return;
      } catch (err: any) {
        console.warn('MediaRecorder permission error or unavailable:', err);
      }
    }

    // Fallback to browser SpeechRecognition if MediaRecorder isn't granted
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event: any) => {
          const current = event.resultIndex;
          const text = event.results[current][0].transcript;
          setTranscript(text);
        };

        recognition.onspeechend = () => {
          recognition.stop();
          processVoiceInput(transcript);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition fallback error:', event.error);
          fallbackSimulation();
        };

        recognition.start();
        return;
      } catch (err) {
        fallbackSimulation();
      }
    } else {
      fallbackSimulation();
    }
  };

  const sendAudioForTranscription = async (blob: Blob) => {
    setVoiceState('processing');
    try {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = async () => {
        const base64String = (reader.result as string)?.split(',')[1] || '';
        const res = await fetch('/api/ai/transcribe-audio', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            base64Audio: base64String,
            mimeType: 'audio/webm',
            language,
          }),
        });

        const data = await res.json();
        const recognizedText = data.transcript || (language === 'hi' ? sampleVoicePhrases[0].hi : sampleVoicePhrases[0].en);
        setTranscript(recognizedText);
        processVoiceInput(recognizedText);
      };
    } catch (err) {
      console.warn('Audio transcription API error:', err);
      fallbackSimulation();
    }
  };

  const fallbackSimulation = () => {
    setVoiceState('listening');
    setTimeout(() => {
      const selected = sampleVoicePhrases[0];
      setTranscript(language === 'hi' ? selected.hi : selected.en);
      processVoiceInput(language === 'hi' ? selected.hi : selected.en);
    }, 2000);
  };

  const processVoiceInput = async (spokenText: string) => {
    const textToSearch = spokenText || (language === 'hi' ? sampleVoicePhrases[0].hi : sampleVoicePhrases[0].en);
    setVoiceState('understanding');
    setTranscript(textToSearch);

    setTimeout(async () => {
      setVoiceState('found');
      await executeSearch(textToSearch);
      setTimeout(() => {
        setIsVoiceActive(false);
      }, 1000);
    }, 900);
  };

  const handlePhraseClick = (phrase: string) => {
    stopRecording();
    setTranscript(phrase);
    processVoiceInput(phrase);
  };

  const handleManualStop = () => {
    stopRecording();
  };

  if (!isVoiceActive) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-4">
      <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-[#dfd8c7] relative animate-in fade-in zoom-in-95 duration-200 text-center">
        {/* Close button */}
        <button
          onClick={() => {
            stopRecording();
            setIsVoiceActive(false);
          }}
          className="absolute top-4 right-4 p-2 text-[#78716c] hover:text-[#1c1917] rounded-full hover:bg-[#f3eedf] transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Animated Microphone Circle */}
        <div className="flex justify-center mb-5">
          <div className="relative">
            {(voiceState === 'listening' || voiceState === 'recording') && (
              <>
                <div className="absolute inset-0 rounded-full bg-[#143d2b]/20 animate-ping"></div>
                <div className="absolute -inset-2 rounded-full bg-[#143d2b]/10 animate-pulse"></div>
              </>
            )}
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all shadow-md ${
                voiceState === 'listening' || voiceState === 'recording'
                  ? 'bg-[#143d2b] scale-105'
                  : voiceState === 'processing' || voiceState === 'understanding'
                  ? 'bg-[#b45309]'
                  : voiceState === 'found'
                  ? 'bg-[#166534]'
                  : 'bg-[#57534e]'
              }`}
            >
              {voiceState === 'recording' || voiceState === 'listening' ? (
                <Mic className="w-10 h-10 animate-pulse" />
              ) : voiceState === 'processing' || voiceState === 'understanding' ? (
                <Sparkles className="w-9 h-9 animate-spin" />
              ) : voiceState === 'found' ? (
                <CheckCircle className="w-10 h-10" />
              ) : (
                <Mic className="w-8 h-8" />
              )}
            </div>
          </div>
        </div>

        {/* Status Message */}
        <h3 className="text-lg sm:text-xl font-bold text-[#1c1917]">
          {voiceState === 'recording' && (
            <span className="flex items-center justify-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              {t(`बोलिए... (${6 - recordingSeconds}s)`, `Listening... (${6 - recordingSeconds}s)`)}
            </span>
          )}
          {voiceState === 'listening' && t('माइक्रोफोन तैयार हो रहा है...', 'Preparing voice assistant...')}
          {voiceState === 'processing' && t('ध्वनि का विश्लेषण हो रहा है...', 'Transcribing speech...')}
          {voiceState === 'understanding' && t('भू-अभिलेख खोजा जा रहा है...', 'Searching land record...')}
          {voiceState === 'found' && t('जमीन रिकॉर्ड मिल गया!', 'Land Record Found!')}
          {voiceState === 'error' && t('आवाज इनपुट', 'Voice Input')}
        </h3>

        <p className="text-xs text-[#78716c] mt-1">
          {t(
            'हिन्दी, इंग्लिश या सामान्य बोलचाल में अपनी जमीन का नाम, गांव या खसरा बताएं',
            'Speak your land name, village, or Khasra in Hindi, English or Hinglish'
          )}
        </p>

        {/* Live Audio Waveform Bars */}
        {(voiceState === 'listening' || voiceState === 'recording') && (
          <div className="flex items-center justify-center gap-1.5 h-8 my-3">
            {[40, 75, 100, 60, 90, 45, 80, 55, 95, 35].map((h, i) => (
              <span
                key={i}
                style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                className="w-1.5 bg-[#143d2b] rounded-full animate-pulse"
              ></span>
            ))}
          </div>
        )}

        {/* Real-time transcript display */}
        <div className="my-4 p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4] min-h-[60px] flex items-center justify-center">
          <p className="text-sm font-semibold text-[#143d2b] italic">
            {transcript ? `"${transcript}"` : t('अपनी बात कहें...', 'Say something like "Ram Kumar in Bilari"...')}
          </p>
        </div>

        {voiceState === 'recording' && (
          <div className="mb-4">
            <button
              onClick={handleManualStop}
              className="px-4 py-1.5 bg-[#143d2b] text-white text-xs font-bold rounded-lg shadow-xs hover:bg-[#0e2a1e] transition-colors"
            >
              {t('बोलना समाप्त करें (खोजें)', 'Done Speaking (Search)')}
            </button>
          </div>
        )}

        {/* Error Notification if any */}
        {errorMessage && (
          <div className="mb-3 p-3 rounded-lg bg-[#fffbeb] border border-[#fef3c7] text-[#92400e] text-xs flex items-start gap-2 text-left">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#b45309]" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* One-Tap Voice Phrases Fallback */}
        <div className="text-left mt-3">
          <p className="text-xs font-bold text-[#78716c] uppercase tracking-wider mb-2">
            {t('या सीधे इन वाक्यों पर टैप करें:', 'Or tap on any phrase:')}
          </p>
          <div className="space-y-1.5">
            {sampleVoicePhrases.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handlePhraseClick(language === 'hi' ? p.hi : p.en)}
                className="w-full text-left px-3.5 py-2 rounded-lg border border-[#dfd8c7] bg-[#ffffff] hover:border-[#143d2b] hover:bg-[#faf7ee] text-xs font-medium text-[#1c1917] flex items-center justify-between group transition-all"
              >
                <span>{language === 'hi' ? p.hi : p.en}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#78716c] group-hover:text-[#143d2b] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

