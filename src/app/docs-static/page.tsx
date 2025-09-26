import Link from 'next/link';

export default function StaticDocs() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, sans-serif',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        lineHeight: '1.6',
      }}
    >
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '40px',
          borderRadius: '12px',
          marginBottom: '30px',
          textAlign: 'center',
        }}
      >
        <h1 style={{ margin: '0 0 15px 0', fontSize: '2.5rem' }}>📖 Todo API Documentation</h1>
        <p style={{ margin: 0, fontSize: '1.2rem', opacity: 0.9 }}>
          完整的 REST API 文檔 - 前端評測輔助用
        </p>
      </div>

      <div
        style={{
          background: '#f8f9fa',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '30px',
        }}
      >
        <h2 style={{ color: '#2d3748', marginTop: 0 }}>📋 快速連結</h2>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <Link
            href="/docs"
            style={{
              background: '#4299e1',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            🎯 Swagger UI (互動式)
          </Link>
          <Link
            href="/api/docs"
            style={{
              background: '#38a169',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            📄 OpenAPI JSON
          </Link>
          <Link
            href="/"
            style={{
              background: '#805ad5',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '500',
            }}
          >
            🏠 主頁
          </Link>
        </div>
      </div>

      <div style={{ display: 'grid', gap: '20px' }}>
        <section
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#2d3748', marginTop: 0 }}>🚀 API 端點總覽</h2>
          <div style={{ overflowX: 'auto' }}>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
                fontSize: '14px',
              }}
            >
              <thead>
                <tr style={{ background: '#f7fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    方法
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    路徑
                  </th>
                  <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #e2e8f0' }}>
                    說明
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { method: 'GET', path: '/api/todos', desc: '取得所有待辦事項' },
                  { method: 'POST', path: '/api/todos', desc: '新增待辦事項' },
                  { method: 'GET', path: '/api/todos/{id}', desc: '取得單筆待辦事項' },
                  { method: 'PATCH', path: '/api/todos/{id}', desc: '更新待辦事項' },
                  { method: 'DELETE', path: '/api/todos/{id}', desc: '刪除待辦事項' },
                  { method: 'PATCH', path: '/api/todos/bulk', desc: '批次操作' },
                ].map((row, i) => (
                  <tr key={i}>
                    <td
                      style={{
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        background: getMethodColor(row.method),
                        color: 'white',
                        fontWeight: '600',
                        textAlign: 'center',
                      }}
                    >
                      {row.method}
                    </td>
                    <td
                      style={{
                        padding: '12px',
                        border: '1px solid #e2e8f0',
                        fontFamily: 'Monaco, monospace',
                        background: '#f7fafc',
                      }}
                    >
                      {row.path}
                    </td>
                    <td style={{ padding: '12px', border: '1px solid #e2e8f0' }}>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#2d3748', marginTop: 0 }}>🎯 快速測試</h2>
          <div
            style={{
              background: '#f7fafc',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px',
            }}
          >
            <strong>取得所有待辦事項：</strong>
            <pre
              style={{
                margin: '8px 0 0 0',
                padding: '10px',
                background: '#2d3748',
                color: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '13px',
              }}
            >
              curl http://localhost:3001/api/todos
            </pre>
          </div>

          <div
            style={{
              background: '#f7fafc',
              padding: '15px',
              borderRadius: '6px',
              marginBottom: '15px',
            }}
          >
            <strong>新增待辦事項：</strong>
            <pre
              style={{
                margin: '8px 0 0 0',
                padding: '10px',
                background: '#2d3748',
                color: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '13px',
              }}
            >
              {`curl -X POST http://localhost:3001/api/todos \\
  -H "Content-Type: application/json" \\
  -d '{"title":"新待辦事項","notes":"測試用"}'`}
            </pre>
          </div>

          <div style={{ background: '#f7fafc', padding: '15px', borderRadius: '6px' }}>
            <strong>篩選已完成項目：</strong>
            <pre
              style={{
                margin: '8px 0 0 0',
                padding: '10px',
                background: '#2d3748',
                color: '#e2e8f0',
                borderRadius: '4px',
                overflow: 'auto',
                fontSize: '13px',
              }}
            >
              curl http://localhost:3001/api/todos?status=completed
            </pre>
          </div>
        </section>

        <section
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#2d3748', marginTop: 0 }}>📝 回應格式</h2>
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#38a169', fontSize: '1.1rem' }}>✅ 成功回應</h3>
            <pre
              style={{
                background: '#f0fff4',
                border: '1px solid #9ae6b4',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '13px',
              }}
            >
              {`{
  "success": true,
  "data": {
    // 資料內容
  }
}`}
            </pre>
          </div>

          <div>
            <h3 style={{ color: '#e53e3e', fontSize: '1.1rem' }}>❌ 錯誤回應</h3>
            <pre
              style={{
                background: '#fff5f5',
                border: '1px solid #feb2b2',
                padding: '15px',
                borderRadius: '6px',
                overflow: 'auto',
                fontSize: '13px',
              }}
            >
              {`{
  "success": false,
  "error": {
    "code": "BAD_REQUEST",
    "message": "Validation failed",
    "details": { /* 錯誤詳情 */ }
  }
}`}
            </pre>
          </div>
        </section>

        <section
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h2 style={{ color: '#2d3748', marginTop: 0 }}>🔧 特色功能</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '15px',
            }}
          >
            {[
              { icon: '🚀', title: '零配置', desc: '無需資料庫或環境變數設定' },
              { icon: '📦', title: '內建種子資料', desc: '啟動即有 8 筆示範資料' },
              { icon: '🔄', title: '記憶體儲存', desc: '重啟伺服器即重置資料' },
              { icon: '🌐', title: '開放 CORS', desc: '支援任何 localhost 前端連接' },
              { icon: '✅', title: '完整 CRUD', desc: '提供所有基本操作' },
              { icon: '🎯', title: '批次操作', desc: '支援一次完成多項操作' },
              { icon: '📝', title: 'Type-safe', desc: '使用 TypeScript 與 Zod 驗證' },
              { icon: '📋', title: 'Swagger 文檔', desc: '完整的 OpenAPI 3.0 文檔' },
            ].map((feature, i) => (
              <div
                key={i}
                style={{
                  background: '#f7fafc',
                  padding: '15px',
                  borderRadius: '6px',
                }}
              >
                <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{feature.icon}</div>
                <div style={{ fontWeight: '600', marginBottom: '4px' }}>{feature.title}</div>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{feature.desc}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer
        style={{
          textAlign: 'center',
          marginTop: '40px',
          padding: '20px',
          color: '#666',
          fontSize: '14px',
        }}
      >
        <p>🚀 前端評測輔助用 Todo API | Next.js 15 + TypeScript</p>
      </footer>
    </div>
  );
}

function getMethodColor(method: string): string {
  const colors = {
    GET: '#38a169',
    POST: '#3182ce',
    PATCH: '#d69e2e',
    DELETE: '#e53e3e',
  };
  return colors[method as keyof typeof colors] || '#666';
}
