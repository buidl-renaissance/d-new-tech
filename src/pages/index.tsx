import Head from "next/head";
import Image from "next/image";
import styled, { keyframes, css } from "styled-components";
import { useState, useEffect, useRef, useCallback } from "react";
import { useUser } from "@/contexts/UserContext";

// Event Types from Meetup API
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

// Member and Message types
interface MemberPreview {
  id: string;
  pfpUrl: string | null;
  username: string | null;
}

interface MembersData {
  count: number;
  recentMembers: MemberPreview[];
  isMember?: boolean;
}

interface ChatMessage {
  id: string;
  content: string;
  createdAt: Date;
  user: {
    id: string;
    username: string | null;
    displayName: string | null;
    pfpUrl: string | null;
  };
}

// Detroit Industrial Theme Colors
const colors = {
  primary: {
    detroitRed: '#E63946',
    crimson: '#C1121F',
  },
  dark: {
    charcoal: '#0D1117',
    graphite: '#161B22',
    steel: '#21262D',
  },
  accent: {
    chrome: '#F0F6FC',
    silver: '#8B949E',
    spark: '#FF6B6B',
  }
};

// Animations
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulseGlow = keyframes`
  0%, 100% {
    box-shadow: 0 0 20px rgba(230, 57, 70, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(230, 57, 70, 0.6);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.dark.charcoal};
  font-family: 'Source Sans 3', -apple-system, BlinkMacSystemFont, sans-serif;
  line-height: 1.7;
  color: ${colors.accent.chrome};
  overflow-x: hidden;
`;

const HeroSection = styled.section`
  position: relative;
  min-height: 100vh;
  background: ${colors.dark.graphite};
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow: visible;

  /* Pull section up to cover body padding on mobile */
  @media (max-width: 768px) {
    margin-top: -56px;
    padding-top: 56px;
  }

  /* Plaid pattern - layered crossing stripes */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      /* Horizontal stripes */
      repeating-linear-gradient(
        0deg,
        transparent,
        transparent 58px,
        rgba(230, 57, 70, 0.08) 58px,
        rgba(230, 57, 70, 0.08) 60px,
        transparent 60px,
        transparent 118px,
        rgba(0, 0, 0, 0.2) 118px,
        rgba(0, 0, 0, 0.2) 120px
      ),
      /* Vertical stripes */
      repeating-linear-gradient(
        90deg,
        transparent,
        transparent 58px,
        rgba(230, 57, 70, 0.08) 58px,
        rgba(230, 57, 70, 0.08) 60px,
        transparent 60px,
        transparent 118px,
        rgba(0, 0, 0, 0.2) 118px,
        rgba(0, 0, 0, 0.2) 120px
      ),
      /* Diagonal accent lines */
      repeating-linear-gradient(
        -45deg,
        transparent,
        transparent 78px,
        rgba(230, 57, 70, 0.04) 78px,
        rgba(230, 57, 70, 0.04) 80px
      ),
      repeating-linear-gradient(
      45deg,
        transparent,
        transparent 78px,
        rgba(230, 57, 70, 0.04) 78px,
        rgba(230, 57, 70, 0.04) 80px
    );
    z-index: 1;
  }

  /* Diagonal accent stripe glow */
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    right: -10%;
    width: 500px;
    height: 200%;
    background: linear-gradient(
      to bottom,
      transparent,
      rgba(230, 57, 70, 0.12) 20%,
      rgba(230, 57, 70, 0.2) 50%,
      rgba(230, 57, 70, 0.12) 80%,
      transparent
    );
    transform: rotate(-15deg);
    z-index: 1;
  }

`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 900px;
  padding: 0 2rem;
  animation: ${fadeIn} 1s ease-out;
  
  @media (max-width: 768px) {
    padding: 55px 1.5rem 0;
  }
  
  @media (max-width: 480px) {
    padding: 50px 1.5rem 0;
  }
`;

const HeroLogo = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  justify-content: center;
  animation: ${fadeInUp} 0.8s ease-out;
  
  img {
    max-width: 180px;
    width: 100%;
    height: auto !important;
    filter: drop-shadow(0 0 30px rgba(230, 57, 70, 0.4));
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      filter: drop-shadow(0 0 50px rgba(230, 57, 70, 0.7));
      transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
      max-width: 140px;
    }
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Bebas Neue', 'Impact', sans-serif;
  font-size: clamp(2.8rem, 7vw, 5rem);
  font-weight: 400;
  margin-bottom: 1.5rem;
  letter-spacing: 0.03em;
  line-height: 1.1;
  color: ${colors.accent.chrome};
  text-transform: uppercase;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
  
  span {
    color: ${colors.primary.detroitRed};
    display: inline-block;
  }
`;

const HeroSubtitle = styled.p`
  font-size: clamp(1.1rem, 2.5vw, 1.4rem);
  margin-bottom: 2.5rem;
  font-weight: 400;
  color: ${colors.accent.silver};
  line-height: 1.6;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
`;

const CTAButton = styled.a<{ $primary?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.1em;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    padding: 0.875rem 1.5rem;
    font-size: 1rem;
  }
  
  ${props => props.$primary ? `
    background: ${colors.primary.detroitRed};
    color: ${colors.accent.chrome};
    border: 2px solid ${colors.primary.detroitRed};
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
      transition: left 0.5s;
    }
    
    &:hover {
      background: ${colors.primary.crimson};
      border-color: ${colors.primary.crimson};
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(230, 57, 70, 0.4);
      
      &::before {
        left: 100%;
      }
    }
  ` : `
    background: transparent;
    color: ${colors.accent.chrome};
    border: 2px solid ${colors.dark.steel};
    
    &:hover {
      border-color: ${colors.primary.detroitRed};
      color: ${colors.primary.detroitRed};
      transform: translateY(-3px);
      box-shadow: 0 10px 30px rgba(230, 57, 70, 0.2);
    }
  `}
`;

const NextEventBanner = styled.div`
  position: fixed;
  top: 12px;
  left: 12px;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-out 0.3s both;
  padding: 0 0.25rem;
  
  @media (max-width: 768px) {
    top: 8px;
    left: 8px;
  }
