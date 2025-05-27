/// <reference types="react" />
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom/client';

// Define a specific type for section IDs
type SectionId = 'hero' | 'about' | 'skills' | 'experience' | 'projects' | 'contact';

// SVG Icon Components
const GitHubIcon = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" width="24" height="24" aria-hidden="true" focusable="false">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
    </svg>
);

const LinkedInIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24" aria-hidden="true" focusable="false">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
);

// Social Media Links Data
const socialMediaLinks: { name: string; url: string; icon: JSX.Element }[] = [
    { name: 'GitHub', url: 'https://github.com/SSravani14', icon: <GitHubIcon /> },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/sravanisiddanthapu/', icon: <LinkedInIcon /> },
    // Add more social links here, e.g., { name: 'Twitter', url: '#', icon: <TwitterIcon /> }
];

const App = () => {
    const [activeSection, setActiveSection] = useState<SectionId>('hero');
    const sectionRefs: Record<SectionId, React.RefObject<HTMLElement | null>> = {
        hero: useRef<HTMLElement>(null),
        about: useRef<HTMLElement>(null),
        skills: useRef<HTMLElement>(null),
        experience: useRef<HTMLElement>(null),
        projects: useRef<HTMLElement>(null),
        contact: useRef<HTMLElement>(null),
    };

    const navItems: NavItem[] = [
        // { id: 'hero', label: 'Home' }, // Hero is usually not in nav
        { id: 'about', label: 'About' },
        { id: 'skills', label: 'Skills' },
        { id: 'experience', label: 'Experience' },
        { id: 'projects', label: 'Projects' },
        { id: 'contact', label: 'Contact' },
    ];

    const scrollToSection = useCallback((sectionId: SectionId) => {
        sectionRefs[sectionId].current?.scrollIntoView({ behavior: 'smooth' });
    }, [sectionRefs]);

    useEffect(() => {
        const headerElement = document.querySelector('.app-header');
        const headerHeight = headerElement ? headerElement.clientHeight : 70;
        
        const observerOptions = {
            root: null,
            rootMargin: `-${headerHeight + 5}px 0px 0px 0px`, // Adjust for fixed header
            threshold: 0.3 // When 30% of the section is visible
        };

        const observerCallback: IntersectionObserverCallback = (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id as SectionId);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);
        const currentRefs = Object.values(sectionRefs);
        currentRefs.forEach(ref => {
            if (ref.current) observer.observe(ref.current);
        });

        return () => {
            currentRefs.forEach(ref => {
                if (ref.current) observer.unobserve(ref.current);
            });
        };
    }, [sectionRefs]);


    return (
        <>
            <Header navItems={navItems} activeSection={activeSection} scrollToSection={scrollToSection} />
            <main>
                <Hero ref={sectionRefs.hero} id="hero" scrollToSection={scrollToSection} />
                <About ref={sectionRefs.about} id="about" />
                <Skills ref={sectionRefs.skills} id="skills" />
                <Experience ref={sectionRefs.experience} id="experience" />
                <Projects ref={sectionRefs.projects} id="projects" />
                <Contact ref={sectionRefs.contact} id="contact" />
            </main>
            <Footer />
        </>
    );
};

interface NavItem {
    id: SectionId;
    label: string;
}

interface HeaderProps {
    navItems: NavItem[];
    activeSection: SectionId;
    scrollToSection: (sectionId: SectionId) => void;
}

const Header: React.FC<HeaderProps> = ({ navItems, activeSection, scrollToSection }) => (
    <header className="app-header" aria-label="Main Navigation">
        <div className="container">
            <a href="#hero" className="logo" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}>Sravani S</a>
            <nav className="main-nav">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id}>
                            <a
                                href={`#${item.id}`}
                                className={activeSection === item.id ? 'active' : ''}
                                onClick={(e) => {
                                    e.preventDefault();
                                    scrollToSection(item.id);
                                }}
                                aria-current={activeSection === item.id ? 'page' : undefined}
                            >
                                {item.label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    </header>
);

interface SectionProps {
    id: SectionId; // Ensure id prop uses SectionId
}

