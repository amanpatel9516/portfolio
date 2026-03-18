/* ═══════════════════════════════════════════════════════════
   CHAT-AGENT.JS — AI assistant that knows EVERYTHING about Aman
   All real links, experience, education, and fun facts built-in
   ═══════════════════════════════════════════════════════════ */

(function () {
  const fab = document.getElementById('chat-fab');
  const fabIcon = document.getElementById('chat-fab-icon');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const input = document.getElementById('chat-input');
  const sendBtn = document.getElementById('chat-send');
  const messagesContainer = document.getElementById('chat-messages');
  const suggestionsContainer = document.getElementById('chat-suggestions');

  if (!fab || !panel) return;

  let isOpen = false;

  fab.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    fabIcon.className = isOpen ? 'fas fa-times chat-fab-icon' : 'fas fa-robot chat-fab-icon';
    if (isOpen) input.focus();
  });

  closeBtn.addEventListener('click', () => {
    isOpen = false;
    panel.classList.remove('open');
    fabIcon.className = 'fas fa-robot chat-fab-icon';
  });

  function sendMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    input.value = '';
    if (suggestionsContainer) suggestionsContainer.style.display = 'none';
    const typing = showTyping();
    setTimeout(() => {
      removeTyping(typing);
      addMessage(generateResponse(text), 'bot');
    }, 600 + Math.random() * 600);
  }

  sendBtn.addEventListener('click', () => sendMessage(input.value));
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') sendMessage(input.value); });
  document.querySelectorAll('.chat-suggestion').forEach(btn => {
    btn.addEventListener('click', () => sendMessage(btn.getAttribute('data-q')));
  });

  function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `chat-msg chat-msg--${type}`;
    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.innerHTML = type === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.textContent = text;
    msg.appendChild(avatar);
    msg.appendChild(bubble);
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function showTyping() {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg--bot';
    msg.innerHTML = '<div class="chat-msg-avatar"><i class="fas fa-robot"></i></div><div class="chat-msg-bubble chat-typing"><span></span><span></span><span></span></div>';
    messagesContainer.appendChild(msg);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return msg;
  }

  function removeTyping(el) { if (el && el.parentNode) el.parentNode.removeChild(el); }


  // ═══════════════════════════════════════════════════════
  // HARDCODED KNOWLEDGE — ALL OF AMAN'S REAL DATA
  // ═══════════════════════════════════════════════════════
  const K = {
    name: 'Aman Patel',
    title: 'AI & Machine Learning Engineer',
    summary: 'Computer Science student at LPU focused on Machine Learning and backend systems. Experienced in building real-world applications including a banking system and a crop recommendation model.',
    education: 'B.Tech in Computer Science at Lovely Professional University (LPU)',

    links: {
      github: 'https://github.com/amanpatel9516',
      linkedin: 'https://www.linkedin.com/in/amanpatellpu/',
      leetcode: 'https://leetcode.com/u/Aman_Patel142/',
      gfg: 'https://www.geeksforgeeks.org/profile/rampatel5byd',
      codechef: 'https://www.codechef.com/users/amanpatel107',
      instagram: 'https://www.instagram.com/aman_patel7722/',
      email: 'rampatel951664@gmail.com',
      phone: '+9516642814'
    },

    skills: {
      languages: 'Java, C++',
      core: 'DSA, OOP, DBMS, Operating Systems, Machine Learning',
      technologies: 'REST APIs, JWT Authentication, ML Models',
      tools: 'Git, GitHub, Postman, VS Code'
    },

    experience: [
      { role: 'AI Trainer', company: 'Outlier AI', link: 'https://outlier.ai/', desc: 'Contributed to training and improving ML models. Reviewed AI-generated outputs and improved data quality and model responses.' },
      { role: 'Freelance Developer', company: 'Independent', desc: 'Delivered real-world projects for clients. Built and deployed apps with clean scalable code.', clientLinks: ['https://publicnewsd.blogspot.com/', 'https://theanuppurnews.blogspot.com/'] },
      { role: 'Placement Committee Member', company: 'LPU', desc: 'Coordinated campus recruitment drives and managed communication between companies and students.' },
      { role: 'Event Host & Anchor', company: 'College Events', desc: 'Hosted multiple technical and cultural events.' }
    ],

    projects: [
      { name: 'Ace Bank Lite', type: 'Full-Stack Banking System', tech: 'Java, REST API, JWT, JDBC, MySQL', desc: 'Complete banking app with JWT auth, account management, deposit/withdraw/transfer, transaction history, audit logs.' }
    ],

    achievements: {
      dsa: '500+ problems solved (LeetCode, GFG, CodeChef)',
      gfg: '4★ GeeksForGeeks rating',
      codechef: '2★ CodeChef rating',
      certs: 'Java Programming — NPTEL',
      roles: '3+ leadership roles'
    },

    fun: [
      'Enjoys optimizing solutions even after they work',
      'Debugging feels like solving a puzzle',
      'Coffee + code = productivity',
      'while(success == false) { tryAgain(); }'
    ]
  };


  // ═══════════════════════════════════════════════════════
  // RESPONSE GENERATOR
  // ═══════════════════════════════════════════════════════
  function generateResponse(query) {
    const q = query.toLowerCase().trim();

    // Greetings
    if (/^(hi|hello|hey|hii+|hola|sup|yo|howdy|namaste)/i.test(q)) {
      return `Hey! 👋 I'm Aman's AI assistant. I know everything about him — skills, projects, experience, all his profile links, you name it! What would you like to know?`;
    }

    // Who / About
    if (m(q, ['who is', 'who are', 'about aman', 'introduce', 'tell me about', 'who is he', 'about him', 'about you'])) {
      return `${K.name} is an ${K.title}.\n\n${K.summary}\n\n🎓 ${K.education}`;
    }

    // GitHub
    if (m(q, ['github', 'git', 'repo', 'repository', 'source code', 'code link'])) {
      return `🔗 GitHub: ${K.links.github}\n\nYou'll find his projects there including Ace Bank Lite and more!`;
    }

    // LinkedIn
    if (m(q, ['linkedin', 'professional profile'])) {
      return `🔗 LinkedIn: ${K.links.linkedin}\n\nConnect with Aman there for professional networking!`;
    }

    // LeetCode
    if (m(q, ['leetcode', 'leet code', 'lc profile'])) {
      return `🔗 LeetCode: ${K.links.leetcode}\n\nHe practices DSA daily with 500+ problems solved across platforms!`;
    }

    // GFG
    if (m(q, ['geeksforgeeks', 'gfg', 'geeks for geeks'])) {
      return `🔗 GeeksForGeeks: ${K.links.gfg}\n\n4★ rating on GFG — strong problem-solving!`;
    }

    // CodeChef
    if (m(q, ['codechef', 'code chef'])) {
      return `🔗 CodeChef: ${K.links.codechef}\n\n2★ rating from competitive programming contests.`;
    }

    // Instagram
    if (m(q, ['instagram', 'insta', 'ig'])) {
      return `📸 Instagram: ${K.links.instagram}\n\nFollow Aman for the other side of his life — events, people, and more!`;
    }

    // Email
    if (m(q, ['email', 'mail', 'gmail'])) {
      return `📧 Email: ${K.links.email}\n\nFeel free to drop him a mail!`;
    }

    // Phone
    if (m(q, ['phone', 'number', 'call', 'mobile', 'whatsapp'])) {
      return `📞 Phone: ${K.links.phone}\n\nYou can call or WhatsApp him!`;
    }

    // Contact (general)
    if (m(q, ['contact', 'reach', 'connect', 'how to reach', 'how to contact'])) {
      return `📬 All ways to reach Aman:\n\n📧 Email: ${K.links.email}\n📞 Phone: ${K.links.phone}\n💻 GitHub: ${K.links.github}\n👔 LinkedIn: ${K.links.linkedin}\n📸 Instagram: ${K.links.instagram}\n💡 LeetCode: ${K.links.leetcode}\n📊 GFG: ${K.links.gfg}\n🏆 CodeChef: ${K.links.codechef}`;
    }

    // All links
    if (m(q, ['link', 'profile', 'social', 'all links', 'where can i find'])) {
      return `🔗 All of Aman's profiles:\n\n💻 GitHub: ${K.links.github}\n👔 LinkedIn: ${K.links.linkedin}\n💡 LeetCode: ${K.links.leetcode}\n📊 GFG: ${K.links.gfg}\n🏆 CodeChef: ${K.links.codechef}\n📸 Instagram: ${K.links.instagram}\n📧 Email: ${K.links.email}\n📞 Phone: ${K.links.phone}`;
    }

    // Skills
    if (m(q, ['skill', 'language', 'technology', 'tool', 'what can', 'tech stack', 'programming', 'what does he know'])) {
      return `Here's Aman's toolkit:\n\n🔤 Languages: ${K.skills.languages}\n📚 Core: ${K.skills.core}\n⚡ Tech: ${K.skills.technologies}\n🔧 Tools: ${K.skills.tools}`;
    }

    // Projects
    if (m(q, ['project', 'ace bank', 'banking', 'built', 'build', 'what has he made', 'application'])) {
      const p = K.projects[0];
      return `🚀 Featured: ${p.name}\n${p.type}\n\n${p.desc}\n\nTech: ${p.tech}\n\n🔗 GitHub: ${K.links.github}`;
    }

    // Experience - Outlier / AI Trainer
    if (m(q, ['outlier', 'ai trainer', 'training'])) {
      const e = K.experience[0];
      return `🤖 ${e.role} at ${e.company}\n🔗 ${e.link}\n\n${e.desc}`;
    }

    // Freelance
    if (m(q, ['freelance', 'client', 'freelancer'])) {
      const e = K.experience[1];
      return `💻 ${e.role}\n\n${e.desc}\n\nClient projects:\n🔗 ${e.clientLinks[0]}\n🔗 ${e.clientLinks[1]}`;
    }

    // Experience (general)
    if (m(q, ['experience', 'work', 'job', 'career', 'leadership', 'role', 'position'])) {
      const exp = K.experience.map(e => {
        let s = `• ${e.role} — ${e.company}`;
        if (e.link) s += ` (${e.link})`;
        return s;
      }).join('\n');
      return `Aman's Experience:\n\n${exp}\n\nThe Freelance work includes client projects — ask "freelance" for links!`;
    }

    // Achievements
    if (m(q, ['achievement', 'rating', 'problem', 'solved', 'competitive', 'stats', 'accomplishment', 'how many'])) {
      return `🏆 Achievements:\n\n• ${K.achievements.dsa}\n• ${K.achievements.gfg}\n• ${K.achievements.codechef}\n• Certified: ${K.achievements.certs}\n• ${K.achievements.roles}`;
    }

    // Certifications
    if (m(q, ['certification', 'certificate', 'nptel', 'certified', 'course'])) {
      return `📜 ${K.achievements.certs}\n\nDemonstrates strong Java & CS foundations.`;
    }

    // Education
    if (m(q, ['education', 'study', 'college', 'university', 'degree', 'student', 'school', 'lpu'])) {
      return `🎓 ${K.education}\n\nFocused on ML, backend development, and consistent DSA practice.`;
    }

    // Currently doing
    if (m(q, ['current', 'doing now', 'learning', 'working on', 'focus'])) {
      return `Currently:\n\n🏋️ Practicing DSA daily on LeetCode, GFG & CodeChef\n🤖 Working on ML projects & AI training at Outlier AI\n🌐 Building backend systems & freelance projects\n📚 Studying CS at LPU`;
    }

    // Why hire
    if (m(q, ['why hire', 'why should', 'strength', 'hire', 'recruit', 'why work'])) {
      return `Why Aman?\n\n✅ Real AI/ML experience at Outlier AI\n✅ 500+ DSA problems, competitive ratings\n✅ Production-grade projects (Ace Bank Lite)\n✅ Freelance track record with real clients\n✅ Strong communication — event hosting, placement committee\n✅ Fast learner, adapts quickly to new tech`;
    }

    // Resume
    if (m(q, ['resume', 'cv', 'download'])) {
      return `📄 Click "Download Resume" in the hero section at the top!\n\nFile: assets/resume.pdf`;
    }

    // Backend
    if (m(q, ['backend', 'api', 'rest', 'database', 'server', 'architecture'])) {
      return `Backend skills:\n\n• REST API design\n• JWT authentication\n• MySQL + JDBC database work\n• Modular, maintainable architecture\n• See Ace Bank Lite project for a full demo!`;
    }

    // ML / AI
    if (m(q, ['machine learning', 'ml', 'ai', 'artificial intelligence', 'model', 'crop'])) {
      return `AI & ML work:\n\n🤖 AI Trainer at Outlier AI — improving ML model accuracy\n🌾 Built a crop recommendation ML model\n📚 Studying ML as part of CS at LPU\n\nAman applies data-driven approaches to solve real-world problems!`;
    }

    // Java
    if (m(q, ['java'])) {
      return `Java is Aman's primary language!\n\n• NPTEL certified in Java\n• Built Ace Bank Lite entirely in Java\n• Uses Java for competitive programming\n• REST API + JDBC expertise`;
    }

    // DSA
    if (m(q, ['dsa', 'data structure', 'algorithm', 'competitive programming', 'cp'])) {
      return `DSA profile:\n\n• 500+ problems solved\n• 4★ GFG | 2★ CodeChef\n• Active on LeetCode daily\n• Arrays, trees, graphs, DP, greedy\n\n🔗 LeetCode: ${K.links.leetcode}\n🔗 GFG: ${K.links.gfg}`;
    }

    // Extra-curricular
    if (m(q, ['extra', 'hobby', 'beyond code', 'ngo', 'volunteer', 'sports', 'cultural'])) {
      return `Beyond coding:\n\n🎤 Event hosting & anchoring\n🤝 NGO & community work\n🏃 Sports & fitness\n🎭 Cultural festivals\n\nCheck the "Beyond the Code" gallery section!`;
    }

    // Portfolio / Website
    if (m(q, ['website', 'portfolio', 'this site', 'how was this'])) {
      return `This portfolio:\n\n• Pure HTML, CSS, JavaScript\n• Three.js 3D particle background\n• Matrix rain cinematic intro\n• AI chat agent (that's me! 🤖)\n• Warm amber/gold theme\n• Fully responsive & lightweight!`;
    }

    // Fun / Easter eggs
    if (m(q, ['fun', 'joke', 'funny', 'laugh', 'easter'])) {
      const funFact = K.fun[Math.floor(Math.random() * K.fun.length)];
      return `😄 Fun fact: ${funFact}\n\nWhy do programmers prefer dark mode? Because light attracts bugs! 🐛`;
    }

    // Thanks
    if (m(q, ['thanks', 'thank', 'cool', 'awesome', 'great', 'nice', 'good', 'got it', 'perfect', 'okay'])) {
      return `You're welcome! 😊 Ask anything else, or scroll down to Contact to reach Aman directly!`;
    }

    // Age
    if (m(q, ['age', 'old', 'born', 'birthday'])) {
      return `Aman is 20 years old.\n🔗 ${K.links.linkedin}`;
    }

    // Location
    if (m(q, ['location', 'where', 'city', 'country', 'based'])) {
      return `Aman is from Anuppur (M.P.) Which is Located at the centre of India.The Birth Place Of MAA - Narmada`;
    }

    // Favorites
    if (m(q, ['favorite', 'fav', 'best'])) {
      return `Aman's favorites:\n\n💻 Language: Java\n🧠 Topic: DSA + Machine Learning\n🏗️ Area: Backend + ML Systems\n🎯 Goal: Landing a great AI/ML or SDE role!`;
    }

    // Fallback
    return `Great question! Here's what I can help with:\n\n• "skills" — tech stack\n• "projects" — Ace Bank Lite\n• "experience" — AI Trainer, Freelance, etc.\n• "links" — all social profiles\n• "contact" — email, phone, socials\n• "achievements" — 500+ DSA, ratings\n• "outlier" — AI training work\n• "freelance" — client projects\n• "fun" — easter eggs 😄\n\nOr ask anything specific!`;
  }

  function m(text, kws) { return kws.some(k => text.includes(k)); }

})();
