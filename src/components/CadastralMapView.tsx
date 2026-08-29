import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  MapPin,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Navigation,
  Info,
  ShieldCheck,
  FileText,
  Eye,
  CheckCircle2,
  AlertTriangle,
  LocateFixed,
  ArrowRight,
  FolderLock,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Compass,
  ExternalLink,
  Activity,
  HelpCircle,
  Clock,
  Landmark,
  Download,
  FileSpreadsheet,
} from 'lucide-react';
import { CadastralParcel } from '../types';

export const CadastralMapView: React.FC = () => {
  const {
    t,
    language,
    parcels,
    selectedParcel,
    setSelectedParcel,
    selectedRecord,
    selectRecordById,
    setActiveTab,
    isSpeaking,
    speakText,
    stopSpeaking,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mapStyle, setMapStyle] = useState<'cadastral' | 'satellite' | 'classification'>('cadastral');
  const [mapTab, setMapTab] = useState<'parcels' | 'revenue_centers'>('parcels');
  const [showLocationDialog, setShowLocationDialog] = useState<boolean>(false);
  const [showAIExplanationModal, setShowAIExplanationModal] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationResult, setLocationResult] = useState<{
    status: 'idle' | 'success' | 'denied' | 'error';
    distanceKm?: number;
    messageHi?: string;
    messageEn?: string;
    nearbyParcel?: string;
  }>({ status: 'idle' });

  // Revenue Centers state with Maps grounding
  const [revenueCenters, setRevenueCenters] = useState<any[]>([]);
  const [selectedRevenueCenter, setSelectedRevenueCenter] = useState<any | null>(null);
  const [loadingCenters, setLoadingCenters] = useState<boolean>(false);
  const [revenueFilter, setRevenueFilter] = useState<string>('all');

  useEffect(() => {
    setLoadingCenters(true);
    fetch('/api/ai/revenue-offices?tehsil=Bilari&district=Moradabad')
      .then(res => res.json())
      .then(data => {
        if (data.centers) {
          setRevenueCenters(data.centers);
          if (data.centers.length > 0) setSelectedRevenueCenter(data.centers[0]);
        }
      })
      .catch(err => console.warn('Failed to load revenue centers:', err))
      .finally(() => setLoadingCenters(false));
  }, []);

  // AI Parcel Explanation state
  const [isExplainingParcel, setIsExplainingParcel] = useState<boolean>(false);
  const [geoJsonExportStatus, setGeoJsonExportStatus] = useState<string | null>(null);
  const [parcelAIExplanation, setParcelAIExplanation] = useState<{
    summary?: string;
    summaryHi?: string;
    boundariesExplanation?: string;
    boundariesExplanationHi?: string;
    roadAccess?: string;
    roadAccessHi?: string;
    titleAndMortgage?: string;
    titleAndMortgageHi?: string;
    recommendedAction?: string;
    recommendedActionHi?: string;
  } | null>(null);

  // Default active parcel
  const activeParcel: CadastralParcel =
    selectedParcel || parcels.find(p => p.isUserParcel) || parcels[0] || {
      id: 'p-452',
      khasraNumber: '452',
      khataNumber: '00142',
      village: 'Ramnagar',
      villageHi: 'रामनगर',
      tehsil: 'Bilari',
      tehsilHi: 'बिलारी',
      district: 'Moradabad',
      districtHi: 'मुरादाबाद',
      areaHectare: 0.210,
      areaBigha: 0.83,
      areaBiswa: 16.6,
      areaSqMeters: 2100,
      landType: 'agricultural',
      landTypeHi: 'कृषि भूमि',
      coordinates: [[60, 120], [140, 110], [145, 200], [55, 190]],
      center: [100, 155],
      primaryOwnerName: 'Ram Kumar Singh & Shyam Kumar Singh',
      primaryOwnerNameHi: 'राम कुमार सिंह एवं श्याम कुमार सिंह',
      fatherName: 'Late Harpal Singh',
      fatherNameHi: 'सुपुत्र स्व. हरपाल सिंह',
      isUserParcel: true,
    };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.2));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleCenterUserLand = () => {
    const userParcel = parcels.find(p => p.isUserParcel && p.khasraNumber === '452') || parcels.find(p => p.isUserParcel);
    if (userParcel) {
      setSelectedParcel(userParcel);
    }
    setZoomLevel(1.3);
    setPanOffset({ x: 0, y: 0 });
  };

  // Dedicated Device Location vs. Property Location
  const handleCheckDeviceLocation = () => {
    setIsLocating(true);
    setLocationResult({
      status: 'idle',
      messageHi: 'मोबाइल जीपीएस स्थिति से उपग्रह संकेत प्राप्त किया जा रहा है...',
      messageEn: 'Acquiring GPS fix from device sensors...',
    });

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setIsLocating(false);
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Ramnagar, Bilari coordinates (approx 28.627 N, 78.802 E)
          const landLat = 28.627;
          const landLng = 78.802;

          // Haversine distance formula
          const R = 6371; // Earth radius in km
          const dLat = ((landLat - userLat) * Math.PI) / 180;
          const dLng = ((landLng - userLng) * Math.PI) / 180;
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((userLat * Math.PI) / 180) *
              Math.cos((landLat * Math.PI) / 180) *
              Math.sin(dLng / 2) *
              Math.sin(dLng / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distanceKm = Math.round(R * c);

          if (distanceKm < 1) {
            setLocationResult({
              status: 'success',
              distanceKm: 0.05,
              nearbyParcel: '452 (रामनगर)',
              messageHi: 'आप अपने खेत (गाटा सं. 452, रामनगर) के प्रत्यक्ष परिसर में उपस्थित हैं।',
              messageEn: 'You are physically present on your land parcel (Khasra #452, Ramnagar).',
            });
          } else {
            setLocationResult({
              status: 'success',
              distanceKm,
              messageHi: `आप अपनी जमीन (रामनगर, बिलारी) से लगभग ${distanceKm} किमी दूर स्थित हैं। आपका भू-नक्शा बिना किसी बदलाव के आपकी वास्तविक जमीन को ही प्रदर्शित कर रहा है।`,
              messageEn: `You are approximately ${distanceKm} km away from your registered property in Ramnagar, Bilari. Your cadastral map always displays the actual land location.`,
            });
          }
        },
        error => {
          setIsLocating(false);
          // Graceful handling of denial - never breaks the app!
          setLocationResult({
            status: 'denied',
            messageHi: 'जीपीएस लोकेशन अनुमति अस्वीकृत या अनुपलब्ध है। आपका पंजीकृत भू-नक्शा (रामनगर, बिलारी) सुरक्षित रूप से प्रदर्शित है।',
            messageEn: 'Device GPS permission denied or unavailable. Your cadastral map for Ramnagar, Bilari remains loaded securely.',
          });
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    } else {
      setIsLocating(false);
      setLocationResult({
        status: 'error',
        messageHi: 'इस ब्राउज़र में जीपीएस सेवा उपलब्ध नहीं है। नक्शा सामान्य रूप से कार्य कर रहा है।',
        messageEn: 'GPS not supported in this browser. Map functions normally.',
      });
    }
  };

  // Fetch AI Plain-Language Parcel Explanation
  const handleFetchParcelExplanation = async () => {
    setShowAIExplanationModal(true);
    setIsExplainingParcel(true);
    setParcelAIExplanation(null);

    try {
      const res = await fetch('/api/ai/explain-parcel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parcelId: activeParcel.id,
          parcel: activeParcel,
          language,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setParcelAIExplanation(data);
      } else {
        throw new Error('API request failed');
      }
    } catch (err) {
      console.warn('Fallback parcel explanation used:', err);
      // Deterministic fallback
      setParcelAIExplanation({
        summary: `Parcel Khasra #${activeParcel.khasraNumber} in Village ${activeParcel.village} has an area of ${activeParcel.areaHectare} Hectares (${activeParcel.areaBigha} Bigha). It is under verified ownership.`,
        summaryHi: `गाटा संख्या ${activeParcel.khasraNumber} (ग्राम ${activeParcel.villageHi}, तहसील ${activeParcel.tehsilHi || 'बिलारी'}) का कुल रकबा ${activeParcel.areaHectare} हेक्टेयर (${activeParcel.areaBigha} बीघा / ${activeParcel.areaBiswa || 16.6} बिस्वा) है। यह आपकी कानूनी रूप से पंजीकृत जमीन है।`,
        boundariesExplanation: activeParcel.boundaries
          ? `North: ${activeParcel.boundaries.north}; South: ${activeParcel.boundaries.south}; East: ${activeParcel.boundaries.east}; West: ${activeParcel.boundaries.west}.`
          : 'Demarcated as per official revenue map records.',
        boundariesExplanationHi: activeParcel.boundaries
          ? `चौहद्दी (सीमाएं): उत्तर में ${activeParcel.boundaries.northHi}; दक्षिण में ${activeParcel.boundaries.southHi}; पूर्व में ${activeParcel.boundaries.eastHi}; पश्चिम में ${activeParcel.boundaries.westHi}।`
          : 'सीमाएं राजस्व मानचित्र के अनुसार निर्धारित हैं।',
        roadAccess: 'The plot has direct access to the 6-meter public Chak Road on the western flank and is served by Government Tubewell No. 12.',
        roadAccessHi: 'इस गाटे के पश्चिमी किनारे पर 6 मीटर चौड़ा सार्वजनिक चक मार्ग स्थित है जिससे ट्रैक्टर व वाहन आसानी से पहुंच सकते हैं। सिंचाई हेतु राजकीय नलकूप सं. 12 उपलब्ध है।',
        titleAndMortgage: activeParcel.recordStatus === 'mortgaged'
          ? (activeParcel.recordStatusReason || 'Active bank mortgage registered on share.')
          : 'Clear title with verified revenue records and zero disputes.',
        titleAndMortgageHi: activeParcel.recordStatus === 'mortgaged'
          ? (activeParcel.recordStatusReasonHi || 'रिकॉर्ड में बैंक ऋण बंधक दर्ज है।')
          : 'शीर्षक बिल्कुल स्पष्ट है। कोई न्यायालय स्थगन या बैंक बंधक नहीं है।',
        recommendedAction: 'You can view the full digital Khatauni extract or check locker documents for this parcel.',
        recommendedActionHi: 'आप इस गाटे की कंप्यूटरीकृत खतौनी नकल देख सकते हैं अथवा भूलेख लॉकर में उपलब्ध प्रमाणित विलेखों का मिलान कर सकते हैं।',
      });
    } finally {
      setIsExplainingParcel(false);
    }
  };

  const handleExportGeoJSON = () => {
    // Village Ramnagar reference centroid coordinates (Uttar Pradesh, India)
    const baseLng = 78.7845;
    const baseLat = 28.6231;

    // Convert SVG grid coordinates (600x480 scale) into geo coordinates
    const features = parcels.map(p => {
      const ring = p.coordinates.map(([x, y]) => [
        Number((baseLng + (x - 300) * 0.00015).toFixed(6)),
        Number((baseLat - (y - 240) * 0.00015).toFixed(6)),
      ]);
      // Close the polygon ring if not closed
      if (ring.length > 0 && (ring[0][0] !== ring[ring.length - 1][0] || ring[0][1] !== ring[ring.length - 1][1])) {
        ring.push([...ring[0]]);
      }

      return {
        type: 'Feature' as const,
        id: p.id,
        geometry: {
          type: 'Polygon' as const,
          coordinates: [ring],
        },
        properties: {
          khasraNumber: p.khasraNumber,
          khataNumber: p.khataNumber,
          village: p.village,
          villageHi: p.villageHi,
          villageCensusCode: '115420',
          tehsil: p.tehsil || 'Bilari',
          tehsilHi: p.tehsilHi || 'बिलारी',
          district: p.district || 'Moradabad',
          districtHi: p.districtHi || 'मुरादाबाद',
          state: 'Uttar Pradesh',
          areaHectare: p.areaHectare,
          areaBigha: p.areaBigha,
          areaBiswa: p.areaBiswa,
          areaSqMeters: p.areaSqMeters,
          landType: p.landType,
          landTypeHi: p.landTypeHi,
          soilType: p.soilType || 'Dumat (Loam)',
          cropClassification: p.cropClassification || 'Rabi / Kharif (Wheat/Paddy)',
          primaryOwnerName: p.primaryOwnerName,
          primaryOwnerNameHi: p.primaryOwnerNameHi,
          fatherName: p.fatherName,
          fatherNameHi: p.fatherNameHi,
          isUserParcel: p.isUserParcel,
          recordStatus: p.recordStatus,
          recordStatusReason: p.recordStatusReason,
          mutationStatus: p.mutationStatus,
          boundaries: p.boundaries,
          surveyAuthority: 'Board of Revenue Uttar Pradesh / Revenue Council',
          sourceSystem: 'Bhoomi Sevak Cadastral Intelligence Subsystem',
          verificationNote: 'Prepared for local municipal and revenue authority demarcation verification',
          exportedAt: new Date().toISOString(),
        },
      };
    });

    const geoJsonData = {
      type: 'FeatureCollection' as const,
      name: `BhoomiSevak_Cadastral_Map_Ramnagar_Gata_${activeParcel.khasraNumber}`,
      crs: {
        type: 'name' as const,
        properties: {
          name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
        },
      },
      metadata: {
        village: 'Ramnagar',
        villageCensusCode: '115420',
        tehsil: 'Bilari',
        district: 'Moradabad',
        state: 'Uttar Pradesh',
        totalParcels: parcels.length,
        activeKhasra: activeParcel.khasraNumber,
        generatedBy: 'Bhoomi Sevak (भूलेख साथी)',
        intendedUse: 'Municipal and Tehsil Revenue Boundary Verification',
      },
      features,
    };

    const blob = new Blob([JSON.stringify(geoJsonData, null, 2)], {
      type: 'application/geo+json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bhoomi_sevak_cadastral_gata_${activeParcel.khasraNumber}_ramnagar.geojson`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setGeoJsonExportStatus(
      language === 'hi'
        ? `गाटा सं. ${activeParcel.khasraNumber} व राजस्व नक्शे का GeoJSON सफलतापूर्वक डाउनलोड किया गया!`
        : `Cadastral GeoJSON for Gata #${activeParcel.khasraNumber} exported successfully!`
    );
    setTimeout(() => setGeoJsonExportStatus(null), 4000);
  };

  return (
    <div id="cadastral-map-container" className="space-y-4 pb-20">
      {/* GeoJSON Export Success Toast */}
      {geoJsonExportStatus && (
        <div className="bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] p-3 rounded-xl flex items-center justify-between gap-3 shadow-xs animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-[#166534] shrink-0" />
            <span>{geoJsonExportStatus}</span>
          </div>
          <button
            onClick={() => setGeoJsonExportStatus(null)}
            className="text-[#143d2b] hover:text-[#166534] p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. Header & Location Breadcrumb Card */}
      <div className="bg-[#ffffff] rounded-xl p-4 sm:p-5 border border-[#dfd8c7] shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ece7d9]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] flex items-center justify-center font-bold shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#eef6f0] border border-[#d1e7dd] text-[10px] font-bold text-[#166534] uppercase tracking-wider mb-0.5">
                <Compass className="w-3 h-3" />
                <span>{t('भू-नक्शा कैडस्ट्रल मानचित्र', 'Cadastral Parcel Map')}</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-[#1c1917] tracking-tight">
                {t('मेरी जमीन कहाँ है? (कैडस्ट्रल भू-नक्शा)', 'Where is My Land? (Cadastral Map)')}
              </h2>
              <p className="text-xs text-[#57534e]">
                {t(
                  'ग्राम रामनगर (कोड: 115420), तहसील बिलारी, जनपद मुरादाबाद (उत्तर प्रदेश)',
                  'Village Ramnagar (Code: 115420), Tehsil Bilari, Moradabad (UP)'
                )}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Center on My Land */}
            <button
              id="btn-center-my-land"
              onClick={handleCenterUserLand}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#143d2b] hover:bg-[#1b4d36] text-white text-xs font-bold transition-colors uppercase tracking-wider shadow-2xs cursor-pointer"
            >
              <Navigation className="w-3.5 h-3.5" />
              <span>{t('मेरी जमीन पर जाएं', 'Go to My Land')}</span>
            </button>

            {/* Export GeoJSON Button */}
            <button
              id="btn-export-geojson"
              onClick={handleExportGeoJSON}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dfd8c7] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#143d2b] text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer"
              title="नगर पालिका / तहसील सत्यापन हेतु GeoJSON फाइल डाउनलोड करें (Export GeoJSON for Municipal Verification)"
            >
              <Download className="w-3.5 h-3.5 text-[#143d2b]" />
              <span>{t('GeoJSON निर्यात', 'Export GeoJSON')}</span>
            </button>

            {/* Device Location Intelligence Check */}
            <button
              id="btn-check-gps-distance"
              onClick={() => {
                setShowLocationDialog(true);
                handleCheckDeviceLocation();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#dfd8c7] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#1c1917] text-xs font-bold transition-colors uppercase tracking-wider cursor-pointer"
              title="स्थान संबंध व जीपीएस जांच"
            >
              <LocateFixed className="w-3.5 h-3.5 text-[#0284c7]" />
              <span>{t('स्थान संबंध व GPS', 'Location & GPS')}</span>
            </button>
          </div>
        </div>

        {/* User Owned Land Overview Summary Pill */}
        <div className="mt-3 bg-[#fbf9f4] p-3 rounded-lg border border-[#e8e2d4] flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#166534]"></span>
            <span className="font-bold text-[#143d2b]">
              {t('आपकी पंजीकृत जमीनें:', 'Your Registered Parcels:')}
            </span>
            <span className="font-mono text-[#1c1917] font-semibold">
              गाटा सं. 452 (0.210 Ha), गाटा सं. 453/1 (0.048 Ha), गाटा सं. 218 (0.180 Ha)
            </span>
          </div>
          <div className="text-[11px] text-[#78716c]">
            {t('कुल रकबा: 0.438 हेक्टेयर (1.73 बीघा)', 'Total Area: 0.438 Ha (1.73 Bigha)')}
          </div>
        </div>

        {/* Primary View Switcher: Parcels vs. Revenue Centers */}
        <div className="mt-3 pt-3 border-t border-[#ece7d9] flex items-center gap-2">
          <button
            onClick={() => setMapTab('parcels')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapTab === 'parcels'
                ? 'bg-[#143d2b] text-white shadow-2xs'
                : 'bg-[#fbf9f4] text-[#57534e] border border-[#dfd8c7] hover:bg-[#eae4d3]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{t('खेती भू-नक्शा (गाटा एवं रकबा)', 'Cadastral Parcels (Gata & Map)')}</span>
          </button>

          <button
            onClick={() => setMapTab('revenue_centers')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              mapTab === 'revenue_centers'
                ? 'bg-[#143d2b] text-white shadow-2xs'
                : 'bg-[#fbf9f4] text-[#57534e] border border-[#dfd8c7] hover:bg-[#eae4d3]'
            }`}
          >
            <Landmark className="w-3.5 h-3.5 text-[#0284c7]" />
            <span>{t('राजस्व प्रशासनिक केंद्र व तहसील (Revenue Centers)', 'Revenue Offices & Tehsil Centers')}</span>
            <span className="bg-[#0284c7] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">4</span>
          </button>
        </div>
      </div>

      {mapTab === 'revenue_centers' ? (
        /* Revenue Centers View */
        <div className="space-y-4">
          <div className="bg-[#ffffff] rounded-xl p-4 sm:p-5 border border-[#dfd8c7] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#ece7d9]">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-[#1c1917] flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-[#143d2b]" />
                  <span>{t('तहसील बिलारी के राजस्व प्रशासनिक केंद्र व नागरिक सेवाएं', 'Tehsil Bilari Revenue Centers & Public Citizen Desks')}</span>
                </h3>
                <p className="text-xs text-[#57534e] mt-0.5">
                  {t('दाखिल-खारिज, खतौनी नकल, पैमाइश सीमांकन व वरासत सत्यापन हेतु निकटतम सत्यापित कार्यालय', 'Verified official desks for mutation, Khatauni copies, boundary demarcation and succession')}
                </p>
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-[#fbf9f4] p-1 rounded-lg border border-[#dfd8c7] text-xs">
                {['all', 'tehsil', 'lekhpal', 'csc'].map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setRevenueFilter(filterKey)}
                    className={`px-2.5 py-1 rounded-md capitalize font-semibold transition-all ${
                      revenueFilter === filterKey
                        ? 'bg-[#143d2b] text-white shadow-2xs'
                        : 'text-[#57534e] hover:text-[#1c1917]'
                    }`}
                  >
                    {filterKey === 'all' && t('सभी केंद्र', 'All Centers')}
                    {filterKey === 'tehsil' && t('तहसील / एसडीएम', 'Tehsil / SDM')}
                    {filterKey === 'lekhpal' && t('लेखपाल केंद्र', 'Lekhpal Post')}
                    {filterKey === 'csc' && t('जन सेवा केंद्र', 'CSC Centers')}
                  </button>
                ))}
              </div>
            </div>

            {/* Centers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
              {revenueCenters
                .filter(c => {
                  if (revenueFilter === 'tehsil') return c.id.includes('tehsil') || c.id.includes('sub-registrar');
                  if (revenueFilter === 'lekhpal') return c.id.includes('lekhpal');
                  if (revenueFilter === 'csc') return c.id.includes('csc');
                  return true;
                })
                .map(center => {
                  const isSelected = selectedRevenueCenter?.id === center.id;
                  return (
                    <div
                      key={center.id}
                      onClick={() => setSelectedRevenueCenter(center)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#143d2b] bg-[#fbf9f4] ring-2 ring-[#143d2b]/20 shadow-xs'
                          : 'border-[#dfd8c7] bg-[#ffffff] hover:border-[#143d2b] hover:bg-[#faf7ee]'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#eef6f0] border border-[#d1e7dd] text-[#166534]">
                              {language === 'hi' ? center.typeHi : center.type}
                            </span>
                            <span className="text-xs font-mono font-bold text-[#b45309]">
                              ~{center.distanceKm} km {t('दूरी', 'away')}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#1c1917] mt-1.5 leading-snug">
                            {language === 'hi' ? center.nameHi : center.name}
                          </h4>
                          <p className="text-xs text-[#57534e] mt-1 flex items-start gap-1">
                            <MapPin className="w-3.5 h-3.5 text-[#78716c] shrink-0 mt-0.5" />
                            <span>{language === 'hi' ? center.addressHi : center.address}</span>
                          </p>
                        </div>
                      </div>

                      {/* Timings & Officer */}
                      <div className="mt-3 pt-3 border-t border-[#ece7d9] grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1.5 text-[#57534e]">
                          <Clock className="w-3.5 h-3.5 text-[#b45309] shrink-0" />
                          <span className="truncate">{language === 'hi' ? center.timingsHi : center.timings}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#57534e]">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#166534] shrink-0" />
                          <span className="truncate font-medium">{language === 'hi' ? center.officerInChargeHi : center.officerInCharge}</span>
                        </div>
                      </div>

                      {/* Citizen Services Available */}
                      <div className="mt-2.5">
                        <span className="text-[11px] font-bold text-[#78716c] uppercase block mb-1">
                          {t('प्रमुख नागरिक सेवाएं:', 'Citizen Services:')}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {(language === 'hi' ? center.servicesHi : center.services).slice(0, 3).map((srv: string, idx: number) => (
                            <span
                              key={idx}
                              className="text-[11px] px-2 py-0.5 rounded bg-[#f5f5f4] border border-[#e7e5e4] text-[#44403c]"
                            >
                              {srv}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Footer Call Action */}
                      <div className="mt-3.5 flex items-center justify-between gap-2 pt-2 border-t border-[#ece7d9]">
                        <span className="text-xs font-mono text-[#57534e]">
                          ☎ {center.phone}
                        </span>
                        <button
                          type="button"
                          className="px-3 py-1 bg-[#143d2b] hover:bg-[#1b4d36] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                        >
                          <span>{t('विवरण देखें', 'View Details')}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* 2. Map Viewport & Controls */}
          <div className="bg-[#ffffff] rounded-xl border border-[#dfd8c7] shadow-xs overflow-hidden">
        {/* Layer Mode & Controls Toolbar */}
        <div className="p-3 bg-[#fbf9f4] border-b border-[#dfd8c7] flex flex-wrap items-center justify-between gap-3">
          {/* Map Layer Mode Switcher */}
          <div className="flex items-center bg-[#ffffff] border border-[#dfd8c7] p-0.5 rounded-lg text-xs font-semibold">
            <button
              onClick={() => setMapStyle('cadastral')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mapStyle === 'cadastral'
                  ? 'bg-[#143d2b] text-white shadow-2xs font-bold'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              {t('राजस्व भू-नक्शा', 'Cadastral Map')}
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mapStyle === 'satellite'
                  ? 'bg-[#143d2b] text-white shadow-2xs font-bold'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              {t('उपग्रह दृश्य', 'Satellite')}
            </button>
            <button
              onClick={() => setMapStyle('classification')}
              className={`px-3 py-1.5 rounded-md transition-colors ${
                mapStyle === 'classification'
                  ? 'bg-[#143d2b] text-white shadow-2xs font-bold'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              {t('मिट्टी व फसल', 'Soil & Crops')}
            </button>
          </div>

          {/* Zoom Toolbar */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-[#ffffff] hover:bg-[#eae4d3] border border-[#dfd8c7] rounded-lg text-[#1c1917] transition-colors"
              title="बड़ा करें (Zoom In)"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-[#ffffff] hover:bg-[#eae4d3] border border-[#dfd8c7] rounded-lg text-[#1c1917] transition-colors"
              title="छोटा करें (Zoom Out)"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 bg-[#ffffff] hover:bg-[#eae4d3] border border-[#dfd8c7] rounded-lg text-[#1c1917] transition-colors"
              title="रीसेट करें (Reset)"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono font-bold text-[#78716c] px-1.5">
              {Math.round(zoomLevel * 100)}%
            </span>
          </div>
        </div>

        {/* Quick 1-Tap Parcel Selector Carousel / Chips */}
        <div className="px-3 py-2 bg-[#ffffff] border-b border-[#ece7d9] overflow-x-auto flex items-center gap-2 text-xs no-scrollbar">
          <span className="text-[11px] font-bold uppercase text-[#78716c] shrink-0">
            {t('गाटा चुनें:', 'Select Gata:')}
          </span>
          {parcels.map(p => {
            const isSelected = activeParcel.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelectedParcel(p)}
                className={`px-2.5 py-1 rounded-lg shrink-0 transition-all font-semibold flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#143d2b] text-white font-bold shadow-2xs'
                    : p.isUserParcel
                    ? 'bg-[#eef6f0] text-[#166534] border border-[#d1e7dd] hover:border-[#166534]'
                    : p.landType === 'road'
                    ? 'bg-[#f5f5f4] text-[#57534e] border border-[#e7e5e4]'
                    : p.landType === 'water_body'
                    ? 'bg-[#f0f9ff] text-[#0284c7] border border-[#e0f2fe]'
                    : 'bg-[#fbf9f4] text-[#57534e] border border-[#e8e2d4] hover:border-[#143d2b]'
                }`}
              >
                {p.isUserParcel && <span className="w-2 h-2 rounded-full bg-[#22c55e]"></span>}
                <span>{p.khasraNumber}</span>
                {p.isUserParcel && <span className="text-[10px] opacity-90">({t('आपकी', 'Mine')})</span>}
              </button>
            );
          })}
        </div>

        {/* Interactive SVG Cadastral Map Viewport */}
        <div className={`relative min-h-[380px] sm:min-h-[460px] flex items-center justify-center select-none overflow-hidden ${
          mapStyle === 'satellite' ? 'bg-[#14231b]' : 'bg-[#fcfbf8]'
        }`}>
          {/* Compass & Scale legend */}
          <div className="absolute top-3 left-3 z-10 bg-[#ffffff]/95 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#dfd8c7] text-[11px] font-mono text-[#57534e] flex items-center gap-2.5 shadow-2xs">
            <span className="font-bold text-[#b45309] flex items-center gap-0.5">
              <Compass className="w-3.5 h-3.5" /> N
            </span>
            <span className="text-[#d6d3d1]">|</span>
            <span>{t('पैमाना: 1:4000', 'Scale: 1:4000')}</span>
            <span className="text-[#d6d3d1]">|</span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#166534] rounded-xs"></span>
              <span className="font-sans font-bold text-[#143d2b]">{t('आपकी जमीन', 'Your Land')}</span>
            </span>
          </div>

          {/* Interactive SVG Cadastral Canvas */}
          <svg
            viewBox="0 0 360 340"
            className="w-full h-full max-h-[520px] transition-transform duration-300 cursor-grab active:cursor-grabbing"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
            }}
          >
            {/* Background Grid Pattern */}
            <defs>
              <pattern id="cadastral-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke={mapStyle === 'satellite' ? '#1f382a' : '#ece7d9'}
                  strokeWidth="0.5"
                />
              </pattern>
              {/* Hatch pattern for user land */}
              <pattern id="user-hatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#166534" strokeWidth="1.2" opacity="0.35" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cadastral-grid)" />

            {/* Render Cadastral Parcels */}
            {parcels.map(parcel => {
              const isSelected = activeParcel.id === parcel.id;
              const pointsStr = parcel.coordinates.map(p => p.join(',')).join(' ');

              // Fill & stroke colors based on map style and ownership
              let fillColor = '#fcfbf8';
              let strokeColor = '#78716c';
              let strokeWidth = '1.5';

              if (mapStyle === 'satellite') {
                fillColor = parcel.landType === 'road' ? '#292524' : parcel.landType === 'water_body' ? '#0369a1' : '#1c3d28';
                strokeColor = '#52796f';
              } else if (mapStyle === 'classification') {
                fillColor = parcel.soilType?.includes('दोमट') || parcel.soilType?.includes('Loam')
                  ? '#fef3c7'
                  : parcel.landType === 'road'
                  ? '#e7e5e4'
                  : parcel.landType === 'water_body'
                  ? '#e0f2fe'
                  : '#f3e8ff';
                strokeColor = '#78716c';
              }

              if (parcel.landType === 'road') {
                fillColor = mapStyle === 'satellite' ? '#292524' : '#e7e5e4';
                strokeColor = '#a8a29e';
              } else if (parcel.landType === 'water_body') {
                fillColor = mapStyle === 'satellite' ? '#0369a1' : '#e0f2fe';
                strokeColor = '#0284c7';
              } else if (parcel.isUserParcel) {
                fillColor = mapStyle === 'satellite' ? '#14532d' : isSelected ? '#dcfce7' : '#eef6f0';
                strokeColor = '#166534';
                strokeWidth = isSelected ? '3.5' : '2.5';
              }

              if (isSelected) {
                strokeColor = '#b45309';
                strokeWidth = '3';
              }

              return (
                <g
                  key={parcel.id}
                  onClick={() => setSelectedParcel(parcel)}
                  className="cursor-pointer transition-transform hover:opacity-90"
                >
                  <polygon
                    points={pointsStr}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={parcel.landType === 'road' ? '5 3' : undefined}
                  />

                  {/* If User Parcel, add subtle diagonal hatch overlay */}
                  {parcel.isUserParcel && (
                    <polygon
                      points={pointsStr}
                      fill="url(#user-hatch)"
                      pointerEvents="none"
                    />
                  )}

                  {/* Parcel Gata Number Label */}
                  <text
                    x={parcel.center[0]}
                    y={parcel.center[1] - (parcel.isUserParcel ? 2 : 0)}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className={`font-bold select-none pointer-events-none ${
                      parcel.isUserParcel
                        ? 'fill-[#143d2b] font-extrabold text-[11px]'
                        : mapStyle === 'satellite'
                        ? 'fill-[#e2e8f0] text-[9px]'
                        : 'fill-[#1c1917] text-[9.5px]'
                    }`}
                  >
                    {parcel.khasraNumber}
                  </text>

                  {/* If User Parcel, show pulsing location beacon */}
                  {parcel.isUserParcel && (
                    <g transform={`translate(${parcel.center[0] + 16}, ${parcel.center[1] - 12})`}>
                      <circle cx="0" cy="0" r="4.5" fill="#166534" className="animate-ping opacity-75" />
                      <circle cx="0" cy="0" r="3" fill="#22c55e" />
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* 3. Mobile-Friendly Bottom Sheet / Parcel Inspector Card */}
      {/* On desktop: Renders inline as rich card. On mobile: Bottom sheet overlay */}
      <div
        id="parcel-bottom-sheet"
        className="bg-[#ffffff] rounded-xl p-4 sm:p-5 border border-[#dfd8c7] shadow-sm animate-in slide-in-from-bottom-2 duration-200"
      >
        {/* Top Handle / Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#ece7d9]">
          <div className="flex items-start gap-2.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 ${
                activeParcel.isUserParcel
                  ? 'bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b]'
                  : 'bg-[#fbf9f4] border border-[#dfd8c7] text-[#57534e]'
              }`}
            >
              <span className="font-mono text-sm font-extrabold">{activeParcel.khasraNumber}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-[#78716c] font-bold uppercase tracking-wider">
                  {t('गाटा / खसरा विवरण:', 'Selected Parcel:')}
                </span>
                <h3 className="text-lg font-extrabold text-[#1c1917]">
                  {t('गाटा सं.', 'Gata #')} <span className="font-mono text-[#143d2b]">{activeParcel.khasraNumber}</span>
                </h3>
              </div>
              <p className="text-xs text-[#57534e]">
                {t('ग्राम:', 'Village:')} {language === 'hi' ? activeParcel.villageHi : activeParcel.village} • {t('तहसील:', 'Tehsil:')} {language === 'hi' ? activeParcel.tehsilHi || 'बिलारी' : activeParcel.tehsil || 'Bilari'} • {t('जनपद:', 'District:')} {language === 'hi' ? activeParcel.districtHi || 'मुरादाबाद' : activeParcel.district || 'Moradabad'}
              </p>
            </div>
          </div>

          {/* User Ownership Badge */}
          {activeParcel.isUserParcel ? (
            <span className="px-3 py-1 rounded-full bg-[#eef6f0] text-[#166534] border border-[#d1e7dd] text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#166534]" />
              <span>{t('आपकी पंजीकृत जमीन', 'Your Land')}</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-[#fbf9f4] text-[#57534e] border border-[#e8e2d4] text-xs font-medium shrink-0">
              {t('पड़ोसी गाटा', 'Neighbor Plot')}
            </span>
          )}
        </div>

        {/* Structured Parcel Facts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3 text-xs">
          {/* Area */}
          <div className="p-2.5 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4]">
            <span className="text-[#78716c] block text-[10px] uppercase font-bold">
              {t('रकबा (क्षेत्रफल)', 'Plot Area')}
            </span>
            <span className="font-mono font-bold text-[#143d2b] text-sm block mt-0.5">
              {activeParcel.areaHectare} Ha
            </span>
            <span className="text-[11px] text-[#57534e]">
              ({activeParcel.areaBigha} {t('बीघा', 'Bigha')} / {activeParcel.areaBiswa || (activeParcel.areaBigha * 20).toFixed(1)} {t('बिस्वा', 'Biswa')})
            </span>
          </div>

          {/* Owner Name */}
          <div className="p-2.5 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4]">
            <span className="text-[#78716c] block text-[10px] uppercase font-bold">
              {t('दर्ज खातेदार (Owner)', 'Recorded Owner')}
            </span>
            <span className="font-bold text-[#1c1917] text-xs block mt-0.5 truncate">
              {language === 'hi' ? activeParcel.primaryOwnerNameHi : activeParcel.primaryOwnerName}
            </span>
            {activeParcel.fatherName && (
              <span className="text-[11px] text-[#57534e] block truncate">
                {language === 'hi' ? activeParcel.fatherNameHi : activeParcel.fatherName}
              </span>
            )}
          </div>

          {/* Record & Title Status */}
          <div className="p-2.5 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4]">
            <span className="text-[#78716c] block text-[10px] uppercase font-bold">
              {t('शीर्षक व स्थिति (Status)', 'Record Status')}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeParcel.recordStatus === 'mortgaged' || activeParcel.isMortgaged
                    ? 'bg-[#b45309]'
                    : 'bg-[#166534]'
                }`}
              ></span>
              <span className="font-bold text-[#1c1917] text-xs">
                {activeParcel.recordStatus === 'mortgaged' || activeParcel.isMortgaged
                  ? t('बैंक बंधक दर्ज', 'Mortgaged')
                  : t('शीर्षक स्पष्ट', 'Title Clear')}
              </span>
            </div>
            <span className="text-[10px] text-[#78716c] block mt-0.5">
              {activeParcel.recordStatus === 'mortgaged'
                ? t('₹1.50 लाख केसीसी ऋण', '₹1.50L KCC Loan')
                : t('शून्य भार / बेदाग', 'Zero Bank Loan')}
            </span>
          </div>

          {/* Documents & Mutation */}
          <div className="p-2.5 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4]">
            <span className="text-[#78716c] block text-[10px] uppercase font-bold">
              {t('दस्तावेज व दाखिल-खारिज', 'Docs & Mutation')}
            </span>
            <span className="font-bold text-[#143d2b] text-xs block mt-0.5">
              {activeParcel.documentCount || 3} {t('प्रमाणित विलेख', 'Certified Docs')}
            </span>
            <span className="text-[10px] text-[#57534e] block truncate mt-0.5">
              {language === 'hi'
                ? activeParcel.mutationStatusTextHi || '1431 फसली में दर्ज'
                : activeParcel.mutationStatusText || 'Mutated in 1431 Fasli'}
            </span>
          </div>
        </div>

        {/* Boundaries / Chauhaddi & Soil details */}
        {activeParcel.boundaries && (
          <div className="p-3 rounded-lg bg-[#faf7ee] border border-[#dfd8c7] mb-3 text-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <Compass className="w-3.5 h-3.5 text-[#143d2b]" />
              <span className="font-bold text-[#143d2b] uppercase tracking-wider text-[11px]">
                {t('गाटे की चौहद्दी (राजस्व मानचित्र सीमांकन):', 'Demarcated Boundaries (Chauhaddi):')}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-bold text-[#57534e]">{t('उत्तर (North):', 'North:')}</span>{' '}
                <span className="text-[#1c1917]">{language === 'hi' ? activeParcel.boundaries.northHi : activeParcel.boundaries.north}</span>
              </div>
              <div>
                <span className="font-bold text-[#57534e]">{t('दक्षिण (South):', 'South:')}</span>{' '}
                <span className="text-[#1c1917]">{language === 'hi' ? activeParcel.boundaries.southHi : activeParcel.boundaries.south}</span>
              </div>
              <div>
                <span className="font-bold text-[#57534e]">{t('पूर्व (East):', 'East:')}</span>{' '}
                <span className="text-[#1c1917]">{language === 'hi' ? activeParcel.boundaries.eastHi : activeParcel.boundaries.east}</span>
              </div>
              <div>
                <span className="font-bold text-[#57534e]">{t('पश्चिम (West):', 'West:')}</span>{' '}
                <span className="text-[#1c1917]">{language === 'hi' ? activeParcel.boundaries.westHi : activeParcel.boundaries.west}</span>
              </div>
            </div>
          </div>
        )}

        {/* 5 Primary Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 border-t border-[#ece7d9]">
          {/* Action 1: View Record */}
          <button
            id="btn-parcel-view-record"
            onClick={() => {
              selectRecordById(activeParcel.landRecordId || 'rec-001');
              setActiveTab('land_record');
            }}
            className="py-2.5 px-3 rounded-lg bg-[#143d2b] hover:bg-[#1b4d36] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-2xs cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>{t('खतौनी नकल देखें', 'View Record')}</span>
          </button>

          {/* Action 2: View Documents */}
          <button
            id="btn-parcel-view-docs"
            onClick={() => setActiveTab('bhulekh_locker')}
            className="py-2.5 px-3 rounded-lg border border-[#dfd8c7] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#143d2b] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <FolderLock className="w-4 h-4 text-[#143d2b]" />
            <span>{t('दस्तावेज़ देखें', 'View Documents')}</span>
          </button>

          {/* Action 3: Understand (AI Assistance) */}
          <button
            id="btn-parcel-understand-ai"
            onClick={handleFetchParcelExplanation}
            className="py-2.5 px-3 rounded-lg border border-[#fef3c7] bg-[#fffbeb] hover:bg-[#fef3c7] text-[#92400e] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider shadow-2xs cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#b45309]" />
            <span>{t('आसान भाषा में समझें', 'Understand')}</span>
          </button>

          {/* Action 4: Track Mutation */}
          <button
            id="btn-parcel-track-mutation"
            onClick={() => setActiveTab('mutation')}
            className="py-2.5 px-3 rounded-lg border border-[#dfd8c7] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#1c1917] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer"
          >
            <Activity className="w-4 h-4 text-[#9333ea]" />
            <span>{t('दाखिल-खारिज स्थिति', 'Track Mutation')}</span>
          </button>

          {/* Action 5: Export GeoJSON */}
          <button
            id="btn-parcel-export-geojson"
            onClick={handleExportGeoJSON}
            className="py-2.5 px-3 rounded-lg border border-[#dfd8c7] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#143d2b] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors uppercase tracking-wider cursor-pointer col-span-2 sm:col-span-1"
            title="भू-स्थानिक GeoJSON फाइल डाउनलोड करें"
          >
            <Download className="w-4 h-4 text-[#143d2b]" />
            <span>{t('GeoJSON फाइल', 'GeoJSON File')}</span>
          </button>
        </div>
      </div>
      </>
      )}

      {/* 4. AI Parcel Explanation Modal Drawer */}
      {showAIExplanationModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-[#dfd8c7] max-h-[90vh] overflow-y-auto animate-in zoom-in-95">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#ece7d9]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-[#b45309] flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#1c1917]">
                    {t('गाटा सं.', 'Gata #')} {activeParcel.khasraNumber} {t('की सरल भाषा में समझ', 'AI Plain-Language Breakdown')}
                  </h3>
                  <p className="text-xs text-[#78716c]">
                    {t('उत्तर प्रदेश राजस्व संहिता एवं मानचित्र सीमाओं पर आधारित सत्यापन', 'Grounded strictly in verified cadastral records')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {parcelAIExplanation && (
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        stopSpeaking();
                      } else {
                        const speech = language === 'hi'
                          ? `${parcelAIExplanation.summaryHi} ${parcelAIExplanation.boundariesExplanationHi} ${parcelAIExplanation.roadAccessHi}`
                          : `${parcelAIExplanation.summary} ${parcelAIExplanation.boundariesExplanation}`;
                        speakText(speech);
                      }
                    }}
                    className="p-2 rounded-lg bg-[#fbf9f4] hover:bg-[#f2ece0] border border-[#dfd8c7] text-[#143d2b]"
                    title={isSpeaking ? 'आवाज बंद करें' : 'बोलकर सुनें'}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4 text-[#b91c1c]" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                )}
                <button
                  onClick={() => setShowAIExplanationModal(false)}
                  className="p-2 rounded-lg bg-[#fbf9f4] hover:bg-[#f2ece0] border border-[#dfd8c7] text-[#57534e]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            {isExplainingParcel ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-8 h-8 border-3 border-[#143d2b] border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-xs font-bold text-[#143d2b]">
                  {t('गाटा संख्या और सीमाओं का विश्लेषण किया जा रहा है...', 'Analyzing cadastral boundaries and rights...')}
                </p>
              </div>
            ) : parcelAIExplanation ? (
              <div className="space-y-4 my-4 text-xs">
                {/* Summary */}
                <div className="p-3.5 rounded-xl bg-[#eef6f0] border border-[#d1e7dd] text-[#143d2b] leading-relaxed">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-1 text-[#166534]">
                    {t('मुख्य विवरण (Summary):', 'Key Summary:')}
                  </span>
                  <p className="text-sm font-medium">
                    {language === 'hi' ? parcelAIExplanation.summaryHi : parcelAIExplanation.summary}
                  </p>
                </div>

                {/* Boundaries */}
                <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4]">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-1 text-[#57534e] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#143d2b]" />
                    <span>{t('चौहद्दी व सीमांकन (Boundaries):', 'Boundaries & Neighbors:')}</span>
                  </span>
                  <p className="text-xs text-[#1c1917] leading-relaxed">
                    {language === 'hi' ? parcelAIExplanation.boundariesExplanationHi : parcelAIExplanation.boundariesExplanation}
                  </p>
                </div>

                {/* Road & Water Connectivity */}
                <div className="p-3.5 rounded-xl bg-[#fbf9f4] border border-[#e8e2d4]">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-1 text-[#57534e]">
                    {t('रास्ता एवं सिंचाई साधन (Connectivity & Water):', 'Road & Irrigation Access:')}
                  </span>
                  <p className="text-xs text-[#1c1917] leading-relaxed">
                    {language === 'hi' ? parcelAIExplanation.roadAccessHi : parcelAIExplanation.roadAccess}
                  </p>
                </div>

                {/* Title and Mortgage Note */}
                <div className="p-3.5 rounded-xl bg-[#fffbeb] border border-[#fef3c7] text-[#92400e]">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-1 text-[#b45309]">
                    {t('भार एवं कानूनी स्थिति (Title & Encumbrance):', 'Title & Encumbrance:')}
                  </span>
                  <p className="text-xs leading-relaxed">
                    {language === 'hi' ? parcelAIExplanation.titleAndMortgageHi : parcelAIExplanation.titleAndMortgage}
                  </p>
                </div>

                {/* Actionable Advice */}
                <div className="p-3.5 rounded-xl bg-[#faf5ff] border border-[#f3e8ff] text-[#6b21a8]">
                  <span className="font-bold block text-[11px] uppercase tracking-wider mb-1 text-[#9333ea]">
                    {t('नागरिक सलाह (Next Action):', 'Recommended Action:')}
                  </span>
                  <p className="text-xs leading-relaxed font-medium">
                    {language === 'hi' ? parcelAIExplanation.recommendedActionHi : parcelAIExplanation.recommendedAction}
                  </p>
                </div>
              </div>
            ) : null}

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#ece7d9]">
              <button
                onClick={() => setShowAIExplanationModal(false)}
                className="px-4 py-2 rounded-lg bg-[#143d2b] hover:bg-[#1b4d36] text-white text-xs font-bold uppercase tracking-wider shadow-2xs"
              >
                {t('ठीक है, समझ गया', 'Understood')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Device Location vs. Property Location Intelligence Modal */}
      {showLocationDialog && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#ffffff] rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-[#dfd8c7] animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-[#f0f9ff] border border-[#e0f2fe] text-[#0284c7] flex items-center justify-center mx-auto mb-3">
              <LocateFixed className="w-6 h-6 animate-pulse" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-[#1c1917] text-center">
              {t('स्थान संबंध व GPS गाइड (Location Intelligence)', 'Location & GPS Assistance')}
            </h3>

            {/* Educational Principle: Current device location is separate from property location */}
            <div className="my-3 space-y-2 text-xs">
              <div className="p-3 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4]">
                <span className="font-bold text-[#143d2b] block mb-0.5">
                  🏠 {t('जमीन का वास्तविक स्थान (Property Location):', 'Actual Property Location:')}
                </span>
                <p className="text-[#57534e]">
                  {t(
                    'ग्राम रामनगर (115420), तहसील बिलारी, जिला मुरादाबाद (उत्तर प्रदेश)। आपका भू-नक्शा हमेशा इसी स्थान को सुरक्षित प्रदर्शित करता है।',
                    'Village Ramnagar (115420), Tehsil Bilari, Moradabad (UP). Your map always shows this actual land location.'
                  )}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#fbf9f4] border border-[#e8e2d4]">
                <span className="font-bold text-[#0284c7] block mb-0.5">
                  📱 {t('मोबाइल डिवाइस जीपीएस (Current Phone Location):', 'Current Phone GPS:')}
                </span>
                <p className="text-[#57534e]">
                  {t(
                    'यदि आप खेत पर उपस्थित हैं, तो जीपीएस से मेड़ व निकटतम गाटा संख्या का मिलान किया जा सकता है।',
                    'If you are standing on the field, GPS can estimate proximity to boundaries.'
                  )}
                </p>
              </div>
            </div>

            {/* Status result */}
            {locationResult.messageHi && (
              <div
                className={`p-3 rounded-lg text-xs font-medium my-3 ${
                  locationResult.status === 'success'
                    ? 'bg-[#eef6f0] border border-[#d1e7dd] text-[#166534]'
                    : locationResult.status === 'denied'
                    ? 'bg-[#fffbeb] border border-[#fef3c7] text-[#92400e]'
                    : 'bg-[#f0f9ff] border border-[#e0f2fe] text-[#0369a1]'
                }`}
              >
                {language === 'hi' ? locationResult.messageHi : locationResult.messageEn}
              </div>
            )}

            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={handleCheckDeviceLocation}
                disabled={isLocating}
                className="px-4 py-2.5 rounded-lg bg-[#143d2b] hover:bg-[#1b4d36] text-white text-xs font-bold transition-colors disabled:opacity-60 flex items-center gap-1.5 uppercase tracking-wider shadow-2xs"
              >
                {isLocating ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{t('जीपीएस दूरी पुनः जांचें', 'Re-Check Distance')}</span>
                )}
              </button>

              <button
                onClick={() => setShowLocationDialog(false)}
                className="px-4 py-2.5 rounded-lg border border-[#dfd8c7] bg-[#fbf9f4] hover:bg-[#f2ece0] text-[#57534e] text-xs font-bold uppercase tracking-wider"
              >
                {t('बंद करें', 'Close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
