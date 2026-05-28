import React from 'react';
import { motion } from 'framer-motion';
import ResumePreview from './ResumePreview';

const samples = [
    {
        id: 1,
        template: 'ats',
        data: {
            personalInfo: {
                fullName: 'John Doe',
                email: 'john.doe@example.com',
                phone: '+1 (555) 000-1234',
                address: 'New York, NY',
                summary: 'Experienced Software Engineer with a focus on building scalable web applications and distributed systems. Proficient in modern JavaScript frameworks and cloud infrastructure.'
            },
            technicalSkills: [
                { category: 'Languages', skills: 'JavaScript, TypeScript, Python, Go' },
                { category: 'Frameworks', skills: 'React, Node.js, Express, Next.js' }
            ],
            internships: [
                {
                    role: 'Senior Developer',
                    company: 'Tech Corp',
                    duration: '2020 - Present',
                    description: ['Led the development of a high-traffic e-commerce platform.', 'Improved system performance by 30% through code optimization.']
                }
            ],
            education: [{ school: 'University of Science', degree: 'B.S. in Computer Science', startDate: '2016' }]
        },
        position: { top: '-40%', left: '-5%', rotate: -8, scale: 0.38, z: 20 },
        delay: 0.1
    },
    {
        id: 2,
        template: 'modern',
        data: {
            personalInfo: {
                fullName: 'Jane Smith',
                email: 'jane.smith@design.com',
                address: 'San Francisco, CA',
                summary: 'Creative UI/UX Designer with 5+ years of experience in crafting intuitive user experiences. Passionate about accessibility and minimalist design.'
            },
            technicalSkills: [
                { category: 'Design', skills: 'Figma, Adobe XD, Sketch, Prototyping' },
                { category: 'Tools', skills: 'InVision, Zeplin, Framer' }
            ],
            projects: [
                {
                    title: 'Mobile Banking App',
                    date: '2022',
                    description: ['Redesigned the mobile experience for 1M+ users.', 'Achieved a 4.8-star rating on the App Store.']
                }
            ],
            education: [{ school: 'Design Institute', degree: 'B.A. in Graphic Design', startDate: '2017' }]
        },
        position: { top: '-45%', left: '30%', rotate: 6, scale: 0.36, z: 10 },
        delay: 0.2
    },
    {
        id: 3,
        template: 'classic',
        data: {
            personalInfo: {
                fullName: 'Robert Wilson',
                email: 'robert.wilson@data.net',
                address: 'Chicago, IL',
                summary: 'Data Scientist with expertise in machine learning, statistical modeling, and data visualization. Skilled in extracting insights from complex datasets.'
            },
            technicalSkills: [
                { category: 'Programming', skills: 'Python, R, SQL, Julia' },
                { category: 'Libraries', skills: 'Pandas, NumPy, Scikit-Learn, PyTorch' }
            ],
            internships: [
                {
                    role: 'Data Analyst',
                    company: 'Insight Data',
                    duration: '2021 - 2022',
                    description: ['Built predictive models for customer churn analysis.', 'Automated data reporting pipelines using Python.']
                }
            ],
            education: [{ school: 'State University', degree: 'M.S. in Statistics', startDate: '2019' }]
        },
        position: { top: '-5%', left: '-15%', rotate: -12, scale: 0.4, z: 30 },
        delay: 0.3
    },
    {
        id: 4,
        template: 'ats',
        data: {
            personalInfo: {
                fullName: 'Emily Brown',
                email: 'emily.b@marketing.com',
                address: 'London, UK',
                summary: 'Results-driven Marketing Manager with a track record of executing successful multi-channel campaigns. Expert in SEO and content strategy.'
            },
            technicalSkills: [
                { category: 'Marketing', skills: 'SEO, SEM, Content Marketing, Analytics' },
                { category: 'Platforms', skills: 'Google Ads, HubSpot, Salesforce' }
            ],
            internships: [
                {
                    role: 'Marketing Lead',
                    company: 'Global Brands',
                    duration: '2019 - Present',
                    description: ['Increased organic traffic by 150% in one year.', 'Managed an annual marketing budget of $500k.']
                }
            ],
            education: [{ school: 'Business School', degree: 'B.A. in Marketing', startDate: '2015' }]
        },
        position: { top: '0%', left: '30%', rotate: 4, scale: 0.38, z: 40 },
        delay: 0.4
    },
    {
        id: 5,
        template: 'modern',
        data: {
            personalInfo: {
                fullName: 'Michael Chen',
                email: 'm.chen@product.io',
                address: 'Seattle, WA',
                summary: 'Product Manager with a focus on user-centric product development. Experienced in leading cross-functional teams to deliver high-impact features.'
            },
            technicalSkills: [
                { category: 'Product', skills: 'Agile, Scrum, Roadmap Planning, User Research' },
                { category: 'Collaboration', skills: 'Jira, Confluence, Trello, Slack' }
            ],
            projects: [
                {
                    title: 'Feature Launch: Real-time Collab',
                    date: '2023',
                    description: ['Led the end-to-end development of a real-time collaboration tool.', 'Grew active user base by 40% post-launch.']
                }
            ],
            education: [{ school: 'Tech University', degree: 'MBA in Technology Management', startDate: '2018' }]
        },
        position: { top: '-25%', left: '42%', rotate: 12, scale: 0.33, z: 15 },
        delay: 0.5
    }
];

const ResumeCollage = () => {
    return (
        <div className="relative w-[600px] h-[600px] perspective-2500 overflow-visible py-20 flex items-center justify-center">
            {samples.map((sample) => (
                <motion.div
                    key={sample.id}
                    initial={{ opacity: 0, y: 100, rotateX: 15, rotate: sample.position.rotate }}
                    animate={{ 
                        opacity: 1, 
                        y: 0, 
                        rotateX: 0,
                        rotate: sample.position.rotate,
                        transition: { 
                            duration: 1, 
                            delay: sample.delay,
                            ease: [0.22, 1, 0.36, 1]
                        }
                    }}
                    whileHover={{ 
                        scale: sample.position.scale * 1.05, 
                        y: -40,
                        transition: { duration: 0.4, ease: "easeOut" }
                    }}
                    className="absolute cursor-pointer shadow-[0_40px_80px_-15px_rgba(0,0,0,0.6)] bg-white overflow-hidden rounded-md ring-1 ring-black/5"
                    style={{
                        top: sample.position.top,
                        left: sample.position.left,
                        width: '210mm',
                        height: '297mm',
                        transformOrigin: 'center center',
                        scale: sample.position.scale,
                        zIndex: sample.position.z,
                        backfaceVisibility: 'hidden'
                    }}
                >
                    {/* Floating Animation Wrapper */}
                    <motion.div
                        animate={{
                            y: [0, -20, 0],
                            rotateZ: [0, 1, -1, 0]
                        }}
                        transition={{
                            duration: 6 + sample.id,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: sample.delay
                        }}
                        className="w-full h-full relative"
                    >
                        <ResumePreview 
                            template={sample.template} 
                            data={sample.data} 
                        />
                        {/* Professional Depth Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-black/10 via-transparent to-white/10 pointer-events-none" />
                    </motion.div>
                </motion.div>
            ))}

            {/* Premium Background Atmosphere */}
            <div className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center">
                <div className="w-full h-full max-w-4xl relative">
                    <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full animate-pulse opacity-50" />
                    <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] bg-indigo-500/10 blur-[150px] rounded-full animate-pulse opacity-50" style={{ animationDelay: '2s' }} />
                </div>
            </div>
        </div>
    );
};

export default ResumeCollage;