`;

const NextEventBadge = styled.a`
  display: inline-flex;
  text-decoration: none;
  color: ${colors.accent.chrome};
  background: rgba(13, 17, 23, 0.95);
  backdrop-filter: blur(12px);
  border-radius: 50px;
  border: 1px solid ${colors.dark.steel};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(230, 57, 70, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
  
  &:hover {
    background: rgba(22, 27, 34, 0.98);
    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(230, 57, 70, 0.2);
    transform: translateY(-1px);
  }
`;

const NextEventBadgeContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 0.75rem 0.35rem 1rem;
  
  @media (max-width: 768px) {
    gap: 0.4rem;
    padding: 0.35rem 0.75rem 0.35rem 1rem;
  }
`;

const NextEventCalendar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 42px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    min-width: 38px;
    border-radius: 6px;
  }
`;

const NextEventCalendarHeader = styled.div`
  background: ${colors.primary.detroitRed};
  width: 100%;
  padding: 0.1rem 0.25rem;
  text-align: center;
  line-height: 1;
`;

const NextEventMonth = styled.span`
  font-size: 0.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: white;
  
  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

const NextEventCalendarBody = styled.div`
  background: ${colors.accent.chrome};
  width: 100%;
  padding: 0.1rem 0.25rem 0.15rem;
  text-align: center;
  line-height: 1;
`;

const NextEventDay = styled.span`
  font-size: 1.15rem;
  font-weight: 800;
  line-height: 1;
  color: ${colors.dark.charcoal};
  
  @media (max-width: 768px) {
  font-size: 1rem;
  }
`;

const NextEventInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35rem;
  
  @media (max-width: 768px) {
    flex: 1;
    min-width: 0;
  }
`;

const NextEventText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  line-height: 1.2;
`;

const NextEventTitle = styled.span`
  font-size: 0.55rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${colors.primary.detroitRed};
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  line-height: 1;
  margin-bottom: 0.1rem;
  
  i {
    font-size: 0.45rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`;

const NextEventDetails = styled.span`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.accent.chrome};
  white-space: nowrap;
  line-height: 1.1;
  
  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const NextEventVenueSmall = styled.span`
  font-size: 0.65rem;
  color: ${colors.accent.silver};
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  line-height: 1;
  margin-top: 0.1rem;
  
  i {
    color: ${colors.accent.silver};
    font-size: 0.5rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.6rem;
  }
`;

const NextEventDivider = styled.span`
  width: 1px;
  height: 32px;
  background: ${colors.dark.steel};
  flex-shrink: 0;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NextEventVenue = styled.span`
  font-size: 0.8rem;
  color: ${colors.accent.silver};
  display: flex;
  align-items: center;
  gap: 0.3rem;
  white-space: nowrap;
  
  i {
    color: ${colors.primary.detroitRed};
    font-size: 0.65rem;
  }
  
  @media (max-width: 768px) {
    font-size: 0.7rem;
    display: none;
  }
`;

const NextEventRsvpButton = styled.button`
  background: ${colors.primary.detroitRed};
  color: white;
  border: none;
  padding: 0.4rem 0.85rem;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  i {
    font-size: 0.65rem;
  }
  
  &:hover {
    background: ${colors.primary.crimson};
    transform: scale(1.02);
  }
  
  @media (max-width: 768px) {
    padding: 0.35rem 0.7rem;
    font-size: 0.7rem;
  }
`;

const NextEventLoading = styled.div`
  padding: 0.5rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  
  i {
    color: ${colors.primary.detroitRed};
    animation: ${pulseGlow} 1.5s ease-in-out infinite;
  }
`;

const Section = styled.section<{ $variant?: 'dark' | 'darker' | 'gradient'; $index?: number }>`
  padding: 6rem 0;
  position: relative;
  
  ${props => {
    switch(props.$variant) {
      case 'darker':
        return `background: ${colors.dark.graphite};`;
      case 'gradient':
        return `
          background: linear-gradient(
            180deg,
            ${colors.dark.charcoal} 0%,
            ${colors.dark.graphite} 100%
          );
        `;
      default:
        return `background: ${colors.dark.charcoal};`;
    }
  }}
  
  /* Subtle top border accent */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: ${colors.primary.detroitRed};
    border-radius: 2px;
  }
  
  @media (max-width: 768px) {
    padding: 4rem 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1.5rem;
  }
`;

const AnimatedElement = styled.div<{ $visible: boolean; $delay?: number }>`
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: ${props => (props.$delay || 0) * 0.1}s;
  
  ${props => props.$visible && css`
    opacity: 1;
    transform: translateY(0);
  `}
`;

const SectionTitle = styled.h2`
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 400;
  text-align: center;
  margin-bottom: 1rem;
  letter-spacing: 0.05em;
  color: ${colors.accent.chrome};
  text-transform: uppercase;
  position: relative;
  
  span {
    color: ${colors.primary.detroitRed};
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.15rem;
  text-align: center;
  max-width: 700px;
  margin: 0 auto 3.5rem;
  line-height: 1.7;
  color: ${colors.accent.silver};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const Card = styled.div<{ $featured?: boolean }>`
  background: ${colors.dark.graphite};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${colors.dark.steel};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  /* Diagonal accent corner */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, transparent 50%, rgba(230, 57, 70, 0.1) 50%);
    transition: all 0.4s ease;
  }
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${colors.primary.detroitRed};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    
    &::before {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, transparent 50%, rgba(230, 57, 70, 0.2) 50%);
    }
  }
  
  ${props => props.$featured && `
    border-color: ${colors.primary.detroitRed};
    background: linear-gradient(135deg, ${colors.dark.graphite} 0%, rgba(230, 57, 70, 0.05) 100%);
  `}
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const CardIcon = styled.div`
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, ${colors.primary.detroitRed} 0%, ${colors.primary.crimson} 100%);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
  font-size: 1.4rem;
  color: ${colors.accent.chrome};
  box-shadow: 0 4px 20px rgba(230, 57, 70, 0.3);
  transition: all 0.3s ease;
  
  ${Card}:hover & {
    transform: scale(1.1) rotate(-5deg);
    box-shadow: 0 8px 30px rgba(230, 57, 70, 0.5);
  }
`;

const CardTitle = styled.h3`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  font-weight: 400;
  margin-bottom: 0.75rem;
  color: ${colors.accent.chrome};
  letter-spacing: 0.03em;
  text-transform: uppercase;
`;

const CardText = styled.p`
  color: ${colors.accent.silver};
  line-height: 1.7;
  font-size: 0.95rem;
`;