const Hero = React.forwardRef<HTMLElement, SectionProps & { scrollToSection: (sectionId: SectionId) => void }>(({ id, scrollToSection }, ref) => {
    const titles = ["AI Enthusiast", "React Developer", "Software Engineer", "Voice Assistant Creator"];
    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
    const [displayedTitle, setDisplayedTitle] = useState('');
    const [isTyping, setIsTyping] = useState(true);
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseDuration = 1500;

    useEffect(() => {
        let timeoutId: number;
        const handleTyping = () => {
            const currentTargetTitle = titles[currentTitleIndex];
            if (isTyping) {
                if (displayedTitle.length < currentTargetTitle.length) {
                    setDisplayedTitle(currentTargetTitle.substring(0, displayedTitle.length + 1));
                    timeoutId = window.setTimeout(handleTyping, typingSpeed);
                } else {
                    timeoutId = window.setTimeout(() => setIsTyping(false), pauseDuration);
                }
            } else {
                if (displayedTitle.length > 0) {
                    setDisplayedTitle(displayedTitle.substring(0, displayedTitle.length - 1));
                    timeoutId = window.setTimeout(handleTyping, deletingSpeed);
                } else {
                    setIsTyping(true);
                    setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % titles.length);
                }
            }
        };

        timeoutId = window.setTimeout(handleTyping, typingSpeed / 2);
        return () => window.clearTimeout(timeoutId);
    }, [displayedTitle, isTyping, currentTitleIndex, titles, typingSpeed, deletingSpeed, pauseDuration]);

    return (
    <section id={id} ref={ref} className="hero" aria-labelledby="hero-heading">
        <div className="container">
            <p className="hero-intro">Hi, my name is</p>
            <h1 id="hero-heading" className="hero-name">Sravani</h1>
            <h2 className="hero-subtitle">Inventing with Intention...</h2>
            <h3 className="hero-dynamic-title">
                I'm a <span className="typing-text">{displayedTitle}</span>
                <span className="typing-cursor"></span>
            </h3>
            <p className="hero-description">
                I'm a software engineer specializing in building (and occasionally designing)
                responsive, user-focused web applications. Currently, I'm exploring AI and working on
                accessible, real-world products- like my first AI powered Voice Assistant for small Businesses.
            </p>
            <button className="cta-button" onClick={() => scrollToSection('projects')}>
                Check out my work!
            </button>
            <div className="social-links">
                {socialMediaLinks.map(link => (
                    <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                        {link.icon}
                    </a>
                ))}
            </div>
        </div>
        <div className="scroll-down" onClick={() => scrollToSection('about')} aria-label="Scroll to about section">
            <span>Scroll Down</span>
            <div className="arrow"></div>
        </div>
    </section>
    );
});

const About = React.forwardRef<HTMLElement, SectionProps>(({ id }, ref) => (
    <section id={id} ref={ref} aria-labelledby="about-heading">
        <div className="container">
            <h2 className="section-title" id="about-heading">About Me</h2>
            <p>
            A software engineer passionate about building clean, accessible, and human-centered digital experiences.
             With 2+ years of experience in full-stack development, I specialize in crafting responsive web applications
             using React, Next.js, TypeScript, and Tailwind CSS.
            </p>
            <p>
            Recently, I’ve been exploring how AI can enhance everyday interactions, and 
            I’m building an AI voice assistant that helps small businesses provide smarter, always-available customer support.
            </p>
            <p>
            I'm currently seeking full-time opportunities in Software Engineering or AI-driven roles, 
            where I can combine thoughtful design with cutting-edge technology to build meaningful products.
            </p>
        </div>
    </section>
));

