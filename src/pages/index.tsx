import Head from "next/head";
import Image from "next/image";
import styled from "styled-components";
import { useState } from "react";

// Detroit Circuit Theme Colors
const colors = {
  primary: {
    detroitRed: '#FF3B30',
    deepTechBlack: '#121212',
  },
  secondary: {
    steelGray: '#2C2C2E',
    lightGray: '#E5E5EA',
  },
  accent: {
    skylineWhite: '#FFFFFF',
  }
};

// Styled Components
const PageContainer = styled.div`
  min-height: 100vh;
  background: ${colors.accent.skylineWhite};
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  line-height: 1.6;
  color: ${colors.primary.deepTechBlack};
`;

const HeroSection = styled.section`
  position: relative;
  height: 100vh;
  background: ${colors.accent.skylineWhite};
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)),
    url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23FFFFFF" width="100%" height="100%"/><path fill="%23E5E5EA" opacity="0.5" d="M0,300 L200,280 L400,320 L600,290 L800,310 L1000,285 L1200,300 L1200,600 L0,600 Z"/><path fill="%23E5E5EA" opacity="0.3" d="M0,350 L150,340 L300,360 L450,345 L600,365 L750,350 L900,355 L1050,345 L1200,350 L1200,600 L0,600 Z"/></svg>');
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: ${colors.primary.deepTechBlack};
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(255, 59, 48, 0.02) 50%,
      transparent 100%
    );
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroLogo = styled.div`
  margin-bottom: 2rem;
  display: flex;
  justify-content: center;
  
  img {
    max-width: 200px;
    width: 100%;
    height: auto !important;
    filter: drop-shadow(0 4px 20px rgba(255, 59, 48, 0.3));
    transition: all 0.3s ease;
    
    &:hover {
      filter: drop-shadow(0 6px 30px rgba(255, 59, 48, 0.5));
      transform: scale(1.05);
    }
    
    @media (max-width: 768px) {
      max-width: 150px;
    }
  }
`;

const HeroTitle = styled.h1`
  font-family: 'Montserrat', 'Inter', sans-serif;
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  color: ${colors.primary.deepTechBlack};

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  font-weight: 400;
  color: ${colors.secondary.steelGray};
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const CTAContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
`;

const CTAButton = styled.a<{ $primary?: boolean }>`
  display: inline-block;
  padding: 1rem 2rem;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  cursor: pointer;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.95rem;
  
  ${props => props.$primary ? `
    background: ${colors.primary.detroitRed};
    color: ${colors.accent.skylineWhite};
    border: 2px solid ${colors.primary.detroitRed};
    
    &:hover {
      background: transparent;
      color: ${colors.primary.detroitRed};
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 59, 48, 0.3);
    }
  ` : `
    background: transparent;
    color: ${colors.primary.deepTechBlack};
    border: 2px solid ${colors.secondary.steelGray};
    
    &:hover {
      background: ${colors.primary.detroitRed};
      color: ${colors.accent.skylineWhite};
      border-color: ${colors.primary.detroitRed};
      transform: translateY(-2px);
      box-shadow: 0 0 20px rgba(255, 59, 48, 0.3);
    }
  `}
`;

const NextEventBadge = styled.div`
  background: ${colors.accent.skylineWhite};
  color: ${colors.primary.deepTechBlack};
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  border: 1px solid rgba(255, 59, 48, 0.2);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Section = styled.section<{ $background?: string; $dark?: boolean }>`
  padding: 5rem 0;
  background: ${props => 
    props.$background === 'dark' ? colors.primary.deepTechBlack :
    props.$background === 'gray' ? colors.secondary.lightGray :
    colors.accent.skylineWhite
  };
  color: ${props => props.$dark ? colors.accent.skylineWhite : colors.primary.deepTechBlack};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const SectionTitle = styled.h2<{ $dark?: boolean }>`
  font-family: 'Montserrat', 'Inter', sans-serif;
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: -0.02em;
  color: ${props => props.$dark ? colors.accent.skylineWhite : colors.primary.deepTechBlack};
`;

const SectionSubtitle = styled.p<{ $dark?: boolean }>`
  font-size: 1.2rem;
  text-align: center;
  max-width: 800px;
  margin: 0 auto 3rem;
  line-height: 1.6;
  color: ${props => props.$dark ? colors.secondary.lightGray : colors.secondary.steelGray};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled.div<{ $dark?: boolean }>`
  background: ${props => props.$dark ? colors.secondary.steelGray : colors.accent.skylineWhite};
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid ${colors.secondary.lightGray};
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(255, 59, 48, 0.1);
    border-color: rgba(255, 59, 48, 0.3);
  }
`;

