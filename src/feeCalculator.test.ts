import { describe, expect, it } from 'vitest';
import { updateUserProfile } from './userProfileApi';

describe('updateUserProfile', () => {
  const currentProfile = {
    id: 'user-123',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 123-4567',
    avatarUrl: 'https://cdn.example.com/avatar.png',
    updatedAt: '2024-01-01T00:00:00.000Z',
  };

  it('updates valid profile fields and returns a 200 response', () => {
    const result = updateUserProfile(currentProfile, {
      firstName: '  Jane  ',
      lastName: 'Doe',
      email: 'JANE.DOE@example.com',
      phone: '+1 (555) 987-6543',
      avatarUrl: 'https://cdn.example.com/new-avatar.png',
    }, { now: new Date('2024-02-01T00:00:00.000Z') });

    expect(result.statusCode).toBe(200);
    expect(result.message).toBe('Profile updated successfully.');
    expect(result.profile).toMatchObject({
      id: 'user-123',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 987-6543',
      avatarUrl: 'https://cdn.example.com/new-avatar.png',
    });
    expect(result.profile?.updatedAt).toBe('2024-02-01T00:00:00.000Z');
  });

  it('returns a validation error for invalid email input', () => {
    const result = updateUserProfile(currentProfile, {
      email: 'not-an-email',
    });

    expect(result.statusCode).toBe(400);
    expect(result.errors).toMatchObject({
      email: 'Email must be a valid email address.',
    });
  });

  it('returns a validation error for empty or malformed name input', () => {
    const result = updateUserProfile(currentProfile, {
      firstName: '   ',
      lastName: 'Doe!!!',
    });

    expect(result.statusCode).toBe(400);
    expect(result.errors).toMatchObject({
      firstName: 'First name cannot be empty.',
      lastName: 'Last name contains invalid characters.',
    });
  });

  it('returns a validation error when the avatar URL is invalid', () => {
    const result = updateUserProfile(currentProfile, {
      avatarUrl: 'ftp://cdn.example.com/avatar.png',
    });

    expect(result.statusCode).toBe(400);
    expect(result.errors).toMatchObject({
      avatarUrl: 'Avatar URL must be a valid http or https URL.',
    });
  });

  it('rejects requests with no profile changes', () => {
    const result = updateUserProfile(currentProfile, {});

    expect(result.statusCode).toBe(400);
    expect(result.errors).toMatchObject({
      updates: 'At least one valid field must be provided.',
    });
  });
});