const Skills = React.forwardRef<HTMLElement, SectionProps>(({ id }, ref) => {
    const skillsList = [
        { name: "React", level: "Frontend" },
        { name:"Angular", level: "Frontend" },
        { name: "Next.js", level: "Frontend" },
        { name: "TypeScript", level: "Language" },
        { name: "JavaScript (ES6+)", level: "Language" },
        { name: "HTML5", level: "Web Standard" },
        { name: "CSS3/Sass", level: "Styling" },
        { name: "Node.js", level: "Backend" },
        { name: "Python", level: "Language" },
        { name: "AI/ML Concepts", level: "AI" },
        { name: "Git & GitHub", level: "Tools" },
        { name: "REST APIs", level: "Web Services" },
        { name: "UI/UX Principles", level: "Design" },
        {name : "Tailwind CSS", level: "Styling"},
        { name: "Docker", level: "Containerization" },
        { name: "Agile Methodologies", level: "Development Process" },
        {name:"Large Language Models", level: "AI" },
        { name: "Natural Language Processing", level: "AI" },
        { name: "Voice Assistant Development", level: "AI" },
  
        
    ];

    return (
        <section id={id} ref={ref} aria-labelledby="skills-heading">
            <div className="container">
                <h2 className="section-title" id="skills-heading">My Skills</h2>
                <div className="skills-grid" role="list">
                    {skillsList.map(skill => (
                        <div key={skill.name} className="skill-item" role="listitem">
                            <h4>{skill.name}</h4>
                            <p>{skill.level}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
});

const Experience = React.forwardRef<HTMLElement, SectionProps>(({ id }, ref) => {
    const experiences = [
        {
            role: "Software Engineer",
            company: "Voicy Labs,Inc.",
            duration: "Ongoing",
            description: "An AI-powered voice assistant designed to handle customer calls, answer common questions, schedule appointments, and provide 24/7 support for small businesses. Built using tools like Voiceflow, Twilio, and OpenAI, the assistant focuses on improving customer experience while reducing manual workload."
        },
        {
            role: "Associate Software Engineer",
            company: "Optum Global Solutions",
            duration: "07/2021 - 12/2022",
            description: "Contributed to the development of responsive front-end applications for healthcare claim management systems using Angular, TypeScript, and SCSS. Led implementation of critical UI features such as drag-and-drop workflows, error-handling modals, and table sorting with date filters. Collaborated in Agile teams, participated in daily scrums, and wrote unit tests with Jasmine and Karma."
        },
        {
            role: "Programmer Analyst Intern",
            company: "Cognizant Technology Solutions",
            duration: "02/2021 - 07/2021",
            description: "Completed a 6-month internship focused on full-stack development and Agile project delivery. Built and optimized features using React, .NET, and Node.js, contributing to a 20% increase in user engagement. Actively participated in Agile sprints, consistently meeting deadlines and achieving a 95% user satisfaction rate."
        }
    ];
    return (
        <section id={id} ref={ref} aria-labelledby="experience-heading">
            <div className="container">
                <h2 className="section-title" id="experience-heading">Professional Journey</h2>
                {experiences.map((exp, index) => (
                    <div key={index} className="experience-item" role="article">
                        <h3>{exp.role}</h3>
                        <h4><span className="company">{exp.company}</span> | {exp.duration}</h4>
                        <p>{exp.description}</p>
                    </div>
                ))}
            </div>
        </section>
    );
});

const Projects = React.forwardRef<HTMLElement, SectionProps>(({ id }, ref) => {
    const projectList = [
        {
            title: "AI-Powered Voice Assistant",
            description: "An AI-powered voice assistant designed to handle customer calls, answer common questions, schedule appointments, and provide 24/7 support for small businesses. Built using tools like Voiceflow, Twilio, and OpenAI, the assistant focuses on improving customer experience while reducing manual workload.",
            tech: ["Voiceflow", "Twilio", "OpenAI", "AssemblyAI", "TypeScript", "React", "FastAPI"],
            // imageUrl: "", 
            liveUrl: "", 
            repoUrl: "" 
        },
        {
            title: "Tandem Travel- Group Travel Planner",
            description: "Working as a core frontend developer for a startup building a group travel planning app. Responsible for implementing responsive UI components using React 19, Next.js 15, Tailwind CSS, and TypeScript. Collaborated in daily standups, contributed to reusable component architecture, and optimized performance for MVP features.",
            tech: ["React", "Next.js", "Node.js", "MongoDB", "TailwindCSS"],
            // imageUrl: "",
            liveUrl: "",
            repoUrl: ""
        },
        {
            title: "Personal Portfolio Website",
            description: "This very portfolio, built using React and TypeScript, showcasing my skills and projects. Designed to be responsive, accessible, and visually appealing, reflecting my personal brand.",
            tech: ["React", "TypeScript", "HTML5", "CSS3"],
            // imageUrl: "",
            liveUrl: "#", 
            repoUrl: ""
        }
    ];

    return (
        <section id={id} ref={ref} aria-labelledby="projects-heading">
            <div className="container">
                <h2 className="section-title" id="projects-heading">My Projects</h2>
                <div className="projects-grid" role="list">
                    {projectList.map(project => (
                        <article key={project.title} className="project-card" role="listitem">
                            {/* <div className="project-card-image">
                                {project.imageUrl ?
                                    <img src={project.imageUrl} alt={project.title} /> :
                                    <span className="image-placeholder-text">Image Placeholder</span>
                                }
                            </div> */}
                            <div className="project-card-content">
                                <h3>{project.title}</h3>
                                <p className="project-description">{project.description}</p>
                                <div className="project-tech">
                                    {project.tech.map(t => <span key={t}>{t}</span>)}
                                </div>
                                <div className="project-links">
                                    {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="outline-button">Live Demo</a>}
                                    {project.repoUrl && <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="outline-button">Source Code</a>}
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
});

const Contact = React.forwardRef<HTMLElement, SectionProps>(({ id }, ref) => {
    //  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     alert("Thank you for your message! (This is a demo, no email was sent)");
    //     (event.target as HTMLFormElement).reset();
    // };
    const userEmail = "siddanthapusravani@gmail.com"; 

    return (
        <section id={id} ref={ref} aria-labelledby="contact-heading">
            <div className="container">
                <h2 className="section-title" id="contact-heading">Get In Touch</h2>
                <div className="contact-content-wrapper">
                    <p className="contact-text">
                        I'm currently seeking new opportunities and am always open to discussing projects, creative ideas,
                        or ways to collaborate. Feel free to reach out if you have any questions.
                    </p>
                    {/* <form onSubmit={handleSubmit} className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Name</label>
                            <input type="text" id="name" name="name" required aria-required="true" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" name="email" required aria-required="true" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="message">Message</label>
                            <textarea id="message" name="message" rows={5} required aria-required="true"></textarea>
                        </div>
                        <button type="submit" className="cta-button">Send Message</button>
                    </form> */}
                    <div className="contact-info">
                        <a href={`mailto:${userEmail}`} className="email-link">{userEmail}</a>
                        <div className="social-links contact-social-links">
                            {socialMediaLinks.map(link => (
                                <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                                    {link.icon}
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
});

const Footer = () => (
    <footer className="app-footer">
        <div className="container">
            <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
            <p>
                Designed & Built by Your Name. Inspired by <a href="https://rizikh.vercel.app/" target="_blank" rel="noopener noreferrer">Rizikh</a>.
            </p>
        </div>
    </footer>
);

const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    console.error("Root element not found: Make sure you have a <div id=\"root\"></div> in your HTML.");
}