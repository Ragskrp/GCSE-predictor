import React, { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Share2, Sparkles } from 'lucide-react';
import './styles.css';

const questions = [
  { topic: 'Algebra', text: 'Solve for x:', equation: '3(x + 2) = 15', options: ['x = 3', 'x = 4', 'x = 5', 'x = 6'], answer: 0, difficulty: 2 },
  { topic: 'Number', text: 'Write 0.35 as a fraction in its simplest form.', options: ['3/5', '7/20', '35/10', '1/35'], answer: 1, difficulty: 2 },
  { topic: 'Ratio', text: 'A ratio is 2 : 3. If the first amount is 14, what is the second?', options: ['18', '20', '21', '24'], answer: 2, difficulty: 2 },
  { topic: 'Geometry', text: 'A triangle has angles 48° and 67°. Find the third angle.', options: ['55°', '65°', '75°', '85°'], answer: 1, difficulty: 2 },
  { topic: 'Probability', text: 'A fair six-sided die is rolled. What is the probability of rolling an even number?', options: ['1/6', '1/3', '1/2', '2/3'], answer: 2, difficulty: 2 },
  { topic: 'Algebra', text: 'Expand: 4(2x − 3)', options: ['8x − 3', '8x − 12', '6x − 12', '8x + 12'], answer: 1, difficulty: 3 },
  { topic: 'Algebra', text: 'Solve for x:', equation: '2x − 5 = 13', options: ['x = 4', 'x = 8', 'x = 9', 'x = 18'], answer: 2, difficulty: 3 },
  { topic: 'Statistics', text: 'The mean of 4, 7 and 10 is:', options: ['6', '7', '8', '9'], answer: 1, difficulty: 2 },
  { topic: 'Graphs', text: 'Which gradient describes a line rising 6 units for every 2 units across?', options: ['2', '3', '4', '6'], answer: 1, difficulty: 3 },
  { topic: 'Number', text: 'What is 15% of 80?', options: ['8', '10', '12', '15'], answer: 2, difficulty: 2 },
  { topic: 'Geometry', text: 'A rectangle is 8 cm by 5 cm. What is its area?', options: ['13 cm²', '26 cm²', '40 cm²', '80 cm²'], answer: 2, difficulty: 1 },
  { topic: 'Algebra', text: 'Factorise: 6x + 12', options: ['2(3x + 6)', '6(x + 2)', '3(2x + 12)', '6(x + 6)'], answer: 1, difficulty: 3 },
  { topic: 'Ratio', text: 'Simplify the ratio 18 : 24.', options: ['2 : 3', '3 : 4', '4 : 3', '6 : 8'], answer: 1, difficulty: 2 },
  { topic: 'Probability', text: 'A bag contains 3 red and 7 blue counters. What is P(red)?', options: ['3/7', '3/10', '7/10', '1/3'], answer: 1, difficulty: 2 },
  { topic: 'Number', text: 'Which is the largest?', options: ['0.6', '5/8', '61%', '0.59'], answer: 1, difficulty: 3 },
  { topic: 'Statistics', text: 'Find the median of 3, 9, 4, 7, 5.', options: ['4', '5', '6', '7'], answer: 1, difficulty: 2 },
  { topic: 'Graphs', text: 'For y = 2x + 1, what is y when x = 4?', options: ['7', '8', '9', '10'], answer: 2, difficulty: 3 },
  { topic: 'Geometry', text: 'A square has side length 6 cm. What is its perimeter?', options: ['12 cm', '18 cm', '24 cm', '36 cm'], answer: 2, difficulty: 1 },
];

function App() {
  const [screen, setScreen] = useState('start');
  const [board, setBoard] = useState('AQA');
  const [subject, setSubject] = useState('Maths');
  const [tier, setTier] = useState('Higher');
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);

  const score = answers.filter(Boolean).length;
  const percentage = Math.round((score / questions.length) * 100);
  const grade = percentage >= 90 ? 9 : percentage >= 80 ? 8 : percentage >= 70 ? 7 : percentage >= 60 ? 6 : percentage >= 50 ? 5 : percentage >= 40 ? 4 : percentage >= 30 ? 3 : percentage >= 20 ? 2 : 1;
  const confidence = percentage >= 65 ? 'High' : percentage >= 45 ? 'Medium' : 'Building';
  const weakTopics = useMemo(() => {
    const misses = {};
    questions.forEach((q, i) => { if (answers[i] === false) misses[q.topic] = (misses[q.topic] || 0) + 1; });
    return Object.entries(misses).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([topic]) => topic);
  }, [answers]);

  const start = () => { setIndex(0); setAnswers([]); setSelected(null); setScreen('quiz'); };
  const next = () => {
    if (selected === null) return;
    const nextAnswers = [...answers];
    nextAnswers[index] = selected === questions[index].answer;
    setAnswers(nextAnswers);
    if (index === questions.length - 1) setScreen('result');
    else { setIndex(index + 1); setSelected(null); }
  };

  return <main className="app-shell">
    {screen === 'start' && <Start board={board} setBoard={setBoard} subject={subject} setSubject={setSubject} tier={tier} setTier={setTier} start={start} />}
    {screen === 'quiz' && <Quiz q={questions[index]} index={index} selected={selected} choose={setSelected} next={next} board={board} subject={subject} tier={tier} back={() => index ? (setIndex(index - 1), setSelected(null)) : setScreen('start')} />}
    {screen === 'result' && <Result grade={grade} percentage={percentage} confidence={confidence} weakTopics={weakTopics} share={() => setScreen('share')} board={board} subject={subject} tier={tier} />}
    {screen === 'share' && <Share grade={grade} percentage={percentage} confidence={confidence} board={board} subject={subject} tier={tier} back={() => setScreen('result')} />}
  </main>;
}

