'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import './pokemon-login.css';

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    // Sign in the user
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (signInData.user) {
      // Check if the user is in the admin_list table
      const { data: adminUser, error: adminError } = await supabase
        .from('admin_list')
        .select('email')
        .eq('email', signInData.user.email)
        .single(); // .single() expects one row or null

      if (adminError || !adminUser) {
        setError('Access Denied. You are not an authorized admin.');
        await supabase.auth.signOut(); // Sign out the user
        setLoading(false);
      } else {
        // User is an admin, proceed to dashboard
        router.push('/dashboard');
        // No need to setLoading(false) if navigating away
      }
    } else {
      // Should not happen if signInError is null, but as a fallback
      setError('An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  return (
    <div className="pokemon-login-container">
      {/* Animated background elements */}
      <div className="background-elements">
        <div className="pokeball pokeball-1"></div>
        <div className="pokeball pokeball-2"></div>
        <div className="pokeball pokeball-3"></div>
        <div className="lightning lightning-1">⚡</div>
        <div className="lightning lightning-2">⚡</div>
        <div className="lightning lightning-3">⚡</div>
        <div className="star star-1">⭐</div>
        <div className="star star-2">⭐</div>
        <div className="star star-3">⭐</div>
        <div className="star star-4">⭐</div>
      </div>

      {/* Multiple floating logo instances */}
      <div className="floating-logos">
        <img src="/image_logo.png" alt="Logo" className="floating-logo logo-1" />
        <img src="/image_logo.png" alt="Logo" className="floating-logo logo-2" />
        <img src="/image_logo.png" alt="Logo" className="floating-logo logo-3" />
        <img src="/image_logo.png" alt="Logo" className="floating-logo logo-4" />
        <img src="/image_logo.png" alt="Logo" className="floating-logo logo-5" />
      </div>

      {/* Main login form */}
      <div className="login-card">
        <div className="card-header">
          <img src="/image_logo.png" alt="Main Logo" className="main-logo" />
          <h1 className="login-title">
            <span className="title-text">ADMIN CENTER</span>
            <span className="title-glow">TRAINER LOGIN</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="email" className="input-label">
                TRAINER ID
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="pokemon-input"
                placeholder="trainer@pokemon.com"
                autoComplete="email"
                autoFocus
              />
            </div>
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <label htmlFor="password" className="input-label">
                PASSWORD
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="pokemon-input"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`login-button ${loading ? 'loading' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                <span>LOGGING IN...</span>
              </>
            ) : (
              <>
                <span className="button-icon">▶</span>
                <span>LOGIN</span>
              </>
            )}
          </button>
        </form>

        {/* Decorative elements */}
        <div className="card-decorations">
          <div className="decoration decoration-1">♦</div>
          <div className="decoration decoration-2">♠</div>
          <div className="decoration decoration-3">♣</div>
          <div className="decoration decoration-4">♥</div>
        </div>
      </div>

      {/* Footer elements */}
      <div className="footer-elements">
        <div className="footer-logos">
          <img src="/image_logo.png" alt="Footer Logo" className="footer-logo footer-logo-1" />
          <img src="/image_logo.png" alt="Footer Logo" className="footer-logo footer-logo-2" />
        </div>
      </div>
    </div>
  );
} 