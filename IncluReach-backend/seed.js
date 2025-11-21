import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/jobModel.js";
import User from "./models/userModel.js";
import bcrypt from "bcryptjs";

// Load environment variables
dotenv.config();

const dummyJobs = [
  {
    title: "Frontend Web Developer",
    company: "TechAccess Solutions",
    location: "Bangalore, Karnataka",
    remote: true,
    description:
      "We are seeking a talented Frontend Developer to join our inclusive team. You will work on building accessible web applications that serve people with diverse abilities. Experience with React, HTML5, and CSS3 is required. We provide screen readers, voice recognition software, and flexible work arrangements.",
    requirements: [
      "2+ years of experience in frontend development",
      "Strong knowledge of React and JavaScript",
      "Understanding of WCAG 2.1 accessibility guidelines",
      "Experience with responsive design",
      "Good communication skills",
    ],
    skills: ["React", "JavaScript", "HTML5", "CSS3", "Accessibility", "Git"],
    disabilityTypes: ["Physical", "Visual", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 45000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Graphic Designer",
    company: "Creative Minds Studio",
    location: "Mumbai, Maharashtra",
    remote: false,
    description:
      "Join our creative team to design marketing materials, social media content, and branding assets. We are an inclusive workplace with wheelchair accessibility, adjustable workstations, and assistive technology. Proficiency in Adobe Creative Suite is essential.",
    requirements: [
      "Bachelor's degree in Design or related field",
      "3+ years of graphic design experience",
      "Portfolio demonstrating creative work",
      "Proficiency in Adobe Photoshop, Illustrator, and InDesign",
      "Strong attention to detail",
    ],
    skills: [
      "Adobe Photoshop",
      "Illustrator",
      "InDesign",
      "Typography",
      "Branding",
    ],
    disabilityTypes: ["Physical", "Hearing", "Cognitive"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 38000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Data Entry Specialist",
    company: "DataPro Services",
    location: "Pune, Maharashtra",
    remote: true,
    description:
      "We need detail-oriented Data Entry Specialists to process and manage information in our database systems. This remote position offers flexible hours and provides all necessary software. Training will be provided on our systems.",
    requirements: [
      "High school diploma or equivalent",
      "Typing speed of 40+ WPM",
      "Basic computer literacy",
      "Attention to detail and accuracy",
      "Ability to work independently",
    ],
    skills: [
      "MS Excel",
      "Data Entry",
      "Typing",
      "Microsoft Office",
      "Attention to Detail",
    ],
    disabilityTypes: ["Physical", "Visual", "Cognitive"],
    disabilitySeverity: "Any",
    salary: {
      amount: 22000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Customer Support Representative",
    company: "HelpDesk India",
    location: "Hyderabad, Telangana",
    remote: true,
    description:
      "Provide excellent customer service through email, chat, and phone support. We offer comprehensive training, flexible schedules, and support for employees with disabilities including TTY services and screen reader compatible systems.",
    requirements: [
      "Excellent written and verbal communication",
      "1+ year of customer service experience",
      "Problem-solving abilities",
      "Patience and empathy",
      "Basic technical troubleshooting skills",
    ],
    skills: [
      "Communication",
      "Customer Service",
      "Problem Solving",
      "MS Office",
      "Email Support",
    ],
    disabilityTypes: ["Physical", "Visual", "Cognitive"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 25000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Medical Transcriptionist",
    company: "HealthScribe Solutions",
    location: "Chennai, Tamil Nadu",
    remote: true,
    description:
      "Transcribe medical reports, patient histories, and clinical notes from audio recordings. Knowledge of medical terminology is required. We provide voice recognition software and flexible work hours to accommodate your needs.",
    requirements: [
      "Certificate in Medical Transcription",
      "Knowledge of medical terminology",
      "Excellent listening and typing skills",
      "1+ year of transcription experience",
      "HIPAA compliance awareness",
    ],
    skills: [
      "Medical Terminology",
      "Transcription",
      "Typing",
      "Attention to Detail",
      "MS Word",
    ],
    disabilityTypes: ["Physical", "Visual"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 28000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Online English Tutor",
    company: "LearnBridge Academy",
    location: "Delhi NCR",
    remote: true,
    description:
      "Teach English to students of various age groups through online video sessions. Create lesson plans and provide personalized feedback. We support tutors with disabilities through accessible teaching platforms and flexible scheduling.",
    requirements: [
      "Bachelor's degree in English or Education",
      "Teaching certification (TEFL/TESOL preferred)",
      "2+ years of teaching experience",
      "Strong communication skills",
      "Patience and creativity",
    ],
    skills: [
      "English Teaching",
      "Curriculum Development",
      "Communication",
      "Online Teaching",
      "Student Assessment",
    ],
    disabilityTypes: ["Physical", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 35000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Software Quality Assurance Tester",
    company: "QualityFirst Tech",
    location: "Bangalore, Karnataka",
    remote: false,
    description:
      "Test software applications for bugs, usability issues, and accessibility compliance. Work with development teams to ensure products meet quality standards and are accessible to all users. Our office is fully accessible with assistive technology available.",
    requirements: [
      "Bachelor's degree in Computer Science or related field",
      "2+ years of QA testing experience",
      "Knowledge of testing methodologies",
      "Experience with bug tracking tools",
      "Understanding of accessibility testing",
    ],
    skills: [
      "Manual Testing",
      "Automation Testing",
      "Selenium",
      "JIRA",
      "Accessibility Testing",
      "SQL",
    ],
    disabilityTypes: ["Physical", "Visual", "Hearing"],
    disabilitySeverity: "Moderate",
    salary: {
      amount: 42000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Content Writer",
    company: "WordCraft Digital",
    location: "Kolkata, West Bengal",
    remote: true,
    description:
      "Create engaging blog posts, articles, and web content for various clients. Research topics, optimize for SEO, and maintain brand voice. This fully remote position offers flexible deadlines and uses accessible content management systems.",
    requirements: [
      "Bachelor's degree in English, Journalism, or related field",
      "2+ years of professional writing experience",
      "SEO knowledge",
      "Strong research skills",
      "Portfolio of published work",
    ],
    skills: [
      "Content Writing",
      "SEO",
      "Research",
      "WordPress",
      "Copywriting",
      "Editing",
    ],
    disabilityTypes: ["Physical", "Visual", "Cognitive"],
    disabilitySeverity: "Any",
    salary: {
      amount: 32000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Accountant",
    company: "FinanceEase Consulting",
    location: "Ahmedabad, Gujarat",
    remote: false,
    description:
      "Manage financial records, prepare tax returns, and assist with bookkeeping. Our office provides accessible workstations, screen magnification software, and ergonomic furniture to ensure comfort for all employees.",
    requirements: [
      "Bachelor's degree in Commerce or Accounting",
      "CA/CMA certification preferred",
      "3+ years of accounting experience",
      "Knowledge of Tally and GST",
      "Analytical and detail-oriented",
    ],
    skills: [
      "Accounting",
      "Tally",
      "GST",
      "Financial Reporting",
      "MS Excel",
      "Tax Preparation",
    ],
    disabilityTypes: ["Physical", "Visual"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 40000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Digital Marketing Specialist",
    company: "GrowthHub Marketing",
    location: "Jaipur, Rajasthan",
    remote: true,
    description:
      "Plan and execute digital marketing campaigns across social media, email, and search engines. Analyze campaign performance and optimize strategies. We support team members with flexible schedules and accessible marketing tools.",
    requirements: [
      "Bachelor's degree in Marketing or related field",
      "2+ years of digital marketing experience",
      "Knowledge of Google Ads and Facebook Ads",
      "Strong analytical skills",
      "Experience with marketing analytics tools",
    ],
    skills: [
      "Digital Marketing",
      "SEO",
      "SEM",
      "Social Media Marketing",
      "Google Analytics",
      "Email Marketing",
    ],
    disabilityTypes: ["Physical", "Hearing", "Cognitive"],
    disabilitySeverity: "Any",
    salary: {
      amount: 38000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Python Developer",
    company: "CodeCraft Technologies",
    location: "Pune, Maharashtra",
    remote: true,
    description:
      "Develop and maintain Python applications for data processing and automation. Work with cross-functional teams to deliver high-quality solutions. Remote work with occasional team meetings online.",
    requirements: [
      "Bachelor's degree in Computer Science",
      "3+ years of Python development experience",
      "Experience with Django or Flask",
      "Knowledge of databases (MySQL/PostgreSQL)",
      "Strong problem-solving skills",
    ],
    skills: ["Python", "Django", "Flask", "REST API", "SQL", "Git", "Docker"],
    disabilityTypes: ["Physical", "Visual", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 55000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "HR Coordinator",
    company: "PeopleFirst HR Solutions",
    location: "Gurgaon, Haryana",
    remote: false,
    description:
      "Support recruitment, onboarding, and employee engagement activities. Maintain HR records and assist with policy implementation. Our company is committed to diversity and inclusion with accessible facilities.",
    requirements: [
      "Bachelor's degree in HR or related field",
      "1-2 years of HR experience",
      "Knowledge of labor laws",
      "Good interpersonal skills",
      "Proficiency in MS Office",
    ],
    skills: [
      "Human Resources",
      "Recruitment",
      "MS Office",
      "Communication",
      "Employee Relations",
    ],
    disabilityTypes: ["Physical", "Cognitive"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 30000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Video Editor",
    company: "Visual Stories Media",
    location: "Mumbai, Maharashtra",
    remote: true,
    description:
      "Edit video content for YouTube, social media, and corporate clients. Create engaging narratives through cutting, color grading, and sound design. We provide necessary software licenses and support flexible working hours.",
    requirements: [
      "2+ years of video editing experience",
      "Proficiency in Adobe Premiere Pro and After Effects",
      "Strong storytelling abilities",
      "Knowledge of color grading",
      "Portfolio of edited videos",
    ],
    skills: [
      "Video Editing",
      "Adobe Premiere Pro",
      "After Effects",
      "Color Grading",
      "Sound Design",
    ],
    disabilityTypes: ["Physical", "Hearing"],
    disabilitySeverity: "Moderate",
    salary: {
      amount: 40000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Web Developer (Full Stack)",
    company: "InnovateTech Labs",
    location: "Bangalore, Karnataka",
    remote: false,
    description:
      "Build and maintain web applications using modern technologies. Collaborate with designers and product managers to create user-friendly solutions. Our workspace is designed for accessibility with adjustable desks and assistive technology.",
    requirements: [
      "Bachelor's degree in Computer Science",
      "3+ years of full-stack development experience",
      "Expertise in JavaScript, Node.js, and React",
      "Experience with MongoDB or similar databases",
      "Knowledge of RESTful APIs",
    ],
    skills: [
      "JavaScript",
      "Node.js",
      "React",
      "MongoDB",
      "Express.js",
      "HTML/CSS",
      "Git",
    ],
    disabilityTypes: ["Physical", "Visual"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 65000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Virtual Assistant",
    company: "RemoteSupport Pro",
    location: "Anywhere in India",
    remote: true,
    description:
      "Provide administrative support including email management, scheduling, research, and data organization. This role offers complete flexibility and uses cloud-based tools accessible to everyone.",
    requirements: [
      "Excellent organizational skills",
      "Strong written and verbal communication",
      "Proficiency in Google Workspace or MS Office",
      "Ability to multitask",
      "Reliable internet connection",
    ],
    skills: [
      "Administrative Support",
      "Email Management",
      "Scheduling",
      "MS Office",
      "Google Workspace",
    ],
    disabilityTypes: ["Physical", "Visual", "Cognitive"],
    disabilitySeverity: "Any",
    salary: {
      amount: 24000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Social Media Manager",
    company: "BrandBoost Agency",
    location: "Delhi NCR",
    remote: true,
    description:
      "Manage social media accounts for multiple clients, create content calendars, and engage with audiences. Track metrics and optimize strategies for better reach and engagement.",
    requirements: [
      "Bachelor's degree in Marketing or Communications",
      "2+ years of social media management experience",
      "Strong understanding of social platforms",
      "Creative content creation skills",
      "Experience with social media analytics tools",
    ],
    skills: [
      "Social Media Marketing",
      "Content Creation",
      "Canva",
      "Analytics",
      "Copywriting",
      "Community Management",
    ],
    disabilityTypes: ["Physical", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 35000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Technical Support Engineer",
    company: "TechHelp Solutions",
    location: "Hyderabad, Telangana",
    remote: false,
    description:
      "Provide technical support to customers via phone, email, and chat. Troubleshoot hardware and software issues and document solutions. We offer comprehensive training and accessible support tools.",
    requirements: [
      "Diploma or degree in Computer Science",
      "1-2 years of technical support experience",
      "Strong troubleshooting skills",
      "Good communication abilities",
      "Knowledge of Windows and common software applications",
    ],
    skills: [
      "Technical Support",
      "Troubleshooting",
      "Customer Service",
      "Windows",
      "Networking Basics",
    ],
    disabilityTypes: ["Physical", "Visual"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 28000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Jewelry Designer",
    company: "Artisan Crafts Studio",
    location: "Jaipur, Rajasthan",
    remote: false,
    description:
      "Design unique jewelry pieces using traditional and contemporary techniques. Work with precious metals and stones to create stunning pieces. Our studio is wheelchair accessible with specialized equipment.",
    requirements: [
      "Diploma in Jewelry Design or related field",
      "2+ years of design experience",
      "Knowledge of CAD software for jewelry",
      "Understanding of gemstones and metals",
      "Creative and detail-oriented",
    ],
    skills: ["Jewelry Design", "CAD", "Gemology", "Metalwork", "Creativity"],
    disabilityTypes: ["Hearing", "Cognitive"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 32000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Research Analyst",
    company: "Market Insights Group",
    location: "Mumbai, Maharashtra",
    remote: true,
    description:
      "Conduct market research, analyze data trends, and prepare detailed reports. Support business decisions with data-driven insights. Remote position with flexible hours and accessible research tools.",
    requirements: [
      "Bachelor's degree in Business, Economics, or Statistics",
      "2+ years of research experience",
      "Strong analytical and statistical skills",
      "Proficiency in MS Excel and data visualization tools",
      "Excellent report writing abilities",
    ],
    skills: [
      "Market Research",
      "Data Analysis",
      "MS Excel",
      "Statistical Analysis",
      "Report Writing",
    ],
    disabilityTypes: ["Physical", "Visual", "Cognitive"],
    disabilitySeverity: "Any",
    salary: {
      amount: 42000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Mobile App Developer (Android)",
    company: "AppVenture Studios",
    location: "Bangalore, Karnataka",
    remote: true,
    description:
      "Develop native Android applications with focus on performance and user experience. Implement accessibility features to ensure apps are usable by everyone. Work remotely with a supportive team.",
    requirements: [
      "Bachelor's degree in Computer Science",
      "3+ years of Android development experience",
      "Proficiency in Kotlin and Java",
      "Experience with Android SDK and APIs",
      "Understanding of Material Design principles",
    ],
    skills: [
      "Android Development",
      "Kotlin",
      "Java",
      "Android SDK",
      "REST APIs",
      "Git",
    ],
    disabilityTypes: ["Physical", "Visual", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 60000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Counselor (Career Guidance)",
    company: "FuturePathways Counseling",
    location: "Pune, Maharashtra",
    remote: true,
    description:
      "Provide career counseling to students and professionals. Conduct assessments, offer guidance, and help individuals make informed career decisions. Online sessions with flexible scheduling.",
    requirements: [
      "Master's degree in Psychology or Counseling",
      "Certification in Career Counseling",
      "2+ years of counseling experience",
      "Empathy and active listening skills",
      "Knowledge of career assessment tools",
    ],
    skills: [
      "Career Counseling",
      "Psychology",
      "Communication",
      "Assessment Tools",
      "Active Listening",
    ],
    disabilityTypes: ["Physical", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 36000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Bookkeeper",
    company: "SmallBiz Accounting Services",
    location: "Chennai, Tamil Nadu",
    remote: true,
    description:
      "Maintain financial records for small businesses, process invoices, and reconcile bank statements. Use accounting software to ensure accuracy and compliance with tax regulations.",
    requirements: [
      "Bachelor's degree in Commerce",
      "2+ years of bookkeeping experience",
      "Knowledge of Tally or QuickBooks",
      "Understanding of GST and tax compliance",
      "Attention to detail and accuracy",
    ],
    skills: [
      "Bookkeeping",
      "Tally",
      "QuickBooks",
      "GST",
      "MS Excel",
      "Accounting",
    ],
    disabilityTypes: ["Physical", "Visual"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 26000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "UI/UX Designer",
    company: "DesignFirst Studio",
    location: "Bangalore, Karnataka",
    remote: false,
    description:
      "Design intuitive and accessible user interfaces for web and mobile applications. Create wireframes, prototypes, and conduct user research. We prioritize accessibility in all our designs and provide necessary tools and support.",
    requirements: [
      "Bachelor's degree in Design or related field",
      "3+ years of UI/UX design experience",
      "Proficiency in Figma or Adobe XD",
      "Understanding of accessibility standards (WCAG)",
      "Strong portfolio demonstrating design thinking",
    ],
    skills: [
      "UI Design",
      "UX Design",
      "Figma",
      "Adobe XD",
      "Prototyping",
      "User Research",
      "Accessibility Design",
    ],
    disabilityTypes: ["Physical", "Hearing", "Cognitive"],
    disabilitySeverity: "Moderate",
    salary: {
      amount: 50000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Electronics Technician",
    company: "CircuitFix Repairs",
    location: "Coimbatore, Tamil Nadu",
    remote: false,
    description:
      "Repair and maintain electronic devices including computers, mobile phones, and appliances. Diagnose issues and perform component-level repairs. Our workshop is equipped with accessible workbenches and tools.",
    requirements: [
      "ITI or Diploma in Electronics",
      "2+ years of repair experience",
      "Knowledge of circuit diagrams and components",
      "Good manual dexterity",
      "Problem-solving abilities",
    ],
    skills: [
      "Electronics Repair",
      "Troubleshooting",
      "Circuit Analysis",
      "Soldering",
      "Component Testing",
    ],
    disabilityTypes: ["Hearing", "Cognitive"],
    disabilitySeverity: "Mild",
    salary: {
      amount: 24000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
  {
    title: "Business Analyst",
    company: "Strategy Solutions Consulting",
    location: "Mumbai, Maharashtra",
    remote: true,
    description:
      "Analyze business processes, identify improvement opportunities, and work with stakeholders to implement solutions. Create documentation and support project delivery. Fully remote with flexible collaboration tools.",
    requirements: [
      "Bachelor's degree in Business Administration or IT",
      "3+ years of business analysis experience",
      "Strong analytical and problem-solving skills",
      "Experience with requirement gathering and documentation",
      "Knowledge of Agile methodologies",
    ],
    skills: [
      "Business Analysis",
      "Requirements Gathering",
      "Process Improvement",
      "SQL",
      "Agile",
      "Documentation",
    ],
    disabilityTypes: ["Physical", "Visual", "Hearing"],
    disabilitySeverity: "Any",
    salary: {
      amount: 58000,
      currency: "INR",
      period: "month",
      isPublic: true,
    },
    status: "active",
  },
];

// MongoDB Connection and Seeding
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ Connected to MongoDB Atlas");

    // Clear existing jobs and users (optional - comment out if you want to keep existing data)
    // await Job.deleteMany({});
    // await User.deleteMany({ email: { $regex: /@seedrecruiter\.com$/ } });
    // console.log("🗑️  Cleared existing seed data");

    // Create dummy recruiter accounts
    console.log("\n👥 Creating recruiter accounts...");

    const hashedPassword = await bcrypt.hash("Recruiter@123", 10);

    const recruiters = [
      {
        fullName: "Rajesh Kumar",
        email: "rajesh.kumar@seedrecruiter.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        fullName: "Kusumkar Deepak",
        email: "deeepak.kusumkar@recruiter.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        fullName: "Joshi Abhishek",
        email: "joshi.abhishek@recruiter.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        fullName: "Somesh Bharbade",
        email: "somesh.bharbade@recruiter.com",
        password: hashedPassword,
        role: "recruiter",
      },
      {
        fullName: "Rushikesh Karlekar",
        email: "rushikesh.karlekar@recruiter.com",
        password: hashedPassword,
        role: "recruiter",
      },
    ];

    // Insert recruiters or find existing ones
    const createdRecruiters = [];
    for (const recruiter of recruiters) {
      let user = await User.findOne({ email: recruiter.email });
      if (!user) {
        user = await User.create(recruiter);
        console.log(`   ✓ Created recruiter: ${recruiter.fullName}`);
      } else {
        console.log(`   ℹ Found existing recruiter: ${recruiter.fullName}`);
      }
      createdRecruiters.push(user);
    }

    console.log(`\n✅ ${createdRecruiters.length} recruiters ready`);

    // Assign postedBy to each job (distribute jobs among recruiters)
    const jobsWithPostedBy = dummyJobs.map((job, index) => ({
      ...job,
      postedBy: createdRecruiters[index % createdRecruiters.length]._id,
    }));

    // Insert dummy jobs
    console.log("\n📝 Creating job postings...");
    const result = await Job.insertMany(jobsWithPostedBy);

    console.log(
      `✅ Successfully seeded ${result.length} job postings to the database`
    );
    console.log("\n📊 Job Distribution:");

    // Count jobs by profession type
    const professionCounts = {};
    dummyJobs.forEach((job) => {
      const category = getCategoryFromTitle(job.title);
      professionCounts[category] = (professionCounts[category] || 0) + 1;
    });

    Object.entries(professionCounts).forEach(([category, count]) => {
      console.log(`   ${category}: ${count} jobs`);
    });

    console.log("\n📌 Recruiter Login Credentials:");
    console.log("   Email: <any-recruiter-email>@seedrecruiter.com");
    console.log("   Password: Recruiter@123");
    console.log("\n   Example: rajesh.kumar@seedrecruiter.com");

    console.log("\n✨ Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log("\n🔒 Database connection closed");
    process.exit(0);
  }
};

// Helper function to categorize jobs
function getCategoryFromTitle(title) {
  const engineeringKeywords = [
    "Developer",
    "Engineer",
    "Technician",
    "QA",
    "Tester",
  ];
  const creativeKeywords = ["Designer", "Editor", "Writer", "Content", "Video"];
  const adminKeywords = [
    "Assistant",
    "Coordinator",
    "Data Entry",
    "Bookkeeper",
    "HR",
  ];
  const serviceKeywords = ["Support", "Customer", "Counselor"];
  const healthcareKeywords = ["Medical", "Transcriptionist", "Healthcare"];
  const educationKeywords = ["Tutor", "Teacher", "Education"];
  const skilledTradeKeywords = ["Jewelry", "Electronics", "Repair"];

  if (engineeringKeywords.some((keyword) => title.includes(keyword)))
    return "Engineering/Technical";
  if (creativeKeywords.some((keyword) => title.includes(keyword)))
    return "Creative/Arts";
  if (adminKeywords.some((keyword) => title.includes(keyword)))
    return "Administrative";
  if (serviceKeywords.some((keyword) => title.includes(keyword)))
    return "Service";
  if (healthcareKeywords.some((keyword) => title.includes(keyword)))
    return "Healthcare";
  if (educationKeywords.some((keyword) => title.includes(keyword)))
    return "Education";
  if (skilledTradeKeywords.some((keyword) => title.includes(keyword)))
    return "Skilled Trade";

  return "Other";
}

// Run the seed function
seedDatabase();
