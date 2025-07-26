import React, { useState, useEffect } from 'react';
import { checkCanisterConnection, createProject, listProjects } from '../utils/canisterService';
import Button from './Button';

const CanisterTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const result = await checkCanisterConnection();
      if (result.success && result.connected) {
        setConnectionStatus('✅ Connected to canister');
        await loadProjects();
      } else {
        setConnectionStatus('❌ Failed to connect: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setConnectionStatus('❌ Connection error: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      const result = await listProjects();
      if (result.success) {
        setProjects(result.projects || []);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const createTestProject = async () => {
    setIsLoading(true);
    try {
      const result = await createProject('Test Project', 'motoko', 'actor { public query func greet(name: Text): Text { "Hello, " # name # "!" } }');
      if (result.success) {
        setConnectionStatus('✅ Test project created! ID: ' + result.projectId);
        await loadProjects();
      } else {
        setConnectionStatus('❌ Failed to create test project: ' + result.error);
      }
    } catch (error) {
      setConnectionStatus('❌ Error creating test project: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Canister Integration Test</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Connection Status</h3>
          <p className="text-sm">{connectionStatus}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          <div className="space-x-2">
            <Button 
              onClick={testConnection}
              disabled={isLoading}
              className="mr-2"
            >
              Test Connection
            </Button>
            <Button 
              onClick={createTestProject}
              disabled={isLoading}
              variant="secondary"
            >
              Create Test Project
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Projects ({projects.length})</h3>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500">No projects found</p>
          ) : (
            <ul className="space-y-1">
              {projects.map(project => (
                <li key={project.id} className="text-sm p-2 bg-gray-100 dark:bg-gray-700 rounded">
                  <strong>{project.name}</strong> ({project.language}) - {project.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CanisterTest; 