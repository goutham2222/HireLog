import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ActiveApplicationsPage } from './pages/ActiveApplicationsPage';
import { AddApplicationPage } from './pages/AddApplicationPage';
import { AnalyticsPage } from './pages/AnalyticsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ActiveApplicationsPage />} />
          <Route path="all" element={<ApplicationsPage />} />
          <Route path="add" element={<AddApplicationPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
