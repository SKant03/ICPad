// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Card from '../components/Card';
import Button from '../components/Button';
import { listProjects } from '../utils/canisterService';

const Dashboard = () => {
  const { isDarkMode } = useTheme();
  const textColor = isDarkMode ? 'text-white' : 'text-gray-900';
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load projects from canister
  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    try {
      const result = await listProjects();
      if (result.success) {
        setProjects(result.projects || []);
      } else {
        setError('Failed to load projects: ' + result.error);
      }
    } catch (error) {
      setError('Error loading projects: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 flex-grow">
      <h2 className={`text-3xl font-bold mb-6 ${textColor}`}>Your Projects</h2>
      
      {loading ? (
        <div className={`${textColor} text-center py-10`}>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          Loading projects...
        </div>
      ) : error ? (
        <div className={`${textColor} text-center py-10`}>
          <p className="text-red-400 mb-4">{error}</p>
          <Button variant="primary" onClick={loadProjects}>Retry</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.length > 0 ? (
            projects.map(project => (
              <Card key={project.id} className="flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{project.name}</h3>
                  <p className="text-sm opacity-80 mb-2">
                    Status: <span className={project.status === 'deployed' ? 'text-green-400 font-medium' : 'text-yellow-400 font-medium'}>{project.status}</span>
                  </p>
                  <p className="text-sm opacity-80 mb-2">
                    Language: <span className="font-medium text-blue-400">{project.language}</span>
                  </p>
                  {project.canister_id && (
                    <p className="text-sm opacity-80 mb-2">
                      Canister: <span className="font-mono text-green-400">{project.canister_id}</span>
                    </p>
                  )}
                  <p className="text-xs opacity-60">
                    Created: {new Date(Number(project.created_at) / 1000000).toLocaleDateString()}
                  </p>
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button variant="secondary" className="text-sm">Open in IDE</Button>
                  {project.status === 'deployed' && (
                    <Button variant="outline" className="text-sm">View Live</Button>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <div className={`${textColor} text-center col-span-full py-10`}>
              <p className="opacity-70 mb-4">No projects found. Create your first project in the IDE!</p>
              <Button variant="primary" onClick={() => window.location.href = '/ide'}>
                Go to IDE
              </Button>
            </div>
          )}
        </div>
      )}
      
      <h2 className={`text-3xl font-bold mt-10 mb-6 ${textColor}`}>User Information</h2>
      <Card className="max-w-md">
        <p className="mb-2 text-lg">
          <span className="font-semibold">Total Projects:</span> <span className="font-mono text-blue-400">{projects.length}</span>
        </p>
        <p className="mb-2">
          <span className="font-semibold">Deployed Projects:</span> {projects.filter(p => p.status === 'deployed').length}
        </p>
        <p className="mb-2">
          <span className="font-semibold">In Development:</span> {projects.filter(p => p.status !== 'deployed').length}
        </p>
        <Button variant="secondary" className="mt-4">View Full Profile</Button>
      </Card>
    </div>
  );
};

export default Dashboard;
