import { useEffect, useState } from 'react';
import axios from 'axios';
import CalculatorPage from './components/CalculatorPage';

function TestPage({ reagents, loading, error }) {
  return (
    <div>
      <h1>🧪 시약 DB 연결 테스트</h1>

      {loading && <p>⏳ 로딩 중...</p>}

      {error && (
        <div style={{ color: 'red', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '4px' }}>
          ❌ 연결 실패: {error}
        </div>
      )}

      {!loading && !error && (
        <div>
          <h2>✅ API 연결 성공!</h2>
          <p>
            <strong>등록된 시약 개수:</strong> {reagents.length}개
          </p>

          {reagents.length > 0 && (
            <table
              style={{
                borderCollapse: 'collapse',
                width: '100%',
                marginTop: '20px',
                backgroundColor: '#f5f5f5',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>한글명</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>영문명</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>분자식</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>분자량</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>밀도</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>카테고리</th>
                  <th style={{ border: '1px solid #ddd', padding: '10px' }}>CAS No.</th>
                </tr>
              </thead>
              <tbody>
                {reagents.map((reagent, index) => (
                  <tr key={reagent.id} style={{ backgroundColor: index % 2 === 0 ? '#fff' : '#f9f9f9' }}>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.id}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.name_kr}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.name_en}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.formula}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.mw_anhydrous}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>
                      {reagent.density ? `${reagent.density} g/cm³` : '-'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.category}</td>
                    <td style={{ border: '1px solid #ddd', padding: '10px' }}>{reagent.cas_no || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [currentPage, setCurrentPage] = useState('calculator'); // 'calculator' 또는 'test'
  const [reagents, setReagents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReagents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/reagents');
        setReagents(response.data.data || []);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('API 호출 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReagents();
  }, []);

  const navButtonStyle = (isActive) => ({
    padding: '10px 15px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1200px', margin: '0 auto' }}>
      {/* 네비게이션 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '2px solid #ddd', paddingBottom: '15px' }}>
        <button
          onClick={() => setCurrentPage('calculator')}
          style={navButtonStyle(currentPage === 'calculator')}
        >
          🧮 농도 계산기
        </button>
        <button
          onClick={() => setCurrentPage('test')}
          style={navButtonStyle(currentPage === 'test')}
        >
          🧪 DB 연결 테스트
        </button>
      </div>

      {/* 페이지 내용 */}
      {currentPage === 'calculator' && <CalculatorPage />}
      {currentPage === 'test' && <TestPage reagents={reagents} loading={loading} error={error} />}
    </div>
  );
}

export default App;