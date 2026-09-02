import React, { useState } from 'react';
import { Users, ClipboardList, Plus, Play, CheckCircle, Trophy, Trash2, Award } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('registration');
  const [teams, setTeams] = useState([]);
  const [formData, setFormData] = useState({ teamName: '', leaderName: '' });

  // Handle Registration
  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.teamName || !formData.leaderName) return;

    const newTeam = {
      id: Date.now(),
      priority: teams.length + 1,
      teamName: formData.teamName,
      leaderName: formData.leaderName,
      status: 'pending', // pending, presenting, completed
      marks: null,
    };

    setTeams([...teams, newTeam]);
    setFormData({ teamName: '', leaderName: '' });
    // Optional: Auto switch to evaluation or show success
  };

  // Handle Calling Team
  const callTeam = (id) => {
    setTeams(teams.map(team => 
      team.id === id ? { ...team, status: 'presenting' } : team
    ));
  };

  // Handle Mark Submission
  const submitMarks = (id, detailedMarks) => {
    if (!detailedMarks.priority || !detailedMarks.presentation || !detailedMarks.proportion) return;
    
    const totalMarks = Number(detailedMarks.priority) + Number(detailedMarks.presentation) + Number(detailedMarks.proportion);
    
    setTeams(teams.map(team => 
      team.id === id ? { ...team, status: 'completed', marks: totalMarks, detailedMarks } : team
    ));
  };

  const handleClearData = () => {
    if (window.confirm("Are you sure you want to clear all registered teams and evaluation data?")) {
      setTeams([]);
      setFormData({ teamName: '', leaderName: '' });
      setActiveTab('registration');
    }
  };

  return (
    <div className="app-container">
      <header className="header">
        <h1 className="title-glow">Hackathon Portal</h1>
        <p className="subtitle">Manage registrations and evaluations seamlessly</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'registration' ? 'active' : ''}`}
          onClick={() => setActiveTab('registration')}
        >
          <Users size={18} /> Phase 1: Registration
        </button>
        <button 
          className={`tab-btn ${activeTab === 'evaluation' ? 'active' : ''}`}
          onClick={() => setActiveTab('evaluation')}
        >
          <ClipboardList size={18} /> Phase 2: Evaluation
        </button>
        <button 
          className={`tab-btn ${activeTab === 'leaderboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('leaderboard')}
        >
          <Award size={18} /> Phase 3: Leaderboard
        </button>
      </div>

      {activeTab === 'registration' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={24} color="var(--primary)" /> Register New Team
          </h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label>Team Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter team name"
                value={formData.teamName}
                onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Team Leader Name</label>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Enter leader's full name"
                value={formData.leaderName}
                onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn-primary">
              Register Team
            </button>
          </form>
        </div>
      )}

      {activeTab === 'evaluation' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={24} color="var(--primary)" /> Evaluation Queue
          </h2>
          
          {teams.length === 0 ? (
            <div className="empty-state">
              <Users size={48} />
              <p>No teams registered yet. Go to Phase 1 to add teams.</p>
            </div>
          ) : (
            <div className="team-list">
              {teams.sort((a, b) => a.priority - b.priority).map((team) => (
                <TeamCard 
                  key={team.id} 
                  team={team} 
                  onCall={() => callTeam(team.id)}
                  onSubmitMarks={(marks) => submitMarks(team.id, marks)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'leaderboard' && (
        <div className="glass-card">
          <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Award size={24} color="var(--warning)" /> Top Performers
          </h2>
          
          {teams.filter(t => t.status === 'completed').length === 0 ? (
            <div className="empty-state">
              <Trophy size={48} />
              <p>No teams have been evaluated yet.</p>
            </div>
          ) : (
            <div className="team-list">
              {teams
                .filter(t => t.status === 'completed')
                .sort((a, b) => b.marks - a.marks)
                .map((team, index) => (
                  <div key={team.id} className="team-card" style={{
                    borderColor: index === 0 ? 'var(--warning)' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--border)',
                    boxShadow: index === 0 ? '0 0 20px rgba(245, 158, 11, 0.2)' : 'none'
                  }}>
                    <div className="team-info">
                      <h3>
                        <span style={{ 
                          color: index === 0 ? 'var(--warning)' : index === 1 ? '#94a3b8' : index === 2 ? '#b45309' : 'var(--text-muted)', 
                          marginRight: '0.75rem',
                          fontSize: index === 0 ? '1.5rem' : '1.2rem'
                        }}>
                          #{index + 1}
                        </span>
                        {team.teamName}
                      </h3>
                      <p>Leader: {team.leaderName}</p>
                    </div>
                    <div className="score-display">
                      {team.marks} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>pts</span>
                    </div>
                  </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Hidden Admin Clear Data Button */}
      <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.1, transition: 'opacity 0.3s' }} 
           onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
           onMouseLeave={(e) => e.currentTarget.style.opacity = '0.1'}>
        <button 
          onClick={handleClearData}
          style={{ background: 'transparent', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '0 auto' }}
        >
          <Trash2 size={12} /> Admin: Reset System
        </button>
      </div>
    </div>
  );
}

function TeamCard({ team, onCall, onSubmitMarks }) {
  const calculateAutoPriorityScore = (rank) => {
    // 1-10 -> 10, 11-20 -> 9, 21-30 -> 8, etc.
    const score = 10 - Math.floor((rank - 1) / 10);
    return Math.max(0, score).toString();
  };

  const [scores, setScores] = useState({ 
    priority: calculateAutoPriorityScore(team.priority), 
    presentation: '', 
    proportion: '' 
  });

  return (
    <div className="team-card">
      <div className="team-info">
        <h3>
          <span style={{ color: 'var(--primary)', marginRight: '0.5rem' }}>#{team.priority}</span>
          {team.teamName}
          <span className={`badge badge-${team.status}`}>
            {team.status}
          </span>
        </h3>
        <p>Leader: {team.leaderName}</p>
      </div>

      <div className="team-actions">
        {team.status === 'pending' && (
          <button className="btn-action highlight" onClick={onCall}>
            <Play size={16} /> Call to Present
          </button>
        )}

        {team.status === 'presenting' && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <input 
                type="number" 
                className="mark-input" 
                placeholder="0" 
                title="Auto-calculated Submission Mark (Cannot be changed)"
                value={scores.priority}
                disabled
                style={{ opacity: 0.7, cursor: 'not-allowed', width: '60px', padding: '0.5rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Submission</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <input 
                type="number" 
                className="mark-input" 
                placeholder="0" 
                title="Presentation Mark"
                value={scores.presentation}
                onChange={(e) => setScores({...scores, presentation: e.target.value})}
                min="0"
                max="100"
                style={{ width: '80px', padding: '0.5rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Presentation</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
              <input 
                type="number" 
                className="mark-input" 
                placeholder="0" 
                title="Proportion Mark"
                value={scores.proportion}
                onChange={(e) => setScores({...scores, proportion: e.target.value})}
                min="0"
                max="100"
                style={{ width: '80px', padding: '0.5rem' }}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Proportion</span>
            </div>
            <button className="btn-action highlight" style={{ marginTop: '0.2rem' }} onClick={() => onSubmitMarks(scores)}>
              <CheckCircle size={16} /> Submit
            </button>
          </div>
        )}

        {team.status === 'completed' && (
          <div className="score-display" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Trophy size={20} color="var(--warning)" />
            {team.marks} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>pts</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
