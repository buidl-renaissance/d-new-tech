import type { NextApiRequest, NextApiResponse } from 'next';

interface Venue {
  address: string;
  city: string;
  state: string;
  name: string;
}

interface EventGroup {
  id: string;
  name: string;
  urlname: string;
}

interface MeetupEvent {
  id: number;
  eventId: string;
  title: string;
  description: string;
  dateTime: string;
  venue: Venue;
  group: EventGroup;
  eventUrl: string;
}

interface MeetupApiResponse {
  events: MeetupEvent[];
  total: number;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MeetupEvent[] | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch('https://meetup.builddetroit.xyz/api/meetup/events');
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data: MeetupApiResponse = await response.json();
    
    // Filter for DNewTech events by title (case insensitive)
    // Looking for: DNewTech, D-NewTech, or D New Tech in the title
    const searchTerms = ['dnewtech', 'd-newtech', 'd new tech'];
    
    const dnewtechEvents = data.events.filter((event) => {
      const titleLower = event.title?.toLowerCase() || '';
      
      return searchTerms.some(term => titleLower.includes(term));
    });
    
    // Sort by date ascending (upcoming first)
    dnewtechEvents.sort((a, b) => 
      new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    );
    
    return res.status(200).json(dnewtechEvents);
  } catch (error) {
    console.error('Error fetching meetup events:', error);
    return res.status(500).json({ error: 'Failed to fetch events' });
  }
}
