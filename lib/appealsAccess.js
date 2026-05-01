/**
 * Appeal history access rules for API routes (service-role Supabase client).
 *
 * - ALLOW_PUBLIC_APPEAL_HISTORY=true → no login required; lists are not user-filtered (demo only).
 * - Production by default requires a signed-in user unless ALLOW_PUBLIC_APPEAL_HISTORY is true.
 * - Development allows anonymous history unless APPEALS_REQUIRE_LOGIN=true.
 */

const isProduction = process.env.NODE_ENV === 'production';

export function allowPublicAppealHistoryDemo() {
  return process.env.ALLOW_PUBLIC_APPEAL_HISTORY === 'true';
}

/** When true, anonymous clients cannot read/write appeals via API. */
export function appealsRequireAuthenticatedUser() {
  if (allowPublicAppealHistoryDemo()) return false;
  if (process.env.APPEALS_REQUIRE_LOGIN === 'true') return true;
  if (process.env.APPEALS_REQUIRE_LOGIN === 'false') return false;
  return isProduction;
}
