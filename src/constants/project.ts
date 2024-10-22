export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  technologies: string[];
  openPositions: number;
  timeCommitment: string;
  popularity: number;
  timeline: string;
  learningObjectives: string[];
  createdAt: string;
  updatedAt: string;
}
  
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
  'PLANNING',
  'IN_PROGRESS',
  'COMPLETED',
  'ON_HOLD',
];
  
export const TECHNOLOGIES = [
  "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Ruby on Rails",
  "ASP.NET", "TypeScript", "GraphQL", "React Native", "Flutter", "Swift", "Kotlin",
  "Xamarin", "Python", "R", "SQL", "Tableau", "Power BI", "Pandas", "NumPy",
  "TensorFlow", "PyTorch", "Scikit-learn", "Keras", "Unity", "Unreal Engine",
  "Godot", "Solidity", "Ethereum", "Hyperledger", "Arduino", "Raspberry Pi",
  "MQTT", "Wireshark", "Metasploit", "Nmap", "Kali Linux", "AWS", "Azure",
  "Google Cloud", "Docker", "Kubernetes",
  // Added languages:
  "JavaScript", "Java", "C++", "C#", "PHP", "Go", "Rust", "Ruby", "Scala",
  "Dart", "Objective-C", "Lua", "Haskell", "Perl", "Julia"
];
  
export const TIME_COMMITMENTS = [
    'Less than 5 hours/week',
    '5-10 hours/week',
    '10-20 hours/week',
    '20+ hours/week',
  ];
