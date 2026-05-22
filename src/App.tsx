import { useState, useEffect, FormEvent } from 'react';
import {
  BookOpen,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Award,
  DollarSign,
  Edit2,
  Filter,
  GraduationCap,
  Info,
  PlusCircle,
  Search,
  Sparkles,
  TrendingUp,
  User,
  X,
  Clock,
  Code,
  Check,
  AlertCircle,
  ArrowRight,
  Target,
  Trophy,
  Activity,
  UserCheck,
  Heart,
  FileText
} from 'lucide-react';

// Interfaces
interface Gig {
  id: string;
  title: string;
  category: 'tutoring' | 'development' | 'design' | 'writing';
  payout: number;
  payoutType: 'hr' | 'fixed';
  description: string;
  durationLabel: string;
  slotsLabel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Expert';
  status: 'available' | 'applied' | 'in-progress' | 'review' | 'completed';
  employer: string;
  quizQuestion?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  codeChallenge?: {
    task: string;
    buggyCode: string;
    options: string[];
    correctIndex: number;
  };
}

interface Course {
  id: string;
  title: string;
  code: string;
  iconBg: string;
  iconText: string;
  progress: number;
  lessons: {
    title: string;
    content: string;
    quiz: {
      question: string;
      options: string[];
      correctIndex: number;
    };
  }[];
}

interface UserProfile {
  name: string;
  initials: string;
  email: string;
  major: string;
  university: string;
  level: string;
  skills: string[];
  badges: string[];
}

interface Toast {
  message: string;
  type: 'success' | 'info' | 'warning';
  visible: boolean;
}

