import { supabaseClient } from '@/core/config/supabase-client.config';
import { computed, DestroyRef, effect, inject, Injectable, signal } from '@angular/core';
import type { Session, User } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sessionState = signal<Session | null>(null);
  private readonly initializedState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private readonly sessionInitialization: Promise<void>;

  readonly session = this.sessionState.asReadonly();
  readonly initialized = this.initializedState.asReadonly();
  readonly error = this.errorState.asReadonly();
  readonly user = computed(() => this.session()?.user ?? null);
  readonly isAuthenticated = computed(() => this.user() !== null);
  readonly displayName = computed(() => this.resolveDisplayName(this.user()));

  constructor() {
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      this.sessionState.set(session);
      this.initializedState.set(true);
      this.errorState.set(null);
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
    this.sessionInitialization = this.loadInitialSession();
    effect(() => console.log('Jwt: ', this.session()?.access_token));
  }

  async signInWithPassword(email: string, password: string): Promise<void> {
    this.errorState.set(null);

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      this.errorState.set(error.message);
      throw error;
    }
  }

  async signUpWithPassword(
    email: string,
    password: string,
    fullName: string | null,
    username: string,
  ): Promise<boolean> {
    this.errorState.set(null);

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: {
          full_name: fullName?.trim() || null,
          username,
        },
      },
    });

    if (error) {
      this.errorState.set(error.message);
      throw error;
    }

    return data.session === null;
  }

  async signOut(): Promise<void> {
    this.errorState.set(null);
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      this.errorState.set(error.message);
      throw error;
    }
  }

  async whenInitialized(): Promise<void> {
    await this.sessionInitialization;
  }

  async getAccessToken(): Promise<string | null> {
    await this.whenInitialized();
    return this.session()?.access_token ?? null;
  }

  async getUserId(): Promise<string> {
    await this.whenInitialized();
    const userId = this.user()?.id;

    if (!userId) {
      throw new Error('Authentication is required to access this resource');
    }

    return userId;
  }

  private async loadInitialSession(): Promise<void> {
    const {
      data: { session },
      error,
    } = await supabaseClient.auth.getSession();

    this.sessionState.set(session);
    this.initializedState.set(true);
    this.errorState.set(error?.message ?? null);
  }

  private resolveDisplayName(user: User | null): string {
    if (!user) {
      return 'Contribuidor';
    }

    const metadata = user.user_metadata as Record<string, unknown>;
    const metadataName = [metadata['full_name'], metadata['name'], metadata['user_name']].find(
      (value): value is string => typeof value === 'string' && value.trim().length > 0,
    );

    return metadataName?.trim() || user.email?.split('@')[0] || 'Contribuidor';
  }
}
