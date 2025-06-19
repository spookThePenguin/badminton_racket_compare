import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import './App.css';

const mainBg = "min-h-screen bg-gray-900 text-white pb-24";
const cardBg = "bg-gray-800";
const cardBase = "rounded-xl shadow-lg";
const mainPadding = "p-8";
// const mainContainer = `max-w-xl mx-auto mt-10 ${mainPadding} ${cardBg} ${cardBase}`;
const btnBase = "px-4 py-2 rounded font-semibold transition";
const btnSuccess = `${btnBase} bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed`;

function Header() {
  return (
    <header className="header">
      <div className="text-2xl font-bold flex items-center gap-2">
        <span role="img" aria-label="badminton racket">🏸</span> RacketCompare
      </div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/compare">Compare</Link>
      </nav>
    </header>
  );
}

function RacketSelect({ rackets, onSelect, selectedId }) {
  return (
    <div className="racket-select flex flex-col items-center">
      <label htmlFor="racket-dropdown">Select a Racket</label>
      <select
        id="racket-dropdown"
        value={selectedId || ''}
        onChange={e => onSelect(e.target.value)}
      >
        <option value="" disabled>Select...</option>
        {rackets.map(racket => (
          <option key={racket.id} value={racket.id}>{racket.name}</option>
        ))}
      </select>
    </div>
  );
}

function RacketDetail({ racket }) {
  if (!racket) return null;
  return (
    <div className="racket-detail-card">
      <h3>{racket.name}</h3>
      <table>
        <tbody>
          <tr><td>Weight</td><td>{Object.entries(racket.weight).map(([k, v]) => <div key={k}>{k}: {v}</div>)}</td></tr>
          <tr><td>Grip Size</td><td>{racket.gripSize.join(', ')}</td></tr>
          <tr><td>Balance</td><td>{racket.balance}</td></tr>
          <tr><td>Play Style</td><td>{racket.playStyle}</td></tr>
          <tr><td>Flexibility</td><td>{racket.flexibility}</td></tr>
          <tr><td>Frame Material</td><td>{racket.frameMaterial}</td></tr>
          <tr><td>Shaft Material</td><td>{racket.shaftMaterial}</td></tr>
          <tr><td>Length</td><td>{racket.length}</td></tr>
          <tr><td>String Tension</td><td>{Object.entries(racket.stringTension).map(([k, v]) => <div key={k}>{k}: {v}</div>)}</td></tr>
          <tr><td>Made In</td><td>{racket.madeIn}</td></tr>
          <tr><td>Technologies</td><td>{racket.technologies.join(', ')}</td></tr>
        </tbody>
      </table>
      {racket.image && <img src={racket.image} alt={racket.name} className="racket-img" />}
    </div>
  );
}

function FloatingCompareButton({ count, onClick }) {
  if (count < 2) return null;
  return (
    <button className="floating-compare-btn" onClick={onClick}>
      Compare ({count})
    </button>
  );
}