const Footer = styled.footer`
  background: ${colors.dark.graphite};
  color: ${colors.accent.chrome};
  padding: 4rem 0 2rem;
  border-top: 1px solid ${colors.dark.steel};
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent, ${colors.primary.detroitRed}, transparent);
  }
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: 1.5fr repeat(3, 1fr);
  gap: 3rem;
  margin-bottom: 3rem;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  h4 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.2rem;
    font-weight: 400;
    margin-bottom: 1.25rem;
    color: ${colors.accent.chrome};
    letter-spacing: 0.05em;
    text-transform: uppercase;
  }
  
  p, a {
    color: ${colors.accent.silver};
    text-decoration: none;
    line-height: 2;
    font-size: 0.95rem;
    transition: color 0.3s ease;
    display: block;
    
    &:hover {
      color: ${colors.primary.detroitRed};
    }
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1.25rem;
  
  @media (max-width: 600px) {
    display: flex;
    justify-content: center;
  }
  
  img {
    max-width: 100px;
    width: 100%;
    height: auto !important;
    filter: drop-shadow(0 0 20px rgba(230, 57, 70, 0.3));
    transition: all 0.3s ease;
    
    &:hover {
      filter: drop-shadow(0 0 30px rgba(230, 57, 70, 0.5));
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid ${colors.dark.steel};
  color: ${colors.accent.silver};
  font-size: 0.9rem;
  
  i {
    color: ${colors.primary.detroitRed};
    margin: 0 0.25rem;
  }
`;

const EventFormat = styled.div`
  background: ${colors.dark.graphite};
  padding: 2.5rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  border: 1px solid ${colors.dark.steel};
  position: relative;
  
  /* Left accent bar */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${colors.primary.detroitRed};
    border-radius: 4px 0 0 4px;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1.5rem 1.5rem 2rem;
  }
`;

const EventList = styled.ul`
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  
  li {
    padding: 0.75rem 0;
    padding-left: 2.5rem;
    position: relative;
    color: ${colors.accent.silver};
    font-size: 1rem;
    border-bottom: 1px solid ${colors.dark.steel};
    
    &:last-child {
      border-bottom: none;
    }
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      background: ${colors.primary.detroitRed};
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    &::after {
      content: '✓';
      position: absolute;
      left: 5px;
      top: 50%;
      transform: translateY(-50%);
      color: ${colors.accent.chrome};
      font-size: 0.7rem;
      font-weight: bold;
    }
  }
`;

const TestimonialCard = styled.div`
  background: ${colors.dark.graphite};
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid ${colors.dark.steel};
  position: relative;
  transition: all 0.4s ease;
  
  /* Quote mark */
  &::before {
    content: '"';
    position: absolute;
    top: 1rem;
    left: 1.5rem;
    font-family: 'Georgia', serif;
    font-size: 4rem;
    color: ${colors.primary.detroitRed};
    opacity: 0.3;
    line-height: 1;
  }
  
  &:hover {
    transform: translateY(-5px);
    border-color: rgba(230, 57, 70, 0.3);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const TestimonialText = styled.p`
  font-style: italic;
  font-size: 1.05rem;
  margin-bottom: 1.25rem;
  color: ${colors.accent.silver};
  line-height: 1.7;
  padding-left: 1rem;
`;

const TestimonialAuthor = styled.p`
  font-weight: 600;
  color: ${colors.accent.chrome};
  font-size: 0.95rem;
  
  span {
    color: ${colors.primary.detroitRed};
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 4rem 0;
  
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
  
  @media (max-width: 480px) {
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: ${colors.dark.graphite};
  border-radius: 8px;
  border: 1px solid ${colors.dark.steel};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.primary.detroitRed};
    transform: translateY(-5px);
  }
`;

const StatNumber = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 400;
  color: ${colors.primary.detroitRed};
  letter-spacing: 0.02em;
  line-height: 1;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 0.9rem;
  color: ${colors.accent.silver};
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.25rem;
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }
`;

const PartnerLogo = styled.div`
  padding: 1.5rem 1rem;
  background: ${colors.dark.graphite};
  border-radius: 8px;
  border: 1px solid ${colors.dark.steel};
  font-weight: 600;
  color: ${colors.accent.silver};
  text-align: center;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.primary.detroitRed};
    color: ${colors.accent.chrome};
    transform: translateY(-3px);
  }
`;

const EmailForm = styled.form`
  display: flex;
  max-width: 500px;
  margin: 2.5rem auto;
  gap: 0;
  background: ${colors.dark.graphite};
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${colors.dark.steel};
  transition: all 0.3s ease;
  
  &:focus-within {
    border-color: ${colors.primary.detroitRed};
    box-shadow: 0 0 20px rgba(230, 57, 70, 0.2);
  }
  
  @media (max-width: 500px) {
    flex-direction: column;
    border-radius: 8px;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 1.25rem 1.5rem;
  border: none;
  font-size: 1rem;
  outline: none;
  background: transparent;
  color: ${colors.accent.chrome};
  font-family: inherit;
  
  &::placeholder {
    color: ${colors.accent.silver};
  }
  
  @media (max-width: 500px) {
    padding: 1rem 1.25rem;
  }
`;

const SubmitButton = styled.button`
  padding: 1.25rem 2rem;
  background: ${colors.primary.detroitRed};
  color: ${colors.accent.chrome};
  border: none;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  &:hover {
    background: ${colors.primary.crimson};
  }
  
  @media (max-width: 500px) {
    padding: 1rem;
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2.5rem 0;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: ${colors.dark.graphite};
  color: ${colors.accent.silver};
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid ${colors.dark.steel};
  font-size: 1.2rem;
  
  &:hover {
    background: ${colors.primary.detroitRed};
    color: ${colors.accent.chrome};
    transform: translateY(-5px) scale(1.05);
    box-shadow: 0 10px 25px rgba(230, 57, 70, 0.4);
    border-color: ${colors.primary.detroitRed};
  }
`;

const EventCard = styled(Card)`
  max-width: 650px;
  margin: 0 auto 3rem;
  text-align: center;
  padding: 3rem;
  border-color: ${colors.primary.detroitRed};
  background: linear-gradient(135deg, ${colors.dark.graphite} 0%, rgba(230, 57, 70, 0.05) 100%);
  
  &::before {
    display: none;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const EventDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  margin: 1.5rem 0 2rem;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const EventDetail = styled.div`
  i {
    color: ${colors.primary.detroitRed};
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
    display: block;
  }
  
  strong {
    display: block;
    color: ${colors.accent.chrome};
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.1em;
  }
  
  span {
    color: ${colors.accent.silver};
    font-size: 0.95rem;
  }