function Logo() { return <div className="logo">GCSE <span><Sparkles size={15} /></span><br/><strong>Predictor</strong></div>; }
function Start({ board, setBoard, subject, setSubject, tier, setTier, start }) {
  return <section className="screen start-screen">
    <header><Logo /><div className="micro-copy">Better<br/>grades<br/>brighter you</div></header>
    <div className="hero-star">✦</div>
    <div className="hero-copy"><h1>GCSE<br/>Grade<br/><em>Predictor</em></h1><p>Take a short diagnostic. See your estimated grade. Find your weak topics. Improve and track your progress.</p></div>
    <Picker label="Exam Board" values={['AQA', 'Edexcel']} value={board} setValue={setBoard}/>
    <Picker label="Subject" values={['Maths', 'Combined Science']} value={subject} setValue={setSubject}/>
    <Picker label="Tier" values={['Foundation', 'Higher']} value={tier} setValue={setTier}/>
    <button className="primary" onClick={start}>Start Diagnostic <ArrowRight size={18}/></button>
    <div className="tiny-note">~ 2 taps to start</div>
  </section>;
}
function Picker({label, values, value, setValue}) { return <div className="picker"><label>{label}</label><div>{values.map(v => <button key={v} className={value === v ? 'selected' : ''} onClick={() => setValue(v)}>{v}</button>)}</div></div>; }
function Quiz({ q, index, selected, choose, next, back, board, subject, tier }) {
  return <section className="screen quiz-screen">
    <header className="quiz-header"><button className="icon-btn" onClick={back}><ArrowLeft/></button><span>{subject}&nbsp; • &nbsp;{board}&nbsp; • &nbsp;{tier}</span><button className="text-btn" onClick={() => back()}>Exit</button></header>
    <div className="progress"><div style={{width: `${((index + 1) / questions.length) * 100}%`}} /></div>
    <div className="question-meta"><span>Question {index + 1} of {questions.length}</span><Bookmark size={18}/></div>
    <span className="topic-tag">{q.topic}</span>
    <div className="question"><h2>{q.text}</h2>{q.equation && <div className="equation">{q.equation}</div>}</div>
    <div className="options">{q.options.map((o, i) => <button key={o} className={selected === i ? 'option active' : 'option'} onClick={() => choose(i)}><span>{String.fromCharCode(65+i)}</span>{o}</button>)}</div>
    <button className="primary bottom" disabled={selected === null} onClick={next}>{index === questions.length - 1 ? 'Reveal my grade' : 'Next'} <ArrowRight size={18}/></button>
  </section>;
}
function Result({grade, percentage, confidence, weakTopics, share, board, subject, tier}) {
  return <section className="screen result-screen"><header><Logo/><button className="icon-btn" onClick={share} aria-label="Share result"><Share2/></button></header><div className="result-title">Your estimated grade</div><div className="grade-wrap"><div className="orbit"/><div className="grade">{grade}</div></div><div className="solid">SOLID {grade}</div><p className="disclaimer">Based on your performance in this diagnostic. This is a practice-based estimate, not an official grade.</p><div className="stats"><Stat value={`${percentage}%`} label="Questions correct"/><Stat value={confidence} label="Confidence in this grade"/><Stat value={questions.length} label="Questions completed"/></div><button className="primary" onClick={share}><Share2 size={18}/> Share Your Result</button><button className="secondary" onClick={() => document.getElementById('breakdown')?.scrollIntoView({behavior:'smooth'})}>View Topic Breakdown</button>{weakTopics.length > 0 && <div id="breakdown" className="weak"><span>Focus next</span>{weakTopics.map(t => <b key={t}>{t}</b>)}</div>}<div className="result-context">{board} · {subject} · {tier}</div></section>;
}
function Stat({value,label}) { return <div className="stat"><strong>{value}</strong><span>{label}</span></div>; }
function Share({grade, percentage, confidence, board, subject, tier, back}) {
  const link = 'https://gcsepredictor.app/abc123';
  const share = async () => {
    if (navigator.share) await navigator.share({title:'My GCSE grade prediction', text:`I got a ${grade} in GCSE ${subject}!`, url:link});
    else await navigator.clipboard?.writeText(link);
  };
  const copy = async () => { await navigator.clipboard?.writeText(link); };
  return <section className="screen share-screen"><header className="quiz-header"><button className="icon-btn" onClick={back}><ArrowLeft/></button><strong>Share Your Result</strong><span/></header><div className="share-tabs"><span className="active">Share Card</span><button onClick={copy}>Copy Link</button></div><div className="share-card"><div className="card-logo">GCSE <Sparkles size={12}/><br/><strong>Predictor</strong></div><p>I got a</p><div className="card-grade">{grade}</div><h3>in GCSE {subject}</h3><span>{board} • {tier}</span><div className="card-stats"><b>{percentage}%<small>questions correct</small></b><b>{confidence}<small>confidence</small></b></div><div className="card-bottom">How will you do?<br/><small>Try it now · gcsepredictor.app/abc123</small><div className="qr">▦</div></div></div><div className="share-actions"><button onClick={share}>Share</button><button onClick={copy}>Copy link</button></div><div className="share-label">Snapchat first · 9:16 share card</div></section>;
}

createRoot(document.getElementById('root')).render(<App />);
