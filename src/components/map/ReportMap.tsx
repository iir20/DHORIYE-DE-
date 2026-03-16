import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { supabase } from '@/lib/supabase';
import { Report } from '@/lib/types';

export default function ReportMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const position: [number, number] = [23.6850, 90.3563]; // Centered on Bangladesh

  useEffect(() => {
    // Fetch initial reports
    const fetchReports = async () => {
      const { data, error } = await supabase.from('reports').select('*');
      if (error) {
        console.error('Error fetching reports:', error);
      } else {
        setReports(data || []);
      }
    };

    fetchReports();

    // Subscribe to new reports
    const channel = supabase
      .channel('realtime reports')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'reports' },
        (payload) => {
          setReports((prevReports) => [...prevReports, payload.new as Report]);
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <MapContainer center={position} zoom={7} scrollWheelZoom={true} style={{ height: 'calc(100vh - 56px)', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {reports.map(report => (
        <Marker key={report.id} position={[report.latitude, report.longitude]}>
          <Popup>
            <b>{report.title}</b><br />
            ধরন: {report.corruption_type}<br />
            <a href={`/report/${report.id}`}>বিস্তারিত দেখুন</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
