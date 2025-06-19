import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useHistory } from 'react-router-dom';
import './App.css';

const mainBg = "min-h-screen bg-gray-900 text-white pb-24";
const cardBg = "bg-gray-800";
const cardBase = "rounded-xl shadow-lg";
const mainPadding = "p-8";
const mainContainer = `max-w-xl mx-auto mt-10 ${mainPadding} ${cardBg} ${cardBase}`;
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
    <div className="racket-select">
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
          <tr><td>Weight</td><td>{racket.weight}</td></tr>
          <tr><td>Grip Size</td><td>{racket.gripSize}</td></tr>
          <tr><td>Balance</td><td>{racket.balance}</td></tr>
          <tr><td>Play Style</td><td>{racket.playStyle}</td></tr>
          <tr><td>Flexibility</td><td>{racket.flexibility}</td></tr>
          <tr><td>Frame Material</td><td>{racket.frameMaterial}</td></tr>
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
  const history = useHistory();

  const selectedRacket = rackets.find(r => r.id === selectedId);

  const handleAddToCompare = () => {
    if (selectedId && !compareList.includes(selectedId)) {
      setCompareList([...compareList, selectedId]);
    }
  };

  return (
    <div className={mainBg}>
      <Header />
      <main className={mainContainer}>
        <RacketSelect rackets={rackets} onSelect={setSelectedId} selectedId={selectedId} />
        <div className="flex gap-4 mb-4">
          <button onClick={handleAddToCompare} disabled={!selectedId || compareList.includes(selectedId)} className={btnSuccess}>Add to Compare</button>
        </div>
        {selectedId && <RacketDetail racket={selectedRacket} />}
      </main>
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
            {['weight','gripSize','balance','playStyle','flexibility','frameMaterial'].map(spec => (
              <tr key={spec}>
                <td>{spec.charAt(0).toUpperCase() + spec.slice(1).replace(/([A-Z])/g, ' $1')}</td>
                {selectedRackets.map(r => <td key={r.id}>{r[spec]}</td>)}
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