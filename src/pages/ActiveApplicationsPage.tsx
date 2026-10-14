import React from 'react';
import { ApplicationsList } from '../components/ApplicationsList';

export const ActiveApplicationsPage: React.FC = () => (
  <ApplicationsList title="Active Applications" excludeStatuses={['rejected']} />
);
