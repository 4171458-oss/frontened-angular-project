
export interface CreateTeamRequest {
  name: string;
  description?: string;
}

export interface AddTeamMemberRequest {
  userId: number;
  role?: 'member' | 'admin';
}

export interface Team {
  id: number;
  name: string;
  description?: string;
  ownerId?: number;
  ownerName?: string;
  createdAt: string;
  memberCount: number;
}