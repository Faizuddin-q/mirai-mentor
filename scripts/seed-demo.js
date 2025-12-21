const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

async function main() {
  const EMAIL = "mirai-mentor-demo@gmail.com";

  console.log(`Seeding data for ${EMAIL}...`);

  try {
    const user = await db.user.findUnique({
      where: { email: EMAIL },
    });

    if (!user) {
      console.error(`User with email ${EMAIL} not found. Please log in with the demo account first to create the user record.`);
      return;
    }

    console.log(`Found user: ${user.id}`);

    // Function to clean data
    async function cleanData() {
      console.log("Clearing existing data...");
      await db.resume.deleteMany({ where: { userId: user.id } });
      await db.coverLetter.deleteMany({ where: { userId: user.id } });
      await db.assessment.deleteMany({ where: { userId: user.id } });
      await db.application.deleteMany({ where: { userId: user.id } });
      console.log("Existing data cleared.");
    }

    // Check for "clean" argument
    if (process.argv.includes("clean")) {
      await cleanData();
      console.log("Cleanup completed!");
      return; 
    }

    // Always clean before seeding
    await cleanData();

    const companies = [
      "TechNova", "StreamLine Systems", "QuantumSoft", "CyberPulse", "InnovateAI",
      "CloudScale Solutions", "DataPeak", "PixelPerfect Designs", "CodeCraft", "FutureNet"
    ];
    
    const roles = [
      "Senior Frontend Engineer", "Full Stack Developer", "UI/UX Designer", 
      "Backend Architect", "DevOps Engineer", "Mobile Developer", 
      "Product Manager", "Software Engineer", "QA Automation Engineer", "System Analyst"
    ];

    const techSkills = ["React", "Node.js", "Python", "AWS", "TypeScript", "Docker", "GraphQL", "Next.js", "PostgreSQL", "Tailwind CSS"];

    // Helper to get random date within last 30 days
    function getRandomDate(daysBack = 30) {
      const randomDays = Math.floor(Math.random() * daysBack);
      const date = new Date();
      date.setDate(date.getDate() - randomDays);
      return date;
    }

    console.log("Seeding Resumes...");
    const resumes = [];
    for (let i = 0; i < 10; i++) {
      const role = roles[i];
      resumes.push({
        userId: user.id,
        title: `${role} Resume`,
        title: `${role} Resume`,
        content: `<div align="center">\n\n# ${user.name || 'Demo User'}\n\ndemo.user@example.com | 9876543210 | [LinkedIn](https://linkedin.com/in/${user.name?.replace(/\s/g, '').toLowerCase() || 'demo'}) | https://github.com/${user.name?.replace(/\s/g, '').toLowerCase() || 'demo'}\n\n</div>\n\n## PROFESSIONAL SUMMARY\n\nResults-oriented ${role} with 5+ years of experience designing and developing scalable web applications. Proficient in the full software development lifecycle, from requirement gathering to deployment. Adept at collaborating with cross-functional teams to deliver high-quality software solutions that drive business growth. Passionate about writing clean, maintainable code and staying updated with the latest industry trends.\n\n## TECHNICAL SKILLS\n\n- **Languages:** JavaScript, TypeScript, Python, SQL\n- **Frameworks:** React, Next.js, Node.js, Express\n- **Tools:** Git, Docker, Kubernetes, AWS, Jenkins\n- **Databases:** PostgreSQL, MongoDB, Redis\n\n## EXPERIENCE\n\n**${role} @ ${companies[i]}**\nJan 2021 - Present\n\n- Spearheaded frontend initiatives and full-stack development projects in a fast-paced environment, contributing to core product features and architectural decisions.\n\n- Led the development of a high-traffic e-commerce platform, resulting in a 30% increase in sales.\n- Implemented microservices architecture using Node.js and Docker, improving system scalability and maintainability.\n- Mentored a team of 3 junior developers, conducting code reviews and providing technical guidance.\n- Optimized database queries, reducing response time by 40%.\n\n**Software Engineer @ Tech Innovators Inc.**\nJun 2018 - Dec 2020\n\n- Played a key role in the development of client-facing web applications, working closely with product managers and designers to deliver high-quality user experiences.\n\n- Developed and maintained multiple web applications using React and Redux.\n- Collaborated with UI/UX designers to implement responsive and user-friendly interfaces.\n- Integrated third-party APIs for payment processing and social media authentication.\n- Automated testing processes using Jest and Cypress, achieving 90% code coverage.\n\n## EDUCATION\n\n**Bachelor of Science in Computer Science @ University of Technology**\nJan 2014 - Dec 2018\n\n- Completed a comprehensive curriculum focusing on software engineering principles, algorithm design, and computer systems. Active member of the university coding club and hackathon team.\n\n- Graduated with Honors\n- Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Development\n\n## PERSONAL PROJECTS\n\n**Personal Finance Tracker @ Self**\nJan 2020 - Mar 2020\n\n- Developed a full-stack financial management tool to assist users in tracking their spending habits and visualization of their financial health.\n\n- Built a web application to help users track expenses and manage budgets.\n- Used React for the frontend and Firebase for the backend.\n- Implemented real-time data synchronization and data visualization using Recharts.\n\n**E-Learning Platform @ Self**\nJun 2019 - Dec 2019\n\n- Created a comprehensive online learning management system supporting video courses, quizzes, and progress tracking.\n\n- Developed a platform for online courses with video streaming and quiz features.\n- Utilized Next.js for server-side rendering and improved SEO.\n- Integrated Stripe for secure payment processing.`,
        atsScore: Math.floor(Math.random() * 20) + 80, // 80-100
        feedback: "Strong technical skills listed. Consider adding more quantitative achievements in your experience section.",
        createdAt: getRandomDate(),
        updatedAt: getRandomDate(),
      });
    }
    await db.resume.createMany({ data: resumes });
    console.log("Created 10 Resumes");

    console.log("Seeding Cover Letters...");
    const coverLetters = [];
    for (let i = 0; i < 10; i++) {
        const company = companies[i];
        const role = roles[i];
      coverLetters.push({
        userId: user.id,
        companyName: company,
        jobTitle: role,
        jobDescription: `We are looking for a highly skilled and motivated ${role} to join our dynamic team at ${company}. In this role, you will be responsible for designing, developing, and deploying high-performance applications. You will work closely with cross-functional teams including designers, product managers, and other engineers to deliver robust and scalable solutions.
        
Key Responsibilities:
- Design and implement scalable software solutions.
- Collaborate with the product team to define requirements.
- Write clean, maintainable, and efficient code.
- Participate in code reviews and mentorship programs.
- Troubleshoot and resolve complex technical issues.

Requirements:
- Proven experience as a ${role} or similar role.
- Strong proficiency in modern programming languages and frameworks.
- Excellent problem-solving skills and attention to detail.
- Ability to work effectively in a fast-paced environment.`,
        content: `Dear Hiring Manager at ${company},

I am writing to express my strong interest in the ${role} position at ${company}, as advertised. With a robust background in software development and a passion for creating innovative solutions, I am confident in my ability to contribute effectively to your engineering team.

In my current and previous roles, I have honed my skills in designing scalable architectures and writing efficient, clean code. I have a proven track record of collaborating with cross-functional teams to deliver high-quality software products on time. My experience includes working with modern technologies such as React, Node.js, and cloud platforms like AWS.

I am particularly drawn to ${company}’s reputation for excellence and innovation in the industry. I am eager to bring my technical expertise and problem-solving abilities to your team and contribute to your ongoing success.

Thank you for considering my application. I look forward to the possibility of discussing how my skills and experiences align with the needs of your team.

Sincerely,
[Your Name]`,
        status: "completed",
        createdAt: getRandomDate(),
        updatedAt: getRandomDate(),
      });
    }
    await db.coverLetter.createMany({ data: coverLetters });
    console.log("Created 10 Cover Letters");

    console.log("Seeding Assessments...");
    
    const questionsPool = [
        { q: "What is the difference between let and var in JavaScript?", a: "let is block-scoped, var is function-scoped." },
        { q: "Explain the concept of closures.", a: "A closure is the combination of a function bundled together with references to its surrounding state." },
        { q: "What is the Virtual DOM in React?", a: "A lightweight copy of the real DOM that allows React to optimizations updates." },
        { q: "Difference between SQL and NoSQL?", a: "SQL databases are relational and table-based, while NoSQL are non-relational and document/key-value based." },
        { q: "What is Hoisting in JavaScript?", a: "Hoisting is JavaScript's behavior of moving declarations to the top." },
        { q: "Explain promises in JavaScript.", a: "Promises represent the eventual completion (or failure) of an asynchronous operation." },
        { q: "What is Dependency Injection?", a: "A design pattern where an object's dependencies are injected rather than created internally." },
        { q: "What are React Hooks?", a: "Functions that let you use state and other React features without writing a class." },
        { q: "Explain Event Bubbling.", a: "When an event happens on an element, it first runs the handlers on it, then on its parent, then all the way up." },
        { q: "What is CORS?", a: "Cross-Origin Resource Sharing is a mechanism that allows restricted resources on a web page to be requested from another domain." },
        { q: "Explain the Box Model in CSS.", a: "It consists of margins, borders, padding, and the actual content." },
        { q: "What is Agile methodology?", a: "An iterative approach to project management and software development." },
        { q: "Difference between == and ===?", a: "== performs type coercion, === checks for both value and type." },
        { q: "What is a Microservice architecture?", a: "Structuring an application as a collection of loosely coupled services." },
        { q: "Explain RESTful APIs.", a: "Architectural style for an API that uses HTTP requests to access and use data." }
    ];

    function getRandomQuestions(n) {
        const shuffled = [...questionsPool].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n).map(item => ({
            question: item.q,
            answer: item.a,
            userAnswer: "My Answer...",
            isCorrect: Math.random() > 0.3 // 70% chance of correct
        }));
    }

    const assessments = [];
    const categories = ["Technical", "Behavioral", "System Design"];
    
    for (let i = 0; i < 10; i++) {
        const numQuestions = Math.floor(Math.random() * 6) + 5; // 5 to 10 questions
        assessments.push({
            userId: user.id,
            quizScore: Math.floor(Math.random() * 30) + 70, // 70-100
            category: categories[i % categories.length],
            questions: getRandomQuestions(numQuestions),
            improvementTip: "Review advanced concepts in system design and optimization.",
            createdAt: getRandomDate(),
            updatedAt: getRandomDate(),
        });
    }
    await db.assessment.createMany({ data: assessments });
    console.log("Created 10 Assessments");

    console.log("Seeding Applications...");
    const applications = [];
    const statuses = ["WISHLIST", "APPLIED", "OA", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN"];
    const jobTypes = ["FULL_TIME", "INTERN", "REMOTE", "HYBRID", "CONTRACT"];

    for (let i = 0; i < 10; i++) {
        const company = companies[i];
        const role = roles[i];
        
        const randomDays = Math.floor(Math.random() * 30);
        const appliedDate = new Date();
        appliedDate.setDate(appliedDate.getDate() - randomDays);

      applications.push({
        userId: user.id,
        companyName: company,
        jobTitle: role,
        jobType: jobTypes[i % jobTypes.length],
        jobLink: `https://www.${company.toLowerCase().replace(/\s/g, '')}.com/careers`,
        status: statuses[i % statuses.length],
        status: statuses[i % statuses.length],
        appliedAt: appliedDate, // already random
        nextAction: i % 2 === 0 ? "Prepare for technical interview" : "Wait for response",
        createdAt: appliedDate,
        updatedAt: appliedDate,
      });
    }

    await db.application.createMany({ data: applications });
    console.log("Created 10 Applications");

    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await db.$disconnect();
  }
}

main();
