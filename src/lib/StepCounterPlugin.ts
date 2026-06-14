/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { registerPlugin, WebPlugin } from '@capacitor/core';

export interface StepCountChangedEvent {
  steps: number;
  caloriesBurned: number;
  calories: number;
}

export interface StepCounterPlugin {
  startStepCounter(): Promise<{ status: string; message: string }>;
  stopStepCounter(): Promise<{ status: string; message: string }>;
  getTodaySteps(): Promise<{ steps: number; calories: number; caloriesBurned: number; date: string }>;
  getStepHistory(): Promise<{ success: boolean; data: any[] }>;
  checkPermissions(): Promise<{ activityRecognition: 'granted' | 'denied'; notifications: 'granted' | 'denied' }>;
  requestPermissions(): Promise<{ 
    activityRecognition: 'granted' | 'denied'; 
    notifications: 'granted' | 'denied';
    actionRequired?: boolean;
    missingPermissions?: string[];
  }>;
}

// Complete implementation of the web fallback class integrated natively
export class StepCounterWebFallback extends WebPlugin implements StepCounterPlugin {
  private activeSimTimer: any = null;
  private currentStepsSim = 0;

  constructor() {
    super();
    
    // Retrieve cached values for simple web flow persistence
    try {
      this.currentStepsSim = parseInt(localStorage.getItem('healthmate_web_fallback_steps') || '0');
    } catch {
      this.currentStepsSim = 0;
    }
  }

  async startStepCounter(): Promise<{ status: string; message: string }> {
    console.log('[StepCounter Web Fallback] Starting web stepping simulators...');
    
    if (this.activeSimTimer) clearInterval(this.activeSimTimer);
    
    this.activeSimTimer = setInterval(() => {
      // Simulate slow casual walking pacing (+1-3 steps every interval)
      const increment = Math.floor(Math.random() * 3) + 1;
      this.currentStepsSim += increment;
      
      try {
        localStorage.setItem('healthmate_web_fallback_steps', String(this.currentStepsSim));
      } catch {}

      const calories = parseFloat((this.currentStepsSim * 0.04).toFixed(2));
      
      this.notifyListeners('stepCountChanged', {
        steps: this.currentStepsSim,
        caloriesBurned: calories,
        calories: calories
      });
    }, 4000);

    return {
      status: 'ACTIVE',
      message: 'Web local simulator started successfully.'
    };
  }

  async stopStepCounter(): Promise<{ status: string; message: string }> {
    console.log('[StepCounter Web Fallback] Halting simulator.');
    if (this.activeSimTimer) {
      clearInterval(this.activeSimTimer);
      this.activeSimTimer = null;
    }
    return {
      status: 'INACTIVE',
      message: 'Web simulation halted.'
    };
  }

  async getTodaySteps(): Promise<{ steps: number; calories: number; caloriesBurned: number; date: string }> {
    const todayStr = new Date().toISOString().split('T')[0];
    const calories = parseFloat((this.currentStepsSim * 0.04).toFixed(2));
    return {
      steps: this.currentStepsSim,
      calories: calories,
      caloriesBurned: calories,
      date: todayStr
    };
  }

  async getStepHistory(): Promise<{ success: boolean; data: any[] }> {
    const todayStr = new Date().toISOString().split('T')[0];
    const calories = parseFloat((this.currentStepsSim * 0.04).toFixed(1));
    return {
      success: true,
      data: [
        { date: todayStr, steps: this.currentStepsSim, caloriesBurned: calories }
      ]
    };
  }

  async checkPermissions(): Promise<{ activityRecognition: 'granted' | 'denied'; notifications: 'granted' | 'denied' }> {
    return {
      activityRecognition: 'granted',
      notifications: 'granted'
    };
  }

  async requestPermissions(): Promise<{ 
    activityRecognition: 'granted' | 'denied'; 
    notifications: 'granted' | 'denied';
    actionRequired?: boolean;
    missingPermissions?: string[];
  }> {
    return {
      activityRecognition: 'granted',
      notifications: 'granted',
      actionRequired: false
    };
  }
}

const StepCounter = registerPlugin<StepCounterPlugin>('StepCounter', {
  web: () => Promise.resolve(new StepCounterWebFallback())
});

export default StepCounter;
export { StepCounter };
