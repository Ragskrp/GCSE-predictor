import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowLeft, ArrowRight, Bookmark, Share2, Sparkles } from 'lucide-react';
import { questionBank } from './data/questionBank';
import { DIAGNOSTIC_LENGTH, START_DIFFICULTY, calculateWeightedScore, confidenceBand, estimateGrade, findWeakTopics, filterQuestions, nextDifficulty, selectNextQuestion } from './engine/predictor';
import './styles.css';

function App() {
  const [screen, setScreen] = useState('start');
  const [board, setBoard] = useState('AQA');
  const [subject, setSubject] = useState('Maths');
  const [tier, setTier] = useState('Higher');
  const [pool, setPool] = useState([]);
  const [current, setCurrent] = useState(null);
  const [usedIds, setUsedIds] = useState(new Set());
  const [difficulty, setDifficulty] = useState(START_DIFFICULTY);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const available = filterQuestions(questionBank, { board, subject, tier });
  const weightedScore = calculateWeightedScore(pool, answers);
  const grade = estimateGrade(weightedScore);
  const confidence = confidenceBand(weightedScore);
  const weakTopics = useMemo(() => findWeakTopics(pool, answers), [pool, answers]);

  const start = () => {
    if (available.length < DIAGNOSTIC_LENGTH) return;
    const first = selectNextQuestion(available, new Set(), START_DIFFICULTY);
    setPool(available);
    setCurrent(first);
    setUsedIds(new Set(first ? [first.id] : []));
    setDifficulty(START_DIFFICULTY);
    setAnswers([]);
    setSelected(null);
    setScreen('quiz');
  };

  const answer = () => {
    if (selected === null || !current) return;
    const correct = selected === current.answer;
    const nextAnswers = [...answers, correct];
    const newDifficulty = nextDifficulty(difficulty, correct);
    const nextUsed = new Set(usedIds);
    setAnswers(nextAnswers);
    setDifficulty(newDifficulty);
    setSelected(null);

    if (nextAnswers.length >= DIAGNOSTIC_LENGTH) {
      setScreen('result');
      return;
    }

    const next = selectNextQuestion(pool, nextUsed, newDifficulty);
    if (next) {
      nextUsed.add(next.id);
      setUsedIds(nextUsed);
      setCurrent(next);
    } else {
      setScreen('result');
    }
  };

  return <main className="app-shell">
    {screen === 'start' && <Start board={board} setBoard={setBoard} subject={subject} setSubject={setSubject} tier={tier} setTier={setTier} start={start} available={available.length >= DIAGNOSTIC_LENGTH} />}
    {screen === 'quiz' && current && <Quiz q={current} index={answers.length} selected={selected} choose={setSelected} next={answer} back={() => setScreen('start')} board={board} subject={subject} tier={tier} />}
    {screen === 'result' && <Result grade={grade} percentage={Math.round(weightedScore * 100)} confidence={confidence} weakTopics={weakTopics} share={() => setScreen('share')} board={board} subject={subject} tier={tier} />}
    {screen === 'share' && <Share grade={grade} percentage={Math.round(weightedScore * 100)} confidence={confidence} board={board} subject={subject} tier={tier} back={() => setScreen('result')} />}
  </main>;
}