`;

// API Events Grid
const ApiEventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }
`;

const ApiEventCard = styled.div`
  background: ${colors.dark.graphite};
  border-radius: 12px;
  border: 1px solid ${colors.dark.steel};
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:hover {
    transform: translateY(-8px);
    border-color: ${colors.primary.detroitRed};
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(230, 57, 70, 0.1);
  }
`;

const ApiEventHeader = styled.div`
  background: linear-gradient(135deg, ${colors.primary.detroitRed} 0%, ${colors.primary.crimson} 100%);
  padding: 1.25rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ApiEventDate = styled.div`
  text-align: left;
`;

const ApiEventDay = styled.div`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 2.5rem;
  line-height: 1;
  color: ${colors.accent.chrome};
  letter-spacing: 0.02em;
`;

const ApiEventMonth = styled.div`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const ApiEventTime = styled.div`
  text-align: right;
  color: ${colors.accent.chrome};
  
  i {
    margin-right: 0.5rem;
    opacity: 0.8;
  }
  
  span {
    font-weight: 600;
    font-size: 0.95rem;
  }
`;

const ApiEventBody = styled.div`
  padding: 1.5rem;
`;

const ApiEventTitle = styled.h3`
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.35rem;
  font-weight: 400;
  color: ${colors.accent.chrome};
  margin-bottom: 1rem;
  letter-spacing: 0.02em;
  line-height: 1.2;
  text-transform: uppercase;
`;

const ApiEventVenue = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  color: ${colors.accent.silver};
  font-size: 0.9rem;
  margin-bottom: 1rem;
  padding: 0.875rem 1rem;
  background: ${colors.dark.charcoal};
  border-radius: 8px;
  border: 1px solid ${colors.dark.steel};
  
  i {
    color: ${colors.primary.detroitRed};
    margin-top: 2px;
    flex-shrink: 0;
  }
`;

const ApiEventVenueDetails = styled.div`
  strong {
    color: ${colors.accent.chrome};
    display: block;
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
  }
`;

const ApiEventGroup = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: ${colors.accent.silver};
  margin-bottom: 1.25rem;
  padding: 0.5rem 0.75rem;
  background: rgba(230, 57, 70, 0.1);
  border-radius: 6px;
  border: 1px solid rgba(230, 57, 70, 0.2);
  
  i {
    color: ${colors.primary.detroitRed};
    font-size: 0.75rem;
  }
`;

const ApiEventButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem 1.5rem;
  background: transparent;
  color: ${colors.accent.chrome};
  border: 2px solid ${colors.dark.steel};
  border-radius: 8px;
  text-decoration: none;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${colors.primary.detroitRed};
    border-color: ${colors.primary.detroitRed};
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(230, 57, 70, 0.3);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4rem;
  gap: 1.5rem;
  
  &::before {
    content: '';
    width: 50px;
    height: 50px;
    border: 3px solid ${colors.dark.steel};
    border-top-color: ${colors.primary.detroitRed};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  span {
    color: ${colors.accent.silver};
    font-size: 0.95rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: ${colors.accent.silver};
  font-size: 1.1rem;
  background: ${colors.dark.graphite};
  border-radius: 12px;
  border: 1px solid ${colors.dark.steel};
  
  i {
    display: block;
    font-size: 3rem;
    color: ${colors.dark.steel};
    margin-bottom: 1rem;
  }
`;

// Floating UI Components
const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const MemberBadge = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: ${colors.dark.graphite};
  padding: 0.625rem 1rem;
  border-radius: 50px;
  border: 1px solid ${colors.dark.steel};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: ${colors.primary.detroitRed};
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
  }
  
  @media (max-width: 768px) {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
    left: 16px;
    padding: 0.5rem 0.875rem;
  }
`;

const AvatarStack = styled.div`
  display: flex;
  align-items: center;
`;

const AvatarImage = styled.div<{ $index: number; $hasImage: boolean }>`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid ${colors.dark.graphite};
  background: ${props => props.$hasImage ? 'transparent' : colors.dark.steel};
  margin-left: ${props => props.$index > 0 ? '-8px' : '0'};
  position: relative;
  z-index: ${props => 10 - props.$index};
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  i {
    font-size: 0.7rem;
    color: ${colors.accent.silver};
  }
`;

const MemberCount = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.accent.chrome};
  white-space: nowrap;
`;

const ChatButton = styled.button`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.primary.detroitRed} 0%, ${colors.primary.crimson} 100%);
  border: none;
  color: ${colors.accent.chrome};
  font-size: 1.4rem;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(230, 57, 70, 0.4);
  z-index: 1000;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(230, 57, 70, 0.6);
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  @media (max-width: 768px) {
    bottom: calc(env(safe-area-inset-bottom, 0px) + 16px);
    right: 16px;
    width: 52px;
    height: 52px;
    font-size: 1.2rem;
  }
`;

const ChatPanelOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  opacity: ${props => props.$isOpen ? 1 : 0};
  pointer-events: ${props => props.$isOpen ? 'auto' : 'none'};
  transition: opacity 0.3s ease;
`;

