export type Project = {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    technologies: string[];
    owner: string;
    openPositions: number;
    timeCommitment: string;
    popularity: number;
    teamMembers: { name: string; role: string }[];
    timeline: string;
    learningObjectives: string[];
  };
  
export type TeamMember = {
    name: string;
    role: string;
  };

export const PROJECT_CATEGORIES = [
    "Artificial Intelligence",
    "Blockchain",
    "Web Development",
    "Mobile Development",
    "Data Science",
    "IoT",
    "Cybersecurity",
    "Game Development"
  ];
  
export const PROJECT_STATUSES = [
    'Planning',
    'In Progress',
    'Completed',
    'On Hold',
  ];
  
export const TECHNOLOGIES = [
    "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Ruby on Rails",
    "ASP.NET", "TypeScript", "GraphQL", "React Native", "Flutter", "Swift", "Kotlin",
    "Xamarin", "Python", "R", "SQL", "Tableau", "Power BI", "Pandas", "NumPy",
    "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Unity", "Unreal Engine",
    "Godot", "Solidity", "Ethereum", "Hyperledger", "Arduino", "Raspberry Pi",
    "MQTT", "Wireshark", "Metasploit", "Nmap", "Kali Linux", "AWS", "Azure",
    "Google Cloud", "Docker", "Kubernetes"
  ];
  
export const TIME_COMMITMENTS = [
    'Less than 5 hours/week',
    '5-10 hours/week',
    '10-20 hours/week',
    '20+ hours/week',
  ];