const CardIcon = styled.div`
  width: 60px;
  height: 60px;
  background: ${colors.primary.detroitRed};
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  color: ${colors.accent.skylineWhite};
  box-shadow: 0 4px 15px rgba(255, 59, 48, 0.2);
`;

const CardTitle = styled.h3<{ $dark?: boolean }>`
  font-family: 'Montserrat', 'Inter', sans-serif;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${props => props.$dark ? colors.accent.skylineWhite : colors.primary.deepTechBlack};
`;

const CardText = styled.p<{ $dark?: boolean }>`
  color: ${props => props.$dark ? colors.secondary.lightGray : colors.secondary.steelGray};
  line-height: 1.6;
`;

const Footer = styled.footer`
  background: ${colors.primary.deepTechBlack};
  color: ${colors.accent.skylineWhite};
  padding: 3rem 0 2rem;
  border-top: 1px solid ${colors.secondary.steelGray};
`;

const FooterContent = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
`;

const FooterSection = styled.div`
  h4 {
    font-family: 'Montserrat', 'Inter', sans-serif;
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: ${colors.accent.skylineWhite};
  }
  
  p, a {
    color: ${colors.secondary.lightGray};
    text-decoration: none;
    line-height: 1.6;
    transition: color 0.3s ease;
    
    &:hover {
      color: ${colors.primary.detroitRed};
    }
  }
`;

const FooterLogo = styled.div`
  margin-bottom: 1rem;
  
  img {
    max-width: 120px;
    width: 100%;
    height: auto !important;
    filter: drop-shadow(0 2px 10px rgba(255, 59, 48, 0.2));
    transition: all 0.3s ease;
    
    &:hover {
      filter: drop-shadow(0 4px 15px rgba(255, 59, 48, 0.4));
    }
    
    @media (max-width: 768px) {
      max-width: 100px;
    }
  }
`;

const FooterBottom = styled.div`
  text-align: center;
  padding-top: 2rem;
  border-top: 1px solid ${colors.secondary.steelGray};
  color: ${colors.secondary.lightGray};
`;

const EventFormat = styled.div<{ $dark?: boolean }>`
  background: ${props => props.$dark ? colors.secondary.steelGray : colors.secondary.lightGray};
  padding: 2rem;
  border-radius: 12px;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 59, 48, 0.1);
`;

const EventList = styled.ul<{ $dark?: boolean }>`
  list-style: none;
  padding: 0;
  
  li {
    padding: 0.5rem 0;
    padding-left: 2rem;
    position: relative;
    color: ${props => props.$dark ? colors.secondary.lightGray : colors.secondary.steelGray};
    
    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: ${colors.primary.detroitRed};
      font-weight: bold;
      font-size: 1.2rem;
    }
  }
`;

const TestimonialCard = styled.div<{ $dark?: boolean }>`
  background: ${props => props.$dark ? colors.secondary.steelGray : colors.secondary.lightGray};
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  border-left: 4px solid ${colors.primary.detroitRed};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(255, 59, 48, 0.1);
  }
`;

const TestimonialText = styled.p<{ $dark?: boolean }>`
  font-style: italic;
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${props => props.$dark ? colors.secondary.lightGray : colors.secondary.steelGray};
`;

const TestimonialAuthor = styled.p<{ $dark?: boolean }>`
  font-weight: 600;
  color: ${props => props.$dark ? colors.accent.skylineWhite : colors.primary.deepTechBlack};
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  margin: 3rem 0;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-family: 'Montserrat', 'Inter', sans-serif;
  font-size: 3rem;
  font-weight: 800;
  color: ${colors.primary.detroitRed};
`;

const StatLabel = styled.div<{ $dark?: boolean }>`
  font-size: 1.1rem;
  color: ${props => props.$dark ? colors.secondary.lightGray : colors.secondary.steelGray};
  font-weight: 500;
`;

const PartnersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  align-items: center;
  text-align: center;
`;

const PartnerLogo = styled.div<{ $dark?: boolean }>`
  padding: 1rem;
  background: ${props => props.$dark ? colors.secondary.steelGray : colors.accent.skylineWhite};
  border-radius: 12px;
  border: 1px solid ${colors.secondary.lightGray};
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  font-weight: 600;
  color: ${props => props.$dark ? colors.accent.skylineWhite : colors.secondary.steelGray};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(255, 59, 48, 0.3);
    box-shadow: 0 4px 20px rgba(255, 59, 48, 0.1);
  }
`;