const ChatPanel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  max-width: 100vw;
  background: ${colors.dark.charcoal};
  border-left: 1px solid ${colors.dark.steel};
  z-index: 1002;
  display: flex;
  flex-direction: column;
  animation: ${props => props.$isOpen ? slideIn : slideOut} 0.3s ease forwards;
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: ${colors.dark.graphite};
  border-bottom: 1px solid ${colors.dark.steel};
  
  h3 {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 1.3rem;
    font-weight: 400;
    color: ${colors.accent.chrome};
    letter-spacing: 0.05em;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    
    i {
      color: ${colors.primary.detroitRed};
    }
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${colors.accent.silver};
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  &:hover {
    color: ${colors.accent.chrome};
    background: ${colors.dark.steel};
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${colors.dark.graphite};
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${colors.dark.steel};
    border-radius: 3px;
  }
`;

const MessageItem = styled.div`
  display: flex;
  gap: 0.75rem;
  padding: 0.75rem;
  background: ${colors.dark.graphite};
  border-radius: 8px;
  border: 1px solid ${colors.dark.steel};
`;

const MessageAvatar = styled.div<{ $hasImage: boolean }>`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${props => props.$hasImage ? 'transparent' : colors.dark.steel};
  flex-shrink: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  i {
    font-size: 1rem;
    color: ${colors.accent.silver};
  }
`;

const MessageContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
`;

const MessageUsername = styled.span`
  font-weight: 600;
  color: ${colors.accent.chrome};
  font-size: 0.9rem;
`;

const MessageTime = styled.span`
  font-size: 0.75rem;
  color: ${colors.accent.silver};
`;

const MessageText = styled.p`
  margin: 0;
  color: ${colors.accent.silver};
  font-size: 0.9rem;
  line-height: 1.5;
  word-break: break-word;
`;

const ChatCompose = styled.form`
  display: flex;
  gap: 0.5rem;
  padding: 1rem;
  background: ${colors.dark.graphite};
  border-top: 1px solid ${colors.dark.steel};
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  background: ${colors.dark.charcoal};
  border: 1px solid ${colors.dark.steel};
  border-radius: 8px;
  color: ${colors.accent.chrome};
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s ease;
  
  &::placeholder {
    color: ${colors.accent.silver};
  }
  
  &:focus {
    border-color: ${colors.primary.detroitRed};
  }
`;

const ChatSendButton = styled.button`
  padding: 0.75rem 1rem;
  background: ${colors.primary.detroitRed};
  border: none;
  border-radius: 8px;
  color: ${colors.accent.chrome};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: ${colors.primary.crimson};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyMessages = styled.div`
  text-align: center;
  padding: 3rem 1rem;
  color: ${colors.accent.silver};
  
  i {
    font-size: 2.5rem;
    color: ${colors.dark.steel};
    margin-bottom: 1rem;
    display: block;
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
  }
`;

const Toast = styled.div<{ $visible: boolean; $type: 'success' | 'error' }>`
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%) translateY(${props => props.$visible ? '0' : '20px'});
  background: ${props => props.$type === 'success' ? colors.primary.detroitRed : '#dc3545'};
  color: ${colors.accent.chrome};
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  z-index: 2000;
  opacity: ${props => props.$visible ? 1 : 0};
  pointer-events: ${props => props.$visible ? 'auto' : 'none'};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  i {
    font-size: 1rem;
  }