export default function App() {
  // --- Persistent State ---
  const [balance, setBalance] = useState<number>(() => {
    const saved = localStorage.getItem('sh_balance');
    return saved ? parseFloat(saved) : 428.50;
  });

  const [monthlyGoal, setMonthlyGoal] = useState<number>(() => {
    const saved = localStorage.getItem('sh_monthly_goal');
    return saved ? parseInt(saved, 10) : 800;
  });

  const [earnedThisMonth, setEarnedThisMonth] = useState<number>(() => {
    const saved = localStorage.getItem('sh_earned_this_month');
    return saved ? parseFloat(saved) : 560.00;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sh_user_profile');
    if (saved) return JSON.parse(saved);
    return {
      name: 'John Doe',
      initials: 'JD',
      email: 'john.doe@university.edu',
      major: 'Computer Science & Biochemistry',
      university: 'State University',
      level: 'Sophomore',
      skills: ['React', 'Organic Chemistry', 'Technical Writing', 'Figma Wireframing'],
      badges: ['First Step', 'Fast Learner']
    };
  });

  // Gigs state
  const [gigs, setGigs] = useState<Gig[]>(() => {
    const saved = localStorage.getItem('sh_gigs');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'gig-1',
        title: 'Organic Chemistry I Exam Prep',
        category: 'tutoring',
        payout: 45,
        payoutType: 'hr',
        description: 'Provide an interactive review session on electrophilic addition mechanisms and synthesis routes for sophomore students.',
        durationLabel: 'Starts in 2h',
        slotsLabel: '4 Slots left',
        difficulty: 'Intermediate',
        status: 'available',
        employer: 'Pre-Med Student Union',
        quizQuestion: {
          question: 'In electrophilic addition of HBr to an alkene (Markovnikov addition), what factor stable-izes the key intermediate?',
          options: [
            'Formation of a more substituted, and therefore more stable, carbocation',
            'Symmetrical distribution of steric hindrance on the methyl groups',
            'Direct coordination of bromide with the less substituted sp3 carbon',
            'The resonance effect of neighboring carbon nucleophiles'
          ],
          correctIndex: 0,
          explanation: 'Alkene protonation yields the tertiary or more stable carbocation intermediate (Markovnikov\'s rule) which is rapidly captured by the bromide nucleophile.'
        }
      },
      {
        id: 'gig-2',
        title: 'Landing Page Bug Fix (React)',
        category: 'development',
        payout: 120,
        payoutType: 'fixed',
        description: 'Fix navigation issues and broken state updates causing double rendering on mobile devices for a local non-profit portal.',
        durationLabel: '24h Deadline',
        slotsLabel: '1 position',
        difficulty: 'Intermediate',
        status: 'available',
        employer: 'Hope Veterinary Shelter',
        codeChallenge: {
          task: 'Fix the infinite loop or incorrect toggle handler in this React button segment:',
          buggyCode: `const [isOpen, setIsOpen] = useState(false);\n// Buggy toggler:\nreturn <button onClick={setIsOpen(!isOpen)}>Toggle Nav</button>;`,
          options: [
            'onClick={() => setIsOpen(!isOpen)}',
            'onClick={setIsOpen(prev => !prev)}',
            'onClick={() => setIsOpen(isOpen => !isOpen)}',
            'onClick={setIsOpen(isOpen = !isOpen)}'
          ],
          correctIndex: 0
        }
      },
      {
        id: 'gig-3',
        title: 'Figma Mobile UI Wireframes',
        category: 'design',
        payout: 180,
        payoutType: 'fixed',
        description: 'Design interactive high-fidelity wireframes for a student study-group organizer application (3 key screens).',
        durationLabel: '3 days left',
        slotsLabel: '1 position',
        difficulty: 'Beginner',
        status: 'available',
        employer: 'VibeCheck Labs',
        quizQuestion: {
          question: 'Which Figma concept is optimal to maintain structural margin spacing and alignment across multiple screen size templates?',
          options: [
            'Auto Layout constraints & grid layouts',
            'Component instance manual rotation vectors',
            'Overlay masking overlays',
            'Standard pixel-perfect hardcoding'
          ],
          correctIndex: 0,
          explanation: 'Figma Auto Layout dynamic rules let constraints resize components organically across varied aspect ratios.'
        }
      },
      {
        id: 'gig-4',
        title: 'Freshman English Essay Proofreader',
        category: 'writing',
        payout: 35,
        payoutType: 'hr',
        description: 'Proofread and refine grammar, structure, and thesis clarity for a 5-page research essay on early Renaissance literature.',
        durationLabel: 'Starts in 5h',
        slotsLabel: '2 slots total',
        difficulty: 'Beginner',
        status: 'available',
        employer: 'Campus Writing Collective',
        quizQuestion: {
          question: 'Identify the common comma splice error in the options below:',
          options: [
            'Shakespeare wrote wonderful sonnets, he also crafted timeless dramatic plays.',
            'Shakespeare wrote wonderful sonnets; he also crafted timeless dramatic plays.',
            'Shakespeare wrote wonderful sonnets; in addition, he crafted dramatic plays.',
            'Because Shakespeare wrote wonderful sonnets, he became extremely popular.'
          ],
          correctIndex: 0,
          explanation: 'Two independent clauses joined simply by a comma without a coordinating conjunction create a comma splice. It requires a semicolon, a period, or a coordinating conjunction.'
        }
      },
      {
        id: 'gig-5',
        title: 'Machine Learning Model Deployment',
        category: 'development',
        payout: 320,
        payoutType: 'fixed',
        description: 'Deploy a fine-tuned text summarization model into live production API endpoints, securing with rate limits and API keys.',
        durationLabel: '4 days deadline',
        slotsLabel: '1 position',
        difficulty: 'Expert',
        status: 'available',
        employer: 'LingoAI Devs',
        codeChallenge: {
          task: 'Ensure the API securely grabs authorization headers in the Express middleware block:',
          buggyCode: `app.use((req, res, next) => {\n  // Bug: grabbing credential incorrectly\n  const token = req.query.api_key;\n  if (!token) return res.status(401).send();\n  next();\n});`,
          options: [
            `const authHeader = req.headers['authorization']; \nconst token = authHeader && authHeader.split(' ')[1];`,
            `const token = req.body.headers.authorization;`,
            `const token = req.cookies.api_key;`,
            `const token = req.params.api_key;`
          ],
          correctIndex: 0
        }
      }
    ];
  });

  // Academy courses
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('sh_courses');
    if (saved) return JSON.parse(saved);

    return [
      {
        id: 'course-1',
        title: 'AI Prompting for Gigs',
        code: 'AI',
        iconBg: 'bg-blue-100 text-blue-600',
        progress: 75,
        lessons: [
          {
            title: 'Structured Persona Prompting',
            content: 'To maximize freelance task speeds: Define clear roles, constraints, and target JSON schemas when outputting structured files.',
            quiz: {
              question: 'Which prompt inclusion ensures you get deterministic, parsed formats from high-level models?',
              options: [
                'Specify a precise JSON schema outline and use structured parameters or few-shot examples.',
                'Tell the model to output as fast as possible without structure.',
                'Use capitalized words repeatedly.',
                'Ask the model to double-check its friendly tone.'
              ],
              correctIndex: 0
            }
          }
        ]
      },
      {
        id: 'course-2',
        title: 'Tax Basics for Freelancers',
        code: 'TX',
        iconBg: 'bg-purple-100 text-purple-600',
        progress: 25,
        lessons: [
          {
            title: 'Tracking Deductible Expenses',
            content: 'Since student freelancers file 1099 structures, keeping software licenses, workspace setups, and device costs separate helps reduce tax rate burdens.',
            quiz: {
              question: 'Which of the following falls under regular tax-deductible freelance operating equipment?',
              options: [
                'The portion of internet bill and IDE license subscriptions used purely for development jobs',
                'General weekend grocery spending',
                'Movie tickets for personal entertainment sessions',
                'Standard university tuition bills'
              ],
              correctIndex: 0
            }
          }
        ]
      },
      {
        id: 'course-3',
        title: 'High-Converting Proposal Writting',
        code: 'PW',
        iconBg: 'bg-rose-100 text-rose-600',
        progress: 0,
        lessons: [
          {
            title: 'The "Hook-Evidence-Value" Pitch',
            content: 'Never send long generic templates. Grab the client within two lines with their core problem, show a relevant screenshot/fact, and close with a micro-meeting request.',
            quiz: {
              question: 'What is the absolute best way to make your custom application proposal stand out?',
              options: [
                'State original tailored action points demonstrating you fully understand their project needs immediately.',
                'Write a lengthy timeline of your university modules.',
                'Submit an empty proposal asking to chat on Zoom text instead.',
                'Undercut pricing by 90% without explaining the solution.'
              ],
              correctIndex: 0
            }
          }
        ]
      }
    ];
  });

  // --- UI Interactivity State ---
  const [activeTab, setActiveTab] = useState<'dashboard' | 'find-gigs' | 'academy' | 'my-gigs' | 'profile'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'tutoring' | 'development' | 'design' | 'writing'>('all');
  
  // Custom Gig Form State
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [newGigTitle, setNewGigTitle] = useState('');
  const [newGigCategory, setNewGigCategory] = useState<'tutoring' | 'development' | 'design' | 'writing'>('tutoring');
  const [newGigPayout, setNewGigPayout] = useState('40');
  const [newGigPayoutType, setNewGigPayoutType] = useState<'hr' | 'fixed'>('hr');
  const [newGigDesc, setNewGigDesc] = useState('');
  const [newGigDiff, setNewGigDiff] = useState<'Beginner' | 'Intermediate' | 'Expert'>('Intermediate');

  // Interactive Gig Simulation/Workspace state
  const [activeWorkspaceGig, setActiveWorkspaceGig] = useState<Gig | null>(null);
  const [workspaceAnswerIndex, setWorkspaceAnswerIndex] = useState<number | null>(null);
  const [workspaceSuccessMessage, setWorkspaceSuccessMessage] = useState<string | null>(null);
  const [isWorkspaceSubmitting, setIsWorkspaceSubmitting] = useState(false);
  const [challengeSubmitted, setChallengeSubmitted] = useState(false);

  // Academy Lesson Modal State
  const [activeLessonCourse, setActiveLessonCourse] = useState<Course | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [academyQuizSelection, setAcademyQuizSelection] = useState<number | null>(null);
  const [academySuccess, setAcademySuccess] = useState(false);

  // Profile Edit Form State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [typedName, setTypedName] = useState(userProfile.name);
  const [typedMajor, setTypedMajor] = useState(userProfile.major);
  const [typedLevel, setTypedLevel] = useState(userProfile.level);
  const [newSkillText, setNewSkillText] = useState('');

  // Toast status
  const [toast, setToast] = useState<Toast>({ message: '', type: 'info', visible: false });

  // Flayer active gigs
  const [activeGigsTicker, setActiveGigsTicker] = useState(1248);

  // Save changes automatically
  useEffect(() => {
    localStorage.setItem('sh_balance', balance.toString());
  }, [balance]);

  useEffect(() => {
    localStorage.setItem('sh_monthly_goal', monthlyGoal.toString());
  }, [monthlyGoal]);

  useEffect(() => {
    localStorage.setItem('sh_earned_this_month', earnedThisMonth.toString());
  }, [earnedThisMonth]);

  useEffect(() => {
    localStorage.setItem('sh_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('sh_gigs', JSON.stringify(gigs));
  }, [gigs]);

  useEffect(() => {
    localStorage.setItem('sh_courses', JSON.stringify(courses));
  }, [courses]);

  // Dynamic Ticker simulation every few seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveGigsTicker(prev => prev + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 3));
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const triggerToast = (message: string, type: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, type, visible: true });
    setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
    }, 4000);
  };

  // Create customized user post-gig
  const handlePostGig = (e: FormEvent) => {
    e.preventDefault();
    if (!newGigTitle.trim() || !newGigDesc.trim()) {
      triggerToast('Please fill out all primary gig fields.', 'warning');
      return;
    }

    const created: Gig = {
      id: `gig-custom-${Date.now()}`,
      title: newGigTitle,
      category: newGigCategory,
      payout: parseFloat(newGigPayout) || 15,
      payoutType: newGigPayoutType,
      description: newGigDesc,
      durationLabel: 'Just posted',
      slotsLabel: '1 Slot open',
      difficulty: newGigDiff,
      status: 'available',
      employer: 'External Peer Client',
      quizQuestion: newGigCategory === 'tutoring' ? {
        question: 'Which statement aligns with efficient problem execution for student peers?',
        options: ['Break work into clear isolated segments with examples.', 'Write everything on a single line.', 'Deliver answers with no steps explained.', 'Ignore secondary units.'],
        correctIndex: 0,
        explanation: 'Providing structured learning helps student peers verify accuracy clearly.'
      } : undefined,
      codeChallenge: newGigCategory === 'development' ? {
        task: 'Select clean variable naming for a user dashboard controller array context:',
        buggyCode: 'let arr = []; // optimize this array naming context',
        options: ['let userProfileList = [];', 'let x = [];', 'let arrayDataValues = [];', 'let temporary_container_for_objects = [];'],
        correctIndex: 0
      } : undefined
    };

    setGigs(prev => [created, ...prev]);
    setIsPostModalOpen(false);
    setNewGigTitle('');
    setNewGigDesc('');
    setNewGigPayout('40');
    triggerToast('Gig successfully added to the live recommended feed!', 'success');
  };

  // Claim/Apply dynamic action
  const handleApplyGig = (gig: Gig) => {
    if (gig.status === 'completed') {
      triggerToast('This gig is already finalized and completed!', 'info');
      return;
    }

    // Put it in 'in-progress' state instantly to simulate live task completion Workspace!
    setGigs(prev => prev.map(g => g.id === gig.id ? { ...g, status: 'in-progress' } : g));
    setActiveWorkspaceGig(gig);
    setWorkspaceAnswerIndex(null);
    setWorkspaceSuccessMessage(null);
    setChallengeSubmitted(false);
    triggerToast(`Gig "${gig.title}" launched in student workspace!`, 'success');
  };

  // Submit active task questions inside workspace simulation
  const handleVerifyWorkspaceChallenge = () => {
    if (workspaceAnswerIndex === null || !activeWorkspaceGig) {
      triggerToast('Please select your answer deliverable first!', 'warning');
      return;
    }

    setIsWorkspaceSubmitting(true);
    
    setTimeout(() => {
      setIsWorkspaceSubmitting(false);
      let isCorrect = false;

      // check chemistry quiz
      if (activeWorkspaceGig.quizQuestion) {
        isCorrect = workspaceAnswerIndex === activeWorkspaceGig.quizQuestion.correctIndex;
      } else if (activeWorkspaceGig.codeChallenge) {
        isCorrect = workspaceAnswerIndex === activeWorkspaceGig.codeChallenge.correctIndex;
      } else {
        // default logic for generic gigs (Design, writing) as correct
        isCorrect = true;
      }

      if (isCorrect) {
        const bonusMultiplier = courses.reduce((acc, current) => {
          return acc + (current.progress === 100 ? 0.05 : 0);
        }, 1.0); // 5% bonus for every fully completed Academy path!

        const basePayout = activeWorkspaceGig.payout;
        // Total earned represents simulated project
        const actualPayout = Math.round((basePayout * bonusMultiplier) * 100) / 100;

        setBalance(prev => prev + actualPayout);
        setEarnedThisMonth(prev => prev + actualPayout);
        
        // Upgrade gigs status
        setGigs(prev => prev.map(g => g.id === activeWorkspaceGig.id ? { ...g, status: 'completed' } : g));
        
        let msg = `Workspace build verified! Payout of $${actualPayout.toFixed(2)} credited straight into available balance.`;
        if (bonusMultiplier > 1) {
          msg += ` (Includes ${Math.round((bonusMultiplier - 1) * 100)}% Academy badge multiplier!)`;
        }
        setWorkspaceSuccessMessage(msg);
        setChallengeSubmitted(true);
        triggerToast('Workspace task passed with high distinction! Credited.', 'success');

        // Check if there is a badge to issue
        const finishedCount = gigs.filter(g => g.status === 'completed').length + 1;
        if (finishedCount === 1 && !userProfile.badges.includes('First Gig Master')) {
          setUserProfile(prev => ({
            ...prev,
            badges: [...prev.badges, 'First Gig Master']
          }));
          triggerToast('New Badge Unlocked: "First Gig Master" ⭐', 'info');
        }
      } else {
        triggerToast('Deliverable test cases failed. Review instructions and try again!', 'warning');
      }
    }, 1200);
  };

  // Academy course lesson and quizzes
  const handleLaunchLesson = (course: Course) => {
    setActiveLessonCourse(course);
    setActiveLessonIndex(0);
    setAcademyQuizSelection(null);
    setAcademySuccess(false);
  };

  const handleSubmitAcademyQuiz = () => {
    if (academyQuizSelection === null || !activeLessonCourse) {
      triggerToast('Select an choice first!', 'warning');
      return;
    }

    const currentQuiz = activeLessonCourse.lessons[activeLessonIndex].quiz;
    if (academyQuizSelection === currentQuiz.correctIndex) {
      setAcademySuccess(true);
      // set course progress to 100%
      setCourses(prev => prev.map(c => {
        if (c.id === activeLessonCourse.id) {
          const newProg = Math.min(100, Math.round(c.progress + 25));
          return { ...c, progress: newProg };
        }
        return c;
      }));
      
      triggerToast('Lesson micro-quiz cleared! Skills upgraded.+25% Course progress.', 'success');
      
      // Update profile badge if 100% completed
      const updatedCourse = courses.find(c => c.id === activeLessonCourse.id);
      if (updatedCourse && updatedCourse.progress >= 75) { // since it adds 25% and starts at 75% for AI prompt
        const badgeName = `${activeLessonCourse.title} Cert`;
        if (!userProfile.badges.includes(badgeName)) {
          setUserProfile(prev => ({
            ...prev,
            badges: [...prev.badges, badgeName]
          }));
          triggerToast(`New Certification Badge: "${badgeName}" 🎉`, 'success');
        }
      }
    } else {
      triggerToast('Incorrect concept. Re-read the training material below!', 'warning');
    }
  };

  // Save modified profile
  const handleSaveProfile = (e: FormEvent) => {
    e.preventDefault();
    if (!typedName.trim()) {
      triggerToast('Name is required.', 'warning');
      return;
    }
    const initials = typedName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    setUserProfile(prev => ({
      ...prev,
      name: typedName,
      major: typedMajor,
      level: typedLevel,
      initials: initials || 'JD'
    }));
    setIsEditingProfile(false);
    triggerToast('Student credentials updated successfully!', 'success');
  };

  const handleAddSkill = () => {
    if (!newSkillText.trim()) return;
    if (userProfile.skills.includes(newSkillText.trim())) {
      triggerToast('Skill already exists in your index.', 'info');
      return;
    }
    setUserProfile(prev => ({
      ...prev,
      skills: [...prev.skills, newSkillText.trim()]
    }));
    setNewSkillText('');
    triggerToast('New expertise skill index updated.', 'success');
  };

  const handleRemoveSkill = (skill: string) => {
    setUserProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  // Filter Gigs according to inputs
  const filteredGigs = gigs.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          g.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.employer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' ? true : g.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Calculate dynamic circular bar stroke math
  const progressPercent = Math.min(100, Math.round((earnedThisMonth / monthlyGoal) * 100));
  // Circumference of r=58 circle is 2 * Math.PI * 58 = 364.42px
  const strokeCircumference = 364.42;
  const strokeDashoffset = strokeCircumference - (progressPercent / 100) * strokeCircumference;

  // Simulate instant custom micro-task
  const runQuickSimulation = () => {
    setBalance(prev => prev + 50.00);
    setEarnedThisMonth(prev => prev + 50.00);
    triggerToast('Simulated instant bonus micro-task milestone: +$50.00!', 'success');
  };

  return (
    <div id="scholar-hustle-container" className="min-h-screen bg-slate-50 flex flex-col font-sans transition-colors duration-200">
      
      {/* Toast Alert Info */}
      {toast.visible && (
        <div id="toast" className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl transition-all duration-300 border ${
          toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
          toast.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          'bg-indigo-50 border-indigo-200 text-indigo-800'
        }`}>
          {toast.type === 'success' && <Check className="w-5 h-5 text-emerald-600 animate-bounce" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-600" />}
          {toast.type === 'info' && <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />}
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}

      {/* Primary Header Navigation representing ScholarHustle theme structure */}
      <header id="primary-nav" className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo Brand Segment */}
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className="flex items-center gap-3 group focus:outline-hidden"
              id="logo-button"
            >
              <div className="w-10 h-10 accent-gradient rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md transition-all group-hover:scale-110">
                S
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xl font-bold text-slate-900 tracking-tight leading-none">ScholarHustle</span>
                <span className="text-[10px] text-indigo-600 font-bold tracking-widest uppercase mt-1">Student Portal</span>
              </div>
            </button>

            {/* Navigation links targeting major app areas */}
            <nav id="desktop-links" className="hidden md:flex gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                id="tab-dashboard"
                onClick={() => setActiveTab('dashboard')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Dashboard
              </button>
              <button
                id="tab-find-gigs"
                onClick={() => setActiveTab('find-gigs')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'find-gigs'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Find Gigs
              </button>
              <button
                id="tab-academy"
                onClick={() => setActiveTab('academy')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === 'academy'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Academy
              </button>
              <button
                id="tab-my-gigs"
                onClick={() => setActiveTab('my-gigs')}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${
                  activeTab === 'my-gigs'
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                My Gigs
                {gigs.some(g => g.status === 'in-progress') && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>
            </nav>
          </div>

          {/* User Earnings & Quick Profile initials */}
          <div className="flex items-center gap-5" id="nav-profile-section">
            <div className="text-right flex flex-col justify-center">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Available Balance</div>
              <div className="text-lg font-black text-emerald-600 flex items-center gap-1 justify-end">
                <DollarSign className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{balance.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 group p-1 pr-3 rounded-full border border-slate-200 hover:border-indigo-300 transition-all ${activeTab === 'profile' ? 'bg-indigo-50 border-indigo-200' : 'bg-white'}`}
              id="avatar-trigger"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-50 border-2 border-indigo-200 overflow-hidden flex items-center justify-center text-indigo-700 font-bold text-sm tracking-tight capitalize group-hover:scale-105 transition-transform">
                {userProfile.initials}
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {userProfile.name}
                </div>
                <div className="text-[10px] text-slate-400 font-semibold">{userProfile.level}</div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container - Grid 12 Columns matching Design specs */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="dashboard-tab-grid">
            
            {/* COLUMN SPAN 8 - Main Dashboard list feed */}
            <section className="col-span-1 lg:col-span-8 space-y-8" id="dashboard-left-zone">
              
              {/* Slate Dark Accent Promo banner */}
              <div id="hero-promo-banner" className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-center shadow-xl border border-slate-800">
                <div className="relative z-10 max-w-lg">
                  <span className="bg-indigo-500/20 text-indigo-300 text-xs font-black tracking-widest uppercase px-3 py-1 rounded-full border border-indigo-500/30">
                    Syllabus to Side-Gig
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight mt-4 mb-3">
                    Turn your degree into<br />
                    <span className="text-indigo-400 bg-clip-text">digital dollars.</span>
                  </h1>
                  <p className="text-slate-300 text-sm sm:text-base mb-6 leading-relaxed">
                    Top students are earning an average of <strong className="text-white font-bold">$650/month</strong> peer tutoring and completing software integration tasks between classes.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setActiveTab('find-gigs')}
                      className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-6 py-3 rounded-xl text-sm font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                      Browse High-Pay Gigs
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsPostModalOpen(true)}
                      className="bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 px-5 py-3 rounded-xl text-sm font-bold transition-all border border-slate-700 flex items-center gap-2"
                    >
                      Post Peer Request
                    </button>
                  </div>
                </div>
                {/* Visual Ambient Circles */}
                <div className="absolute top-[-30px] right-[-30px] w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-[-35px] left-[50%] w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
              </div>

              {/* Recommended feed and quick action pills */}
              <div className="space-y-6" id="gigs-recommended-area">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recommended for your skills</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Custom listings matching your academic achievements</p>
                  </div>
                  <button
                    onClick={() => { setActiveTab('find-gigs'); setSelectedCategory('all'); }}
                    className="text-indigo-600 text-sm font-bold hover:underline flex items-center gap-1 shrink-0"
                  >
                    View all {gigs.length} gigs
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Categories quick pill switchboard */}
                <div className="flex flex-wrap gap-2" id="category-pills">
                  {(['all', 'tutoring', 'development', 'design', 'writing'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize transition-all border ${
                        selectedCategory === cat
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {cat === 'all' ? 'All Focus areas' : cat}
                    </button>
                  ))}
                </div>

                {/* Render limited list for dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5" id="gigs-dashboard-grid">
                  {filteredGigs.slice(0, 4).map(gig => (
                    <div
                      key={gig.id}
                      className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition-all flex flex-col justify-between card-shadow group relative"
                    >
                      {/* Completion check tag overlay */}
                      {gig.status === 'completed' && (
                        <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-emerald-200">
                          <Check className="w-3 h-3 text-emerald-600" /> Completed
                        </span>
                      )}

                      {gig.status === 'in-progress' && (
                        <span className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600 animate-spin" /> Working
                        </span>
                      )}

                      <div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md uppercase tracking-wide border ${
                            gig.category === 'tutoring' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                            gig.category === 'development' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                            gig.category === 'design' ? 'bg-rose-50 text-rose-700 border-rose-150' :
                            'bg-amber-50 text-amber-700 border-amber-150'
                          }`}>
                            {gig.category}
                          </span>
                          
                          {gig.status === 'available' && (
                            <span className="text-xl font-black text-slate-800 tracking-tight">
                              ${gig.payout}
                              <span className="text-xs font-normal text-slate-400">
                                /{gig.payoutType === 'hr' ? 'hr' : 'total'}
                              </span>
                            </span>
                          )}
                        </div>

                        <h3 className="font-bold text-slate-950 text-lg mb-1 leading-snug group-hover:text-indigo-600 transition-colors">
                          {gig.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-semibold mb-2">Posted by {gig.employer}</p>
                        <p className="text-xs text-slate-500 mb-5 leading-relaxed line-clamp-2">
                          {gig.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-auto">
                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-450" />
                            {gig.durationLabel}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-450" />
                            {gig.slotsLabel}
                          </span>
                        </div>

                        {gig.status === 'available' ? (
                          <button
                            onClick={() => handleApplyGig(gig)}
                            className="bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white text-indigo-600 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1"
                          >
                            Claim Task
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        ) : gig.status === 'in-progress' ? (
                          <button
                            onClick={() => { setActiveWorkspaceGig(gig); setActiveTab('my-gigs'); }}
                            className="bg-amber-100 text-amber-900 hover:bg-amber-200 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                          >
                            Open Workspace
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle className="w-4 h-4" /> Earned
                          </span>
                        )}
                      </div>
                    </div>
                  ))}

                  {filteredGigs.length === 0 && (
                    <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center col-span-2">
                      <GraduationCap className="w-12 h-12 text-slate-350 mx-auto mb-3" />
                      <h4 className="font-bold text-slate-800">No gigs match selected filter</h4>
                      <p className="text-xs text-slate-450 mt-1">Try selecting an alternative focus area or reset search values.</p>
                      <button 
                        onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                        className="mt-4 text-indigo-600 font-bold text-xs hover:underline"
                      >
                        Reset All Filters
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* COLUMN SPAN 4 - Sidebar featuring Goals and Academy modules */}
            <aside className="col-span-1 lg:col-span-4 space-y-6" id="dashboard-right-zone">
              
              {/* Radial Progress Earnings Wheel Card */}
              <div id="earnings-goal-card" className="bg-white rounded-3xl p-6 border border-slate-200 card-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-extrabold text-slate-900 text-base">Earnings Progress</h3>
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                    Goal Tracker
                  </span>
                </div>
                
                <div className="flex flex-col items-center py-4">
                  
                  {/* Circle SVG */}
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="58" 
                        stroke="#f1f5f9" 
                        strokeWidth="8" 
                        fill="transparent" 
                      />
                      <circle 
                        cx="72" 
                        cy="72" 
                        r="58" 
                        stroke="#4f46e5" 
                        strokeWidth="8" 
                        fill="transparent" 
                        strokeDasharray={strokeCircumference} 
                        strokeDashoffset={strokeDashoffset} 
                        strokeLinecap="round"
                        className="transition-all duration-700 ease-out"
                      />
                    </svg>

                    {/* Centered label */}
                    <div className="absolute text-center flex flex-col items-center justify-center">
                      <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">
                        {progressPercent}%
                      </div>
                      <div className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                        Of Monthly Goal
                      </div>
                    </div>
                  </div>

                  {/* Quantitative Stats */}
                  <div className="mt-6 w-full space-y-3.5 border-t border-slate-100 pt-5">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <DollarSign className="w-4 h-4 text-slate-400" /> Current Earned
                      </span>
                      <span className="font-bold text-slate-900">${earnedThisMonth.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-medium flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-slate-400" /> Target Goal
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 font-bold">$</span>
                        <input
                          type="number"
                          value={monthlyGoal}
                          onChange={(e) => setMonthlyGoal(Math.max(1, parseInt(e.target.value) || 0))}
                          className="w-18 bg-slate-50 border border-slate-200 focus:border-indigo-500 text-slate-800 text-right font-bold py-0.5 px-1.5 rounded-md focus:outline-hidden"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Simulator button panel to show reactive calculation */}
                  <div className="w-full mt-4 p-3 bg-slate-50 rounded-2xl flex items-center justify-between gap-3 border border-slate-200/60">
                    <div className="text-[10px] text-slate-400 font-bold shrink-0">Demo Console:</div>
                    <button
                      onClick={runQuickSimulation}
                      className="text-[10px] bg-slate-900 text-white font-bold hover:bg-slate-800 px-3 py-1.5 rounded-lg tracking-wide shadow-xs active:scale-95 transition-all"
                    >
                      Simulate +$50 Earned
                    </button>
                  </div>
                </div>
              </div>

              {/* Learning paths card */}
              <div id="academy-sidebar-card" className="bg-white rounded-3xl p-6 border border-slate-200 card-shadow flex-1">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-extrabold text-slate-900 text-base">Learning Paths</h3>
                  <Award className="w-4 h-4 text-yellow-500" />
                </div>

                <div className="space-y-4">
                  {courses.map(course => (
                    <div 
                      key={course.id}
                      onClick={() => { handleLaunchLesson(course); setActiveTab('academy'); }}
                      className="p-3 bg-slate-50 hover:bg-indigo-50/50 rounded-2xl border border-slate-105 hover:border-indigo-150 flex items-center gap-3.5 cursor-pointer group transition-all"
                    >
                      <div className={`w-10 h-10 ${course.iconBg} rounded-xl flex items-center justify-center font-bold text-xs font-mono group-hover:scale-105 transition-transform shrink-0`}>
                        {course.code}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                          {course.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-indigo-650 rounded-full" 
                              style={{ width: `${course.progress}%` }}
                            />
                          </div>
                          <span className="text-[9px] text-slate-400 font-bold">{course.progress}%</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setActiveTab('academy')}
                  className="w-full mt-6 py-2.5 border-2 border-slate-100 hover:border-slate-200 text-slate-500 hover:text-indigo-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all active:scale-98"
                >
                  Browse Academy Courses
                </button>
              </div>
            </aside>
          </div>
        )}

        {/* VIEW 2: ALL RECOMMENDATIONS / GIG FINDER */}
        {activeTab === 'find-gigs' && (
          <div className="space-y-8" id="find-gigs-tab">
            <div className="bg-indigo-900 text-white rounded-3xl p-8 relative overflow-hidden shadow-xl" id="search-banner">
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-2xl sm:text-3xl font-black mb-2 tracking-tight">Gig Blackboard</h2>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  Snoop on-campus and remote peer tasks. Complete them immediately inside your sandbox to pocket cash. Use the controls below to build custom task files.
                </p>

                {/* Integrated Search Controller bar */}
                <div className="relative" id="feed-search">
                  <Search className="absolute left-4 top-3.5 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by title, skills (Chemistry, React, Figma), or student clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white text-slate-800 placeholder-slate-400 pl-12 pr-4 py-3.5 rounded-2xl font-medium focus:outline-hidden focus:ring-2 focus:ring-indigo-500 shadow-lg text-sm"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-4 top-4 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="absolute right-[-40px] top-[-40px] w-64 h-64 bg-indigo-700/30 rounded-full blur-2xl" />
            </div>

            {/* Main view with Filters and listing Feed */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left filter side column */}
              <div className="col-span-1 lg:col-span-3 space-y-6">
                <div className="bg-white border border-slate-200 p-6 rounded-3xl card-shadow">
                  
                  <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Filter className="w-4 h-4 text-slate-400" /> Filter Criteria
                    </span>
                    {(selectedCategory !== 'all' || searchQuery) && (
                      <button
                        onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                        className="text-[10px] text-indigo-600 font-bold hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] uppercase font-black tracking-widest text-slate-400 mb-2">Category</label>
                      <div className="flex flex-col gap-1.5">
                        {([
                          { id: 'all', label: 'All Fields' },
                          { id: 'tutoring', label: 'Peer Tutoring' },
                          { id: 'development', label: 'Development' },
                          { id: 'design', label: 'UI/UX Design' },
                          { id: 'writing', label: 'Writing & Editorial' }
                        ] as const).map(op => (
                          <button
                            key={op.id}
                            onClick={() => setSelectedCategory(op.id)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between ${
                              selectedCategory === op.id
                                ? 'bg-indigo-50 text-indigo-700 font-bold'
                                : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span>{op.label}</span>
                            {selectedCategory === op.id && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                      <div className="bg-indigo-50 rounded-2xl p-4 text-indigo-950 text-xs">
                        <div className="flex items-center gap-1.5 font-bold mb-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                          <span>Student Benefit</span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-indigo-800">
                          Clear micro-courses inside the Academy to unlock payouts multipliers across matches.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA - Post custom Peer request */}
                <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-850 shadow-md">
                  <h4 className="font-bold text-sm mb-2">Need project help?</h4>
                  <p className="text-[11px] text-slate-450 leading-relaxed mb-4">
                    Got an assignment question or a design asset block? Post a peer request listing for classmates.
                  </p>
                  <button
                    onClick={() => setIsPostModalOpen(true)}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 py-2.5 rounded-xl text-xs font-bold transition-all text-white flex items-center justify-center gap-1 shadow-md active:scale-95"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Create a Gig</span>
                  </button>
                </div>
              </div>

              {/* Gigs List main board */}
              <div className="col-span-1 lg:col-span-9 space-y-5">
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 card-shadow text-xs">
                  <span className="text-slate-500 font-semibold">Matched Gigs: ({filteredGigs.length}) listings</span>
                  <span className="text-slate-400 font-medium">Auto-renewing daily</span>
                </div>

                {filteredGigs.map(gig => (
                  <div
                    key={gig.id}
                    className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-400 hover:shadow-lg transition-all card-shadow flex flex-col md:flex-row gap-5 justify-between group relative"
                  >
                    {/* Completion indicators */}
                    {gig.status === 'completed' && (
                      <span className="absolute top-4 right-4 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <Check className="w-3 h-3 text-emerald-600" /> Completed & Verified
                      </span>
                    )}
                    {gig.status === 'in-progress' && (
                      <span className="absolute top-4 right-4 bg-amber-100 text-amber-850 text-[10px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
                        <Clock className="w-3 h-3 text-amber-600 animate-spin" /> In Progress Workspace
                      </span>
                    )}

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wide border ${
                          gig.category === 'tutoring' ? 'bg-emerald-50 text-emerald-700 border-emerald-150' :
                          gig.category === 'development' ? 'bg-indigo-50 text-indigo-700 border-indigo-150' :
                          gig.category === 'design' ? 'bg-rose-50 text-rose-700 border-rose-150' :
                          'bg-amber-50 text-amber-700 border-amber-150'
                        }`}>
                          {gig.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-xs text-slate-400 font-bold">Employer: {gig.employer}</span>
                        <span className="text-slate-300">•</span>
                        <span className="bg-slate-105 text-slate-650 text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide border border-slate-200">
                          {gig.difficulty}
                        </span>
                      </div>

                      <h3 className="text-xl font-extrabold text-slate-950 group-hover:text-indigo-600 transition-colors">
                        {gig.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 leading-relaxed max-w-2xl">
                        {gig.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1 font-semibold">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {gig.durationLabel}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><UserCheck className="w-3.5 h-3.5" /> {gig.slotsLabel}</span>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between items-end md:border-l md:border-slate-100 md:pl-6 shrink-0 pt-4 md:pt-0">
                      <div className="text-right w-full md:w-auto mb-3 md:mb-0">
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Rate Payout</div>
                        <div className="text-2xl font-black text-slate-900 mt-1">
                          ${gig.payout}
                          <span className="text-sm font-normal text-slate-400">/{gig.payoutType === 'hr' ? 'hr' : 'total'}</span>
                        </div>
                      </div>

                      {gig.status === 'available' ? (
                        <button
                          onClick={() => handleApplyGig(gig)}
                          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-1"
                        >
                          Claim Active Gig
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ) : gig.status === 'in-progress' ? (
                        <button
                          onClick={() => { setActiveWorkspaceGig(gig); setActiveTab('my-gigs'); }}
                          className="w-full md:w-auto bg-amber-100 text-amber-900 hover:bg-amber-200 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Workspace Console
                        </button>
                      ) : (
                        <div className="bg-emerald-50 text-emerald-800 text-xs px-3.5 py-1.5 rounded-lg font-bold border border-emerald-150 flex items-center gap-1">
                          <Check className="w-4 h-4 text-emerald-600" /> Deliverable Success
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {filteredGigs.length === 0 && (
                  <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center card-shadow">
                    <Search className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-extrabold text-slate-900 text-lg">No gigs match selection queries</h3>
                    <p className="text-sm text-slate-400 mt-1">Try resetting search keywords or selecting all criteria fields.</p>
                    <button
                      onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
                      className="mt-6 bg-indigo-50 text-indigo-600 font-bold px-5 py-2 rounded-xl text-xs hover:bg-indigo-100 transition-colors"
                    >
                      Reset Filter Board
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: IN-PROGRESS WORKSPACE (MY GIGS) */}
        {activeTab === 'my-gigs' && (
          <div className="space-y-8" id="my-gigs-tab">
            
            <div className="bg-white p-6 rounded-3xl border border-slate-200 card-shadow">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Student Digital Workspace</h2>
              <p className="text-xs text-slate-400 mt-1">
                You work in real-time. Code compiler, design wireframe validators, and Peer essay proofing rooms are integrated. Complete tasks here to claim balance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Active list section Left */}
              <div className="col-span-1 lg:col-span-4 space-y-4">
                <h3 className="font-bold text-slate-900 text-sm">Active Assignments</h3>
                
                {gigs.filter(g => g.status === 'in-progress').map(active => (
                  <button
                    key={active.id}
                    onClick={() => {
                      setActiveWorkspaceGig(active);
                      setWorkspaceAnswerIndex(null);
                      setWorkspaceSuccessMessage(null);
                      setChallengeSubmitted(false);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex justify-between items-center group ${
                      activeWorkspaceGig?.id === active.id 
                        ? 'bg-indigo-50/60 border-indigo-200 shadow-sm' 
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <span className="text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm tracking-widest border border-indigo-100">
                        {active.category}
                      </span>
                      <h4 className="font-bold text-slate-900 text-sm truncate mt-2 group-hover:text-indigo-600 transition-colors">{active.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-1">Payout: ${active.payout} {active.payoutType === 'hr' ? '/hr' : 'total'}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-indigo-500 transition-transform group-hover:translate-x-0.5" />
                  </button>
                ))}

                {/* Show completed list */}
                <h3 className="font-bold text-slate-900 text-sm pt-4">History Archives</h3>
                {gigs.filter(g => g.status === 'completed').map(comp => (
                  <div key={comp.id} className="bg-white p-4 rounded-2xl border border-slate-200 flex justify-between items-center gap-3">
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-700 text-xs truncate">{comp.title}</h4>
                      <p className="text-[10px] text-emerald-600 font-bold mt-0.5 flex items-center gap-0.5">
                        <Check className="w-3 h-3 text-emerald-500" /> Payout Settled (${comp.payout})
                      </p>
                    </div>
                    <span className="bg-emerald-50 border border-emerald-150 rounded-full w-6 h-6 flex items-center justify-center text-emerald-600 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </div>
                ))}

                {gigs.filter(g => g.status === 'in-progress' || g.status === 'completed').length === 0 && (
                  <div className="bg-slate-100 p-8 rounded-2xl text-center text-slate-400 text-xs">
                    No historic or active records in your workspace yet. Claim a Recommended Task on the main feed!
                  </div>
                )}
              </div>

              {/* Console/Interactive sandbox right Column */}
              <div className="col-span-1 lg:col-span-8">
                {activeWorkspaceGig && activeWorkspaceGig.status === 'in-progress' ? (
                  <div className="bg-slate-900 text-slate-100 rounded-3xl overflow-hidden shadow-xl border border-slate-800" id="gig-workspace-frame">
                    
                    {/* Console Header Bar */}
                    <div className="bg-slate-800 px-6 py-4 flex items-center justify-between border-b border-slate-850">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5 shrink-0">
                          <span className="w-3 h-3 rounded-full bg-rose-500 block" />
                          <span className="w-3 h-3 rounded-full bg-amber-500 block" />
                          <span className="w-3 h-3 rounded-full bg-emerald-500 block" />
                        </div>
                        <span className="text-slate-400 font-bold text-xs font-mono ml-4">peer-sandbox v2.0-secure-run</span>
                      </div>
                      <div className="bg-indigo-900/40 text-indigo-300 font-mono text-[10px] uppercase font-black px-2.5 py-1 rounded-sm border border-indigo-500/30">
                        {activeWorkspaceGig.category} IDE
                      </div>
                    </div>

                    {/* Work details body */}
                    <div className="p-6 sm:p-8 space-y-6">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest text-indigo-400 font-bold uppercase">Sandbox Target Assignment:</span>
                        <h3 className="text-xl font-bold text-white mt-1">{activeWorkspaceGig.title}</h3>
                        <p className="text-slate-300 text-xs mt-2 leading-relaxed bg-slate-850 p-4 rounded-xl border border-slate-800">
                          {activeWorkspaceGig.description}
                        </p>
                      </div>

                      {/* WORKSPACE CASE 1: Peer Chemistry/Calculus/General Quiz (Tutoring) */}
                      {activeWorkspaceGig.quizQuestion && (
                        <div className="space-y-4">
                          <div className="bg-slate-850 p-4 rounded-xl text-xs font-mono border-l-4 border-indigo-500 border border-slate-800 text-slate-200">
                            <div className="font-bold text-indigo-300 mb-1">Student Query Mockboard:</div>
                            {activeWorkspaceGig.quizQuestion.question}
                          </div>

                          <div className="space-y-2">
                            {activeWorkspaceGig.quizQuestion.options.map((option, idx) => (
                              <button
                                key={idx}
                                disabled={challengeSubmitted}
                                onClick={() => setWorkspaceAnswerIndex(idx)}
                                className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                                  workspaceAnswerIndex === idx
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : challengeSubmitted 
                                      ? 'bg-slate-850 text-slate-500 border border-slate-800'
                                      : 'bg-slate-850 text-slate-350 hover:bg-slate-800 border border-slate-800'
                                }`}
                              >
                                <span className="bg-slate-800 text-slate-400 font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <span>{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* WORKSPACE CASE 2: Coding Sandbox Challenge (Development) */}
                      {activeWorkspaceGig.codeChallenge && (
                        <div className="space-y-4">
                          <div className="bg-slate-950 p-4 rounded-xl text-xs font-mono border border-slate-850">
                            <div className="font-bold text-amber-500 pb-2 mb-2 border-b border-slate-900">{activeWorkspaceGig.codeChallenge.task}</div>
                            <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">{activeWorkspaceGig.codeChallenge.buggyCode}</pre>
                          </div>

                          <div className="space-y-2">
                            {activeWorkspaceGig.codeChallenge.options.map((option, idx) => (
                              <button
                                key={idx}
                                disabled={challengeSubmitted}
                                onClick={() => setWorkspaceAnswerIndex(idx)}
                                className={`w-full text-left p-3.5 rounded-xl text-xs font-mono flex items-center gap-3 transition-all ${
                                  workspaceAnswerIndex === idx
                                    ? 'bg-indigo-600 text-white shadow-md'
                                    : challengeSubmitted
                                      ? 'bg-slate-850 text-slate-500 border border-slate-800'
                                      : 'bg-slate-850 text-emerald-400 hover:bg-slate-800 border border-slate-800'
                                }`}
                              >
                                <div className="bg-slate-800 text-slate-400 font-bold w-5 h-5 rounded-full flex items-center justify-center font-sans shrink-0">
                                  {idx + 1}
                                </div>
                                <span className="truncate">{option}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* WORKSPACE CASE 3: Design / General Creative validation (Gigs with neither) */}
                      {!activeWorkspaceGig.quizQuestion && !activeWorkspaceGig.codeChallenge && (
                        <div className="space-y-4">
                          <div className="bg-slate-850 p-6 rounded-xl text-center border border-slate-800">
                            <FileText className="w-12 h-12 text-indigo-400 mx-auto mb-3 animate-pulse" />
                            <h4 className="font-bold text-slate-200">Submit Portfolio Project / Document draft</h4>
                            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
                              This freelance creative segment triggers auto-compressive layout verification of Figma paths or writing outlines.
                            </p>
                          </div>

                          <button
                            disabled={challengeSubmitted}
                            onClick={() => setWorkspaceAnswerIndex(9)}
                            className={`w-full text-center py-4 rounded-xl text-xs font-bold border transition-all ${
                              workspaceAnswerIndex === 9
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                : 'bg-slate-800 text-slate-350 border-slate-700 hover:bg-slate-750'
                            }`}
                          >
                            {workspaceAnswerIndex === 9 ? '⭐ Document Attached - Ready to Compile' : '📎 Sim-Compile Student Document Package'}
                          </button>
                        </div>
                      )}

                      {/* Status / Success display logs */}
                      {workspaceSuccessMessage ? (
                        <div className="p-4 bg-emerald-900/60 text-emerald-100 rounded-xl text-xs font-medium border border-emerald-800 leading-relaxed flex items-start gap-2.5">
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-emerald-200">LINTER VERIFIED:</span> {workspaceSuccessMessage}
                            <div className="text-[10px] text-emerald-300 font-mono mt-1 pt-1 border-t border-emerald-800/40">Response code: 200 OK • Balance Transmitted.</div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-850 rounded-xl text-xs font-mono text-slate-400 border border-slate-800 flex items-center justify-between gap-3">
                          <span className="flex items-center gap-1.5"><Activity className="w-3.5 h-3.5 text-indigo-400" /> Host connection optimal.</span>
                          <span>Logs: Clean</span>
                        </div>
                      )}

                      {/* Core control trigger buttons */}
                      <div className="flex gap-3 justify-end pt-2 border-t border-slate-800">
                        <button
                          onClick={() => {
                            // Abandon task, return to feed
                            setGigs(prev => prev.map(g => g.id === activeWorkspaceGig.id ? { ...g, status: 'available' } : g));
                            setActiveWorkspaceGig(null);
                            triggerToast('Workspace session disbanded.', 'info');
                          }}
                          className="bg-slate-800 hover:bg-slate-755 text-slate-300 px-5 py-2.5 rounded-xl text-xs font-bold transition-all"
                        >
                          Disband Session
                        </button>
                        
                        {!challengeSubmitted && (
                          <button
                            onClick={handleVerifyWorkspaceChallenge}
                            disabled={isWorkspaceSubmitting || workspaceAnswerIndex === null}
                            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all text-white flex items-center gap-2 ${
                              workspaceAnswerIndex === null 
                                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-505 shadow-md active:scale-95'
                            }`}
                          >
                            {isWorkspaceSubmitting ? (
                              <>
                                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                Validating Tests...
                              </>
                            ) : (
                              'Push & Verify Build'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white border border-slate-200 p-12 rounded-3xl text-center card-shadow flex flex-col items-center justify-center min-h-[420px]" id="workspace-unoccupied-state">
                    <Code className="w-16 h-16 text-slate-300 mb-4 animate-bounce" />
                    <h3 className="font-extrabold text-slate-900 text-lg">No active workspace assigned</h3>
                    <p className="text-sm text-slate-400 mt-2 max-w-sm leading-relaxed">
                      Select an assignment on the recommended feed or left-side directory to boot the developer compile simulator.
                    </p>
                    <button
                      onClick={() => setActiveTab('find-gigs')}
                      className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl text-xs transition-transform shadow-md active:scale-95"
                    >
                      Browse Available Gigs
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: SCHOLARHUSTLE ACADEMY */}
        {activeTab === 'academy' && (
          <div className="space-y-8" id="academy-tab">
            
            {/* Header banner */}
            <div className="bg-white border border-slate-200 p-8 rounded-3xl card-shadow">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-indigo-600 shrink-0" />
                    <span>ScholarHustle Academy</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
                    Build your professional freelance toolset. Read essential guides, pass quick-fire micro quizzes, and claim verified multiplier cert badges.
                  </p>
                </div>
                
                {/* Score panel */}
                <div className="flex gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                  <div className="text-center px-4 border-r border-indigo-150">
                    <div className="text-xl font-bold text-slate-800">{courses.filter(c => c.progress === 100).length}</div>
                    <div className="text-[9px] text-slate-500 font-black uppercase mt-0.5 tracking-wider">Certs Issued</div>
                  </div>
                  <div className="text-center px-4">
                    <div className="text-xl font-bold text-indigo-600">
                      +{courses.filter(c => c.progress === 100).length * 5}%
                    </div>
                    <div className="text-[9px] text-slate-500 font-black uppercase mt-0.5 tracking-wider">Pay Multiplier</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Courses list block */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map(course => (
                <div 
                  key={course.id}
                  className="bg-white border border-slate-200 rounded-3xl overflow-hidden card-shadow flex flex-col justify-between hover:border-indigo-300 transition-all group"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-11 h-11 ${course.iconBg} rounded-xl flex items-center justify-center font-bold text-xs font-mono`}>
                        {course.code}
                      </div>

                      {course.progress === 100 ? (
                        <span className="bg-emerald-50 text-emerald-700 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-150 flex items-center gap-1.5 shadow-xs">
                          <Check className="w-3.5 h-3.5 text-emerald-600" /> Complete
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">Progress: {course.progress}%</span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 leading-snug mb-2 group-hover:text-indigo-600 transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-xs text-slate-500 leading-relaxed mb-6">
                      Covers key professional and technical requirements to safely fulfill {course.code} targets.
                    </p>

                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-indigo-650 rounded-full transition-all duration-500" 
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {course.lessons.length} Micro module
                    </span>
                    <button
                      onClick={() => handleLaunchLesson(course)}
                      className="bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-1.5 rounded-lg text-xs font-bold transition-transform active:scale-95"
                    >
                      {course.progress === 100 ? 'Review Cert' : course.progress > 0 ? 'Resume Lesson' : 'Launch course'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Dynamic Lesson Display Panel */}
            {activeLessonCourse && (
              <div id="active-lesson-shelf" className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <span className="text-[10px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-sm tracking-widest border border-indigo-100">
                      Active Portal Training
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 mt-2">{activeLessonCourse.title}</h3>
                  </div>
                  <button 
                    onClick={() => setActiveLessonCourse(null)}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-105"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Lesson detail card */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Lesson text content Left */}
                  <div className="space-y-4">
                    <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl">
                      <h4 className="font-extrabold text-slate-800 text-sm mb-2 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-indigo-500" />
                        <span>Lesson topic: {activeLessonCourse.lessons[activeLessonIndex].title}</span>
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeLessonCourse.lessons[activeLessonIndex].content}
                      </p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-2xl text-amber-900 text-xs">
                      <div className="font-bold mb-1 flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Micro-Certification Perks</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-amber-800">
                        Achieving 100% completion unlocks an permanent 5% pay increase multiplier for that focus segment!
                      </p>
                    </div>
                  </div>

                  {/* Lesson quiz Right */}
                  <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl relative">
                    <h4 className="font-bold text-slate-800 text-sm mb-4">Interactive Verification Quiz:</h4>
                    
                    <p className="text-xs text-slate-600 mb-4 bg-white p-4.5 rounded-xl border border-slate-150 font-medium leading-relaxed">
                      {activeLessonCourse.lessons[activeLessonIndex].quiz.question}
                    </p>

                    <div className="space-y-2.5">
                      {activeLessonCourse.lessons[activeLessonIndex].quiz.options.map((option, idx) => (
                        <button
                          key={idx}
                          disabled={academySuccess}
                          onClick={() => setAcademyQuizSelection(idx)}
                          className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                            academyQuizSelection === idx
                              ? 'bg-indigo-600 text-white'
                              : academySuccess
                                ? 'bg-white text-slate-400 border border-slate-100'
                                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                          }`}
                        >
                          <span className="bg-slate-100 text-slate-600 text-[10px] font-mono font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span>{option}</span>
                        </button>
                      ))}
                    </div>

                    {academySuccess ? (
                      <div className="mt-4 p-4.5 bg-emerald-50 text-emerald-800 border border-emerald-150 rounded-xl text-xs font-semibold leading-relaxed">
                        🎉 Correct answer! You have successfully mastered this core concept. Course tracking stats are updated.
                      </div>
                    ) : (
                      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-200">
                        <button
                          onClick={handleSubmitAcademyQuiz}
                          className="bg-indigo-650 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                        >
                          Submit verification
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 5: STUDENT PROFILE & BADGES */}
        {activeTab === 'profile' && (
          <div className="space-y-8" id="profile-tab">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Profile Card left */}
              <div className="col-span-1 lg:col-span-4 space-y-6">
                
                <div className="bg-white border border-slate-200 rounded-3xl p-6 text-center card-shadow relative">
                  
                  <div className="w-24 h-24 rounded-full bg-indigo-50 border-4 border-white shadow-md mx-auto overflow-hidden flex items-center justify-center text-indigo-700 font-black text-3xl capitalize">
                    {userProfile.initials}
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mt-4">{userProfile.name}</h3>
                  <p className="text-xs text-indigo-600 font-bold mt-1">Class Level: {userProfile.level}</p>
                  
                  <div className="mt-4 py-2.5 px-4 bg-slate-50 border border-slate-100 rounded-2xl text-[11px] text-slate-400 font-medium">
                    {userProfile.university} • Major:
                    <div className="text-xs font-bold text-slate-700 mt-1">{userProfile.major}</div>
                  </div>

                  <div className="border-t border-slate-100 pt-5 mt-6 grid grid-cols-2 gap-2 text-center">
                    <div className="p-3 bg-slate-50 border border-slate-105 rounded-2xl">
                      <div className="text-2xl font-black text-indigo-600">{gigs.filter(g => g.status === 'completed').length}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Completes</div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-105 rounded-2xl">
                      <div className="text-2xl font-black text-emerald-600">{userProfile.badges.length}</div>
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Accomplished</div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setIsEditingProfile(!isEditingProfile);
                      setTypedName(userProfile.name);
                      setTypedMajor(userProfile.major);
                      setTypedLevel(userProfile.level);
                    }}
                    className="w-full mt-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Edit Student Profile</span>
                  </button>
                </div>
              </div>

              {/* Editing details & skill badge index right columns */}
              <div className="col-span-1 lg:col-span-8 space-y-8">
                
                {/* Save forms */}
                {isEditingProfile && (
                  <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 card-shadow space-y-5">
                    <h3 className="font-extrabold text-slate-900 text-lg">Update Credentials</h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          value={typedName}
                          onChange={(e) => setTypedName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1.5">Class Year LeveL</label>
                        <select
                          value={typedLevel}
                          onChange={(e) => setTypedLevel(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                        >
                          <option>Freshman</option>
                          <option>Sophomore</option>
                          <option>Junior</option>
                          <option>Senior</option>
                          <option>Postgraduate</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-bold text-slate-400 mb-1.5">Academic Degree/Majors</label>
                      <input
                        type="text"
                        value={typedMajor}
                        onChange={(e) => setTypedMajor(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                        required
                      />
                    </div>

                    <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        Save Profiles
                      </button>
                    </div>
                  </form>
                )}

                {/* Skills configuration slot */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 card-shadow space-y-6">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-950">Expertise Skills Index</h3>
                    <p className="text-xs text-slate-400 mt-1">Representing skills matching recommended algorithms</p>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {userProfile.skills.map(skill => (
                      <span
                        key={skill}
                        className="bg-indigo-50/70 border border-indigo-150 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 group hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors cursor-pointer"
                        onClick={() => handleRemoveSkill(skill)}
                        title="Click to remove skill"
                      >
                        <span>{skill}</span>
                        <X className="w-3.5 h-3.5 text-indigo-400 group-hover:text-rose-500" />
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2.5 max-w-md pt-4 border-t border-slate-100">
                    <input
                      type="text"
                      placeholder="Add an expertise skill (e.g., Python, Marketing, Calculus...)"
                      value={newSkillText}
                      onChange={(e) => setNewSkillText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                      className="flex-1 bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-hidden"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="bg-slate-900 text-white hover:bg-slate-850 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 active:scale-95"
                    >
                      Add Skill
                    </button>
                  </div>
                </div>

                {/* Certificates / Badges layout */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 card-shadow space-y-4">
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-950">Accomplished Micro-Badges</h3>
                    <p className="text-xs text-slate-400 mt-1">Certifications validated through sandbox and courses clearance</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
                    {userProfile.badges.map((badge, index) => (
                      <div
                        key={index}
                        className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center gap-3.5"
                      >
                        <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-650 font-bold text-sm shrink-0 shadow-xs">
                          ⭐
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800">{badge}</div>
                          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">Verified Active Badge</div>
                        </div>
                      </div>
                    ))}
                    
                    {userProfile.badges.length === 0 && (
                      <div className="text-xs text-slate-400 p-8 text-center col-span-2">
                        No badge milestones registered yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-auto border-t border-slate-200 bg-white shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 py-4 sm:py-0">
          <div>
            &copy; 2026 ScholarHustle Inc. &bull; Designed under Professional Polish Theme &bull; Privacy Security Checked.
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200 font-semibold uppercase tracking-wider text-[10px]">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
              <span>{activeGigsTicker} Gigs live</span>
            </div>
            <div className="flex items-center gap-1">
              <span>System Status:</span>
              <span className="text-slate-500 font-bold uppercase">Optimal</span>
            </div>
          </div>
        </div>
      </footer>

      {/* DIALOG DRAWERS AND MODALS */}
      
      {/* POST GIG MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden my-8" id="post-gig-modal">
            
            {/* Header */}
            <div className="accent-gradient p-6 text-white flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold">Post a Peer Student Gig</h3>
                <p className="text-indigo-100 text-xs mt-1">Publish an assignment help or creative development task file</p>
              </div>
              <button 
                onClick={() => setIsPostModalOpen(false)}
                className="text-white hover:bg-white/10 p-2 rounded-full transition-colors focus:outline-hidden"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePostGig} className="p-6 sm:p-8 space-y-4">
              <div>
                <label className="block text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1.5">Gig Title</label>
                <input
                  type="text"
                  placeholder="e.g. Intro General Physics Electromagnetism Tutors"
                  value={newGigTitle}
                  onChange={(e) => setNewGigTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-hidden font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1.5">Target Category</label>
                  <select
                    value={newGigCategory}
                    onChange={(e) => setNewGigCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-hidden font-bold"
                  >
                    <option value="tutoring">Tutoring</option>
                    <option value="development">Development</option>
                    <option value="design">UI/UX Design</option>
                    <option value="writing">Writing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1.5">Job Difficulty</label>
                  <select
                    value={newGigDiff}
                    onChange={(e) => setNewGigDiff(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-hidden font-bold"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1.5">Payout Amount ($)</label>
                  <input
                    type="number"
                    value={newGigPayout}
                    onChange={(e) => setNewGigPayout(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-slate-800 focus:outline-hidden font-bold"
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1.5">Payout Mode</label>
                  <div className="flex gap-2.5 mt-1">
                    <button
                      type="button"
                      onClick={() => setNewGigPayoutType('hr')}
                      className={`flex-1 py-1.5 border rounded-xl font-bold text-xs transition-colors ${newGigPayoutType === 'hr' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-655 border-slate-200'}`}
                    >
                      Hourly
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewGigPayoutType('fixed')}
                      className={`flex-1 py-1.5 border rounded-xl font-bold text-xs transition-colors ${newGigPayoutType === 'fixed' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-655 border-slate-200'}`}
                    >
                      Fixed
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-1.5">Task Description & Requirements</label>
                <textarea
                  placeholder="Outline key steps student peer will configure in the sandbox to complete successfully..."
                  value={newGigDesc}
                  onChange={(e) => setNewGigDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-205 focus:border-indigo-500 rounded-xl px-4 py-3 text-xs text-slate-800 h-28 focus:outline-hidden leading-relaxed"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPostModalOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  Publish feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
