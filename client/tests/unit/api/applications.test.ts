/**
 * Route handlers run on the server, so they need the node environment —
 * jsdom does not provide the Web `Request` global that next/server builds on.
 *
 * @jest-environment node
 */
import { NextRequest } from 'next/server';

const mockGetAdminUser = jest.fn();

jest.mock('@/shared/lib/auth/guards', () => ({
  getAdminUser: () => mockGetAdminUser(),
}));

jest.mock('@/assets/applicants.json', () => [
  {
    id: '1',
    name: 'Alice',
    role: 'Data Scientist',
    interviewStatus: 'Finished',
    applicationStatus: 'Pending',
  },
  {
    id: '2',
    name: 'Bob',
    role: 'Backend Developer',
    interviewStatus: 'Not Scheduled',
    applicationStatus: 'Waitlisted',
  },
]);

import { GET } from '@/app/api/applications/route';

const request = (query = '') =>
  new NextRequest(`http://localhost:3000/api/applications${query}`);

describe('GET /api/applications', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Applicant records are PII — middleware only proves someone is signed in,
  // so a non-admin must not get past this handler.
  it('returns 403 when nobody is signed in', async () => {
    mockGetAdminUser.mockResolvedValue(null);

    const res = await GET(request());

    expect(res.status).toBe(403);
    await expect(res.json()).resolves.toEqual({ error: 'Forbidden' });
  });

  it('returns 403 for a signed-in non-admin', async () => {
    mockGetAdminUser.mockResolvedValue(null);

    const res = await GET(request('?name=Alice'));

    expect(res.status).toBe(403);
  });

  it('does not leak applicant data in the forbidden response', async () => {
    mockGetAdminUser.mockResolvedValue(null);

    const body = await (await GET(request())).json();

    expect(JSON.stringify(body)).not.toContain('Alice');
    expect(body.applications).toBeUndefined();
  });

  it('returns applications for an admin', async () => {
    mockGetAdminUser.mockResolvedValue({ id: 'u1', admin: true });

    const res = await GET(request());
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.applications).toHaveLength(2);
    expect(body.total).toBe(2);
  });

  it('still applies filters for an admin', async () => {
    mockGetAdminUser.mockResolvedValue({ id: 'u1', admin: true });

    const body = await (await GET(request('?name=Alice'))).json();

    expect(body.applications).toHaveLength(1);
    expect(body.applications[0].name).toBe('Alice');
  });
});
