export type UserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  updatedAt?: string;
};

export type UserProfileUpdateInput = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatarUrl: string;
}>;

export type UserProfileUpdateResult = {
  statusCode: number;
  message: string;
  profile?: UserProfile;
  errors?: Record<string, string>;
};

function normalizeString(value: string | undefined): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
}

export function createProfileUpdateResponse(
  statusCode: number,
  message: string,
  profile?: UserProfile,
  errors?: Record<string, string>,
): UserProfileUpdateResult {
  return {
    statusCode,
    message,
    ...(profile ? { profile } : {}),
    ...(errors && Object.keys(errors).length > 0 ? { errors } : {}),
  };
}

export function updateUserProfile(
  currentProfile: UserProfile,
  updates: UserProfileUpdateInput,
  options: { now?: Date } = {},
): UserProfileUpdateResult {
  if (!currentProfile || typeof currentProfile !== 'object') {
    return createProfileUpdateResponse(400, 'Current profile is required.', undefined, {
      profile: 'Current profile is required.',
    });
  }

  if (!updates || typeof updates !== 'object' || Object.keys(updates).length === 0) {
    return createProfileUpdateResponse(400, 'No profile changes were provided.', undefined, {
      updates: 'At least one valid field must be provided.',
    });
  }

  const errors: Record<string, string> = {};
  const nextProfile: UserProfile = { ...currentProfile };

  const firstName = normalizeString(updates.firstName);
  if (updates.firstName !== undefined && firstName === undefined) {
    errors.firstName = 'First name cannot be empty.';
  } else if (firstName) {
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]{1,50}$/.test(firstName)) {
      errors.firstName = 'First name contains invalid characters.';
    } else {
      nextProfile.firstName = firstName;
    }
  }

  const lastName = normalizeString(updates.lastName);
  if (updates.lastName !== undefined && lastName === undefined) {
    errors.lastName = 'Last name cannot be empty.';
  } else if (lastName) {
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ'\- ]{1,50}$/.test(lastName)) {
      errors.lastName = 'Last name contains invalid characters.';
    } else {
      nextProfile.lastName = lastName;
    }
  }

  const email = normalizeString(updates.email);
  if (updates.email !== undefined && email === undefined) {
    errors.email = 'Email cannot be empty.';
  } else if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Email must be a valid email address.';
    } else {
      nextProfile.email = email.toLowerCase();
    }
  }

  const phone = normalizeString(updates.phone);
  if (updates.phone !== undefined && phone === undefined) {
    errors.phone = 'Phone number cannot be empty.';
  } else if (phone) {
    if (!/^\+?[0-9()\-\s]{7,20}$/.test(phone)) {
      errors.phone = 'Phone number must contain 7 to 20 digits or formatting characters.';
    } else {
      nextProfile.phone = phone;
    }
  }

  const avatarUrl = normalizeString(updates.avatarUrl);
  if (updates.avatarUrl !== undefined && avatarUrl === undefined) {
    errors.avatarUrl = 'Avatar URL cannot be empty.';
  } else if (avatarUrl) {
    try {
      const parsedUrl = new URL(avatarUrl);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Unsupported protocol');
      }
      nextProfile.avatarUrl = parsedUrl.toString();
    } catch {
      errors.avatarUrl = 'Avatar URL must be a valid http or https URL.';
    }
  }

  if (Object.keys(errors).length > 0) {
    return createProfileUpdateResponse(400, 'Profile update failed validation.', undefined, errors);
  }

  const updatedAt = (options.now ?? new Date()).toISOString();
  const updatedProfile: UserProfile = {
    ...nextProfile,
    updatedAt,
  };

  return createProfileUpdateResponse(200, 'Profile updated successfully.', updatedProfile);
}
