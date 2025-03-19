import React, { useState, useEffect } from 'react';

const PomodoroTimer = () => {
  // Timer States
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [currentSession, setCurrentSession] = useState('work'); // work, shortBreak, longBreak
  const [settings, setSettings] = useState({
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    soundEnabled: true,
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(0);

  // Theme Colors
  const colors = {
    work: {
      primary: '#4A90E2',
      secondary: '#D0E6F1',
      background: '#F0F7FF'
    },
    shortBreak: {
      primary: '#66BB6A',
      secondary: '#C8E6C9',
      background: '#F1F8E9'
    },
    longBreak: {
      primary: '#7E57C2',
      secondary: '#D1C4E9',
      background: '#F3E5F5'
    }
  };

  const getCurrentColors = () => colors[currentSession];

  useEffect(() => {
    const storedSettings = localStorage.getItem('pomodoroSettings');
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings));
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      playSound();
      handleSessionComplete();
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSessionComplete = () => {
    setIsActive(false);
    const newCompletedSessions = completedSessions + 1;
    setCompletedSessions(newCompletedSessions);

    if (currentSession === 'work') {
      if (newCompletedSessions % 4 === 0) {
        setCurrentSession('longBreak');
        setTimeLeft(settings.longBreakDuration * 60);
      } else {
        setCurrentSession('shortBreak');
        setTimeLeft(settings.shortBreakDuration * 60);
      }
    } else {
      setCurrentSession('work');
      setTimeLeft(settings.workDuration * 60);
    }
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    if (currentSession === 'work') {
      setTimeLeft(settings.workDuration * 60);
    } else if (currentSession === 'shortBreak') {
      setTimeLeft(settings.shortBreakDuration * 60);
    } else {
      setTimeLeft(settings.longBreakDuration * 60);
    }
  };

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('pomodoroSettings', JSON.stringify(newSettings));
    setIsSettingsOpen(false);
    resetTimer();
  };

  const playSound = () => {
    if (settings.soundEnabled) {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWoGAACBhYqFbF1NOTgzOENXY3N0cGReRys2R1prY15AOC0zQ1dsY1lELSkyPE5fblhAKiQvN0lYaF1LMyUlMD1NW2piSkIvKiw3RVVqaWJTSkA7OkBIVGBsb21qaGJeXF1haXN5dG5hVDg6OjxETGJyZ15NMyYnLjpHWG1nWEEsJSo0QVNpZ1lELCUvOk1abmVZRTEpLjhGVGdoYlJBMy0yPUlXaGlgUz8qLzU/TF5oZF1NQDMzPEZRbXBsaWVdU0tLUFplZ2VYRzU1P0lba3RxaF9Tamx0aWFVRTc4P0RRX21qaGBJNy4zPkldb3JrYVA/ODo7QlNrf4iDfHVtZmRpbHF1cW1iVkhHSktPV2FkYFhEMysyPkpUXF1UQzk2PEVTZmpgVEU/QURHSlRiaXN0cG1hT0BGR0pPWWx+gHptWj89Q0pPVmh3f4F/eXBnW1NUWmBnbHN5fHp0bGNWRkVHTlpreHp0aV1KPTg6P0hZcX18b1xALys0QE9nfYN5aE42LzQ7SlxufnxvYFRGP0FNV2p3gIeKhXxsVkhHUVppbG50e4B8dGlbRUBBQkNNZHqEhHxoUjs1PEVNVmp7hYR9b1pGPTxBSVp1hYV7Z0w5MT1JVGd4hYqMhXlrXlJOT1JaaXeAfXVrX1FLUFVXW2h3gIaGf3NjTkE/QkhTaX2FhX9yYE0+OkBKWnODhoR4ZUs7PEVPWm59hYaFfG9eT0pNUVhldYGHhYB2aVdKR0pPVmJ4h4mJgW9ZQUFHU1tldH+Hh4R6a1lMTVBUWGR5iZCPhnZhS0BGSlFdcoGLjoZ1YElFSU1PWnKHj4+DcVxKRUpNT1tzi5OQhm9XQkRLUFdcc4qRkIVvV0VGTVFVW3GJkpGFb1dCRUtQV1xziZGQhW9XQkVLUFdcc4mRkIVvV0JFS1BXXHP////+/v7+/v39/f39/fz8+/v7+vr6+vn5+fn5+fn4+Pj49/f39vb29fX19fX19fT09PPz8/Ly8vHx8fHx8fHw8PDv7u7t7e3s7Ozs7Ozs6+vr6unp6Ojo5+fn5+fn5+bm5uXk5OPj4+Li4uLi4uLh4eHg39/e3t7d3d3d3d3d3Nzc29ra2dnZ2NjY2NjY2NfX19bV1dTU1NPT09PT09PS0tLR0NDPz8/Ozs7Ozs7Ozdvb2tvb3Nzc3d3d3d3d3d7e3t/g4OHh4eLi4uLi4uLj4+Pk5eXm5ubm5ubm5+fn6Onp6urq6+vr6+vr6+zs7O3u7u/v7/Dw8PDw8PDx8fHy8/P09PT19fX19fX19vb29/j4+fn5+vr6+vr6+vv7+/z9/f7+/v7+/v7////+/v7+/v39/f39/fz8+/v7+vr6+vn5+fn5+fn4+Pj49/f39vb29fX19fX19fT09PPz8/Ly8vHx8fHx8fHw8PDv7u7t7e3s7Ozs7Ozs6+vr6unp6Ojo5+fn5+fn5+bm5uXk5OPj4+Li4uLi4uLh4eHg39/e3t7d3d3d3d3d3Nzc29ra2dnZ2NjY2NjY2NfX19bV1dTU1NPT09PT09PS0tLR0NDPz8/Ozs7Ozs7Ozc3NzMvLysrKycnJycnJycjIyMfGxsXFxcTExMTExMTDw8PCwcHAwMC/v7+/v7+/vr6+vby8u7u7urq6urq6urm5ubi3t7a2trW1tbW1tbW0tLSzsrKxsbGwsLCwsLCwr6+vrq2trKysq6urq6urq6qqqpmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZk=');
      audio.play();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-6">
        <div 
          className="rounded-2xl shadow-lg overflow-hidden transition-all duration-500"
          style={{ backgroundColor: getCurrentColors().background }}
        >
          {/* Header */}
          <div 
            className="p-6 text-center"
            style={{ backgroundColor: getCurrentColors().primary }}
          >
            <h1 className="text-2xl font-bold text-white">
              Pomodoro Timer
            </h1>
            <p className="mt-2 text-sm text-white opacity-90">
              {currentSession === 'work' ? 'Focus Time' : 
               currentSession === 'shortBreak' ? 'Short Break' : 'Long Break'}
            </p>
          </div>

          {/* Timer Display */}
          <div className="p-8 text-center">
            <div 
              className="text-6xl font-bold mb-8 transition-all duration-300"
              style={{ color: getCurrentColors().primary }}
            >
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4 mb-8">
              <button
                onClick={toggleTimer}
                className="px-6 py-3 rounded-xl font-medium text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: getCurrentColors().primary }}
              >
                {isActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: getCurrentColors().secondary,
                  color: getCurrentColors().primary
                }}
              >
                Reset
              </button>
            </div>

            {/* Session Progress */}
            <div className="flex justify-center gap-2 mb-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: index < (completedSessions % 4) 
                      ? getCurrentColors().primary 
                      : getCurrentColors().secondary
                  }}
                />
              ))}
            </div>
          </div>

          {/* Settings Button */}
          <div className="p-4 border-t border-gray-100">
            <button
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="w-full px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{ color: getCurrentColors().primary }}
            >
              Settings
            </button>
          </div>

          {/* Settings Panel */}
          {isSettingsOpen && (
            <div className="p-6 border-t border-gray-100">
              <h2 className="text-lg font-semibold mb-4" style={{ color: getCurrentColors().primary }}>
                Timer Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Work Duration (minutes)</label>
                  <input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({...settings, workDuration: parseInt(e.target.value)})}
                    className="w-full p-2 rounded border"
                    min="1"
                    max="60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Break (minutes)</label>
                  <input
                    type="number"
                    value={settings.shortBreakDuration}
                    onChange={(e) => setSettings({...settings, shortBreakDuration: parseInt(e.target.value)})}
                    className="w-full p-2 rounded border"
                    min="1"
                    max="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Long Break (minutes)</label>
                  <input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({...settings, longBreakDuration: parseInt(e.target.value)})}
                    className="w-full p-2 rounded border"
                    min="1"
                    max="60"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.soundEnabled}
                    onChange={(e) => setSettings({...settings, soundEnabled: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium">Enable Sound</label>
                </div>
                <button
                  onClick={() => saveSettings(settings)}
                  className="w-full px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:opacity-90"
                  style={{ backgroundColor: getCurrentColors().primary }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;