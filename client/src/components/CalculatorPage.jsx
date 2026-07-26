import { useState } from 'react';
import SolidToSolutionCalculator from './SolidToSolutionCalculator';
import DilutionCalculator from './DilutionCalculator';
import BufferCalculator from './BufferCalculator';
import StandardizationCalculator from './StandardizationCalculator';

export default function CalculatorPage() {
  const [currentCalculator, setCurrentCalculator] = useState('concentration'); // 'concentration', 'buffer', 'standardization'
  const [subMode, setSubMode] = useState('solid'); // 농도 계산 내 모드

  const tabButtonStyle = (isActive) => ({
    padding: '12px 20px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'all 0.2s',
  });

  const subModeButtonStyle = (isActive) => ({
    flex: 1,
    padding: '12px 20px',
    backgroundColor: isActive ? '#007bff' : '#e9ecef',
    color: isActive ? 'white' : '#333',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '14px',
    transition: 'all 0.2s',
  });

  return (
    <div style={{ padding: '0' }}>
      {/* 타이틀 */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>⚗️ 고급 계산기 패키지</h2>
        <p style={{ margin: '0', color: '#666', fontSize: '14px' }}>분석화학 실험실용 종합 계산 도구</p>
      </div>

      {/* 탭 선택 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setCurrentCalculator('concentration')}
          style={tabButtonStyle(currentCalculator === 'concentration')}
        >
          🧮 농도/묽힘
        </button>
        <button
          onClick={() => setCurrentCalculator('buffer')}
          style={tabButtonStyle(currentCalculator === 'buffer')}
        >
          🧫 완충용액
        </button>
        <button
          onClick={() => setCurrentCalculator('standardization')}
          style={tabButtonStyle(currentCalculator === 'standardization')}
        >
          📊 표정/통계
        </button>
      </div>

      {/* 농도/묽힘 계산기 */}
      {currentCalculator === 'concentration' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setSubMode('solid')}
              style={subModeButtonStyle(subMode === 'solid')}
            >
              ⚪ 고체 시약 → 용액 제조
            </button>
            <button
              onClick={() => setSubMode('dilution')}
              style={subModeButtonStyle(subMode === 'dilution')}
            >
              💧 원액 → 희석
            </button>
          </div>

          <div style={{ padding: '20px', backgroundColor: '#fafbfc', borderRadius: '8px', border: '1px solid #ddd' }}>
            {subMode === 'solid' ? <SolidToSolutionCalculator /> : <DilutionCalculator />}
          </div>
        </div>
      )}

      {/* 완충용액 계산기 */}
      {currentCalculator === 'buffer' && (
        <div style={{ padding: '20px', backgroundColor: '#fafbfc', borderRadius: '8px', border: '1px solid #ddd' }}>
          <BufferCalculator />
        </div>
      )}

      {/* 표정/통계 계산기 */}
      {currentCalculator === 'standardization' && (
        <div style={{ padding: '20px', backgroundColor: '#fafbfc', borderRadius: '8px', border: '1px solid #ddd' }}>
          <StandardizationCalculator />
        </div>
      )}
    </div>
  );
}