function LandingPage({ rackets, compareList, setCompareList }) {
  const [selectedId, setSelectedId] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const history = useHistory();

  // const brands = Array.from(new Set(rackets.map(r => r.name.split(' ')[0])));
  const brands = ["Yonex", "Li-Ning" , "Victor"];

  const selectedRacket = rackets.find(r => r.id === selectedId);

  const handleAddToCompare = () => {
    if (selectedId && !compareList.includes(selectedId)) {
      setCompareList([...compareList, selectedId]);
    }
  };

  // Helper to get brand image path
  const getBrandImage = (brand) => {
    if (!brand) return null;
    const fileName = brand.toLowerCase().replace(/\s+/g, '-');
    return `/brands/${fileName}.png`;
  };

  return (
    <div className={mainBg}>
      <Header />
      <div
        className="court-bg"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        {/* Brand Dropdown (Graph filter) */}
        <div className="mb-4 flex justify-center">
          <div className="flex flex-col items-center">
            <label htmlFor="brand-dropdown" className="block mb-1 font-semibold text-center">Chart</label>
            <select
              id="brand-dropdown"
              value={selectedBrand}
              onChange={e => setSelectedBrand(e.target.value)}
              className="text-black px-2 py-1 rounded"
            >
              <option value="">Select a brand...</option>
              {brands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Show brand image if selected */}
        {selectedBrand && (
          <div className="mb-4 flex justify-center">
            <img
              src={getBrandImage(selectedBrand)}
              alt={selectedBrand + ' logo'}
              style={{ maxHeight: '400px', maxWidth: '1000px', objectFit: 'contain' }}
              onError={e => { e.target.style.display = 'none'; }}
            />
          </div>
        )}
        {/* Add extra spacing between dropdowns */}
        <div style={{ height: '2rem' }} />
        <div className="flex justify-center mb-4">
          <div className="flex flex-col items-center">
            <RacketSelect rackets={rackets} onSelect={setSelectedId} selectedId={selectedId} />
          </div>
        </div>
        <div className="flex gap-4 mb-4 justify-center">
          <button onClick={handleAddToCompare} disabled={!selectedId || compareList.includes(selectedId)} className={btnSuccess}>Add to Compare</button>
        </div>
        {selectedId && <RacketDetail racket={selectedRacket} />}
      </div>
      <FloatingCompareButton count={compareList.length} onClick={() => history.push('/compare')} />
    </div>
  );
}

function ComparePage({ rackets, compareList, setCompareList }) {
  const selectedRackets = rackets.filter(r => compareList.includes(r.id));
  const history = useHistory();

  const handleRemove = (id) => {
    setCompareList(compareList.filter(rid => rid !== id));
  };
  const handleClearAll = () => setCompareList([]);

  // List all specs to compare
  const specs = [
    { key: 'weight', label: 'Weight', render: r => Object.entries(r.weight).map(([k, v]) => <div key={k}>{k}: {v}</div>) },
    { key: 'gripSize', label: 'Grip Size', render: r => r.gripSize.join(', ') },
    { key: 'balance', label: 'Balance' },
    { key: 'playStyle', label: 'Play Style' },
    { key: 'flexibility', label: 'Flexibility' },
    { key: 'frameMaterial', label: 'Frame Material' },
    { key: 'shaftMaterial', label: 'Shaft Material' },
    { key: 'length', label: 'Length' },
    { key: 'stringTension', label: 'String Tension', render: r => Object.entries(r.stringTension).map(([k, v]) => <div key={k}>{k}: {v}</div>) },
    { key: 'madeIn', label: 'Made In' },
    { key: 'technologies', label: 'Technologies', render: r => r.technologies.join(', ') },
  ];

  return (
    <div className="compare-page">
      <Header />
      <main>
        <button onClick={() => history.push('/')}>Back to Home</button>
        <table className="compare-table">
          <thead>
            <tr>
              <th>Specification</th>
              {selectedRackets.map(r => <th key={r.id}>{r.name} <button onClick={() => handleRemove(r.id)}>Remove</button></th>)}
            </tr>
          </thead>
          <tbody>
            {specs.map(spec => (
              <tr key={spec.key}>
                <td>{spec.label}</td>
                {selectedRackets.map(r => <td key={r.id}>{spec.render ? spec.render(r) : r[spec.key]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleClearAll}>Clear All</button>
      </main>
    </div>
  );
}

function App() {
  const [rackets, setRackets] = useState([]);
  const [compareList, setCompareList] = useState(() => {
    const saved = localStorage.getItem('compareList');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch('/rackets.json')
      .then(res => res.json())
      .then(setRackets);
  }, []);

  useEffect(() => {
    localStorage.setItem('compareList', JSON.stringify(compareList));
  }, [compareList]);

  return (
    <Router>
      <Switch>
        <Route exact path="/" render={() => <LandingPage rackets={rackets} compareList={compareList} setCompareList={setCompareList} />} />
        <Route path="/compare" render={() => <ComparePage rackets={rackets} compareList={compareList} setCompareList={setCompareList} />} />
      </Switch>
    </Router>
  );
}

export default App;