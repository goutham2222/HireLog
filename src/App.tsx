import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ActiveApplicationsPage } from './pages/ActiveApplicationsPage';
import { AddApplicationPage } from './pages/AddApplicationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ApplicationsProvider } from './hooks/useJobApplications';

function App() {
  return (
    <Router>
      <ApplicationsProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<ActiveApplicationsPage />} />
            <Route path="all" element={<ApplicationsPage />} />
            <Route path="add" element={<AddApplicationPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Route>
        </Routes>
      </ApplicationsProvider>
    </Router>
  );
}

export default App;