const EmailForm = styled.form`
  display: flex;
  max-width: 400px;
  margin: 2rem auto;
  gap: 1rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const EmailInput = styled.input`
  flex: 1;
  padding: 1rem;
  border: 2px solid ${colors.secondary.lightGray};
  border-radius: 12px;
  font-size: 1rem;
  outline: none;
  background: ${colors.accent.skylineWhite};
  color: ${colors.primary.deepTechBlack};
  transition: all 0.3s ease;
  
  &:focus {
    border-color: ${colors.primary.detroitRed};
    box-shadow: 0 0 0 3px rgba(255, 59, 48, 0.1);
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: ${colors.primary.detroitRed};
  color: ${colors.accent.skylineWhite};
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:hover {
    background: transparent;
    color: ${colors.primary.detroitRed};
    border: 2px solid ${colors.primary.detroitRed};
    box-shadow: 0 0 20px rgba(255, 59, 48, 0.3);
  }
`;

const SocialLinks = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const SocialLink = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  background: ${colors.secondary.steelGray};
  color: ${colors.accent.skylineWhite};
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  
  &:hover {
    background: ${colors.primary.detroitRed};
    transform: translateY(-3px);
    box-shadow: 0 0 20px rgba(255, 59, 48, 0.4);
    border-color: ${colors.primary.detroitRed};
  }
`;

export default function Home() {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email signup:', email);
    setEmail('');
    alert('Thank you for signing up! We&apos;ll keep you updated on upcoming events.');
  };

  return (
    <>
      <Head>
        <title>D-NewTech | Connecting Detroit&apos;s Startup Community Since 2010</title>
        <meta name="description" content="Monthly meetups, powerful connections, and real stories from entrepreneurs in Southeast Michigan. Join Detroit&apos;s premier startup and technology community." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="keywords" content="Detroit, startup, technology, networking, entrepreneurs, innovation, meetup" />
        <link rel="icon" href="/favicon.ico" />

      </Head>
      
      <PageContainer>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <HeroLogo>
          <Image
                  src="/images/d-new-tech-logo.png"
                  alt="D-NewTech Logo"
                width={200}
                height={0}
                style={{ height: 'auto' }}
            priority
          />
            </HeroLogo>
            <HeroTitle>Connecting Detroit&apos;s Startup Community Since 2010</HeroTitle>
            <HeroSubtitle>
              Monthly meetups, powerful connections, and real stories from entrepreneurs in Southeast Michigan.
            </HeroSubtitle>
            <CTAContainer>
              <CTAButton href="#next-event" $primary>Join Our Next Meetup</CTAButton>
              <CTAButton href="#get-involved">Become a Member</CTAButton>
            </CTAContainer>
            <NextEventBadge>
              Next Event: January 15, 2025 • 6:00 PM • TechTown Detroit
            </NextEventBadge>
          </HeroContent>
        </HeroSection>

        {/* About D-NewTech */}
        <Section $background="dark" $dark>
          <Container>
            <SectionTitle $dark>About D-NewTech</SectionTitle>
            <SectionSubtitle $dark>
              Since 2010, D-NewTech has been the cornerstone of Detroit&apos;s startup ecosystem, 
              fostering innovation, collaboration, and local growth through authentic connections 
              and shared entrepreneurial experiences.
            </SectionSubtitle>
            
            <Grid>
              <Card $dark>
                <CardIcon>🚀</CardIcon>
                <CardTitle $dark>Entrepreneurs</CardTitle>
                <CardText $dark>
                  Founders and startup enthusiasts looking to build, scale, and connect 
                  with like-minded innovators in the Motor City.
                </CardText>
              </Card>
              
              <Card $dark>
                <CardIcon>💻</CardIcon>
                <CardTitle $dark>Technologists</CardTitle>
                <CardText $dark>
                  Developers, designers, and tech professionals passionate about 
                  building the future of technology in Detroit.
                </CardText>
              </Card>
              
              <Card $dark>
                <CardIcon>💰</CardIcon>
                <CardTitle $dark>Investors</CardTitle>
                <CardText $dark>
                  Angel investors, VCs, and funding partners seeking promising 
                  startups and innovative ideas in Southeast Michigan.
                </CardText>
              </Card>
              
              <Card $dark>
                <CardIcon>📈</CardIcon>
                <CardTitle $dark>Marketers</CardTitle>
                <CardText $dark>
                  Growth hackers, marketing professionals, and brand builders 
                  helping startups reach their audience effectively.
                </CardText>
              </Card>
              
              <Card $dark>
                <CardIcon>🎓</CardIcon>
                <CardTitle $dark>Students</CardTitle>
                <CardText $dark>
                  University students and recent graduates eager to learn, 
                  network, and launch their entrepreneurial journeys.
                </CardText>
              </Card>
              
              <Card $dark>
                <CardIcon>🤝</CardIcon>
                <CardTitle $dark>Community</CardTitle>
                <CardText $dark>
                  Mentors, advisors, and supporters committed to building 
                  a thriving startup ecosystem in Detroit.
                </CardText>
              </Card>
            </Grid>
          </Container>
        </Section>

        {/* What to Expect */}
        <Section $background="gray">
          <Container>
            <SectionTitle>What to Expect at Our Events</SectionTitle>
            
            <EventFormat>
              <CardTitle>Our Event Format</CardTitle>
              <EventList>
                <li>Inspirational guest speaker sharing industry insights</li>
                <li>3-5 startup presentations (5 min pitch + 5 min Q&A)</li>
                <li>Open announcements for community opportunities</li>
                <li>Structured networking with fellow entrepreneurs</li>
                <li>Post-event networking and informal discussions</li>
              </EventList>
            </EventFormat>

            <SectionSubtitle>
              Every month, we feature inspiring speakers and innovative startups from across 
              Southeast Michigan, creating opportunities for meaningful connections and collaboration.
            </SectionSubtitle>
          </Container>
        </Section>

        {/* Upcoming Events */}
        <Section id="next-event">
          <Container>
            <SectionTitle>Upcoming Events</SectionTitle>
            
            <Card style={{ maxWidth: '600px', margin: '0 auto 3rem', textAlign: 'center' }}>
              <CardTitle>January 2025 Meetup</CardTitle>
              <CardText style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>
                <strong>Date:</strong> Wednesday, January 15, 2025<br />
                <strong>Time:</strong> 6:00 PM - 8:30 PM<br />
                <strong>Location:</strong> TechTown Detroit<br />
                440 Burroughs St, Detroit, MI 48202
              </CardText>
              <CTAButton href="#" $primary style={{ marginTop: '1rem' }}>
                RSVP Now - Free Event
              </CTAButton>
            </Card>

            <SectionSubtitle>
              Mark your calendars! We meet every third Wednesday of the month. 
              Stay tuned for speaker announcements and presenting startup reveals.
            </SectionSubtitle>
          </Container>
        </Section>

        {/* Get Involved */}
        <Section $background="dark" $dark id="get-involved">
          <Container>
            <SectionTitle $dark>Get Involved</SectionTitle>
            <SectionSubtitle $dark>
              Ready to be part of Detroit&apos;s entrepreneurial story? Here&apos;s how you can contribute 
              to our thriving community.
            </SectionSubtitle>
            
            <Grid>
              <Card $dark>
                <CardIcon>🎤</CardIcon>
                <CardTitle $dark>Present Your Startup</CardTitle>
                <CardText $dark>
                  Share your venture with our community. Get valuable feedback, 
                  potential customers, and investment opportunities.
                </CardText>
                <CTAButton href="#" style={{ marginTop: '1rem', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                  Apply to Present
                </CTAButton>
              </Card>
              
              <Card $dark>
                <CardIcon>🏢</CardIcon>
                <CardTitle $dark>Sponsor an Event</CardTitle>
                <CardText $dark>
                  Support Detroit&apos;s startup ecosystem while gaining visibility 
                  among entrepreneurs, investors, and innovators.
                </CardText>
                <CTAButton href="#" style={{ marginTop: '1rem', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                  Sponsor an Event
                </CTAButton>
              </Card>
              
              <Card $dark>
                <CardIcon>🤲</CardIcon>
                <CardTitle $dark>Volunteer & Collaborate</CardTitle>
                <CardText $dark>
                  Help us organize events, mentor startups, or contribute your 
                  expertise to strengthen our community.
                </CardText>
                <CTAButton href="#" style={{ marginTop: '1rem', fontSize: '0.9rem', padding: '0.75rem 1.5rem' }}>
                  Get Involved
                </CTAButton>
              </Card>
            </Grid>
          </Container>
        </Section>

        {/* Community Partners */}
        <Section>
          <Container>
            <SectionTitle>Community Partners & Collaborations</SectionTitle>
            <SectionSubtitle>
              We&apos;re proud to collaborate with leading organizations that share our vision 
              of building a thriving entrepreneurial ecosystem in Detroit.
            </SectionSubtitle>
            
            <PartnersGrid>
              <PartnerLogo>TechTown Detroit</PartnerLogo>
              <PartnerLogo>Wayne State University</PartnerLogo>
              <PartnerLogo>Detroit Regional Chamber</PartnerLogo>
              <PartnerLogo>Michigan Economic Development</PartnerLogo>
              <PartnerLogo>Venture for America</PartnerLogo>
              <PartnerLogo>Detroit Startup Week</PartnerLogo>
            </PartnersGrid>
          </Container>
        </Section>

        {/* Testimonials & Impact */}
        <Section $background="gray">
          <Container>
            <SectionTitle>Testimonials & Impact</SectionTitle>
            
            <StatsContainer>
              <StatItem>
                <StatNumber>150+</StatNumber>
                <StatLabel>Startups Featured</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>10,000+</StatNumber>
                <StatLabel>Community Members</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>15</StatNumber>
                <StatLabel>Years Building Connections</StatLabel>
              </StatItem>
              <StatItem>
                <StatNumber>180+</StatNumber>
                <StatLabel>Monthly Events</StatLabel>
              </StatItem>
            </StatsContainer>

            <Grid>
              <TestimonialCard>
                <TestimonialText>
                  &ldquo;D-NewTech gave me the platform to share my startup vision and connect 
                  with investors who believed in our mission. The community here is unmatched.&rdquo;
                </TestimonialText>
                <TestimonialAuthor>— Sarah Chen, Founder of TechFlow Solutions</TestimonialAuthor>
              </TestimonialCard>
              
              <TestimonialCard>
                <TestimonialText>
                  &ldquo;As an investor, D-NewTech events consistently showcase the most promising 
                  startups in Southeast Michigan. It&apos;s my go-to for finding great opportunities.&rdquo;
                </TestimonialText>
                <TestimonialAuthor>— Marcus Williams, Detroit Angels</TestimonialAuthor>
              </TestimonialCard>
              
              <TestimonialCard>
                <TestimonialText>
                  &ldquo;The connections I made at D-NewTech helped me find my co-founder, 
                  our first customers, and invaluable mentors. This community changes lives.&rdquo;
                </TestimonialText>
                <TestimonialAuthor>— Alex Rodriguez, CTO of InnovateMI</TestimonialAuthor>
              </TestimonialCard>
            </Grid>
          </Container>
        </Section>

        {/* Stay Connected */}
        <Section>
          <Container>
            <SectionTitle>Stay Connected</SectionTitle>
            <SectionSubtitle>
              Never miss an event or opportunity. Join our community and stay updated 
              on all things D-NewTech.
            </SectionSubtitle>
            
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

            <SocialLinks>
              <SocialLink href="#" aria-label="LinkedIn">
                💼
              </SocialLink>
              <SocialLink href="#" aria-label="Twitter">
                🐦
              </SocialLink>
              <SocialLink href="#" aria-label="Instagram">
                📷
              </SocialLink>
              <SocialLink href="#" aria-label="Meetup">
                👥
              </SocialLink>
            </SocialLinks>
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
                    width={120}
                    height={0}
                    style={{ height: 'auto' }}
                  />
                </FooterLogo>
                <p>Connecting Detroit&apos;s startup community since 2010.</p>
                <p>Building the future of entrepreneurship in Southeast Michigan.</p>
              </FooterSection>
              
              <FooterSection>
                <h4>Contact Info</h4>
                <p>Email: hello@d-newtech.org</p>
                <p>Location: TechTown Detroit</p>
                <p>440 Burroughs St, Detroit, MI 48202</p>
              </FooterSection>
              
              <FooterSection>
                <h4>Quick Links</h4>
                <p><a href="#about">About</a></p>
                <p><a href="#events">Events</a></p>
                <p><a href="#present">Present</a></p>
                <p><a href="#sponsors">Sponsors</a></p>
              </FooterSection>
              
              <FooterSection>
                <h4>Legal</h4>
                <p><a href="#privacy">Privacy Policy</a></p>
                <p><a href="#terms">Terms of Service</a></p>
                <p><a href="#code">Code of Conduct</a></p>
              </FooterSection>
            </FooterContent>
            
            <FooterBottom>
              <p>&copy; 2025 D-NewTech. All rights reserved. Made with ❤️ in Detroit.</p>
            </FooterBottom>
          </Container>
        </Footer>
      </PageContainer>
    </>
  );
}
