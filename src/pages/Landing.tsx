import React from 'react';
import { Hero } from '../components/landing/Hero';
import { Features } from '../components/landing/Features';
import { Testimonials } from '../components/landing/Testimonials';
import { AuthForm } from '../components/auth/AuthForm';

export function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <Features />
      <Testimonials />
      
      <section id="auth-section" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AuthForm />
        </div>
      </section>
    </div>
  );
}