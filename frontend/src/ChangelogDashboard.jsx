import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

// =========================================================================
// 🏎️ SUB-COMPONENT: FULL-PAGE BACKGROUND ANIMATION CANVAS
// =========================================================================
function FullPageDriveAnimation({ pipelineStatus, currentStepText, progressPercent, onCarArrived }) {
  const [carLeft, setCarLeft] = useState(-180);
  const [activeBubble, setActiveBubble] = useState('greet'); 
  const [isLaneMoving, setIsLaneMoving] = useState(true);
  const [isCarIdle, setIsCarIdle] = useState(false);
  const [pkgState, setPkgState] = useState({ opacity: 0, transform: 'translateY(24px)', animation: 'none' });

  useEffect(() => {
    if (pipelineStatus === 'idle') {
      setActiveBubble('greet');
      setIsLaneMoving(true);
      setIsCarIdle(false);
      setCarLeft(170);
      setPkgState({ opacity: 0, transform: 'translateY(24px)', animation: 'none' });
      
      const timer = setTimeout(() => {
        setIsLaneMoving(false);
        setIsCarIdle(true);
        setActiveBubble('form');
        if (onCarArrived) onCarArrived(); 
      }, 2000);
      return () => clearTimeout(timer);
    }

    if (pipelineStatus === 'processing') {
      setActiveBubble('loader');
      setIsCarIdle(false);
      setIsLaneMoving(true);
      setCarLeft(-200);
    }

    if (pipelineStatus === 'success') {
      setActiveBubble('hide');
      setIsLaneMoving(false);
      setCarLeft(170);
      
      const arrivalTimer = setTimeout(() => {
        setIsCarIdle(true);
        setActiveBubble('done');
        setPkgState({
          opacity: 1,
          transform: 'translateY(0)',
          animation: 'pkgFloat 0.8s ease-in-out infinite alternate'
        });
      }, 1800);
      
      return () => clearTimeout(arrivalTimer);
    }
  }, [pipelineStatus]);

  const starsArray = Array.from({ length: 60 }).map((_, i) => ({
    left: `${(i * 7.3) % 100}%`,
    top: `${5 + (i * 13) % 45}%`,
    size: i % 3 === 0 ? 2 : 1,
    delay: `${(i * 0.25) % 3}s`,
    duration: `${2 + (i * 0.5) % 3}s`
  }));

  const animStyles = {
    bgScene: { width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, overflow: 'hidden', background: '#030712', zIndex: 1 },
    skyGrad: { position: 'absolute', inset: 0, height: '60%', background: 'linear-gradient(180deg, #030712 0%, #060911 40%, #0f1422 100%)' },
    moonWrap: { position: 'absolute', top: '40px', right: '10%' },
    moonBody: { width: '40px', height: '40px', background: '#f9fafb', borderRadius: '50%', boxShadow: '0 0 25px rgba(255,255,255,0.15)', position: 'relative' },
    crater: { position: 'absolute', borderRadius: '50%', backgroundColor: '#e5e7eb' },
    skyline: { position: 'absolute', bottom: '180px', left: 0, right: 0, opacity: 0.25 },
    sidewalk: { position: 'absolute', bottom: '172px', left: 0, right: 0, height: '8px', backgroundColor: '#111827' },
    roadSurface: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '172px', backgroundColor: '#070a12' },
    laneEdge: { position: 'absolute', left: 0, right: 0, height: '1px', backgroundColor: 'rgba(255,255,255,0.03)' },
    laneMarkContainer: { position: 'absolute', width: '200%', height: '100%', left: 0 },
    laneMark: { position: 'absolute', bottom: '84px', width: '90px', height: '5px', backgroundColor: '#374151', borderRadius: '2px', opacity: 0.4 },
    car: { position: 'absolute', bottom: '60px', left: `${carLeft}px`, transition: 'left 1.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', animation: isCarIdle ? 'idle 1.4s ease-in-out infinite' : 'none' },
    streetlight: { position: 'absolute', bottom: '172px' },
    slPole: { width: '4px', backgroundColor: '#1f2937', borderRadius: '2px' },
    slArm: { position: 'absolute', height: '3px', backgroundColor: '#1f2937' },
    slBulb: { position: 'absolute', width: '12px', height: '6px', backgroundColor: '#fff', borderRadius: '3px', boxShadow: '0 0 15px 5px rgba(255,255,255,0.35)' },
    speech: { position: 'absolute', bottom: '165px', left: '165px', transition: 'all 0.4s ease', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 },
    speechBox: { backgroundColor: '#0f172a', border: '1px solid rgba(99, 102, 241, 0.4)', borderRadius: '12px', padding: '12px 18px', fontSize: '13px', color: '#f3f4f6', boxShadow: '0 10px 30px rgba(0,0,0,0.6)', minWidth: '240px', maxWidth: '320px', textAlign: 'center', lineHeight: '1.45', fontFamily: 'monospace' },
    speechTail: { width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid rgba(99, 102, 241, 0.4)', marginTop: '-1px' },
    loaderBar: { width: '100%', height: '5px', backgroundColor: '#1e293b', borderRadius: '3px', marginTop: '10px', overflow: 'hidden' },
    loaderFill: { height: '100%', backgroundColor: '#6366f1', borderRadius: '3px', transition: 'width 0.4s ease' },
    loaderTxt: { fontSize: '11px', color: '#9ca3af', fontFamily: 'monospace' },
    pkg: { position: 'absolute', bottom: '185px', left: '345px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 5, transition: 'opacity 0.5s, transform 0.5s' },
    pkgInner: { width: '38px', height: '30px', backgroundColor: '#b45309', borderRadius: '4px', border: '1px solid #d97706', position: 'relative' },
    pkgRibbonH: { position: 'absolute', top: '50%', left: 0, right: 0, height: '2px', backgroundColor: '#f59e0b', transform: 'translateY(-50%)' },
    pkgRibbonV: { position: 'absolute', left: '50%', top: 0, bottom: 0, width: '2px', backgroundColor: '#f59e0b', transform: 'translateX(-50%)' },
    pkgLbl: { fontSize: '9px', fontWeight: 'bold', color: '#f59e0b', marginTop: '3px', fontFamily: 'monospace' }
  };

  return (
    <div style={animStyles.bgScene}>
      <style>{`
        @keyframes laneMove { from { transform: translateX(0); } to { transform: translateX(-130px); } }
        @keyframes idle { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-3px); } }
        @keyframes pkgFloat { 0% { transform: translateY(0); } 100% { transform: translateY(-6px); } }
        @keyframes twinkle { 0%, 100% { opacity: 0.7; } 50% { opacity: 0.1; } }
      `}</style>

      <div style={animStyles.skyGrad} />
      
      {starsArray.map((star, idx) => (
        <div key={idx} style={{ position: 'absolute', left: star.left, top: star.top, width: star.size, height: star.size, borderRadius: '50%', backgroundColor: '#ffffff', opacity: 0.5, animation: `twinkle ${star.duration} ease-in-out ${star.delay} infinite` }} />
      ))}

      <div style={animStyles.moonWrap}>
        <div style={animStyles.moonBody}>
          <div style={{ ...animStyles.crater, width: '8px', height: '8px', top: '8px', left: '10px', opacity: 0.12 }} />
          <div style={{ ...animStyles.crater, width: '5px', height: '5px', top: '22px', left: '22px', opacity: 0.12 }} />
        </div>
      </div>

      <div style={animStyles.skyline}>
        <svg width="100%" height="160" viewBox="0 0 800 160" preserveAspectRatio="none" style={{ display: 'block' }}>
          <path d="M0,160 L0,70 L60,70 L60,90 L120,90 L120,45 L180,45 L180,100 L250,100 L250,35 L310,35 L310,110 L380,110 L380,65 L460,65 L460,20 L530,20 L530,80 L600,80 L600,55 L670,55 L670,115 L740,115 L740,45 L800,45 L800,160 Z" fill="#060911" />
        </svg>
      </div>

      <div style={animStyles.sidewalk} />
      <div style={animStyles.roadSurface}>
        <div style={{ ...animStyles.laneEdge, top: 0 }} />
        <div style={{ ...animStyles.laneMarkContainer, animation: isLaneMoving ? 'laneMove 0.4s linear infinite' : 'none' }}>
          {[0, 160, 320, 480, 640, 800, 960, 1120, 1280, 1440].map((pos, i) => (
            <div key={i} style={{ ...animStyles.laneMark, left: pos }} />
          ))}
        </div>
      </div>

      <div style={{ ...animStyles.streetlight, left: '10%' }}>
        <div style={{ ...animStyles.slPole, height: '140px' }} />
        <div style={{ ...animStyles.slArm, width: '30px', bottom: '138px', left: '2px' }} />
        <div style={{ ...animStyles.slBulb, bottom: '134px', left: '24px' }} />
      </div>

      <div style={animStyles.car}>
        <svg width="150" height="70" viewBox="0 0 160 72">
          <rect x="10" y="28" width="140" height="36" rx="8" fill="#4f46e5" />
          <rect x="34" y="12" width="82" height="36" rx="10" fill="#312e81" />
          <rect x="42" y="18" width="30" height="20" rx="4" fill="#030712" opacity="0.8" />
          <rect x="78" y="18" width="30" height="20" rx="4" fill="#030712" opacity="0.8" />
          <circle cx="38" cy="58" r="11" fill="#030712" />
          <circle cx="118" cy="58" r="11" fill="#030712" />
          <rect x="10" y="38" width="10" height="6" rx="1" fill="#fbbf24" />
          <rect x="140" y="40" width="10" height="6" rx="1" fill="#ef4444" />
        </svg>
      </div>

      <div style={{ ...animStyles.pkg, opacity: pkgState.opacity, transform: pkgState.transform, animation: pkgState.animation }}>
        <div style={animStyles.pkgInner}>
          <div style={animStyles.pkgRibbonH} />
          <div style={animStyles.pkgRibbonV} />
        </div>
        <div style={animStyles.pkgLbl}>CHANGELOG</div>
      </div>

      {activeBubble === 'greet' && (
        <div style={animStyles.speech}>
          <div style={animStyles.speechBox}>SYSTEM: Routing to local context terminal...</div>
          <div style={animStyles.speechTail} />
        </div>
      )}

      {activeBubble === 'form' && (
        <div style={animStyles.speech}>
          <div style={animStyles.speechBox}>DRIVE-THRU: Awaiting Git URL Parameters...</div>
          <div style={animStyles.speechTail} />
        </div>
      )}

      {activeBubble === 'loader' && (
        <div style={{ ...animStyles.speech, left: '115px' }}>
          <div style={animStyles.speechBox}>
            <div style={animStyles.loaderTxt}>{currentStepText}</div>
            <div style={animStyles.loaderBar}>
              <div style={{ ...animStyles.loaderFill, width: `${progressPercent}%` }} />
            </div>
          </div>
          <div style={animStyles.speechTail} />
        </div>
      )}

      {activeBubble === 'done' && (
        <div style={animStyles.speech}>
          <div style={animStyles.speechBox}>SUCCESS: Markdown package parsed and ready! ✨</div>
          <div style={animStyles.speechTail} />
        </div>
      )}
    </div>
  );
}

// =========================================================================
// 🚀 MAIN DASHBOARD COMPONENT (ERROR-RESILIENT ENGINE)
// =========================================================================
export default function ChangelogDashboard() {
  const [repoUrl, setRepoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [changelog, setChangelog] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const [pipelineStatus, setPipelineStatus] = useState('idle'); 
  const [currentStepText, setCurrentStepText] = useState('Ready...');
  const [progressPercent, setProgressPercent] = useState(0);
  const [showInputCard, setShowInputCard] = useState(false); 

  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!repoUrl) return;

    setLoading(true);
    setError('');
    setChangelog('');
    setPipelineStatus('processing');
    setCurrentStepText('Validating connection link format...');
    setProgressPercent(15);

    try {
      // 1. Initial configuration request to Spring Boot
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/repositories/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: repoUrl.trim(),
          firebaseUid: 'test-uid-lokesh-1073',
        }),
      });

      // 🔍 ERROR CHECK A: If the initial URL hand-off completely fails
      if (!response.ok) {
        throw new Error('Repository mapping failed. Please verify the URL structure or connection rules.');
      }
      
      const data = await response.json();
      const targetRepoId = data.repoId;

      if (!targetRepoId) {
        throw new Error('Database indexing error: No valid repoId returned.');
      }

      setCurrentStepText('Fetching GitHub commit logs...');
      setProgressPercent(45);

      // 2. Poll the status lookup map mapping framework every 3 seconds
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`http://localhost:8081/api/repositories/status/${targetRepoId}`);
          
          if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            
            // 🔍 ERROR CHECK B: If n8n workflow updates status to 'error' or 'failed'
            if (statusData.currentStatus === 'error' || statusData.status === 'error' || statusData.status === 'failed') {
              setError('Pipeline Engine Error: The repository could not be reached, or holds no public commit graph properties.');
              setLoading(false);
              setPipelineStatus('idle');
              setShowInputCard(true);
              clearInterval(pollInterval);
              return;
            }

            if (statusData.currentStatus === 'pending') {
              setCurrentStepText('Analyzing commits with Gemini AI...');
              setProgressPercent(75);
            }

            if (statusData.changelog && statusData.changelog.trim() !== "") {
              setChangelog(statusData.changelog);
              setLoading(false);
              setPipelineStatus('success');
              clearInterval(pollInterval);
            } else if (statusData.currentStatus === 'completed' || statusData.status === 'completed') {
              setChangelog(statusData.changelog || 'Changelog compilation complete.');
              setLoading(false);
              setPipelineStatus('success');
              clearInterval(pollInterval);
            }
          }
        } catch (pollError) {
          console.error("Tracking connection drop:", pollError);
        }
      }, 3000);

      // 90 Seconds Safety Gate Closure Limit
      setTimeout(() => {
        clearInterval(pollInterval);
        setLoading((currentLoading) => {
          if (currentLoading) {
            setError('Pipeline parsing timed out. Verify your background ledger container connection states.');
            setPipelineStatus('idle');
            setShowInputCard(true);
            return false;
          }
          return currentLoading;
        });
      }, 90000);

    } catch (err) {
      // 🌟 Clean fallback error catcher: drops the form back immediately on crash!
      setError(err.message || 'An unexpected runtime connection error occurred.');
      setLoading(false);
      setPipelineStatus('idle');
      setShowInputCard(true);
    }
  };

  const handleReset = () => {
    setRepoUrl('');
    setChangelog('');
    setError('');
    setLoading(false);
    setShowInputCard(false); 
    setPipelineStatus('idle'); 
    setProgressPercent(0);
    setCurrentStepText('Ready...');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(changelog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const styles = {
    scrollContainer: { width: '100vw', minHeight: '100vh', overflowY: 'auto', position: 'relative', zIndex: 5 },
    layoutCenterer: { width: '100%', maxWidth: '800px', margin: '0 auto', padding: '60px 20px', display: 'flex', flexDirection: 'column', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '20px', marginBottom: '30px' },
    title: { fontSize: '24px', fontWeight: '900', color: '#ffffff', margin: 0, textShadow: '0 4px 12px rgba(0,0,0,0.5)' },
    badge: { fontSize: '11px', fontWeight: '700', fontFamily: 'monospace', background: 'rgba(99, 102, 241, 0.2)', border: '1px solid rgba(99, 102, 241, 0.4)', padding: '6px 14px', borderRadius: '20px', color: '#a5b4fc' },
    glassCard: { background: 'rgba(15, 23, 42, 0.55)', backdropFilter: 'blur(16px)', border: '1px solid rgba(99, 102, 241, 0.25)', borderRadius: '16px', padding: '28px', boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6)', marginTop: '20px' },
    label: { fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#94a3b8', marginBottom: '8px', display: 'block' },
    inputRow: { display: 'flex', gap: '12px' },
    input: { flex: 1, backgroundColor: 'rgba(3, 7, 18, 0.7)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '10px', padding: '14px 18px', color: '#ffffff', fontSize: '15px', outline: 'none' },
    button: { background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: '#ffffff', border: 'none', borderRadius: '10px', padding: '14px 28px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.4)' },
    error: { marginTop: '16px', padding: '12px', backgroundColor: 'rgba(220, 38, 38, 0.15)', border: '1px solid rgba(220, 38, 38, 0.3)', borderRadius: '10px', color: '#f87171', fontSize: '13px', fontFamily: 'monospace', lineHeight: '1.4' },
    outputCard: { backgroundColor: 'rgba(3, 7, 18, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '16px', overflow: 'hidden', marginTop: '30px', marginBottom: '60px', boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)' },
    outputHeader: { backgroundColor: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid rgba(255, 255, 255, 0.07)', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' },
    actionBtns: { display: 'flex', gap: '10px', alignItems: 'center' },
    copyBtn: { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '6px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer' },
    resetBtn: { backgroundColor: '#6366f1', border: 'none', color: '#fff', borderRadius: '6px', padding: '6px 14px', fontSize: '12px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 2px 8px rgba(99,102,241,0.3)' },
    outputBody: { padding: '36px', color: '#e5e7eb', lineHeight: '1.8', fontSize: '15px' }
  };

  return (
    <>
      <FullPageDriveAnimation 
        pipelineStatus={pipelineStatus}
        currentStepText={currentStepText}
        progressPercent={progressPercent}
        onCarArrived={() => setShowInputCard(true)} 
      />

      <div style={styles.scrollContainer}>
        <div style={styles.layoutCenterer}>
          
          <header style={styles.header}>
            <h1 style={styles.title}>GitAnalyzer <span style={{fontWeight: '300', opacity: 0.7}}>v1.0</span></h1>
            <div style={styles.badge}>DRIVE-THRU MODE</div>
          </header>

          {pipelineStatus === 'idle' && showInputCard && (
            <div style={styles.glassCard}>
              <form onSubmit={handleAnalyze}>
                <label style={styles.label}>GitHub Connection Endpoint</label>
                <div style={styles.inputRow}>
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/S-lokesh4432/ppt_reader"
                    style={styles.input}
                    disabled={loading}
                  />
                  <button type="submit" disabled={loading} style={styles.button}>
                    Generate
                  </button>
                </div>
              </form>
              {error && <div style={styles.error}>{error}</div>}
            </div>
          )}

          {changelog && pipelineStatus === 'success' && !loading && (
            <div style={styles.outputCard}>
              <div style={styles.outputHeader}>
                <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#94a3b8' }}>RELEASE_CHANGELOG.md</span>
                <div style={styles.actionBtns}>
                  <button onClick={copyToClipboard} style={styles.copyBtn}>
                    {copied ? 'Copied ✨' : 'Copy Markdown'}
                  </button>
                  <button onClick={handleReset} style={styles.resetBtn}>
                    Analyze Another Repo
                  </button>
                </div>
              </div>
              <div style={styles.outputBody} className="prose-custom">
                <ReactMarkdown>{changelog}</ReactMarkdown>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}