function Logo() { return <div className="logo">GCSE <span><Sparkles size={15} /></span><br/><strong>Predictor</strong></div>; }
function Start({ board, setBoard, subject, setSubject, tier, setTier, start, available }) {
  return <section className="screen start-screen">
    <header><Logo /><div className="micro-copy">Better<br/>grades<br/>brighter you</div></header>
    <div className="hero-star">✦</div>
    <div className="hero-copy"><h1>GCSE<br/>Grade<br/><em>Predictor</em></h1><p>Take a short diagnostic. See your estimated grade. Find your weak topics. Improve and track your progress.</p></div>
    <Picker label="Exam Board" values={['AQA', 'Edexcel']} value={board} setValue={setBoard}/>
    <Picker label="Subject" values={['Maths', 'Combined Science']} value={subject} setValue={setSubject}/>
    <Picker label="Tier" values={['Foundation', 'Higher']} value={tier} setValue={setTier}/>
    <button className="primary" disabled={!available} onClick={start}>{available ? <>Start Diagnostic <ArrowRight size={18}/></> : 'Questions for this combination coming soon'}</button>
    <div className="tiny-note">{available ? '~ 2 taps to start' : 'The seed question bank currently contains AQA Maths Higher only.'}</div>
  </section>;
}
function Picker({label, values, value, setValue}) { return <div className="picker"><label>{label}</label><div>{values.map(v => <button key={v} className={value === v ? 'selected' : ''} onClick={() => setValue(v)}>{v}</button>)}</div></div>; }
function Quiz({ q, index, selected, choose, next, back, board, subject, tier }) {
  return <section className="screen quiz-screen">
    <header className="quiz-header"><button className="icon-btn" onClick={back}><ArrowLeft/></button><span>{subject}&nbsp; • &nbsp;{board}&nbsp; • &nbsp;{tier}</span><button className="text-btn" onClick={back}>Exit</button></header>
    <div className="progress"><div style={{width: `${((index + 1) / DIAGNOSTIC_LENGTH) * 100}%`}} /></div>
    <div className="question-meta"><span>Question {index + 1} of {DIAGNOSTIC_LENGTH}</span><Bookmark size={18}/></div>
    <span className="topic-tag">{q.topic}</span>
    <div className="question"><h2>{q.text}</h2>{q.equation && <div className="equation">{q.equation}</div>}</div>
    <div className="options">{q.options.map((o, i) => <button key={o} className={selected === i ? 'option active' : 'option'} onClick={() => choose(i)}><span>{String.fromCharCode(65+i)}</span>{o}</button>)}</div>
    <button className="primary bottom" disabled={selected === null} onClick={next}>{index === DIAGNOSTIC_LENGTH - 1 ? 'Reveal my grade' : 'Next'} <ArrowRight size={18}/></button>
  </section>;
}
function Result({grade, percentage, confidence, weakTopics, share, board, subject, tier}) {
  return <section className="screen result-screen"><header><Logo/><button className="icon-btn" onClick={share} aria-label="Share result"><Share2/></button></header><div className="result-title">Your estimated grade</div><div className="grade-wrap"><div className="orbit"/><div className="grade">{grade}</div></div><div className="solid">SOLID {grade}</div><p className="disclaimer">Based on your performance in this diagnostic. This is a practice-based estimate, not an official grade.</p><div className="stats"><Stat value={`${percentage}%`} label="Weighted score"/><Stat value={confidence} label="Confidence in this grade"/><Stat value={DIAGNOSTIC_LENGTH} label="Questions completed"/></div><button className="primary" onClick={share}><Share2 size={18}/> Share Your Result</button><button className="secondary" onClick={() => document.getElementById('breakdown')?.scrollIntoView({behavior:'smooth'})}>View Topic Breakdown</button>{weakTopics.length > 0 && <div id="breakdown" className="weak"><span>Focus next</span>{weakTopics.map(t => <b key={t.specPoint}>{t.specPoint.replace('MATHS-', '').replace('-SEED', '').toLowerCase()}</b>)}</div>}<div className="result-context">{board} · {subject} · {tier}</div></section>;
}
function Stat({value,label}) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }
function Share({grade, percentage, confidence, board, subject, tier, back}) {
  const link = 'https://gcsepredictor.app/abc123';
  const share = async () => { if (navigator.share) await navigator.share({title:'My GCSE grade prediction', text:`I got a ${grade} in GCSE ${subject}!`, url:link}); else await navigator.clipboard?.writeText(link); };
  const copy = async () => { await navigator.clipboard?.writeText(link); };
  return <section className="screen share-screen"><header className="quiz-header"><button className="icon-btn" onClick={back}><ArrowLeft/></button><strong>Share Your Result</strong><span/></header><div className="share-tabs"><span className="active">Share Card</span><button onClick={copy}>Copy Link</button></div><div className="share-card"><div className="card-logo">GCSE <Sparkles size={12}/><br/><strong>Predictor</strong></div><p>I got a</p><div className="card-grade">{grade}</div><h3>in GCSE {subject}</h3><span>{board} • {tier}</span><div className="card-stats"><b>{percentage}%<small>weighted score</small></b><b>{confidence}<small>confidence</small></b></div><div className="card-bottom">How will you do?<br/><small>Try it now · gcsepredictor.app/abc123</small><div className="qr">▦</div></div></div><div className="share-actions"><button onClick={share}>Share</button><button onClick={copy}>Copy link</button></div><div className="share-label">Snapchat first · 9:16 share card</div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
