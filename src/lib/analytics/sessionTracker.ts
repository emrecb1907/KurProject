/**
 * Anonymous Session Tracker
 * 
 * Purpose: Track anonymous user sessions for analytics
 * Privacy: Minimal data collection, no personal information
 * 
 * What we track:
 * - Device ID (anonymous, generated locally)
 * - Session count (how many times app opened)
 * - Last active timestamp
 * - Conversion (when user creates account)
 * - Basic device info (OS, version)
 */

import { supabase } from '@/lib/supabase/client';
import { getDeviceId } from '@/lib/utils/device';
import Constants from 'expo-constants';
import * as Device from 'expo-device';

export const sessionTracker = {
  /**
   * Track app session on open
   * Called when app starts
   * Non-blocking, fails silently
   */
  async trackSession(): Promise<void> {
    try {
      const deviceId = await getDeviceId();
      
      // Collect minimal device info (non-personal)
      const deviceInfo = {
        platform: Constants.platform?.os || 'unknown',
        appVersion: Constants.expoConfig?.version || '1.0.0',
        deviceType: Device.deviceType, // 1=phone, 2=tablet, etc.
        osVersion: Device.osVersion,
      };

      console.log('📊 Tracking session for device:', deviceId.substring(0, 16) + '...');

      // Upsert: Insert if new, update if exists
      const { data, error } = await supabase
        .from('anonymous_sessions')
        .upsert(
          {
            device_id: deviceId,
            last_active_at: new Date().toISOString(),
            device_info: deviceInfo,
            // On conflict, these will be updated by trigger
          },
          {
            onConflict: 'device_id',
            ignoreDuplicates: false,
          }
        )
        .select('session_count')
        .single();

      if (error) {
        console.warn('⚠️ Analytics tracking failed (non-critical):', error.message);
        return;
      }

      if (data) {
        console.log('✅ Session tracked - Count:', data.session_count);
      }
    } catch (err) {
      // Silent fail - analytics failure shouldn't break app
      console.warn('⚠️ Session tracking error (ignored):', err);
    }
  },

  /**
   * Mark user as converted (created account)
   * Called after successful registration or login
   */
  async markAccountCreated(userId: string): Promise<void> {
    try {
      const deviceId = await getDeviceId();

      console.log('🎯 Tracking conversion for device:', deviceId.substring(0, 16) + '...');

      const { error } = await supabase
        .from('anonymous_sessions')
        .update({
          created_account: true,
          user_id: userId,
        })
        .eq('device_id', deviceId);

      if (error) {
        console.warn('⚠️ Conversion tracking failed:', error.message);
        return;
      }

      console.log('✅ Conversion tracked successfully');
    } catch (err) {
      console.warn('⚠️ Conversion tracking error:', err);
    }
  },

  /**
   * Get analytics summary (for admin dashboard)
   */
  async getAnalyticsSummary() {
    try {
      const { data, error } = await supabase
        .from('anonymous_analytics')
        .select('*')
        .single();

      if (error) throw error;

      return {
        success: true,
        data,
      };
    } catch (err) {
      console.error('❌ Failed to fetch analytics:', err);
      return {
        success: false,
        error: err,
      };
    }
  },
};

