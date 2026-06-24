/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from './types';
import Splash from './components/Splash';
import ProfileSetup from './components/ProfileSetup';
import MainPage from './components/MainPage';
import Auth from './components/Auth';
import HealthMateCompanionWidget from './components/HealthMateCompanionWidget';
import { apiFetch } from './lib/api';
import LoadingScreen from './components/LoadingScreen';
type AppStep = 'splash' | 'auth' | 'setup' | 'main';

export default function App() {
  const [step, setStep] = useState<AppStep>('splash');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [authUser, setAuthUser] = useState<any | null>(null);

  const [initialIsSignup, setInitialIsSignup] = useState<boolean>(false);

  // Trigger contextual messages for our persistent 3D buddy on app step transitions
  useEffect(() => {
    const t = setTimeout(() => {
      if (step === 'splash') {
        window.dispatchEvent(new CustomEvent('aura-buddy', {
          detail: {
            mood: 'happy',
            text: "Hi! I'm your HealthMate 🌱"
          }
        }));
      } else if (step === 'auth') {
        window.dispatchEvent(new CustomEvent('aura-buddy', {
          detail: {
            mood: 'calm',
            text: "Welcome back."
          }
        }));
      } else if (step === 'setup') {
        window.dispatchEvent(new CustomEvent('aura-buddy', {
          detail: {
            mood: 'thinking',
            text: "Let's understand your health profile. Tell me about yourself."
          }
        }));
      } else if (step === 'main') {
        window.dispatchEvent(new CustomEvent('aura-buddy', {
          detail: {
            mood: 'happy',
            text: "Here's your progress."
          }
        }));
      }
    }, 400);

    return () => clearTimeout(t);
  }, [step]);

  // Restore authenticated session from localStorage if present
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('healthmate_auth_user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setAuthUser(parsedUser);
        setStep('main');

        // Fetch fresh profile state from backend
        apiFetch('/api/get-profile', {
          headers: {
            'x-user-id': parsedUser._id,
          },
        })
          .then((res) => res.json())
          .then((resJson) => {
            let localProfile: UserProfile | null = null;
            try {
              const stored = localStorage.getItem('healthmate_profile');
              if (stored) {
                localProfile = JSON.parse(stored);
              }
            } catch {}

            if ((resJson.success && resJson.data && resJson.data.age) || localProfile?.age) {
              const u = resJson.data || {};
              const mappedProfile: UserProfile = {
                age: u.age || localProfile?.age || 25,
                gender: u.gender || localProfile?.gender || 'male',
                height: u.height || localProfile?.height || 170,
                weight: u.weight || localProfile?.weight || 65,
                activityLevel: u.activityLevel || localProfile?.activityLevel || 'moderate',
              };
              setProfile(mappedProfile);
              setStep('main');

              // Sync profile back to DB if missing on server
              if (!u.age && localProfile) {
                apiFetch('/api/create-profile', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': parsedUser._id,
                  },
                  body: JSON.stringify(localProfile),
                }).catch(() => {});
              }
            } else {
              setStep('setup');
            }
          })
          .catch((err) => {
            console.warn('Backup routing active. Loading local cached profiles.', err);
            const storedProfile = localStorage.getItem('healthmate_profile');
            if (storedProfile) {
              setProfile(JSON.parse(storedProfile));
              setStep('main');
            } else {
              setStep('auth');
            }
          });
      }
    } catch (e) {
      console.warn('Could not restore user profile stats from storage', e);
    }
  }, []);

  const handleGetStarted = (mode: 'login' | 'register') => {
    setInitialIsSignup(mode === 'register');
    setStep('auth');
  };

  const handleAuthSuccess = (userData: any, isNewSignup: boolean) => {
    setAuthUser(userData);
    try {
      localStorage.setItem('healthmate_auth_user', JSON.stringify(userData));
      localStorage.setItem('healthmate_just_logged_in', 'true');
    } catch (e) {
      console.error('Failed to preserve credentials', e);
    }

    let localProfile: UserProfile | null = null;
    try {
      const stored = localStorage.getItem('healthmate_profile');
      if (stored) {
        localProfile = JSON.parse(stored);
      }
    } catch {}

    const isExistingUser = !isNewSignup || userData.age || localProfile?.age || userData.height || userData.weight;

    if (isExistingUser) {
      const mappedProfile: UserProfile = {
        age: userData.age || localProfile?.age || 25,
        gender: userData.gender || localProfile?.gender || 'male',
        height: userData.height || localProfile?.height || 170,
        weight: userData.weight || localProfile?.weight || 65,
        activityLevel: userData.activityLevel || localProfile?.activityLevel || 'moderate',
      };
      setProfile(mappedProfile);

      try {
        localStorage.setItem('healthmate_profile', JSON.stringify(mappedProfile));
      } catch {}

      // Auto-save back to DB if missing on server
      if (!userData.age && localProfile) {
        apiFetch('/api/create-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': userData._id || '',
          },
          body: JSON.stringify(localProfile),
        }).catch(() => {});
      }

      setStep('main');
    } else {
      setStep('setup');
    }
  };

  const handleProfileSubmit = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('healthmate_profile', JSON.stringify(newProfile));
    } catch (e) {
      console.error('Failed to preserve user profile in offline storage', e);
    }

    apiFetch('/api/create-profile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': authUser?._id || '',
      },
      body: JSON.stringify(newProfile),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('✅ Profile saved to database successfully:', data);
        if (data.success && data.data) {
          const updatedUser = { ...authUser, ...data.data };
          setAuthUser(updatedUser);
          localStorage.setItem('healthmate_auth_user', JSON.stringify(updatedUser));
        }
      })
      .catch((err) => {
        console.warn('⚠️ Database profile sync deferred. Running in offline fallback.', err.message);
      });

    setStep('main');
  };

  const handleEditProfile = () => {
    setStep('setup');
  };

  const handleWipeAndReset = () => {
    try {
      localStorage.removeItem('healthmate_profile');
      localStorage.removeItem('healthmate_auth_user');
    } catch (e) {
      console.error(e);
    }
    setProfile(null);
    setAuthUser(null);
    setStep('auth');
  };
  if (
  step === 'main' &&
  (!profile || !authUser)
) {
  return <LoadingScreen />;
}

  return (
    <div className="relative min-h-screen bg-[#050B14] text-slate-100 flex flex-col font-sans transition-all duration-300">
      {step === 'splash' && (
        <Splash onGetStarted={handleGetStarted} />
      )}

      {step === 'auth' && (
        <Auth 
          onSuccess={handleAuthSuccess}
          onBack={() => setStep('splash')}
        />
      )}

      {step === 'setup' && (
        <ProfileSetup 
          initialProfile={profile || undefined}
          onSubmit={handleProfileSubmit}
          onBack={profile ? () => setStep('main') : undefined}
        />
      )}

      {step === 'main' && profile && authUser && (
        <MainPage 
          profile={profile}
          authUser={authUser}
          onEditProfile={handleEditProfile}
          onReset={handleWipeAndReset}
        />
      )}

      {/* Global persistent HealthMate movable companion */}
      <HealthMateCompanionWidget />
    </div>
  );
}
