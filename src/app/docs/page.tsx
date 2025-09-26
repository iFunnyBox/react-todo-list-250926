'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamic import of SwaggerUI to avoid SSR issues
const DynamicSwaggerUI = dynamic(() => import('swagger-ui-react'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        padding: '40px',
        textAlign: 'center',
        fontSize: '18px',
        color: '#666',
      }}
    >
      <div style={{ marginBottom: '20px' }}>📖 Loading API Documentation...</div>
      <div
        style={{
          width: '40px',
          height: '40px',
          margin: '0 auto',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
        }}
      ></div>
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  ),
});

export default function SwaggerDocs() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Dynamically import the CSS
    // @ts-expect-error
    import('swagger-ui-react/swagger-ui.css')
      .then(() => {
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error('Failed to load Swagger UI CSS:', error);
        setIsLoaded(true); // Still try to render without CSS
      });
  }, []);

  if (!isLoaded) {
    return (
      <div
        style={{
          padding: '40px',
          textAlign: 'center',
          fontSize: '18px',
          color: '#666',
        }}
      >
        📖 Initializing API Documentation...
      </div>
    );
  }

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <DynamicSwaggerUI
        url="/api/docs"
        deepLinking={true}
        displayOperationId={false}
        defaultModelsExpandDepth={1}
        defaultModelExpandDepth={1}
        defaultModelRendering="example"
        displayRequestDuration={true}
        docExpansion="list"
        filter={true}
        showExtensions={true}
        showCommonExtensions={true}
        tryItOutEnabled={true}
      />
    </div>
  );
}
