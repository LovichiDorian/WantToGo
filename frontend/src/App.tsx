import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '@/layouts/AppLayout';
import { PlacesListPage } from '@/pages/PlacesListPage';
import { PlaceDetailPage } from '@/pages/PlaceDetailPage';
import { PlaceFormPage } from '@/pages/PlaceFormPage';
import { MapPage } from '@/pages/MapPage';
import { SettingsPage } from '@/pages/SettingsPage';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          {/* Map is the default landing page */}
          <Route index element={<Navigate to="/map" replace />} />
          <Route path="map" element={<MapPage />} />
          <Route path="places" element={<PlacesListPage />} />
          <Route path="place/:id" element={<PlaceDetailPage />} />
          <Route path="add" element={<PlaceFormPage />} />
          <Route path="edit/:id" element={<PlaceFormPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
