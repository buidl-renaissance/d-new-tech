import type { NextApiRequest, NextApiResponse } from 'next';
import { getDb } from '@/db/drizzle';
import { members, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { getUserById } from '@/db/user';

type MemberPreview = {
  id: string;
  pfpUrl: string | null;
  username: string | null;
};

type GetResponseData = {
  count: number;
  recentMembers: MemberPreview[];
  isMember?: boolean;
};

type PostResponseData = {
  success: boolean;
  message: string;
  alreadyMember?: boolean;
};

type ErrorResponse = {
  error: string;
};

// Helper to get user from request (cookie or query param)
async function getUserFromRequest(req: NextApiRequest) {
  // Try query param first
  if (req.query.userId && typeof req.query.userId === 'string') {
    return await getUserById(req.query.userId);
  }

  // Try cookie
  const cookies = req.headers.cookie || '';
  const sessionMatch = cookies.match(/user_session=([^;]+)/);
  
  if (sessionMatch && sessionMatch[1]) {
    return await getUserById(sessionMatch[1]);
  }

  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | PostResponseData | ErrorResponse>
) {
  const db = getDb();

  if (req.method === 'GET') {
    try {
      // Get member count
      const allMembers = await db.select().from(members);
      const count = allMembers.length;

      // Get recent members with user info (last 8 for avatar stack)
      const recentMembersWithUsers = await db
        .select({
          memberId: members.id,
          userId: members.userId,
          username: users.username,
          pfpUrl: users.pfpUrl,
          createdAt: members.createdAt,
        })
        .from(members)
        .leftJoin(users, eq(members.userId, users.id))
        .orderBy(desc(members.createdAt))
        .limit(8);

      const recentMembers: MemberPreview[] = recentMembersWithUsers.map((m) => ({
        id: m.memberId,
        pfpUrl: m.pfpUrl,
        username: m.username,
      }));

      // Check if current user is a member
      const currentUser = await getUserFromRequest(req);
      let isMember = false;
      
      if (currentUser) {
        const existingMember = await db
          .select()
          .from(members)
          .where(eq(members.userId, currentUser.id))
          .limit(1);
        isMember = existingMember.length > 0;
      }

      return res.status(200).json({
        count,
        recentMembers,
        isMember,
      });
    } catch (error) {
      console.error('Error fetching members:', error);
      return res.status(500).json({ error: 'Failed to fetch members' });
    }
  }

  if (req.method === 'POST') {
    try {
      const user = await getUserFromRequest(req);

      if (!user) {
        return res.status(401).json({ error: 'Not authenticated' });
      }

      // Check if already a member
      const existingMember = await db
        .select()
        .from(members)
        .where(eq(members.userId, user.id))
        .limit(1);

      if (existingMember.length > 0) {
        return res.status(200).json({
          success: true,
          message: 'You are already a member!',
          alreadyMember: true,
        });
      }

      // Create new member
      const newMember = {
        id: uuidv4(),
        userId: user.id,
      };

      await db.insert(members).values(newMember);

      return res.status(201).json({
        success: true,
        message: 'Welcome to D-NewTech! You are now a member.',
        alreadyMember: false,
      });
    } catch (error) {
      console.error('Error registering member:', error);
      return res.status(500).json({ error: 'Failed to register as member' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
