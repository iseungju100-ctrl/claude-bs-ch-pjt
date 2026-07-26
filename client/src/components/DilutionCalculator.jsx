import { useState } from 'react';
import { calculateDilution, roundToSignificantFigures } from '../utils/calculatorUtils';

export default function DilutionCalculator() {
  const [concentrationMode, setConcentrationMode] = useState('direct'); // 'direct' 또는 'fromDensity'
  const [showSteps, setShowSteps] = useState(false);

  // 직접 입력 모드
  const [stockConcentration, setStockConcentration] = useState('');

  // 밀도 입력 모드
  const [stockDensity, setStockDensity] = useState('');
  const [stockMW, setStockMW] = useState('');
  const [stockAssay, setStockAssay] = useState(100);

  // 공통 입력
  const [targetConcentration, setTargetConcentration] = useState('');
  const [targetVolume, setTargetVolume] = useState('');
  const [decimalPlaces, setDecimalPlaces] = useState(2);

  // 결과
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    setError('');
    setResult(null);

    if (!targetConcentration || targetConcentration <= 0) {
      setError('❌ 목표 농도를 입력하세요.');
      return;
    }

    if (!targetVolume || targetVolume <= 0) {
      setError('❌ 목표 최종 부피를 입력하세요.');
      return;
    }

    let stockM = 0;

    if (concentrationMode === 'direct') {
      if (!stockConcentration || stockConcentration <= 0) {
        setError('❌ 원액 농도를 입력하세요.');
        return;
      }
      stockM = parseFloat(stockConcentration);
    } else {
      if (!stockDensity || stockDensity <= 0) {
        setError('❌ 원액 밀도를 입력하세요.');
        return;
      }
      if (!stockMW || stockMW <= 0) {
        setError('❌ 원액 분자량을 입력하세요.');
        return;
      }
      if (stockAssay <= 0 || stockAssay > 100) {
        setError('❌ 순도는 0~100% 범위여야 합니다.');
        return;
      }
    }

    try {
      const calculationResult = calculateDilution({
        stockConcentration: concentrationMode === 'direct' ? stockM : null,
        stockConcentrationUnit: concentrationMode === 'direct' ? 'M' : 'density',
        targetConcentration: parseFloat(targetConcentration),
        targetVolume: parseFloat(targetVolume),
        stockMW: parseFloat(stockMW),
        stockDensity: parseFloat(stockDensity),
        stockAssay: parseFloat(stockAssay),
        decimalPlaces,
      });

      setResult(calculationResult);
    } catch (err) {
      setError(`❌ 계산 오류: ${err.message}`);
    }
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    fontSize: '13px',
    color: '#333',
  };

  const containerStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
    marginBottom: '20px',
  };

  const groupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  return (
    <div style={{ padding: '0' }}>
      {/* 원액 농도 입력 방식 선택 */}
      <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h3>원액 농도 입력 방식</h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setConcentrationMode('direct')}
            style={{
              padding: '10px 20px',
              backgroundColor: concentrationMode === 'direct' ? '#007bff' : '#e9ecef',
              color: concentrationMode === 'direct' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            💾 원액 농도 (M) 직접 입력
          </button>
          <button
            onClick={() => setConcentrationMode('fromDensity')}
            style={{
              padding: '10px 20px',
              backgroundColor: concentrationMode === 'fromDensity' ? '#007bff' : '#e9ecef',
              color: concentrationMode === 'fromDensity' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ⚗️ 액체시약 (밀도 + 순도 → M)
          </button>
        </div>
      </div>

      {/* 원액 농도 입력 */}
      <div style={{ marginBottom: '30px', paddingBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h4 style={{ marginBottom: '15px' }}>원액 정보</h4>

        {concentrationMode === 'direct' ? (
          <div style={containerStyle}>
            <div style={groupStyle}>
              <label style={labelStyle}>원액 농도 (M)</label>
              <input
                type="number"
                placeholder="예: 10"
                value={stockConcentration}
                onChange={(e) => setStockConcentration(e.target.value)}
                style={inputStyle}
                step="0.01"
              />
            </div>
          </div>
        ) : (
          <div style={containerStyle}>
            <div style={groupStyle}>
              <label style={labelStyle}>밀도 (g/mL)</label>
              <input
                type="number"
                placeholder="예: 1.19"
                value={stockDensity}
                onChange={(e) => setStockDensity(e.target.value)}
                style={inputStyle}
                step="0.01"
              />
              <small style={{ color: '#666', fontSize: '12px' }}>액체시약의 밀도</small>
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>분자량 (g/mol)</label>
              <input
                type="number"
                placeholder="예: 36.46"
                value={stockMW}
                onChange={(e) => setStockMW(e.target.value)}
                style={inputStyle}
                step="0.01"
              />
            </div>

            <div style={groupStyle}>
              <label style={labelStyle}>순도 (%)</label>
              <input
                type="number"
                value={stockAssay}
                onChange={(e) => setStockAssay(e.target.value)}
                style={inputStyle}
                step="0.1"
                min="0"
                max="100"
              />
            </div>
          </div>
        )}
      </div>

      {/* 목표 농도 및 부피 */}
      <div style={containerStyle}>
        <div style={groupStyle}>
          <label style={labelStyle}>목표 농도 (M)</label>
          <input
            type="number"
            placeholder="예: 0.1"
            value={targetConcentration}
            onChange={(e) => setTargetConcentration(e.target.value)}
            style={inputStyle}
            step="0.01"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>목표 최종 부피 (mL)</label>
          <input
            type="number"
            placeholder="예: 1000"
            value={targetVolume}
            onChange={(e) => setTargetVolume(e.target.value)}
            style={inputStyle}
            step="10"
          />
        </div>

        <div style={groupStyle}>
          <label style={labelStyle}>유효숫자 (소수점 자릿수)</label>
          <input
            type="number"
            value={decimalPlaces}
            onChange={(e) => setDecimalPlaces(parseInt(e.target.value))}
            style={inputStyle}
            min="0"
            max="5"
          />
        </div>
      </div>

      {/* 에러 메시지 */}
      {error && (
        <div style={{ padding: '15px', backgroundColor: '#ffe0e0', border: '1px solid #ff6b6b', borderRadius: '4px', marginBottom: '20px', color: '#d32f2f' }}>
          {error}
        </div>
      )}

      {/* 계산 버튼 */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px' }}>
        <button
          onClick={handleCalculate}
          style={{
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '16px',
          }}
        >
          🧮 계산하기
        </button>
        {result && (
          <button
            onClick={() => setShowSteps(!showSteps)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            {showSteps ? '▼ 계산 과정 숨기기' : '▶ 계산 과정 보기'}
          </button>
        )}
      </div>

      {/* 결과 표시 */}
      {result && (
        <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '2px solid #007bff' }}>
          {/* 경고 메시지 */}
          {result.isWarning && (
            <div style={{ padding: '15px', backgroundColor: '#fff3cd', border: '2px solid #ff6b6b', borderRadius: '4px', marginBottom: '20px' }}>
              <strong style={{ color: '#d32f2f', fontSize: '16px' }}>❌ {result.guidance}</strong>
            </div>
          )}

          {/* 결과값 강조 */}
          <div
            style={{
              backgroundColor: result.isWarning ? '#ffebee' : '#f0f8ff',
              padding: '30px',
              borderRadius: '8px',
              textAlign: 'center',
              marginBottom: '20px',
              border: result.isWarning ? '2px solid #ff6b6b' : '2px solid #007bff',
            }}
          >
            <div style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
              {result.isWarning ? '🚫 오류 발생' : '✅ 계산 완료'}
            </div>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: result.isWarning ? '#d32f2f' : '#007bff', marginBottom: '10px' }}>
              {result.resultValue}
            </div>
            <div style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>
              <strong>{result.resultLabel}</strong> ({result.resultUnit})
            </div>

            {!result.isWarning && result.breakdown && (
              <div style={{ fontSize: '13px', color: '#555', padding: '15px', backgroundColor: '#e7f3ff', borderRadius: '4px', marginTop: '15px', textAlign: 'left' }}>
                <div style={{ marginBottom: '8px' }}>
                  💉 <strong>원액 부피:</strong> {result.breakdown.stockVolume} mL
                </div>
                <div>
                  💧 <strong>정제수 부피:</strong> {result.breakdown.waterVolume} mL
                </div>
              </div>
            )}

            <div style={{ fontSize: '14px', color: '#555', padding: '10px', backgroundColor: '#e7f3ff', borderRadius: '4px', marginTop: '15px' }}>
              📋 {result.guidance}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}