`;

// Custom hook for scroll animation
function useOnScreen(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );
    
    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, threshold]);
  
  return isVisible;
}

export default function Home() {
  const { user } = useUser();
  const [email, setEmail] = useState('');
  const [events, setEvents] = useState<MeetupEvent[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Member badge state
  const [membersData, setMembersData] = useState<MembersData>({ count: 0, recentMembers: [], isMember: false });
  const [memberLoading, setMemberLoading] = useState(false);
  
  // Chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);
  const chatMessagesRef = useRef<HTMLDivElement>(null);
  
  // Toast state
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({
    visible: false,
    message: '',
    type: 'success'
  });
  
  // Refs for scroll animations
  const aboutRef = useRef<HTMLDivElement>(null);
  const eventsRef = useRef<HTMLDivElement>(null);
  const getInvolvedRef = useRef<HTMLDivElement>(null);
  const partnersRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const connectRef = useRef<HTMLDivElement>(null);
  
  const aboutVisible = useOnScreen(aboutRef);
  const eventsVisible = useOnScreen(eventsRef);
  const getInvolvedVisible = useOnScreen(getInvolvedRef);
  const partnersVisible = useOnScreen(partnersRef);
  const testimonialsVisible = useOnScreen(testimonialsRef);
  const connectVisible = useOnScreen(connectRef);

  // Show toast helper
  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 3000);
  }, []);

  // Fetch members data
  const fetchMembers = useCallback(async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data: MembersData = await response.json();
        setMembersData(data);
      }
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  }, []);

  // Fetch chat messages
  const fetchMessages = useCallback(async () => {
    try {
      const response = await fetch('/api/messages');
      if (response.ok) {
        const data = await response.json();
        setChatMessages(data.messages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  }, []);

  // Handle becoming a member
  const handleBecomeMember = async (e: React.MouseEvent) => {
    if (!user) {
      // Not authenticated, just scroll to get-involved section
      return;
    }
    
    e.preventDefault();
    setMemberLoading(true);
    
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.alreadyMember) {
          showToast('You are already a member!', 'success');
        } else {
          showToast('Welcome to D-NewTech! You are now a member.', 'success');
          fetchMembers(); // Refresh member count
        }
      } else {
        showToast('Failed to register. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error becoming member:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setMemberLoading(false);
    }
  };

  // Handle sending a chat message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || chatSending || !user) return;
    
    setChatSending(true);
    
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: chatInput.trim() }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setChatMessages(prev => [...prev, data.message]);
        setChatInput('');
        
        // Scroll to bottom
        setTimeout(() => {
          if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
          }
        }, 100);
      } else {
        showToast('Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      showToast('An error occurred. Please try again.', 'error');
    } finally {
      setChatSending(false);
    }
  };

  // Format relative time
  const formatRelativeTime = (date: Date | string) => {
    const now = new Date();
    const messageDate = new Date(date);
    const diffMs = now.getTime() - messageDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return messageDate.toLocaleDateString();
  };

  // Fetch DNewTech events from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Use local API route to avoid CORS issues
        const response = await fetch('/api/meetup/events');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const dnewtechEvents: MeetupEvent[] = await response.json();
        setEvents(dnewtechEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, []);

  // Fetch members on mount
  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  // Fetch messages when chat opens
  useEffect(() => {
    if (chatOpen) {
      fetchMessages();
    }
  }, [chatOpen, fetchMessages]);

  // Scroll to bottom when chat opens or messages change
  useEffect(() => {
    if (chatOpen && chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chatOpen, chatMessages]);

  // Format date for display
  const formatEventDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'long' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email signup:', email);
    setEmail('');
    alert('Thank you for signing up! We\'ll keep you updated on upcoming events.');
  };

  return (
    <>
      <Head>
        <title>D-NewTech | Connecting Detroit&apos;s Startup Community Since 2010</title>
        <meta name="description" content="Monthly meetups, powerful connections, and real stories from entrepreneurs in Southeast Michigan. Join Detroit&apos;s premier startup and technology community." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Detroit, startup, technology, networking, entrepreneurs, innovation, meetup" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Source+Sans+3:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
      </Head>

      <PageContainer>
        {/* Floating Next Event Banner */}
        <NextEventBanner>
          {events.length > 0 ? (
            <NextEventBadge 
              href={user ? undefined : events[0].eventUrl} 
              as={user ? 'div' : 'a'}
              target={user ? undefined : "_blank"} 
              rel={user ? undefined : "noopener noreferrer"}
              style={user ? { cursor: 'default' } : undefined}
            >
              <NextEventBadgeContent>
                <NextEventCalendar>
                  <NextEventCalendarHeader>
                    <NextEventMonth>{formatEventDate(events[0].dateTime).month}</NextEventMonth>
                  </NextEventCalendarHeader>
                  <NextEventCalendarBody>
                    <NextEventDay>{formatEventDate(events[0].dateTime).day}</NextEventDay>
                  </NextEventCalendarBody>
                </NextEventCalendar>
                <NextEventInfo>
                  <NextEventText>
                    <NextEventTitle>
                      <i className="fas fa-bolt"></i>
                      Next Event
                    </NextEventTitle>
                    <NextEventDetails>
                      {formatEventDate(events[0].dateTime).weekday} • {formatEventDate(events[0].dateTime).time}
                    </NextEventDetails>
                    <NextEventVenueSmall>
                      <i className="fas fa-map-marker-alt"></i>
                      {events[0].venue?.name || 'TBA'}
                    </NextEventVenueSmall>
                  </NextEventText>
                </NextEventInfo>
                {user && (
                  <NextEventRsvpButton
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(events[0].eventUrl, '_blank', 'noopener,noreferrer');
                    }}
                  >
                    <i className="fas fa-check"></i>
                    RSVP
                  </NextEventRsvpButton>
                )}
              </NextEventBadgeContent>
            </NextEventBadge>
          ) : loading ? (
            <NextEventBadge as="div">
              <NextEventBadgeContent>
                <i className="fas fa-spinner fa-spin" style={{ color: '#E63946' }}></i>
                <NextEventDetails>Loading next event...</NextEventDetails>
              </NextEventBadgeContent>
            </NextEventBadge>
          ) : (
            <NextEventBadge as="div">
              <NextEventBadgeContent>
                <i className="fas fa-calendar-alt" style={{ color: '#E63946' }}></i>
                <NextEventDetails>Stay tuned for upcoming events!</NextEventDetails>
              </NextEventBadgeContent>
            </NextEventBadge>
          )}
        </NextEventBanner>

        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroLogo>
              <Image
                src="/images/d-new-tech-white-logo.png"
                alt="D-NewTech Logo"
                width={180}
                height={0}
                style={{ height: 'auto' }}
                priority
              />
            </HeroLogo>
            <HeroTitle>
              Connecting <span>Detroit&apos;s</span> Startup<br />Community Since 2010
            </HeroTitle>
            <HeroSubtitle>
              Monthly meetups, powerful connections, and real stories from entrepreneurs in Southeast Michigan.
            </HeroSubtitle>
            <CTAContainer>
              <CTAButton href="#next-event" $primary>
                <i className="fas fa-calendar-alt"></i>
                Join Our Next Meetup
              </CTAButton>
              <CTAButton 
                href="#get-involved" 
                onClick={handleBecomeMember}
                style={{ opacity: memberLoading ? 0.7 : 1 }}
              >
                <i className={`fas ${memberLoading ? 'fa-spinner fa-spin' : (membersData.isMember ? 'fa-check' : 'fa-users')}`}></i>
                {membersData.isMember ? 'Member' : 'Become a Member'}
              </CTAButton>
            </CTAContainer>
          </HeroContent>
        </HeroSection>

        {/* About D-NewTech */}
        <Section $variant="darker" ref={aboutRef}>
          <Container>
            <AnimatedElement $visible={aboutVisible}>
              <SectionTitle>About <span>D-NewTech</span></SectionTitle>
              <SectionSubtitle>
              Since 2010, D-NewTech has been the cornerstone of Detroit&apos;s startup ecosystem,
                fostering innovation, collaboration, and local growth through authentic connections.
            </SectionSubtitle>
            </AnimatedElement>

            <Grid>
              {[
                { icon: 'fa-rocket', title: 'Entrepreneurs', text: 'Founders and startup enthusiasts looking to build, scale, and connect with like-minded innovators in the Motor City.' },
                { icon: 'fa-code', title: 'Technologists', text: 'Developers, designers, and tech professionals passionate about building the future of technology in Detroit.' },
                { icon: 'fa-chart-line', title: 'Investors', text: 'Angel investors, VCs, and funding partners seeking promising startups and innovative ideas in Southeast Michigan.' },
                { icon: 'fa-bullhorn', title: 'Marketers', text: 'Growth hackers, marketing professionals, and brand builders helping startups reach their audience effectively.' },
                { icon: 'fa-graduation-cap', title: 'Students', text: 'University students and recent graduates eager to learn, network, and launch their entrepreneurial journeys.' },
                { icon: 'fa-handshake', title: 'Community', text: 'Mentors, advisors, and supporters committed to building a thriving startup ecosystem in Detroit.' },
              ].map((item, i) => (
                <AnimatedElement key={item.title} $visible={aboutVisible} $delay={i + 2}>
                  <Card>
                    <CardIcon>
                      <i className={`fas ${item.icon}`}></i>
                    </CardIcon>
                    <CardTitle>{item.title}</CardTitle>
                    <CardText>{item.text}</CardText>
              </Card>
                </AnimatedElement>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* What to Expect */}
        <Section $variant="dark">
          <Container>
            <SectionTitle>What to <span>Expect</span></SectionTitle>
            <SectionSubtitle>
              Every month, we feature inspiring speakers and innovative startups from across
              Southeast Michigan, creating opportunities for meaningful connections.
            </SectionSubtitle>

            <EventFormat>
              <CardTitle>Our Event Format</CardTitle>
              <EventList>
                <li>Inspirational guest speaker sharing industry insights</li>
                <li>3-5 startup presentations (5 min pitch + 5 min Q&amp;A)</li>
                <li>Open announcements for community opportunities</li>
                <li>Structured networking with fellow entrepreneurs</li>
                <li>Post-event networking and informal discussions</li>
              </EventList>
            </EventFormat>
          </Container>
        </Section>

        {/* Upcoming Events */}
        <Section $variant="gradient" id="next-event" ref={eventsRef}>
          <Container>
            <AnimatedElement $visible={eventsVisible}>
              <SectionTitle>Upcoming <span>Events</span></SectionTitle>
              <SectionSubtitle>
                Check out our upcoming DNewTech meetups and community events.
              </SectionSubtitle>
            </AnimatedElement>

            <AnimatedElement $visible={eventsVisible} $delay={2}>
              {loading ? (
                <LoadingSpinner>
                  <span>Loading upcoming events...</span>
                </LoadingSpinner>
              ) : events.length > 0 ? (
                <ApiEventsGrid>
                  {events.map((event) => {
                    const dateInfo = formatEventDate(event.dateTime);
                    return (
                      <ApiEventCard key={event.eventId}>
                        <ApiEventHeader>
                          <ApiEventDate>
                            <ApiEventDay>{dateInfo.day}</ApiEventDay>
                            <ApiEventMonth>{dateInfo.month}</ApiEventMonth>
                          </ApiEventDate>
                          <ApiEventTime>
                            <i className="fas fa-clock"></i>
                            <span>{dateInfo.time}</span>
                          </ApiEventTime>
                        </ApiEventHeader>
                        <ApiEventBody>
                          <ApiEventGroup>
                            <i className="fas fa-users"></i>
                            {event.group?.name || 'DNewTech'}
                          </ApiEventGroup>
                          <ApiEventTitle>{event.title}</ApiEventTitle>
                          {event.venue && (
                            <ApiEventVenue>
                              <i className="fas fa-map-marker-alt"></i>
                              <ApiEventVenueDetails>
                                <strong>{event.venue.name}</strong>
                                {event.venue.address}, {event.venue.city}, {event.venue.state}
                              </ApiEventVenueDetails>
                            </ApiEventVenue>
                          )}
                          <ApiEventButton 
                            href={event.eventUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <i className="fas fa-external-link-alt"></i>
                            View Event Details
                          </ApiEventButton>
                        </ApiEventBody>
                      </ApiEventCard>
                    );
                  })}
                </ApiEventsGrid>
              ) : (
                <NoEventsMessage>
                  <i className="fas fa-calendar-xmark"></i>
                  No upcoming DNewTech events at the moment. Check back soon!
                </NoEventsMessage>
              )}
            </AnimatedElement>

            <AnimatedElement $visible={eventsVisible} $delay={4}>
              <SectionSubtitle style={{ marginBottom: 0 }}>
              Mark your calendars! We meet every third Wednesday of the month.
            </SectionSubtitle>
            </AnimatedElement>
          </Container>
        </Section>

        {/* Get Involved */}
        <Section $variant="darker" id="get-involved" ref={getInvolvedRef}>
          <Container>
            <AnimatedElement $visible={getInvolvedVisible}>
              <SectionTitle>Get <span>Involved</span></SectionTitle>
              <SectionSubtitle>
              Ready to be part of Detroit&apos;s entrepreneurial story? Here&apos;s how you can contribute
              to our thriving community.
            </SectionSubtitle>
            </AnimatedElement>

            <Grid>
              {[
                { icon: 'fa-microphone', title: 'Present Your Startup', text: 'Share your venture with our community. Get valuable feedback, potential customers, and investment opportunities.', cta: 'Apply to Present' },
                { icon: 'fa-building', title: 'Sponsor an Event', text: 'Support Detroit\'s startup ecosystem while gaining visibility among entrepreneurs, investors, and innovators.', cta: 'Become a Sponsor' },
                { icon: 'fa-hands-helping', title: 'Volunteer & Collaborate', text: 'Help us organize events, mentor startups, or contribute your expertise to strengthen our community.', cta: 'Get Involved' },
              ].map((item, i) => (
                <AnimatedElement key={item.title} $visible={getInvolvedVisible} $delay={i + 2}>
                  <Card>
                    <CardIcon>
                      <i className={`fas ${item.icon}`}></i>
                    </CardIcon>
                    <CardTitle>{item.title}</CardTitle>
                    <CardText>{item.text}</CardText>
                    <CTAButton href="#" style={{ marginTop: '1.25rem', padding: '0.75rem 1.25rem', fontSize: '0.9rem' }}>
                      {item.cta}
                </CTAButton>
              </Card>
                </AnimatedElement>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Community Partners */}
        <Section $variant="dark" ref={partnersRef}>
          <Container>
            <AnimatedElement $visible={partnersVisible}>
              <SectionTitle>Community <span>Partners</span></SectionTitle>
            <SectionSubtitle>
                We&apos;re proud to collaborate with leading organizations building Detroit&apos;s entrepreneurial ecosystem.
            </SectionSubtitle>
            </AnimatedElement>

            <AnimatedElement $visible={partnersVisible} $delay={2}>
            <PartnersGrid>
                {['TechTown Detroit', 'Wayne State University', 'Detroit Regional Chamber', 'Michigan Economic Development', 'Venture for America', 'Detroit Startup Week'].map((partner) => (
                  <PartnerLogo key={partner}>{partner}</PartnerLogo>
                ))}
            </PartnersGrid>
            </AnimatedElement>
          </Container>
        </Section>

        {/* Testimonials & Impact */}
        <Section $variant="gradient" ref={testimonialsRef}>
          <Container>
            <AnimatedElement $visible={testimonialsVisible}>
              <SectionTitle>Testimonials &amp; <span>Impact</span></SectionTitle>
            </AnimatedElement>

            <AnimatedElement $visible={testimonialsVisible} $delay={2}>
            <StatsContainer>
                {[
                  { number: '150+', label: 'Startups Featured' },
                  { number: '10,000+', label: 'Community Members' },
                  { number: '15', label: 'Years Strong' },
                  { number: '180+', label: 'Events Hosted' },
                ].map((stat) => (
                  <StatItem key={stat.label}>
                    <StatNumber>{stat.number}</StatNumber>
                    <StatLabel>{stat.label}</StatLabel>
              </StatItem>
                ))}
            </StatsContainer>
            </AnimatedElement>

            <Grid>
              {[
                { text: 'D-NewTech gave me the platform to share my startup vision and connect with investors who believed in our mission. The community here is unmatched.', author: 'Sarah Chen', title: 'Founder, TechFlow Solutions' },
                { text: 'As an investor, D-NewTech events consistently showcase the most promising startups in Southeast Michigan. It\'s my go-to for finding great opportunities.', author: 'Marcus Williams', title: 'Detroit Angels' },
                { text: 'The connections I made at D-NewTech helped me find my co-founder, our first customers, and invaluable mentors. This community changes lives.', author: 'Alex Rodriguez', title: 'CTO, InnovateMI' },
              ].map((testimonial, i) => (
                <AnimatedElement key={testimonial.author} $visible={testimonialsVisible} $delay={i + 4}>
              <TestimonialCard>
                    <TestimonialText>&ldquo;{testimonial.text}&rdquo;</TestimonialText>
                    <TestimonialAuthor>
                      — {testimonial.author}, <span>{testimonial.title}</span>
                    </TestimonialAuthor>
              </TestimonialCard>
                </AnimatedElement>
              ))}
            </Grid>
          </Container>
        </Section>

        {/* Stay Connected */}
        <Section $variant="darker" ref={connectRef}>
          <Container>
            <AnimatedElement $visible={connectVisible}>
              <SectionTitle>Stay <span>Connected</span></SectionTitle>
            <SectionSubtitle>
              Never miss an event or opportunity. Join our community and stay updated
              on all things D-NewTech.
            </SectionSubtitle>
            </AnimatedElement>

            <AnimatedElement $visible={connectVisible} $delay={2}>
            <EmailForm onSubmit={handleEmailSubmit}>
              <EmailInput
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <SubmitButton type="submit">Subscribe</SubmitButton>
            </EmailForm>
            </AnimatedElement>
          </Container>
        </Section>

        {/* Footer */}
        <Footer>
          <Container>
            <FooterContent>
              <FooterSection>
                <FooterLogo>
                  <Image
                    src="/images/d-new-tech-logo.png"
                    alt="D-NewTech Logo"
                    width={100}
                    height={0}
                    style={{ height: 'auto' }}
                  />
                </FooterLogo>
                <p>Connecting Detroit&apos;s startup community since 2010.</p>
                <p>Building the future of entrepreneurship in Southeast Michigan.</p>
              </FooterSection>

              <FooterSection>
                <h4>Contact</h4>
                <p>hello@d-newtech.org</p>
                <p>TechTown Detroit</p>
                <p>440 Burroughs St</p>
                <p>Detroit, MI 48202</p>
              </FooterSection>

              <FooterSection>
                <h4>Quick Links</h4>
                <a href="#about">About</a>
                <a href="#next-event">Events</a>
                <a href="#get-involved">Get Involved</a>
                <a href="#sponsors">Sponsors</a>
              </FooterSection>

              <FooterSection>
                <h4>Legal</h4>
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#code">Code of Conduct</a>
              </FooterSection>
            </FooterContent>

            <FooterBottom>
              <p>© 2025 D-NewTech. All rights reserved. Made with <i className="fas fa-heart"></i> in Detroit.</p>
            </FooterBottom>
          </Container>
        </Footer>

        {/* Floating Member Badge - Always visible */}
        <MemberBadge onClick={() => window.location.href = '#get-involved'}>
          <AvatarStack>
            {membersData.recentMembers.slice(0, 5).map((member, index) => (
              <AvatarImage key={member.id} $index={index} $hasImage={!!member.pfpUrl}>
                {member.pfpUrl ? (
                  <img src={member.pfpUrl} alt={member.username || 'Member'} />
                ) : (
                  <i className="fas fa-user"></i>
                )}
              </AvatarImage>
            ))}
            {membersData.recentMembers.length === 0 && (
              <AvatarImage $index={0} $hasImage={false}>
                <i className="fas fa-users"></i>
              </AvatarImage>
            )}
          </AvatarStack>
          <MemberCount>
            {membersData.count} {membersData.count === 1 ? 'member' : 'members'}
          </MemberCount>
        </MemberBadge>

        {/* Floating Chat Button - Only for authenticated users */}
        {user && (
          <ChatButton onClick={() => setChatOpen(true)} aria-label="Open community chat">
            <i className="fas fa-comment"></i>
          </ChatButton>
        )}

        {/* Chat Panel */}
        {user && (
          <>
            <ChatPanelOverlay $isOpen={chatOpen} onClick={() => setChatOpen(false)} />
            {chatOpen && (
              <ChatPanel $isOpen={chatOpen}>
                <ChatHeader>
                  <h3><i className="fas fa-comments"></i> Community Chat</h3>
                  <CloseButton onClick={() => setChatOpen(false)} aria-label="Close chat">
                    <i className="fas fa-times"></i>
                  </CloseButton>
                </ChatHeader>
                
                <ChatMessages ref={chatMessagesRef}>
                  {chatMessages.length === 0 ? (
                    <EmptyMessages>
                      <i className="fas fa-comment-dots"></i>
                      <p>No messages yet. Be the first to say hello!</p>
                    </EmptyMessages>
                  ) : (
                    chatMessages.map((message) => (
                      <MessageItem key={message.id}>
                        <MessageAvatar $hasImage={!!message.user.pfpUrl}>
                          {message.user.pfpUrl ? (
                            <img src={message.user.pfpUrl} alt={message.user.username || 'User'} />
                          ) : (
                            <i className="fas fa-user"></i>
                          )}
                        </MessageAvatar>
                        <MessageContent>
                          <MessageHeader>
                            <MessageUsername>
                              {message.user.displayName || message.user.username || 'Anonymous'}
                            </MessageUsername>
                            <MessageTime>{formatRelativeTime(message.createdAt)}</MessageTime>
                          </MessageHeader>
                          <MessageText>{message.content}</MessageText>
                        </MessageContent>
                      </MessageItem>
                    ))
                  )}
                </ChatMessages>
                
                <ChatCompose onSubmit={handleSendMessage}>
                  <ChatInput
                    type="text"
                    placeholder="Type a message..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    maxLength={500}
                    disabled={chatSending}
                  />
                  <ChatSendButton type="submit" disabled={!chatInput.trim() || chatSending}>
                    <i className={`fas ${chatSending ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                  </ChatSendButton>
                </ChatCompose>
              </ChatPanel>
            )}
          </>
        )}

        {/* Toast Notification */}
        <Toast $visible={toast.visible} $type={toast.type}>
          <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
          {toast.message}
        </Toast>
      </PageContainer>
    </>
  );
}
