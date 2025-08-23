import React, { useState } from 'react';
import { createMagazine } from '../lib/api';

const TestMagazinePage: React.FC = () => {
  const [result, setResult] = useState<{ error?: string } | Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const testCreateMagazine = async () => {
    setLoading(true);
    try {
      const testData = {
        name: "Test Magazine API",
        description: "Testing magazine creation API with all fields",
        category: "Technology",
        type: "free" as const,
        magzineType: "magzine" as const,
        image: "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/covers/test-image.jpg",
        file: "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/documents/test-file.pdf",
        audioFile: "https://pub-b8050509235e4bcca261901d10608e30.r2.dev/audio/test-audio.mp3",
        total_pages: 45,
        fileType: "pdf",
        isActive: true,
        rating: 4.5,
        downloads: 0,
        views: 0,
        likes: 0,
        reads: 0
      };

      console.log('Sending test data:', testData);
      
      const response = await createMagazine(testData);
      
      console.log('API Response:', response);
      setResult(response);
    } catch (error) {
      console.error('Error:', error);
      setResult({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Magazine Creation API</h1>
      
      <button
        onClick={testCreateMagazine}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Testing...' : 'Test Create Magazine'}
      </button>

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default TestMagazinePage;
