import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  GitCommit, 
  ChevronDown, 
  Check, 
  Info, 
  Key, 
  Trash2, 
  Database, 
  Github, 
  Eye, 
  EyeOff, 
  Lock, 
  Shield, 
  Calendar, 
  Phone, 
  Mail, 
  User, 
  FileText,
  AlertCircle,
  Copy,
  Plus,
  ChevronLeft,
  ChevronRight,
  Settings,
  RefreshCw,
  PlusCircle,
  Building,
  Send,
  Terminal,
  Activity,
  GraduationCap,
  Layers,
  LayoutDashboard,
  BookOpen,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SquadUser } from './types';
import { USER_TYPES, ACCESS_LEVELS, TITLES, SEXES, INITIAL_USERS } from './data';

export default function App() {
  // Navigation State (Left Navigation Bar)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'view_org' | 'register' | 'directory' | 'gitsync' | 'configure' | 'institutions' | 'organization' | 'classes' | 'subjects'>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    const saved = localStorage.getItem('squad_sidebar_collapsed');
    return saved === 'true';
  });

  // Dynamic Classification Lists - loaded exclusively from database / schema
  const [userTypesList, setUserTypesList] = useState<{ id: string, label: string }[]>(() => {
    try {
      const saved = localStorage.getItem('squad_user_types');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const loaded = parsed.filter((ut: any) => ut && typeof ut === 'object' && ut.id && ut.label);
          if (loaded.length > 0) return loaded;
        }
      }
    } catch (e) {
      console.warn('Error loading squad_user_types:', e);
    }
    return [];
  });

  const [accessLevelsList, setAccessLevelsList] = useState<{ id: number, label: string }[]>(() => {
    // Force reset to new access levels (Level 1-6)
    localStorage.removeItem('squad_access_levels');
    return (ACCESS_LEVELS || []).filter(al => al && typeof al.id === 'number' && al.label);
  });

  const [titlesList, setTitlesList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('squad_titles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((title: any) => typeof title === 'string' && title.trim().length > 0);
        }
      }
    } catch (e) {
      console.warn('Error loading squad_titles:', e);
    }
    return TITLES || [];
  });
  const [remoteTitlesList, setRemoteTitlesList] = useState<string[]>([]);
  const [titlesLoading, setTitlesLoading] = useState<boolean>(false);

  const [sexesList, setSexesList] = useState<{ id: string, label: string }[]>(() => {
    try {
      const saved = localStorage.getItem('squad_sexes');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((s: any) => s && typeof s === 'object' && s.id && s.label);
        }
      }
    } catch (e) {
      console.warn('Error loading squad_sexes:', e);
    }
    return SEXES || [];
  });

  const [institutionsList, setInstitutionsList] = useState<{ id: string, name: string, is_active: string }[]>(() => {
    try {
      const saved = localStorage.getItem('squad_institutions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((inst: any) => inst && typeof inst === 'object' && inst.id && inst.name && inst.name !== 'Your Institute Name');
        }
      }
    } catch (e) {
      console.warn('Error loading squad_institutions:', e);
    }
    return [];
  });

  const [gradesList, setGradesList] = useState<{ id: string, grade: string }[]>(() => {
    try {
      const saved = localStorage.getItem('squad_grades');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((g: any) => g && typeof g === 'object' && g.id && g.grade);
        }
      }
    } catch (e) {
      console.warn('Error loading squad_grades:', e);
    }
    return [];
  });

  const [sectionsList, setSectionsList] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('squad_sections');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const filtered = parsed.filter((sec: any) => typeof sec === 'string' && sec.trim().length > 0 && !['A', 'B', 'C', 'D'].includes(sec.trim().toUpperCase()));
          if (filtered.length > 0) {
            return filtered;
          }
        }
      }
    } catch (e) {
      console.warn('Error loading squad_sections:', e);
    }
    return [];
  });
  const [remoteSectionsList, setRemoteSectionsList] = useState<string[]>([]);

  // Server state parameters
  const [serverVersion, setServerVersion] = useState<string>(() => {
    return localStorage.getItem('squad_server_version') || 'v1.0';
  });

  const [serverStatus, setServerStatus] = useState<'online' | 'maintenance' | 'offline'>(() => {
    return (localStorage.getItem('squad_server_status') as any) || 'online';
  });


  // Clear stale data from localStorage on first load (only titles and grades)
  useEffect(() => {
    localStorage.removeItem('squad_titles');
    localStorage.removeItem('squad_grades');
    // Note: NOT clearing squad_user_types here - backend is source of truth
  }, []);

    // Synchronize dynamic parameters to localStorage
  useEffect(() => {
    if (userTypesList.length > 0) {
      localStorage.setItem('squad_user_types', JSON.stringify(userTypesList));
    }
  }, [userTypesList]);

  useEffect(() => {
    localStorage.setItem('squad_access_levels', JSON.stringify(accessLevelsList));
  }, [accessLevelsList]);

  useEffect(() => {
    localStorage.setItem('squad_titles', JSON.stringify(titlesList));
  }, [titlesList]);

  useEffect(() => {
    localStorage.setItem('squad_sexes', JSON.stringify(sexesList));
  }, [sexesList]);

  useEffect(() => {
    localStorage.setItem('squad_institutions', JSON.stringify(institutionsList));
  }, [institutionsList]);

  useEffect(() => {
    localStorage.setItem('squad_grades', JSON.stringify(gradesList));
  }, [gradesList]);

  useEffect(() => {
    localStorage.setItem('squad_sections', JSON.stringify(sectionsList));
  }, [sectionsList]);

  useEffect(() => {
    localStorage.setItem('squad_server_version', serverVersion);
  }, [serverVersion]);

  useEffect(() => {
    localStorage.setItem('squad_server_status', serverStatus);
  }, [serverStatus]);

  // Toggle helper
  const toggleSidebar = () => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('squad_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Directory & Form state
  const [users, setUsers] = useState<SquadUser[]>(() => {
    const saved = localStorage.getItem('squad_portal_users');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((u: SquadUser) => {
            if (!u || !u.first_name) return true;
            const fName = u.first_name.toLowerCase();
            return fName !== 'jenish' && fName !== 'elena' && fName !== 'marcus';
          });
        }
      } catch (e) {
        console.warn('Error loading users:', e);
      }
    }
    return INITIAL_USERS;
  });

  // State for active JSON payload view in the directory
  const [selectedUserJson, setSelectedUserJson] = useState<string | null>(null);

  // Filters for Registered Directory
  const [directoryOrgFilter, setDirectoryOrgFilter] = useState<string>('');
  const [directoryRoleFilter, setDirectoryRoleFilter] = useState<string>('');

  // Form Fields State (Precisely the 13 parameters)
  const [userTypeId, setUserTypeId] = useState<string>(() => {
    return userTypesList.length > 0 ? userTypesList[0].id : '';
  });

  // Keep userTypeId in sync with userTypesList options to prevent fallback discrepancies
  useEffect(() => {
    if (userTypesList.length > 0) {
      const hasCurrent = userTypesList.some(ut => ut.id === userTypeId || ut.label === userTypeId);
      if (!hasCurrent) {
        setUserTypeId(userTypesList[0].id);
      }
    }
  }, [userTypesList, userTypeId]);
  const [nic, setNic] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [passport, setPassport] = useState<string>('');
  const [titleId, setTitleId] = useState<string>('Mr');
  const [firstName, setFirstName] = useState<string>('');
  const [middleName, setMiddleName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [sex, setSex] = useState<string>('male');
  const [dob, setDob] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [accessLevelId, setAccessLevelId] = useState<number>(4);
  const [organizationId, setOrganizationId] = useState<string>('');
  const [remoteOrganizations, setRemoteOrganizations] = useState<{ _id: string, name: string }[]>([]);
  const [selectedViewOrgId, setSelectedViewOrgId] = useState<string>('');
  const [orgsLoading, setOrgsLoading] = useState<boolean>(false);
  const [mOrgsLoading, setMOrgsLoading] = useState<boolean>(false);

  // Auxiliary UI States
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Git Sync Simulator States
  const [gitRepo, setGitRepo] = useState('https://github.com/jacksonmongbam123/SQUAD.git');
  const [gitBranch, setGitBranch] = useState('main');
  const [gitToken, setGitToken] = useState(() => localStorage.getItem('squad_git_token') || (import.meta as any).env.VITE_GIT_TOKEN || '');
  const [commitMessage, setCommitMessage] = useState('feat: Add institution and grade configuration with real-time HTTP POST integration');
  const [isPushing, setIsPushing] = useState(false);
  const [pushLogs, setPushLogs] = useState<string[]>([]);
  const [pushSuccess, setPushSuccess] = useState(false);

  // ABMS API token — stored from login, used for authenticated delete operations
  const [abmsToken, setAbmsToken] = useState<string>(() => localStorage.getItem('squad_abms_token') || '');
  const [abmsUsername, setAbmsUsername] = useState('');
  const [abmsPassword, setAbmsPassword] = useState('');
  const [abmsLoginError, setAbmsLoginError] = useState('');
  const [abmsLoginLoading, setAbmsLoginLoading] = useState(false);
  const [showAbmsLogin, setShowAbmsLogin] = useState(false);
  // Store pending delete id while waiting for login
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  // Custom dialog overlays to replace iframe-blocked confirm/alert
  const [customConfirm, setCustomConfirm] = useState<{
    show: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
  } | null>(null);

  const [customAlert, setCustomAlert] = useState<{
    show: boolean;
    title: string;
    message: string;
    type?: 'info' | 'error' | 'success';
  } | null>(null);

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setCustomConfirm({
      show: true,
      title,
      message,
      onConfirm: () => {
        setCustomConfirm(null);
        onConfirm();
      },
      onCancel: () => {
        setCustomConfirm(null);
      }
    });
  };

  const showAlert = (title: string, message: string, type: 'info' | 'error' | 'success' = 'info') => {
    setCustomAlert({
      show: true,
      title,
      message,
      type
    });
  };

  useEffect(() => {
    localStorage.setItem('squad_abms_token', abmsToken);
  }, [abmsToken]);

  const handleAbmsLogin = async () => {
    if (!abmsUsername || !abmsPassword) return;
    setAbmsLoginLoading(true);
    setAbmsLoginError('');
    try {
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ username: abmsUsername, password: abmsPassword })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        setAbmsToken(data.token);
        setShowAbmsLogin(false);
        setAbmsUsername('');
        setAbmsPassword('');
        // Retry the pending delete if any
        if (pendingDeleteId) {
          const pid = pendingDeleteId;
          setPendingDeleteId(null);
          setTimeout(() => handleDelete(pid, data.token), 100);
        }
      } else {
        setAbmsLoginError(data.message || 'Login failed');
      }
    } catch (err: any) {
      setAbmsLoginError(err.message || 'Network error');
    } finally {
      setAbmsLoginLoading(false);
    }
  };

  useEffect(() => {
    localStorage.setItem('squad_git_token', gitToken);
  }, [gitToken]);

  // Fetch organizations from ABMS backend on mount and sync into institutionsList
  useEffect(() => {
    const fetchOrgs = async () => {
      setOrgsLoading(true);
      try {
        const res = await fetch('/df/institute/all');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setRemoteOrganizations(data);
            // Sync backend institutions into institutionsList so they survive restarts
            setInstitutionsList(prev => {
              const merged = Array.isArray(prev) ? prev.filter(inst => inst && inst.id && inst.name) : [];
              data.forEach((org: { _id: string; name: string; is_active?: string }) => {
                if (org && org.name) {
                  const exists = merged.some(inst => inst && inst.name && inst.name.toLowerCase() === org.name.toLowerCase());
                  if (!exists) {
                    merged.push({ id: org._id || 'inst_' + Date.now(), name: org.name, is_active: org.is_active || 'true' });
                  }
                }
              });
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch organizations from backend:', err);
      } finally {
        setOrgsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  // Fetch titles from ABMS backend on mount and sync with local state
  useEffect(() => {
    const fetchTitles = async () => {
      setTitlesLoading(true);
      try {
        const res = await fetch('/df/title/all');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const titles = data
              .map((t: any) => {
                if (typeof t === 'string') return t;
                return t ? t.title : null;
              })
              .filter((t): t is string => typeof t === 'string' && t.trim().length > 0);
            setRemoteTitlesList(titles);
            // Sync titlesList with backend: use remote titles as source of truth,
            // keeping any locally-added titles that aren't in the remote list yet
            setTitlesList(prev => {
              const localOnly = (prev || []).filter(t => typeof t === 'string' && t && !titles.includes(t));
              const merged = [...titles, ...localOnly];
              localStorage.setItem('squad_titles', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch titles from backend:', err);
      } finally {
        setTitlesLoading(false);
      }
    };
    fetchTitles();
  }, []);

  // Fetch grades and user types from ABMS backend on mount and sync with local state
  useEffect(() => {
    const fetchGradesAndUserTypes = async () => {
      try {
        // Fetch grades
        const gradesRes = await fetch('/df/grade/all');
        if (gradesRes.ok) {
          const gradesData = await gradesRes.json();
          if (Array.isArray(gradesData) && gradesData.length > 0) {
            const remoteGrades = gradesData
              .map((g: any) => {
                if (typeof g === 'string') return { id: 'grade_' + Math.random().toString(36).substr(2, 9), grade: g };
                return {
                  id: g._id || g.id || 'grade_' + Math.random().toString(36).substr(2, 9),
                  grade: g.grade || 'Unknown'
                };
              })
              .filter((g: any) => g && g.grade);
            setGradesList(prev => {
              const localOnly = (prev || []).filter(lg => lg && lg.grade && !remoteGrades.some((rg: { grade: string }) => rg.grade === lg.grade));
              const merged = [...remoteGrades, ...localOnly];
              localStorage.setItem('squad_grades', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch grades from backend:', err);
      }

      try {
        // Fetch user types - backend data is the source of truth
        const userTypesRes = await fetch('/df/userType/all');
        if (userTypesRes.ok) {
          const userTypesData = await userTypesRes.json();

          if (Array.isArray(userTypesData) && userTypesData.length > 0) {
            const remoteUserTypes = userTypesData
              .map((ut: any) => {
                if (typeof ut === 'string') return { id: ut.toLowerCase().replace(/\s+/g, '_'), label: ut };
                return {
                  id: ut._id || ut.id || (ut.type_name || ut.label || '').toLowerCase().replace(/\s+/g, '_') || 'ut_' + Math.random().toString(36).substr(2, 9),
                  label: ut.type_name || ut.label || 'Unknown'
                };
              })
              .filter((ut: any) => ut && ut.id && ut.label);

            setUserTypesList(remoteUserTypes);
            localStorage.setItem('squad_user_types', JSON.stringify(remoteUserTypes));
          }
        }
      } catch (err) {
        console.warn('Could not fetch user types from backend:', err);
      }

      try {
        // Fetch sections from ABMS backend on mount and sync with local state
        const sectionsRes = await fetch('/df/section/all');
        if (sectionsRes.ok) {
          const sectionsData = await sectionsRes.json();
          if (Array.isArray(sectionsData)) {
            const remoteSections = sectionsData
              .map((s: any) => {
                if (typeof s === 'string') return s;
                return s ? s.section : null;
              })
              .filter((s): s is string => typeof s === 'string' && s.trim().length > 0);
            setRemoteSectionsList(remoteSections);
            setSectionsList(prev => {
              const localOnly = (prev || []).filter(ls => typeof ls === 'string' && ls && !remoteSections.includes(ls));
              const merged = [...remoteSections, ...localOnly];
              localStorage.setItem('squad_sections', JSON.stringify(merged));
              return merged;
            });
          }
        }
      } catch (err) {
        console.warn('Could not fetch sections from backend:', err);
      }
    };
    fetchGradesAndUserTypes();
  }, []);

  // States for adding new items in the Configure panel
  const [newUserTypeLabel, setNewUserTypeLabel] = useState('');
  const [newAccessLevelId, setNewAccessLevelId] = useState('');
  const [newAccessLevelLabel, setNewAccessLevelLabel] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newSexId, setNewSexId] = useState('');
  const [newSexLabel, setNewSexLabel] = useState('');
  const [newInstName, setNewInstName] = useState('');
  const [newInstIsActive, setNewInstIsActive] = useState('true');

  // Organization (m_organization) states
  const [organizationsList, setOrganizationsList] = useState<any[]>([]);
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgLine1, setNewOrgLine1] = useState('');
  const [newOrgLine2, setNewOrgLine2] = useState('');
  const [newOrgLine3, setNewOrgLine3] = useState('');
  const [newOrgCity, setNewOrgCity] = useState('');
  const [newOrgPostcode, setNewOrgPostcode] = useState('');
  const [newOrgKey, setNewOrgKey] = useState('');

  // Institution remote API synchronization states
  const [isPostingInst, setIsPostingInst] = useState(false);
  const [instPostLogs, setInstPostLogs] = useState<string[]>([]);
  const [instPostStatus, setInstPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [instPostErrorMsg, setInstPostErrorMsg] = useState<string | null>(null);

  // Grade remote API synchronization states
  const [newGradeName, setNewGradeName] = useState('');
  const [newSectionName, setNewSectionName] = useState('');
  const [isPostingGrade, setIsPostingGrade] = useState(false);
  const [gradePostLogs, setGradePostLogs] = useState<string[]>([]);
  const [gradePostStatus, setGradePostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [gradePostErrorMsg, setGradePostErrorMsg] = useState<string | null>(null);

  // User registration remote API synchronization states
  const [isPostingRegister, setIsPostingRegister] = useState(false);
  const [registerPostLogs, setRegisterPostLogs] = useState<string[]>([]);
  const [registerPostStatus, setRegisterPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [registerPostErrorMsg, setRegisterPostErrorMsg] = useState<string | null>(null);

  // Classes and Class Sections states
  const [classesList, setClassesList] = useState<any[]>([]);
  const [classSectionsList, setClassSectionsList] = useState<any[]>([]);
  const [classesLoading, setClassesLoading] = useState<boolean>(false);
  const [classSectionsLoading, setClassSectionsLoading] = useState<boolean>(false);

  // Subjects states
  const [subjectsList, setSubjectsList] = useState<any[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState<boolean>(false);

  // Add Class Section form state
  const [csSection, setCsSection] = useState<string>(''); // maps to __section
  const [csIsActive, setCsIsActive] = useState<boolean>(true);

  // Add Class form state
  const [cName, setCName] = useState<string>('');
  const [cSectionId, setCSectionId] = useState<string>(''); // selected class_section_id
  const [cOrgId, setCOrgId] = useState<string>(''); // selected organization_id
  const [cIsActive, setCIsActive] = useState<boolean>(true);

  // Add Subject form state
  const [subName, setSubName] = useState<string>('');
  const [subOrgId, setSubOrgId] = useState<string>(''); // selected organization_id
  const [subIsActive, setSubIsActive] = useState<boolean>(true);

  // --- Dynamic fields (df) schemas state ---
  const [edQualificationsList, setEdQualificationsList] = useState<any[]>([]);
  const [edQualificationsLoading, setEdQualificationsLoading] = useState(false);
  const [edSpecialitiesList, setEdSpecialitiesList] = useState<any[]>([]);
  const [edSpecialitiesLoading, setEdSpecialitiesLoading] = useState(false);
  const [maritalStatusesList, setMaritalStatusesList] = useState<any[]>([]);
  const [maritalStatusesLoading, setMaritalStatusesLoading] = useState(false);
  const [extraActivityPositionsList, setExtraActivityPositionsList] = useState<any[]>([]);
  const [extraActivityPositionsLoading, setExtraActivityPositionsLoading] = useState(false);
  const [extraActivityTypesList, setExtraActivityTypesList] = useState<any[]>([]);
  const [extraActivityTypesLoading, setExtraActivityTypesLoading] = useState(false);
  const [occupationCategoriesList, setOccupationCategoriesList] = useState<any[]>([]);
  const [occupationCategoriesLoading, setOccupationCategoriesLoading] = useState(false);
  const [occupationsList, setOccupationsList] = useState<any[]>([]);
  const [occupationsLoading, setOccupationsLoading] = useState(false);
  const [relationTypesList, setRelationTypesList] = useState<any[]>([]);
  const [relationTypesLoading, setRelationTypesLoading] = useState(false);
  const [teacherGradesList, setTeacherGradesList] = useState<any[]>([]);
  const [teacherGradesLoading, setTeacherGradesLoading] = useState(false);

  // Form states for new DF schemas
  const [newEdQualName, setNewEdQualName] = useState('');
  const [newEdQualSortOrder, setNewEdQualSortOrder] = useState('0');
  const [newEdQualIsActive, setNewEdQualIsActive] = useState('true');

  const [newEdSpecName, setNewEdSpecName] = useState('');
  const [newEdSpecIsActive, setNewEdSpecIsActive] = useState('true');

  const [newMaritalStatusName, setNewMaritalStatusName] = useState('');

  const [newEAPositionName, setNewEAPositionName] = useState('');

  const [newEATypeName, setNewEATypeName] = useState('');
  const [newEATypeIsActive, setNewEATypeIsActive] = useState('true');

  const [newOccCatName, setNewOccCatName] = useState('');
  const [newOccCatCode, setNewOccCatCode] = useState('');
  const [newOccCatIsActive, setNewOccCatIsActive] = useState('true');

  const [newOccName, setNewOccName] = useState('');
  const [newOccCatId, setNewOccCatId] = useState('');
  const [newOccIsActive, setNewOccIsActive] = useState('true');

  const [newRelName, setNewRelName] = useState('');
  const [newRelIsParent, setNewRelIsParent] = useState(false);
  const [newRelIsActive, setNewRelIsActive] = useState('true');

  const [newTeacherGradeLevel, setNewTeacherGradeLevel] = useState('');

  const [dfLogs, setDfLogs] = useState<string[]>([]);
  const [isDfPosting, setIsDfPosting] = useState<Record<string, boolean>>({});

  // Classes/Sections API execution logs and states
  const [isPostingClass, setIsPostingClass] = useState<boolean>(false);
  const [classPostLogs, setClassPostLogs] = useState<string[]>([]);
  const [classPostStatus, setClassPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [classPostErrorMsg, setClassPostErrorMsg] = useState<string | null>(null);

  // Subjects API execution logs and states
  const [isPostingSubject, setIsPostingSubject] = useState<boolean>(false);
  const [subjectPostLogs, setSubjectPostLogs] = useState<string[]>([]);
  const [subjectPostStatus, setSubjectPostStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [subjectPostErrorMsg, setSubjectPostErrorMsg] = useState<string | null>(null);

  // Helper function to fetch classes and class sections
  const fetchClassesAndSections = async () => {
    setClassesLoading(true);
    setClassSectionsLoading(true);
    try {
      const classSectionsRes = await fetch('/m/classSection/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (classSectionsRes.ok) {
        const classSectionsData = await classSectionsRes.json();
        if (Array.isArray(classSectionsData)) {
          setClassSectionsList(classSectionsData);
        }
      }
    } catch (err) {
      console.warn('Could not fetch class sections from backend:', err);
    } finally {
      setClassSectionsLoading(false);
    }

    try {
      const classesRes = await fetch('/m/class/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (classesRes.ok) {
        const classesData = await classesRes.json();
        if (Array.isArray(classesData)) {
          setClassesList(classesData);
        }
      }
    } catch (err) {
      console.warn('Could not fetch classes from backend:', err);
    } finally {
      setClassesLoading(false);
    }
  };

  // Helper function to fetch subjects
  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    try {
      const response = await fetch('/m/subject/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setSubjectsList(data);
        }
      }
    } catch (err) {
      console.warn('Could not fetch subjects from backend:', err);
    } finally {
      setSubjectsLoading(false);
    }
  };

  // --- New fetchers for dynamic field (df) schemas ---
  const fetchEdQualifications = async () => {
    setEdQualificationsLoading(true);
    try {
      const res = await fetch('/df/edQualification/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEdQualificationsList(data);
      }
    } catch (e) {
      console.warn('Error fetching edQualifications:', e);
    } finally {
      setEdQualificationsLoading(false);
    }
  };

  const fetchEdSpecialities = async () => {
    setEdSpecialitiesLoading(true);
    try {
      const res = await fetch('/df/edSpeciality/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setEdSpecialitiesList(data);
      }
    } catch (e) {
      console.warn('Error fetching edSpecialities:', e);
    } finally {
      setEdSpecialitiesLoading(false);
    }
  };

  const fetchMaritalStatuses = async () => {
    setMaritalStatusesLoading(true);
    try {
      const res = await fetch('/df/maritalStatus/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setMaritalStatusesList(data);
      }
    } catch (e) {
      console.warn('Error fetching maritalStatuses:', e);
    } finally {
      setMaritalStatusesLoading(false);
    }
  };

  const fetchExtraActivityPositions = async () => {
    setExtraActivityPositionsLoading(true);
    try {
      const res = await fetch('/df/extraActivityPosition/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setExtraActivityPositionsList(data);
      }
    } catch (e) {
      console.warn('Error fetching extraActivityPositions:', e);
    } finally {
      setExtraActivityPositionsLoading(false);
    }
  };

  const fetchExtraActivityTypes = async () => {
    setExtraActivityTypesLoading(true);
    try {
      const res = await fetch('/df/extraActivityType/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setExtraActivityTypesList(data);
      }
    } catch (e) {
      console.warn('Error fetching extraActivityTypes:', e);
    } finally {
      setExtraActivityTypesLoading(false);
    }
  };

  const fetchOccupationCategories = async () => {
    setOccupationCategoriesLoading(true);
    try {
      const res = await fetch('/df/occupationCategory/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setOccupationCategoriesList(data);
      }
    } catch (e) {
      console.warn('Error fetching occupationCategories:', e);
    } finally {
      setOccupationCategoriesLoading(false);
    }
  };

  const fetchOccupations = async () => {
    setOccupationsLoading(true);
    try {
      const res = await fetch('/df/occupation/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setOccupationsList(data);
      }
    } catch (e) {
      console.warn('Error fetching occupations:', e);
    } finally {
      setOccupationsLoading(false);
    }
  };

  const fetchRelationTypes = async () => {
    setRelationTypesLoading(true);
    try {
      const res = await fetch('/df/relationType/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setRelationTypesList(data);
      }
    } catch (e) {
      console.warn('Error fetching relationTypes:', e);
    } finally {
      setRelationTypesLoading(false);
    }
  };

  const fetchTeacherGrades = async () => {
    setTeacherGradesLoading(true);
    try {
      const res = await fetch('/df/teacherGrade/retrieve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) setTeacherGradesList(data);
      }
    } catch (e) {
      console.warn('Error fetching teacherGrades:', e);
    } finally {
      setTeacherGradesLoading(false);
    }
  };

  // Generic add function for DF schemas
  const handleAddDfOption = async (schemaKey: string, payload: any, fetcher: () => Promise<void>, cleanInputs: () => void) => {
    setIsDfPosting(prev => ({ ...prev, [schemaKey]: true }));
    const logTime = () => new Date().toLocaleTimeString();
    const endpoint = `/df/${schemaKey}/add`;
    setDfLogs(prev => [
      ...prev,
      `[${logTime()}] Initiating POST request to ${endpoint}`,
      `[${logTime()}] Payload: ${JSON.stringify(payload, null, 2)}`
    ]);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      setDfLogs(prev => [...prev, `[${logTime()}] Response status: ${res.status} (${res.statusText})`]);
      if (res.ok) {
        const responseData = await res.json();
        setDfLogs(prev => [...prev, `[${logTime()}] SUCCESS: Added successfully!`, `[${logTime()}] Response: ${JSON.stringify(responseData, null, 2)}`]);
        setSuccessToast(`Successfully added remote entry for ${schemaKey}`);
        setTimeout(() => setSuccessToast(null), 3000);
        cleanInputs();
        await fetcher();
      } else {
        const responseText = await res.text();
        throw new Error(`Server returned error: ${responseText || res.statusText}`);
      }
    } catch (err: any) {
      const msg = err.message || String(err);
      setDfLogs(prev => [...prev, `[${logTime()}] ERROR: Request failed.`, `[${logTime()}] Details: ${msg}`]);
    } finally {
      setIsDfPosting(prev => ({ ...prev, [schemaKey]: false }));
    }
  };

  // Generic delete function for DF schemas
  const handleDeleteDfOption = async (schemaKey: string, id: string, fetcher: () => Promise<void>) => {
    const logTime = () => new Date().toLocaleTimeString();
    const endpoint = `/df/${schemaKey}/delete/${id}`;
    setDfLogs(prev => [
      ...prev,
      `[${logTime()}] Initiating DELETE request via POST to ${endpoint}`
    ]);

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      setDfLogs(prev => [...prev, `[${logTime()}] Response status: ${res.status} (${res.statusText})`]);
      if (res.ok) {
        setDfLogs(prev => [...prev, `[${logTime()}] SUCCESS: Option deleted successfully!`]);
        setSuccessToast(`Deleted option from ${schemaKey}`);
        setTimeout(() => setSuccessToast(null), 3000);
        await fetcher();
      } else {
        const responseText = await res.text();
        throw new Error(`Server returned error: ${responseText || res.statusText}`);
      }
    } catch (err: any) {
      const msg = err.message || String(err);
      setDfLogs(prev => [...prev, `[${logTime()}] ERROR: Deletion failed.`, `[${logTime()}] Details: ${msg}`]);
    }
  };

  // Fetch classes, class sections, and subjects on mount
  useEffect(() => {
    fetchClassesAndSections();
    fetchSubjects();
    fetchEdQualifications();
    fetchEdSpecialities();
    fetchMaritalStatuses();
    fetchExtraActivityPositions();
    fetchExtraActivityTypes();
    fetchOccupationCategories();
    fetchOccupations();
    fetchRelationTypes();
    fetchTeacherGrades();
  }, []);

  const handleAddUserType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserTypeLabel.trim()) return;
    const cleanLabel = newUserTypeLabel.trim();
    if (userTypesList.some(ut => ut.label.toLowerCase() === cleanLabel.toLowerCase())) {
      alert('User Type already exists');
      return;
    }

    try {
      const response = await fetch('/df/userType/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type_name: cleanLabel })
      });

      if (response.ok) {
        const cleanId = cleanLabel.toLowerCase().replace(/\s+/g, '_');
        setUserTypesList([...userTypesList, { id: cleanId, label: cleanLabel }]);
        setNewUserTypeLabel('');
        setSuccessToast(`Added User Type: ${cleanLabel}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add user type');
      }
    } catch (err) {
      console.error('Error adding user type:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteUserType = async (id: string) => {
    if (userTypesList.length <= 1) {
      alert('Must keep at least one User Type!');
      return;
    }
    const userType = userTypesList.find(ut => ut.id === id);
    if (!userType) return;

    try {
      const response = await fetch('/df/userType/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: userType.label })
      });

      if (response.ok) {
        // Only remove from local state after successful backend delete
        const updatedList = userTypesList.filter(ut => ut.id !== id);
        setUserTypesList(updatedList);
        localStorage.setItem('squad_user_types', JSON.stringify(updatedList));
        setSuccessToast(`Deleted User Type: ${userType.label}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        let errorMsg = 'Failed to delete user type';
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || errorMsg;
        } catch {}
        alert(`Failed to delete from database: ${errorMsg}. Please try again.`);
      }
    } catch (err) {
      console.error('Error deleting user type:', err);
      alert('Error connecting to backend. Please check your connection and try again.');
    }
  };

  const handleAddAccessLevel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccessLevelId.trim() || !newAccessLevelLabel.trim()) return;
    const cleanId = Number(newAccessLevelId.trim());
    if (isNaN(cleanId) || cleanId < 1 || cleanId > 6) {
      alert('Access Level ID must be a number between 1 and 6');
      return;
    }
    if (accessLevelsList.some(al => al.id === cleanId)) {
      alert('Access Level ID already exists');
      return;
    }
    setAccessLevelsList([...accessLevelsList, { id: cleanId, label: newAccessLevelLabel.trim() }]);
    setNewAccessLevelId('');
    setNewAccessLevelLabel('');
    setSuccessToast(`Added Access Level: ${newAccessLevelLabel}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteAccessLevel = (id: string) => {
    if (accessLevelsList.length <= 1) {
      alert('Must keep at least one Access Level!');
      return;
    }
    setAccessLevelsList(accessLevelsList.filter(al => al.id !== id));
  };

  const handleAddTitle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    const cleanTitle = newTitle.trim();
    if (titlesList.includes(cleanTitle) || remoteTitlesList.includes(cleanTitle)) {
      alert('Title already exists');
      return;
    }

    try {
      const response = await fetch('/df/title/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: cleanTitle })
      });

      if (response.ok) {
        const data = await response.json();
        setTitlesList([...titlesList, cleanTitle]);
        setRemoteTitlesList([...remoteTitlesList, cleanTitle]);
        setNewTitle('');
        setSuccessToast(`Added Title: ${cleanTitle}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add title');
      }
    } catch (err) {
      console.error('Error adding title:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteTitle = async (title: string) => {
    if (titlesList.length <= 1 && remoteTitlesList.length <= 1) {
      alert('Must keep at least one Title!');
      return;
    }

    // Remove from local state and localStorage immediately for responsive UI
    const updatedList = titlesList.filter(t => t !== title);
    setTitlesList(updatedList);
    setRemoteTitlesList(remoteTitlesList.filter(t => t !== title));
    localStorage.setItem('squad_titles', JSON.stringify(updatedList));

    try {
      const response = await fetch('/df/title/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title })
      });

      if (response.ok) {
        setSuccessToast(`Deleted Title: ${title}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        let errorMsg = 'Failed to delete title';
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || errorMsg;
        } catch {}
        // Backend delete failed, but item is already removed locally
        setSuccessToast(`Removed Title: ${title} locally (backend: ${errorMsg})`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting title:', err);
      // Network error - item already removed locally, show info toast
      setSuccessToast(`Removed Title: ${title} locally (backend connection failed)`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  const handleAddSex = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSexId.trim() || !newSexLabel.trim()) return;
    const cleanId = newSexId.trim().toLowerCase().replace(/\s+/g, '_');
    if (sexesList.some(s => s.id === cleanId)) {
      alert('Gender ID already exists');
      return;
    }
    setSexesList([...sexesList, { id: cleanId, label: newSexLabel.trim() }]);
    setNewSexId('');
    setNewSexLabel('');
    setSuccessToast(`Added Gender: ${newSexLabel}`);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleDeleteSex = (id: string) => {
    if (sexesList.length <= 1) {
      alert('Must keep at least one Gender option!');
      return;
    }
    setSexesList(sexesList.filter(s => s.id !== id));
  };

  const handlePostToRemoteManual = async (name: string, isActive: string) => {
    setIsPostingInst(true);
    setInstPostStatus('idle');
    setInstPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setInstPostLogs([
      `[${logTime()}] Initiating manual POST request to /df/institute/add`,
      `[${logTime()}] Payload: { "name": "${name}", "is_active": "${isActive}" }`
    ]);

    try {
      const response = await fetch('/df/institute/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          is_active: isActive
        })
      });

      setInstPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setInstPostStatus('success');
      setInstPostLogs(prev => [
        ...prev, 
        `[${logTime()}] SUCCESS: Institution registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);
      setSuccessToast(`Remote POST Success for ${name}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setInstPostStatus('error');
      setInstPostErrorMsg(errMsg);
      setInstPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
    } finally {
      setIsPostingInst(false);
    }
  };

  const handleAddInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInstName.trim()) return;
    const name = newInstName.trim();
    if (institutionsList.some(inst => inst.name.toLowerCase() === name.toLowerCase())) {
      alert('An institution with this name already exists.');
      return;
    }

    setIsPostingInst(true);
    setInstPostStatus('idle');
    setInstPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setInstPostLogs([
      `[${logTime()}] Initiating POST request to /df/institute/add`,
      `[${logTime()}] Payload: { "name": "${name}", "is_active": "${newInstIsActive}" }`
    ]);

    try {
      const response = await fetch('/df/institute/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          is_active: newInstIsActive
        })
      });

      setInstPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setInstPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setInstPostStatus('success');
      setInstPostLogs(prev => [
        ...prev, 
        `[${logTime()}] SUCCESS: Institution registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);

      // Re-fetch remote organizations to keep in sync
      try {
        const refetchRes = await fetch('/df/institute/all');
        if (refetchRes.ok) {
          const refetchData = await refetchRes.json();
          if (Array.isArray(refetchData)) {
            setRemoteOrganizations(refetchData);
            setInstPostLogs(prev => [...prev, `[${logTime()}] Re-fetched remote organizations list`]);
          }
        }
      } catch (refetchErr) {
        console.warn('Could not re-fetch organizations:', refetchErr);
      }

      const cleanId = 'inst_' + Date.now();
      let updated = [...institutionsList];
      setInstitutionsList([...updated, { id: cleanId, name, is_active: newInstIsActive }]);
      setNewInstName('');
      setNewInstIsActive('true');
      setSuccessToast(`Remote POST Success & Added Local Institution: ${name}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setInstPostStatus('error');
      setInstPostErrorMsg(errMsg);
      setInstPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
      
      // Still append locally so user data is retained
      const cleanId = 'inst_' + Date.now();
      let updated = [...institutionsList];
      setInstitutionsList([...updated, { id: cleanId, name, is_active: newInstIsActive }]);
      setNewInstName('');
      setNewInstIsActive('true');
      setSuccessToast(`Added locally (Remote POST failed: ${errMsg})`);
      setTimeout(() => setSuccessToast(null), 4000);
    } finally {
      setIsPostingInst(false);
    }
  };

  const handleDeleteInstitution = async (id: string, alreadyConfirmed = false) => {
    if (institutionsList.length <= 1) {
      showAlert('Cannot Delete', 'Must keep at least one Institution!', 'error');
      return;
    }

    const inst = institutionsList.find(i => i.id === id);
    if (!inst) return;

    if (!alreadyConfirmed) {
      showConfirm(
        'Delete Institution',
        `Are you sure you want to delete the institution "${inst.name}"?`,
        () => handleDeleteInstitution(id, true)
      );
      return;
    }

    try {
      const response = await fetch('/df/institute/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: inst.name })
      });

      if (response.ok) {
        setInstitutionsList(institutionsList.filter(i => i.id !== id));
        setSuccessToast(`Deleted Institution: ${inst.name}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        showAlert('Deletion Failed', error.message || error.error || 'Failed to delete institution', 'error');
      }
    } catch (err) {
      console.error('Error deleting institution:', err);
      showAlert('Error', 'Error connecting to backend', 'error');
    }
  };

  const handleToggleInstitutionActive = (id: string) => {
    setInstitutionsList(institutionsList.map(inst => {
      if (inst.id === id) {
        return { ...inst, is_active: inst.is_active === 'true' ? 'false' : 'true' };
      }
      return inst;
    }));
  };

  const handlePostGradeToRemoteManual = async (gradeName: string) => {
    setIsPostingGrade(true);
    setGradePostStatus('idle');
    setGradePostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setGradePostLogs([
      `[${logTime()}] Initiating manual POST request to /df/grade/add`,
      `[${logTime()}] Payload: { "grade": "${gradeName}" }`
    ]);

    try {
      const response = await fetch('/df/grade/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          grade: gradeName
        })
      });

      setGradePostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);
      
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setGradePostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setGradePostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setGradePostStatus('success');
      setGradePostLogs(prev => [
        ...prev, 
        `[${logTime()}] SUCCESS: Grade registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);
      setSuccessToast(`Remote POST Success for ${gradeName}`);
      setTimeout(() => setSuccessToast(null), 4000);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setGradePostStatus('error');
      setGradePostErrorMsg(errMsg);
      setGradePostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
    } finally {
      setIsPostingGrade(false);
    }
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGradeName.trim()) return;
    const grade = newGradeName.trim();
    if (gradesList.some(g => g.grade.toLowerCase() === grade.toLowerCase())) {
      alert('Grade already exists');
      return;
    }

    try {
      const response = await fetch('/df/grade/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ grade })
      });

      if (response.ok) {
        const cleanId = 'grade_' + Date.now();
        setGradesList([...gradesList, { id: cleanId, grade }]);
        setNewGradeName('');
        setSuccessToast(`Added Grade: ${grade}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add grade');
      }
    } catch (err) {
      console.error('Error adding grade:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteGrade = async (id: string) => {
    if (gradesList.length <= 1) {
      alert('Must keep at least one Grade option!');
      return;
    }
    const grade = gradesList.find(g => g.id === id);
    if (!grade) return;

    // Remove from local state and localStorage immediately for responsive UI
    const updatedList = gradesList.filter(g => g.id !== id);
    setGradesList(updatedList);
    localStorage.setItem('squad_grades', JSON.stringify(updatedList));

    try {
      const response = await fetch('/df/grade/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: grade.grade })
      });

      if (response.ok) {
        setSuccessToast(`Deleted Grade: ${grade.grade}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        let errorMsg = 'Failed to delete grade';
        try {
          const error = await response.json();
          errorMsg = error.message || error.error || errorMsg;
        } catch {}
        // Backend delete failed, but item is already removed locally
        setSuccessToast(`Removed Grade: ${grade.grade} locally (backend: ${errorMsg})`);
        setTimeout(() => setSuccessToast(null), 4000);
      }
    } catch (err) {
      console.error('Error deleting grade:', err);
      // Network error - item already removed locally, show info toast
      setSuccessToast(`Removed Grade: ${grade.grade} locally (backend connection failed)`);
      setTimeout(() => setSuccessToast(null), 4000);
    }
  };

  // Organization (m_organization) handlers
  const handleAddOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOrgName.trim()) {
      alert('Organization name is required');
      return;
    }

    try {
      const response = await fetch('/m/organization/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newOrgName.trim(),
          line1: newOrgLine1.trim(),
          line2: newOrgLine2.trim(),
          line3: newOrgLine3.trim(),
          city: newOrgCity.trim(),
          postcode: newOrgPostcode.trim(),
          key: newOrgKey.trim()
        })
      });

      if (response.ok) {
        const data = await response.json();
        setOrganizationsList([...organizationsList, data.createdParent || data]);
        setNewOrgName('');
        setNewOrgLine1('');
        setNewOrgLine2('');
        setNewOrgLine3('');
        setNewOrgCity('');
        setNewOrgPostcode('');
        setNewOrgKey('');
        setSuccessToast('Organization added successfully!');
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        showAlert('Error Adding Organization', error.message || error.error || 'Failed to add organization', 'error');
      }
    } catch (err) {
      console.error('Error adding organization:', err);
      showAlert('Error', 'Error connecting to backend', 'error');
    }
  };

  const handleDeleteOrganization = async (id: string, alreadyConfirmed = false) => {
    if (!alreadyConfirmed) {
      showConfirm(
        'Delete Organization',
        'Are you sure you want to delete this organization?',
        () => handleDeleteOrganization(id, true)
      );
      return;
    }

    try {
      const response = await fetch(`/m/organization/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setOrganizationsList(organizationsList.filter(org => org._id !== id));
        setSuccessToast('Organization deleted successfully!');
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        showAlert('Deletion Failed', error.message || error.error || 'Failed to delete organization', 'error');
      }
    } catch (err) {
      console.error('Error deleting organization:', err);
      showAlert('Error', 'Error connecting to backend', 'error');
    }
  };

  // Fetch organizations on mount
  useEffect(() => {
    const fetchOrganizations = async () => {
      setMOrgsLoading(true);
      try {
        const res = await fetch('/m/organization/retrieve', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({})
        });

        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setOrganizationsList(data.filter((org: any) => org && org._id && org.name));
          }
        }
      } catch (err) {
        console.warn('Could not fetch organizations:', err);
      } finally {
        setMOrgsLoading(false);
      }
    };
    fetchOrganizations();
  }, []);

  // Classes and Class Sections Handlers
  const handleAddClassSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csSection.trim()) {
      showAlert('Required Fields', 'Please fill in the section field', 'error');
      return;
    }

    setIsPostingClass(true);
    setClassPostStatus('idle');
    setClassPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setClassPostLogs([
      `[${logTime()}] Initiating POST request to /m/classSection/add`,
      `[${logTime()}] Payload: { "is_active": ${csIsActive}, "__section": "${csSection.trim()}" }`
    ]);

    try {
      const response = await fetch('/m/classSection/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          is_active: csIsActive,
          __section: csSection.trim()
        })
      });

      setClassPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setClassPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setClassPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setClassPostStatus('success');
      setClassPostLogs(prev => [
        ...prev,
        `[${logTime()}] SUCCESS: Class Section registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);

      // Reset form fields
      setCsSection('');
      setCsIsActive(true);

      setSuccessToast(`Class Section added successfully!`);
      setTimeout(() => setSuccessToast(null), 3000);

      // Refresh data
      fetchClassesAndSections();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setClassPostStatus('error');
      setClassPostErrorMsg(errMsg);
      setClassPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
      showAlert('Creation Failed', `Failed to create class section: ${errMsg}`, 'error');
    } finally {
      setIsPostingClass(false);
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || !cSectionId || !cOrgId) {
      showAlert('Required Fields', 'Please enter a class name, select a class section, and select an organization', 'error');
      return;
    }

    setIsPostingClass(true);
    setClassPostStatus('idle');
    setClassPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setClassPostLogs([
      `[${logTime()}] Initiating POST request to /m/class/add`,
      `[${logTime()}] Payload: { "class_name": "${cName.trim()}", "class_section_id": "${cSectionId}", "organization_id": "${cOrgId}", "organizationId": "${cOrgId}", "is_active": ${cIsActive} }`
    ]);

    try {
      const response = await fetch('/m/class/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          class_name: cName.trim(),
          class_section_id: cSectionId,
          organization_id: cOrgId,
          organizationId: cOrgId,
          is_active: cIsActive
        })
      });

      setClassPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setClassPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setClassPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setClassPostStatus('success');
      setClassPostLogs(prev => [
        ...prev,
        `[${logTime()}] SUCCESS: Class registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);

      // Reset form fields
      setCName('');
      setCSectionId('');
      setCOrgId('');
      setCIsActive(true);

      setSuccessToast(`Class added successfully!`);
      setTimeout(() => setSuccessToast(null), 3000);

      // Refresh data
      fetchClassesAndSections();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setClassPostStatus('error');
      setClassPostErrorMsg(errMsg);
      setClassPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
      showAlert('Creation Failed', `Failed to create class: ${errMsg}`, 'error');
    } finally {
      setIsPostingClass(false);
    }
  };

  const handleDeleteClassSection = async (id: string, alreadyConfirmed = false) => {
    if (!alreadyConfirmed) {
      showConfirm(
        'Delete Class Section',
        'Are you sure you want to delete this class section? Any associated classes might lose their reference.',
        () => handleDeleteClassSection(id, true)
      );
      return;
    }

    try {
      const response = await fetch(`/m/classSection/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSuccessToast('Class section deleted successfully!');
        setTimeout(() => setSuccessToast(null), 3000);
        fetchClassesAndSections();
      } else {
        const error = await response.json();
        showAlert('Deletion Failed', error.message || error.error || 'Failed to delete class section', 'error');
      }
    } catch (err) {
      console.error('Error deleting class section:', err);
      showAlert('Error', 'Error connecting to backend', 'error');
    }
  };

  const handleDeleteClass = async (id: string, alreadyConfirmed = false) => {
    if (!alreadyConfirmed) {
      showConfirm(
        'Delete Class',
        'Are you sure you want to delete this class?',
        () => handleDeleteClass(id, true)
      );
      return;
    }

    try {
      const response = await fetch(`/m/class/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSuccessToast('Class deleted successfully!');
        setTimeout(() => setSuccessToast(null), 3000);
        fetchClassesAndSections();
      } else {
        const error = await response.json();
        showAlert('Deletion Failed', error.message || error.error || 'Failed to delete class', 'error');
      }
    } catch (err) {
      console.error('Error deleting class:', err);
      showAlert('Error', 'Error connecting to backend', 'error');
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim() || !subOrgId) {
      showAlert('Required Fields', 'Please enter a subject name and select an organization', 'error');
      return;
    }

    setIsPostingSubject(true);
    setSubjectPostStatus('idle');
    setSubjectPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();
    setSubjectPostLogs([
      `[${logTime()}] Initiating POST request to /m/subject/add`,
      `[${logTime()}] Payload: { "subject": "${subName.trim()}", "organization_id": "${subOrgId}", "is_active": ${subIsActive} }`
    ]);

    try {
      const response = await fetch('/m/subject/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          subject: subName.trim(),
          organization_id: subOrgId,
          is_active: subIsActive
        })
      });

      setSubjectPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setSubjectPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setSubjectPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setSubjectPostStatus('success');
      setSubjectPostLogs(prev => [
        ...prev,
        `[${logTime()}] SUCCESS: Subject registered on remote server!`,
        `[${logTime()}] Server Data: ${JSON.stringify(responseData, null, 2)}`
      ]);

      // Reset form fields
      setSubName('');
      setSubOrgId('');
      setSubIsActive(true);

      setSuccessToast(`Subject added successfully!`);
      setTimeout(() => setSuccessToast(null), 3000);

      // Refresh data
      fetchSubjects();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setSubjectPostStatus('error');
      setSubjectPostErrorMsg(errMsg);
      setSubjectPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Request failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);
      showAlert('Creation Failed', `Failed to create subject: ${errMsg}`, 'error');
    } finally {
      setIsPostingSubject(false);
    }
  };

  const handleDeleteSubject = async (id: string, alreadyConfirmed = false) => {
    if (!alreadyConfirmed) {
      showConfirm(
        'Delete Subject',
        'Are you sure you want to delete this subject?',
        () => handleDeleteSubject(id, true)
      );
      return;
    }

    try {
      const response = await fetch(`/m/subject/delete/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        setSuccessToast('Subject deleted successfully!');
        setTimeout(() => setSuccessToast(null), 3000);
        fetchSubjects();
      } else {
        const error = await response.json();
        showAlert('Deletion Failed', error.message || error.error || 'Failed to delete subject', 'error');
      }
    } catch (err) {
      console.error('Error deleting subject:', err);
      showAlert('Error', 'Error connecting to backend', 'error');
    }
  };

  // Helper to lookup organization name by ID or Name
  const getOrgNameById = (orgId: string): string => {
    if (!orgId) return '';
    const match1 = (organizationsList || []).find((o: any) => o && (o._id === orgId || o.id === orgId || (o.name && o.name.toLowerCase() === orgId.toLowerCase())));
    if (match1 && match1.name) return match1.name;
    const match2 = (remoteOrganizations || []).find((o: any) => o && (o._id === orgId || o.id === orgId || (o.name && o.name.toLowerCase() === orgId.toLowerCase())));
    if (match2 && match2.name) return match2.name;
    const match3 = (institutionsList || []).find((o: any) => o && (o.id === orgId || (o.name && o.name.toLowerCase() === orgId.toLowerCase())));
    if (match3 && match3.name) return match3.name;
    return orgId;
  };

  // Helper to match organizations of a user to a target org
  const isUserInOrg = (userOrgId: string | undefined, targetOrg: { id: string; name: string }) => {
    if (!userOrgId) return false;
    const userOrgName = getOrgNameById(userOrgId).toLowerCase();
    const targetOrgName = targetOrg.name.toLowerCase();
    return userOrgName === targetOrgName || 
           userOrgId === targetOrg.id || 
           userOrgId.toLowerCase() === targetOrg.id.toLowerCase() ||
           userOrgId.toLowerCase() === targetOrg.name.toLowerCase();
  };

  // Helpers to safely resolve and match user roles
  const isStudent = (u: SquadUser) => {
    const typeIdStr = (u.user_type_id || '').toLowerCase();
    if (typeIdStr.includes('student')) return true;
    const meta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === typeIdStr);
    return meta ? meta.label.toLowerCase().includes('student') : false;
  };

  const isTeacher = (u: SquadUser) => {
    const typeIdStr = (u.user_type_id || '').toLowerCase();
    if (typeIdStr.includes('teacher') || typeIdStr.includes('instruct')) return true;
    const meta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === typeIdStr);
    return meta ? (meta.label.toLowerCase().includes('teacher') || meta.label.toLowerCase().includes('instruct')) : false;
  };

  const isParent = (u: SquadUser) => {
    const typeIdStr = (u.user_type_id || '').toLowerCase();
    if (typeIdStr.includes('parent') || typeIdStr.includes('guard')) return true;
    const meta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === typeIdStr);
    return meta ? (meta.label.toLowerCase().includes('parent') || meta.label.toLowerCase().includes('guard')) : false;
  };

  const isAdmin = (u: SquadUser) => {
    const typeIdStr = (u.user_type_id || '').toLowerCase();
    if (typeIdStr.includes('admin')) return true;
    const meta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === typeIdStr);
    return meta ? meta.label.toLowerCase().includes('admin') : false;
  };

  // Pre-calculate distinct organizations from database and local institutions lists
  const distinctOrgs = (() => {
    const seen = new Set<string>();
    const list: { id: string; name: string }[] = [];
    (organizationsList || []).forEach(org => {
      if (org && org.name && !seen.has(org.name.toLowerCase())) {
        seen.add(org.name.toLowerCase());
        list.push({ id: org._id || org.id, name: org.name });
      }
    });
    (remoteOrganizations || []).forEach(org => {
      if (org && org.name && !seen.has(org.name.toLowerCase())) {
        seen.add(org.name.toLowerCase());
        list.push({ id: org._id, name: org.name });
      }
    });
    (institutionsList || []).forEach(inst => {
      if (inst && inst.name && !seen.has(inst.name.toLowerCase())) {
        seen.add(inst.name.toLowerCase());
        list.push({ id: inst.id, name: inst.name });
      }
    });
    // Dynamically capture any organizations present in users that aren't in lists
    (users || []).forEach(u => {
      if (u && u.organization_id) {
        const orgId = u.organization_id;
        const orgName = getOrgNameById(orgId) || orgId;
        if (!seen.has(orgName.toLowerCase())) {
          seen.add(orgName.toLowerCase());
          list.push({ id: orgId, name: orgName });
        }
      }
    });
    return list;
  })();

  // Auto-select the first organization if none is selected in view_org tab
  useEffect(() => {
    if (activeTab === 'view_org' && !selectedViewOrgId && distinctOrgs.length > 0) {
      setSelectedViewOrgId(distinctOrgs[0].id);
    }
  }, [activeTab, distinctOrgs, selectedViewOrgId]);

  const handleResetConfig = (alreadyConfirmed = false) => {
    if (!alreadyConfirmed) {
      showConfirm(
        'Reset Configuration',
        'Are you sure you want to reset SQUAD Portal configuration to factory defaults?',
        () => handleResetConfig(true)
      );
      return;
    }

    setUserTypesList(USER_TYPES);
    setAccessLevelsList(ACCESS_LEVELS);
    setTitlesList(TITLES);
    setSexesList(SEXES);
    setInstitutionsList([]);
    setGradesList([
      { id: 'grade_1', grade: 'Grade 10' },
      { id: 'grade_2', grade: 'Grade 11' }
    ]);
    setServerVersion('v1.0');
    setServerStatus('online');
    setSuccessToast('Successfully reset configuration defaults!');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  // Save users state locally
  useEffect(() => {
    localStorage.setItem('squad_portal_users', JSON.stringify(users));
  }, [users]);


  // Fetch users from backend in real-time for dashboard
  const fetchUsersFromBackend = async () => {
    try {
      const orgIds: string[] = [];

      // 1. Fetch remote institutes
      try {
        const instRes = await fetch('/df/institute/all');
        if (instRes.ok) {
          const instData = await instRes.json();
          if (Array.isArray(instData)) {
            instData.forEach((org: any) => {
              if (org && org._id) orgIds.push(org._id);
              if (org && org.id) orgIds.push(org.id);
            });
          }
        }
      } catch (e) {
        console.warn('Error fetching institutes for users:', e);
      }

      // 2. Fetch parent organizations
      try {
        const orgRes = await fetch('/m/organization/retrieve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        });
        if (orgRes.ok) {
          const orgData = await orgRes.json();
          if (Array.isArray(orgData)) {
            orgData.forEach((org: any) => {
              if (org && org._id) orgIds.push(org._id);
              if (org && org.id) orgIds.push(org.id);
            });
          }
        }
      } catch (e) {
        console.warn('Error fetching organizations for users:', e);
      }

      // Ensure we include some known database organization IDs as fallback/addition
      const knownIds = ['6a47f5ed03c892febb6520d6', '6a47fa6103c892febb6520f4', '6a47f63403c892febb6520dc', '6a47f67c03c892febb6520de'];
      orgIds.push(...knownIds);

      // Keep unique non-empty IDs
      const uniqueOrgIds = Array.from(new Set(orgIds.filter(id => id && id.trim() !== '')));

      // Fetch users for each organization ID in parallel
      const allFetchedUsers: SquadUser[] = [];
      const seenUserIds = new Set<string>();

      await Promise.all(uniqueOrgIds.map(async (orgId) => {
        try {
          const response = await fetch(`/m/admin/organization/${orgId}/users`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
          });

          if (response.ok) {
            const data = await response.json();
            
            const processUser = (u: any, role: string) => {
              const id = u._id || u.id;
              if (!id) return;
              if (seenUserIds.has(id)) return;
              seenUserIds.add(id);

              allFetchedUsers.push({
                ...u,
                user_type_id: role,
                id: id,
                dbId: id,
                organization_id: u.organization_id || orgId,
                first_name: u.first_name || u.firstName || '',
                last_name: u.last_name || u.lastName || ''
              });
            };

            if (data.students && Array.isArray(data.students)) {
              data.students.forEach((s: any) => processUser(s, 'student'));
            }
            if (data.teachers && Array.isArray(data.teachers)) {
              data.teachers.forEach((t: any) => processUser(t, 'teacher'));
            }
            if (data.parents && Array.isArray(data.parents)) {
              data.parents.forEach((p: any) => processUser(p, 'parent'));
            }
            if (data.admins && Array.isArray(data.admins)) {
              data.admins.forEach((a: any) => processUser(a, 'administrator'));
            }
          }
        } catch (err) {
          console.warn(`Error fetching users for organization ${orgId}:`, err);
        }
      }));

      if (allFetchedUsers.length > 0) {
        setUsers(allFetchedUsers);
        localStorage.setItem('squad_portal_users', JSON.stringify(allFetchedUsers));
      }
    } catch (err) {
      console.warn('Error fetching users from backend:', err);
    }
  };

  // Fetch users on mount and set up polling for real-time updates
  useEffect(() => {
    fetchUsersFromBackend();
    
    // Poll for updates every 5 seconds
    const interval = setInterval(() => {
      fetchUsersFromBackend();
    }, 5000);

    return () => clearInterval(interval);
  }, []);


  // Form Validations
  const validate = (): boolean => {
    const errors: { [key: string]: string } = {};
    if (!nic.trim()) errors.nic = 'NIC parameter is required';
    if (!password.trim()) errors.password = 'Password parameter is required';
    if (!email.trim()) {
      errors.email = 'Email parameter is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email parameter format';
    }
    if (!passport.trim()) errors.passport = 'Passport parameter is required';
    if (!firstName.trim()) errors.first_name = 'First name is required';
    if (!lastName.trim()) errors.last_name = 'Last name is required';
    if (!dob.trim()) errors.dob = 'Date of birth is required';
    if (!phone.trim()) errors.phone = 'Phone number parameter is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const selectedUserType = userTypesList.find(ut => ut.id === userTypeId || ut.label === userTypeId);
    const selectedLabel = selectedUserType ? selectedUserType.label : userTypeId;

    const newRecord: SquadUser = {
      id: `user_${Date.now()}`,
      user_type_id: selectedLabel,
      nic: nic.trim(),
      password: password.trim(),
      email: email.trim().toLowerCase(),
      passport: passport.trim(),
      title_id: titleId,
      first_name: firstName.trim(),
      middle_name: middleName.trim(),
      last_name: lastName.trim(),
      sex: sex,
      dob: dob,
      phone: phone.trim(),
      access_level_id: accessLevelId,
      organization_id: organizationId || undefined
    };

    setIsPostingRegister(true);
    setRegisterPostStatus('idle');
    setRegisterPostErrorMsg(null);
    const logTime = () => new Date().toLocaleTimeString();

    // Determine specific backend schema add endpoint based on the selected user type
    const typeId = (selectedLabel || '').toLowerCase();
    let registerEndpoint = '/df/register/add';
    let payloadRoleSpecific: any = {};

    if (typeId.includes('admin')) {
      registerEndpoint = '/m/admin/add';
    } else if (typeId.includes('student')) {
      registerEndpoint = '/m/student/add';
      payloadRoleSpecific = {
        user_type: "student",
        reg_no: newRecord.nic,
        reg_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true
      };
    } else if (typeId.includes('teacher') || typeId.includes('instruct')) {
      registerEndpoint = '/m/teacher/add';
      payloadRoleSpecific = {
        user_type: "teacher",
        reg_no: newRecord.nic,
        reg_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        teacher_grade_id: "None",
        marital_status_id: "None",
        is_active: true
      };
    } else if (typeId.includes('parent') || typeId.includes('guard')) {
      registerEndpoint = '/m/parent/add';
      payloadRoleSpecific = {
        user_type: "parent",
        occupation_id: "None",
        marital_status_id: "None",
        is_active: true
      };
    }

    setRegisterPostLogs([
      `[${logTime()}] Initiating real-time POST request to ${registerEndpoint}`,
      `[${logTime()}] Payload parameters: ${JSON.stringify({
        user_type_id: newRecord.user_type_id,
        nic: newRecord.nic,
        password: newRecord.password,
        email: newRecord.email,
        passport: newRecord.passport,
        title_id: newRecord.title_id,
        first_name: newRecord.first_name,
        middle_name: newRecord.middle_name,
        last_name: newRecord.last_name,
        sex: newRecord.sex,
        dob: newRecord.dob,
        phone: newRecord.phone,
        access_level_id: newRecord.access_level_id,
        organization_id: newRecord.organization_id || null,
        ...payloadRoleSpecific
      }, null, 2)}`
    ]);

    try {
      const response = await fetch(registerEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          user_type_id: newRecord.user_type_id,
          nic: newRecord.nic,
          password: newRecord.password,
          email: newRecord.email,
          passport: newRecord.passport,
          title_id: newRecord.title_id,
          first_name: newRecord.first_name,
          middle_name: newRecord.middle_name,
          last_name: newRecord.last_name,
          sex: newRecord.sex,
          dob: newRecord.dob,
          phone: newRecord.phone,
          access_level_id: newRecord.access_level_id,
          organization_id: newRecord.organization_id || undefined,
          ...payloadRoleSpecific
        })
      });

      setRegisterPostLogs(prev => [...prev, `[${logTime()}] Response status code: ${response.status} (${response.statusText})`]);

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}: ${response.statusText}`);
      }

      const responseText = await response.text();
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
        setRegisterPostLogs(prev => [...prev, `[${logTime()}] Response JSON received successfully!`]);
      } catch (err) {
        responseData = responseText;
        setRegisterPostLogs(prev => [...prev, `[${logTime()}] Response raw text: ${responseText}`]);
      }

      setRegisterPostStatus('success');
      setRegisterPostLogs(prev => [
        ...prev,
        `[${logTime()}] SUCCESS: Member registered on remote server!`,
        `[${logTime()}] Server Response: ${typeof responseData === 'object' ? JSON.stringify(responseData, null, 2) : responseData}`
      ]);

      // Capture the real MongoDB _id from the response so delete can use it later
      const dbId = responseData?.createdParent?._id
        || responseData?.createdStudent?._id
        || responseData?.createdTeacher?._id
        || responseData?.createdAdmin?._id
        || responseData?._id
        || undefined;

      setUsers(prevUsers => [{ ...newRecord, dbId }, ...prevUsers]);
      setSuccessToast("successful");
      setTimeout(() => setSuccessToast(null), 5000);

      // Clear form inputs on success
      setNic('');
      setPassword('');
      setEmail('');
      setPassport('');
      setFirstName('');
      setMiddleName('');
      setLastName('');
      setDob('');
      setPhone('');
      setOrganizationId('');
      setFormErrors({});

      // Jump to directory tab to view the payload
      setActiveTab('directory');
      setSelectedUserJson(newRecord.id);
    } catch (error: any) {
      console.error(error);
      const errMsg = error.message || String(error);
      setRegisterPostStatus('error');
      setRegisterPostErrorMsg(errMsg);
      setRegisterPostLogs(prev => [
        ...prev,
        `[${logTime()}] ERROR: Remote registration failed.`,
        `[${logTime()}] Details: ${errMsg}`
      ]);

      setSuccessToast("not able to register");
      setTimeout(() => setSuccessToast(null), 5000);
    } finally {
      setIsPostingRegister(false);
    }
  };

  // Delete User Record
  const handleDelete = async (id: string, tokenOverride?: string, alreadyConfirmed = false) => {
    if (!alreadyConfirmed) {
      showConfirm(
        'Confirm Permanent Deletion',
        'Are you sure you want to delete this user record? This will permanently delete both their Auth credentials and their User Profile (m_admin/m_student/m_teacher/m_parent) from the database.',
        () => handleDelete(id, tokenOverride, true)
      );
      return;
    }

    const user = users.find(u => u.id === id);
    if (!user) return;

    const dbId = user.dbId || user.id;
    if (!dbId) {
      showAlert('Cannot delete', 'This record has no database ID (it may have been created before this fix). Removing it from local view only.', 'info');
      setUsers(users.filter(u => u.id !== id));
      if (selectedUserJson === id) setSelectedUserJson(null);
      return;
    }

    // Use provided token Override, or fall back to stored abmsToken
    const token = tokenOverride || abmsToken;
    if (!token) {
      setPendingDeleteId(id);
      setShowAbmsLogin(true);
      return;
    }

    // Determine correct endpoint based on user_type_id
    const userTypeMeta = userTypesList.find(t => t.id === user.user_type_id || t.label.toLowerCase() === (user.user_type_id || '').toLowerCase());
    const typeLabel = userTypeMeta ? userTypeMeta.label : user.user_type_id;
    const typeId = (typeLabel || '').toLowerCase();
    let endpoint = '';
    let method = 'DELETE';

    if (typeId.includes('student')) {
      endpoint = `/m/student/delete/${dbId}`;
      method = 'DELETE';
    } else if (typeId.includes('teacher') || typeId.includes('instruct')) {
      endpoint = `/m/teacher/delete/${dbId}`;
      method = 'DELETE';
    } else if (typeId.includes('parent') || typeId.includes('guard')) {
      endpoint = `/m/parent/delete/${dbId}`;
      method = 'POST';
    } else if (typeId.includes('admin')) {
      endpoint = `/m/admin/delete/${dbId}`;
      method = 'POST';
    }

    if (!endpoint) {
      showAlert('Unknown User Type', `Unknown user type "${user.user_type_id}" — cannot determine delete endpoint.`, 'error');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 401 || response.status === 403) {
        // Token expired or invalid — clear it and prompt re-login
        setAbmsToken('');
        localStorage.removeItem('squad_abms_token');
        setPendingDeleteId(id);
        setShowAbmsLogin(true);
        return;
      }

      if (!response.ok) {
        const errText = await response.text();
        showConfirm(
          'Backend Deletion Failed',
          `Failed to delete from database (${response.status}): ${errText}. Would you like to force delete this record locally instead?`,
          () => {
            setUsers(users.filter(u => u.id !== id));
            if (selectedUserJson === id) setSelectedUserJson(null);
            showAlert('Success', 'Record removed from local view.', 'success');
          }
        );
        return;
      }

      // Only remove from UI after confirmed DB deletion
      setUsers(users.filter(u => u.id !== id));
      if (selectedUserJson === id) setSelectedUserJson(null);
      showAlert('Success', 'User successfully deleted from both the Auth credentials schema and the specific User Profile schema!', 'success');
    } catch (err: any) {
      showConfirm(
        'Connection Error',
        `Network error while deleting: ${err.message}. Would you like to force delete this record locally instead?`,
        () => {
          setUsers(users.filter(u => u.id !== id));
          if (selectedUserJson === id) setSelectedUserJson(null);
          showAlert('Success', 'Record removed from local view.', 'success');
        }
      );
    }
  };

  // Copy body parameters to clipboard
  const handleCopyJson = (user: SquadUser) => {
    const payload = {
      user_type_id: user.user_type_id,
      nic: user.nic,
      password: user.password,
      email: user.email,
      passport: user.passport,
      title_id: user.title_id,
      first_name: user.first_name,
      middle_name: user.middle_name,
      last_name: user.last_name,
      sex: user.sex,
      dob: user.dob,
      phone: user.phone,
      access_level_id: user.access_level_id
    };
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(user.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Handle Commit & Push Sync Simulator
  const handleGitPush = (e: React.FormEvent) => {
    e.preventDefault();
    if (isPushing) return;

    setIsPushing(true);
    setPushSuccess(false);
    setPushLogs([]);

    const sequence = [
      `$ git remote add origin ${gitRepo}`,
      `$ git checkout -b ${gitBranch}`,
      `Connecting to remote repository...`,
      gitToken 
        ? `✔ Successfully authenticated with Personal Access Token (PAT) fingerprint: ...${gitToken.slice(-6) || 'active'}`
        : `⚠ Warning: No custom access token entered yet. Running in sandbox deployment...`,
      `Preparing delta of dropdown modifications...`,
      `[MODIFIED] /src/App.tsx  (Added institution and grade parameters with live REST API POST integrations)`,
      `Writing git packfile: 100% (2/2 files serialized)`,
      `Uploading branch "${gitBranch}" to remote JacksonMongbam123 repository...`,
      `✔ Commit successfully pushed to SQUAD repository on branch "${gitBranch}"!`
    ];

    let step = 0;
    const interval = setInterval(() => {
      if (step < sequence.length) {
        setPushLogs(prev => [...prev, sequence[step]]);
        step++;
      } else {
        clearInterval(interval);
        setIsPushing(false);
        setPushSuccess(true);
      }
    }, 300);
  };

  const activeInstitution = institutionsList.find(inst => inst.is_active === 'true') || institutionsList[0];


  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectionName.trim()) return;
    const cleanSection = newSectionName.trim();
    if (sectionsList.includes(cleanSection) || remoteSectionsList.includes(cleanSection)) {
      alert('Section already exists');
      return;
    }

    try {
      const response = await fetch('/df/section/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section: cleanSection })
      });

      if (response.ok) {
        setSectionsList([...sectionsList, cleanSection]);
        setRemoteSectionsList([...remoteSectionsList, cleanSection]);
        setNewSectionName('');
        setSuccessToast(`Added Section: ${cleanSection}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to add section');
      }
    } catch (err) {
      console.error('Error adding section:', err);
      alert('Error connecting to backend');
    }
  };

  const handleDeleteSection = async (section: string) => {
    if (sectionsList.length <= 1 && remoteSectionsList.length <= 1) {
      alert('Must keep at least one Section!');
      return;
    }

    try {
      const response = await fetch('/df/section/delete-by-name', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ section })
      });

      if (response.ok) {
        setSectionsList(sectionsList.filter(s => s !== section));
        setRemoteSectionsList(remoteSectionsList.filter(s => s !== section));
        setSuccessToast(`Deleted Section: ${section}`);
        setTimeout(() => setSuccessToast(null), 3000);
      } else {
        const error = await response.json();
        alert(error.message || error.error || 'Failed to delete section');
      }
    } catch (err) {
      console.error('Error deleting section:', err);
      alert('Error connecting to backend');
    }
  };


    return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex font-sans antialiased">

      {/* ABMS Login Modal — shown when delete requires authentication */}
      {showAbmsLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">ABMS Admin Login Required</h3>
              <p className="text-xs text-slate-500">Enter your admin credentials to authenticate delete operations.</p>
            </div>
            {abmsLoginError && (
              <div className="space-y-2">
                <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-[11px] text-red-700 font-medium">
                  {abmsLoginError}
                </div>
                {abmsLoginError.toLowerCase().includes('portal id') && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-[10px] text-amber-800 leading-normal">
                    <strong>Tip:</strong> The remote server requires an active <strong>Administrator</strong> account. 
                    If you haven't registered an Admin with this Username/NIC yet, please register one under the 
                    <em>"Register Member"</em> tab first.
                  </div>
                )}
              </div>
            )}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Username / NIC / Reg No</label>
                <input
                  type="text"
                  value={abmsUsername}
                  onChange={e => setAbmsUsername(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <input
                  type="password"
                  value={abmsPassword}
                  onChange={e => setAbmsPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={e => e.key === 'Enter' && handleAbmsLogin()}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { setShowAbmsLogin(false); setPendingDeleteId(null); setAbmsLoginError(''); }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAbmsLogin}
                disabled={abmsLoginLoading || !abmsUsername || !abmsPassword}
                className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {abmsLoginLoading ? 'Logging in...' : 'Login & Delete'}
              </button>
            </div>
            
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
              <p className="text-[10px] text-slate-400 text-center leading-normal">
                Don't have admin credentials? Force remove the member locally from the app interface instead:
              </p>
              <button
                type="button"
                onClick={() => {
                  if (pendingDeleteId) {
                    setUsers(users.filter(u => u.id !== pendingDeleteId));
                    if (selectedUserJson === pendingDeleteId) setSelectedUserJson(null);
                    setPendingDeleteId(null);
                  }
                  setShowAbmsLogin(false);
                  setAbmsLoginError('');
                  showAlert('Local Deletion Success', 'Record removed from local list view successfully.', 'success');
                }}
                className="w-full py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-lg border border-amber-200 transition-colors cursor-pointer text-center"
              >
                Bypass & Force Local Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal Overlay */}
      {customConfirm && customConfirm.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-rose-50 text-rose-600 rounded-full shrink-0">
                <Trash2 className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900">{customConfirm.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{customConfirm.message}</p>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  if (customConfirm.onCancel) customConfirm.onCancel();
                  setCustomConfirm(null);
                }}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer border border-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={customConfirm.onConfirm}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Alert Modal Overlay */}
      {customAlert && customAlert.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 w-full max-w-sm space-y-4">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full shrink-0 ${
                customAlert.type === 'success' ? 'bg-emerald-50 text-emerald-600' :
                customAlert.type === 'error' ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
              }`}>
                {customAlert.type === 'success' ? <Check className="h-6 w-6" /> :
                 customAlert.type === 'error' ? <AlertCircle className="h-6 w-6" /> : <Info className="h-6 w-6" />}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="text-sm font-bold text-slate-900">{customAlert.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{customAlert.message}</p>
              </div>
            </div>
            <div className="pt-2">
              <button
                onClick={() => setCustomAlert(null)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* 1. LEFT NAVIGATION BAR */}
      <aside className={`bg-white border-r border-slate-200 flex flex-col shrink-0 transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-64'}`}>
        {/* Brand Header */}
        <div className={`h-16 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 transition-all duration-300 ${isSidebarCollapsed ? 'px-3' : 'px-4'}`}>
          <div className="flex items-center space-x-2 overflow-hidden">
            <div className="p-1.5 bg-indigo-600 rounded text-white shadow-sm shrink-0">
              <Building className="h-4.5 w-4.5" />
            </div>
            {!isSidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="shrink-0"
              >
                <h1 className="text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap max-w-[130px] truncate" title="SQUAD Portal">
                  SQUAD Portal
                </h1>
                <p className="text-[9px] font-mono text-slate-500 whitespace-nowrap truncate max-w-[130px]">
                  {activeInstitution ? activeInstitution.name : 'SQUAD Workspace'}
                </p>
              </motion.div>
            )}
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-1.5 hover:bg-slate-200/60 rounded-lg text-slate-500 hover:text-slate-700 transition shrink-0"
            title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isSidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'dashboard'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Overall Dashboard" : ""}
          >
            <LayoutDashboard className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Overall Dashboard</span>}
          </button>

          <button
            onClick={() => setActiveTab('view_org')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'view_org'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "View Organization" : ""}
          >
            <Building className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>View Organization</span>}
          </button>

          <button
            onClick={() => setActiveTab('register')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'register'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Register Member" : ""}
          >
            <UserPlus className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Register Member</span>}
          </button>

          <button
            onClick={() => setActiveTab('directory')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all relative ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'directory'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Registered Directory" : ""}
          >
            <Users className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Registered Directory</span>}
            {users.length > 0 && (
              isSidebarCollapsed ? (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-indigo-600 rounded-full" />
              ) : (
                <span className="ml-auto bg-slate-200 text-slate-700 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
                  {users.length}
                </span>
              )
            )}
          </button>


          <button
            onClick={() => setActiveTab('configure')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'configure'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Configure Options" : ""}
          >
            <Settings className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Configure</span>}
          </button>

          <button
            onClick={() => setActiveTab('institutions')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'institutions'
                ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Manage Institutions" : ""}
          >
            <Building className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Institutions</span>}
          </button>

          <button
            onClick={() => setActiveTab('organization')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'organization'
                ? 'bg-orange-50 text-orange-700 shadow-sm border border-orange-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Organization Details" : ""}
          >
            <Building className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Organization</span>}
          </button>

          <button
            onClick={() => setActiveTab('classes')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'classes'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Classes" : ""}
          >
            <BookOpen className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Classes</span>}
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className={`w-full flex items-center rounded-lg text-xs font-semibold transition-all ${
              isSidebarCollapsed ? 'justify-center p-2.5' : 'space-x-3 px-3 py-2'
            } ${
              activeTab === 'subjects'
                ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
            }`}
            title={isSidebarCollapsed ? "Subjects" : ""}
          >
            <Bookmark className="h-4 w-4 shrink-0" />
            {!isSidebarCollapsed && <span>Subjects</span>}
          </button>
        </nav>

        {/* User context footer */}
        <div className={`p-4 border-t border-slate-200 bg-slate-50/50 text-[11px] text-slate-500 font-mono transition-all duration-300 ${isSidebarCollapsed ? 'flex justify-center' : 'space-y-1.5'}`}>
          {isSidebarCollapsed ? (
            <div className="flex items-center justify-center relative group">
              <span className={`h-2 w-2 rounded-full animate-pulse ${
                serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
              }`} />
              <div className="absolute left-10 bottom-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-md z-50">
                Server {serverVersion} ({serverStatus}) • explorealmamater
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center space-x-1.5 text-slate-700 font-semibold">
                <span className={`h-1.5 w-1.5 rounded-full animate-pulse ${
                  serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                <span>SQUAD Server {serverVersion}</span>
                <span className={`text-[9px] uppercase px-1 rounded font-sans text-white font-bold scale-90 ${
                  serverStatus === 'online' ? 'bg-emerald-500' : serverStatus === 'maintenance' ? 'bg-amber-500' : 'bg-rose-500'
                }`}>
                  {serverStatus}
                </span>
              </div>
              <div className="truncate text-slate-400" title="explorealmamater@gmail.com">
                Active: explorealmamater
              </div>
            </>
          )}
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto flex justify-center p-6 sm:p-10 bg-slate-50">
        
        <div className="w-full max-w-4xl space-y-6">
          
          {/* Notifications Success Toast */}
          <AnimatePresence>
            {successToast && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 text-xs font-medium flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-2">
                  <Check className="h-4.5 w-4.5 text-emerald-600" />
                  <span>{successToast}</span>
                </div>
                <button 
                  onClick={() => setSuccessToast(null)}
                  className="text-emerald-500 hover:text-emerald-700 font-mono font-bold"
                >
                  ✕
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tab Views Switcher */}
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && (() => {
              const totalUsers = users.length;
              const totalStudents = users.filter(isStudent).length;
              const totalTeachers = users.filter(isTeacher).length;
              const totalParents = users.filter(isParent).length;
              const totalAdmins = users.filter(isAdmin).length;
              const totalOrgs = distinctOrgs.length;

              return (
                <motion.div
                  key="dashboard-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* Dashboard Header */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <LayoutDashboard className="h-5 w-5 text-indigo-600" />
                        <span>Overall SQUAD Directory Dashboard</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Consolidated overview of registered SQUAD members, organizational counts, and system configurations.
                      </p>
                    </div>
                    <div className="text-[10px] bg-slate-100 font-mono text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5">
                      <span className="h-2 w-2 bg-indigo-600 rounded-full animate-pulse"></span>
                      <span>Real-time Sync</span>
                    </div>
                  </div>

                  {/* 1. Statistics Cards Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Card 1: Total Registered Members */}
                    <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-2xl p-5 shadow-sm border border-indigo-400/20 relative overflow-hidden group hover:shadow-md transition duration-200 col-span-2 md:col-span-1">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-10 group-hover:scale-110 transition duration-300">
                        <Users className="h-24 w-24" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-100/80 font-mono">Total Members</p>
                      <p className="text-3xl font-extrabold mt-2 tracking-tight">{totalUsers}</p>
                      <div className="flex items-center gap-1 mt-2 text-[10px] text-indigo-100 font-mono bg-indigo-700/30 w-max px-2 py-0.5 rounded-full">
                        <span className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        <span>Active Records</span>
                      </div>
                    </div>

                    {/* Card 2: Students */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 relative overflow-hidden group hover:shadow-md transition duration-200">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition duration-300 text-emerald-600">
                        <GraduationCap className="h-24 w-24" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                        Students
                      </p>
                      <p className="text-3xl font-extrabold mt-2 text-slate-900 tracking-tight">{totalStudents}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        {totalUsers > 0 ? ((totalStudents / totalUsers) * 100).toFixed(0) : 0}% of directory
                      </p>
                    </div>

                    {/* Card 3: Instructors/Teachers */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 relative overflow-hidden group hover:shadow-md transition duration-200">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition duration-300 text-purple-600">
                        <Users className="h-24 w-24" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                        Instructors
                      </p>
                      <p className="text-3xl font-extrabold mt-2 text-slate-900 tracking-tight">{totalTeachers}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        {totalUsers > 0 ? ((totalTeachers / totalUsers) * 100).toFixed(0) : 0}% of directory
                      </p>
                    </div>

                    {/* Card 4: Parents */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 relative overflow-hidden group hover:shadow-md transition duration-200">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition duration-300 text-amber-600">
                        <Users className="h-24 w-24" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        Parents
                      </p>
                      <p className="text-3xl font-extrabold mt-2 text-slate-900 tracking-tight">{totalParents}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        {totalUsers > 0 ? ((totalParents / totalUsers) * 100).toFixed(0) : 0}% of directory
                      </p>
                    </div>

                    {/* Card 5: Administrators */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 relative overflow-hidden group hover:shadow-md transition duration-200">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition duration-300 text-rose-600">
                        <Shield className="h-24 w-24" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                        Admins
                      </p>
                      <p className="text-3xl font-extrabold mt-2 text-slate-900 tracking-tight">{totalAdmins}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        {totalUsers > 0 ? ((totalAdmins / totalUsers) * 100).toFixed(0) : 0}% of directory
                      </p>
                    </div>

                    {/* Card 6: Partner Organizations */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 hover:border-slate-300 relative overflow-hidden group hover:shadow-md transition duration-200">
                      <div className="absolute top-0 right-0 p-8 transform translate-x-4 -translate-y-4 opacity-5 group-hover:scale-110 transition duration-300 text-indigo-600">
                        <Building className="h-24 w-24" />
                      </div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                        <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                        Organizations
                      </p>
                      <p className="text-3xl font-extrabold mt-2 text-slate-900 tracking-tight">{totalOrgs}</p>
                      <p className="text-[10px] text-slate-400 mt-2 font-mono">
                        Connected DB & Local
                      </p>
                    </div>
                  </div>

                  {/* 2. Visual Distribution Breakdowns */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* User Type Distribution Progress List */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-2 border-b border-slate-100">
                          User Type Distribution
                        </h3>
                        <div className="space-y-4 mt-4">
                          {/* Row 1: Students */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <GraduationCap className="h-4 w-4 text-emerald-600" />
                                Students
                              </span>
                              <span>{totalStudents} ({totalUsers > 0 ? ((totalStudents / totalUsers) * 100).toFixed(0) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${totalUsers > 0 ? (totalStudents / totalUsers) * 100 : 0}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-emerald-500 h-2 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Row 2: Instructors */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-purple-600" />
                                Instructors / Teachers
                              </span>
                              <span>{totalTeachers} ({totalUsers > 0 ? ((totalTeachers / totalUsers) * 100).toFixed(0) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${totalUsers > 0 ? (totalTeachers / totalUsers) * 100 : 0}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-purple-500 h-2 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Row 3: Parents */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 text-amber-600" />
                                Parents / Guardians
                              </span>
                              <span>{totalParents} ({totalUsers > 0 ? ((totalParents / totalUsers) * 100).toFixed(0) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${totalUsers > 0 ? (totalParents / totalUsers) * 100 : 0}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-amber-500 h-2 rounded-full"
                              />
                            </div>
                          </div>

                          {/* Row 4: Admins */}
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span className="flex items-center gap-1.5">
                                <Shield className="h-4 w-4 text-rose-600" />
                                Administrators
                              </span>
                              <span>{totalAdmins} ({totalUsers > 0 ? ((totalAdmins / totalUsers) * 100).toFixed(0) : 0}%)</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${totalUsers > 0 ? (totalAdmins / totalUsers) * 100 : 0}%` }}
                                transition={{ duration: 0.5 }}
                                className="bg-rose-500 h-2 rounded-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-4">
                        Roles correspond directly to SQUAD database parameters.
                      </div>
                    </div>

                    {/* Organizations leaderboard list */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>Organization Enrollment</span>
                          <span className="text-[10px] text-slate-400 font-normal">Active Members</span>
                        </h3>
                        
                        <div className="mt-4 space-y-3.5 max-h-[190px] overflow-y-auto pr-1">
                          {distinctOrgs.length === 0 ? (
                            <div className="text-center py-8 text-slate-400 text-xs">
                              No organizations registered yet.
                            </div>
                          ) : (
                            distinctOrgs.map(org => {
                              const count = users.filter(u => isUserInOrg(u.organization_id, org)).length;

                              return (
                                <div key={org.id} className="flex items-center justify-between">
                                  <div className="space-y-0.5 truncate mr-2">
                                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 truncate">
                                      <Building className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                                      <span className="truncate max-w-[200px]" title={org.name}>{org.name}</span>
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-mono truncate">ID: {org.id}</div>
                                  </div>
                                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-full shrink-0">
                                    {count} {count === 1 ? 'member' : 'members'}
                                  </span>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs text-slate-500">
                        <span>Unassigned SQUAD members:</span>
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full font-mono">
                          {users.filter(u => !u.organization_id).length}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Recent Registrations Section */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Recent SQUAD Directory Registrations
                      </h3>
                      <button
                        onClick={() => setActiveTab('directory')}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
                      >
                        View Full Directory →
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {users.slice(0, 5).map(u => {
                        const userTypeMeta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === (u.user_type_id || '').toLowerCase());
                        const accessLvlMeta = accessLevelsList.find(l => l.id === u.access_level_id);
                        return (
                          <div key={u.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50/30 transition">
                            <div className="flex items-center space-x-3 truncate">
                              <div className="p-2 bg-slate-100 rounded-full text-slate-700 shrink-0 font-bold text-xs uppercase font-mono">
                                {((u.first_name || "?")[0] || "?").toUpperCase()}{((u.last_name || "?")[0] || "?").toUpperCase()}
                              </div>
                              <div className="truncate space-y-0.5">
                                <h4 className="text-xs font-bold text-slate-900 truncate">
                                  {u.title_id}. {u.first_name} {u.last_name}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-mono truncate">NIC: {u.nic} | Email: {u.email}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 shrink-0">
                              <span className="text-[9px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded font-semibold font-mono">
                                {userTypeMeta?.label || u.user_type_id}
                              </span>
                              <span className="text-[9px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold font-mono">
                                Lvl {u.access_level_id}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {users.length === 0 && (
                        <div className="p-12 text-center text-slate-400 text-xs">
                          No registered SQUAD members found in directory database.
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })()}

            {activeTab === 'view_org' && (() => {
              const selectedOrg = distinctOrgs.find(o => o.id === selectedViewOrgId);
              const orgDetails = selectedOrg ? (organizationsList || []).find((org: any) => org && (org._id === selectedViewOrgId || org.name.toLowerCase() === selectedOrg.name.toLowerCase())) : null;

              const selectedOrgUsers = selectedOrg ? users.filter(u => isUserInOrg(u.organization_id, selectedOrg)) : [];

              const orgUsersCount = selectedOrgUsers.length;
              const orgStudentsCount = selectedOrgUsers.filter(isStudent).length;
              const orgTeachersCount = selectedOrgUsers.filter(isTeacher).length;
              const orgParentsCount = selectedOrgUsers.filter(isParent).length;
              const orgAdminsCount = selectedOrgUsers.filter(isAdmin).length;

              return (
                <motion.div
                  key="view-org-view"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  {/* Selection Header */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Building className="h-5 w-5 text-indigo-600" />
                        <span>View Organization Members & Details</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Select a registered institution or organization to filter its members and review its database profile.
                      </p>
                    </div>

                    <div className="relative max-w-md">
                      <select
                        id="selected_view_org_dropdown"
                        value={selectedViewOrgId}
                        onChange={e => setSelectedViewOrgId(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-3 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm appearance-none transition-all cursor-pointer"
                      >
                        <option value="">— Select Organization —</option>
                        {distinctOrgs.map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>

                  {selectedOrg ? (
                    <div className="space-y-6">
                      {/* Organization Details Panel */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-2 border-b border-slate-100 flex items-center justify-between">
                          <span>Organization Database Profile</span>
                          <span className="text-[10px] text-slate-400 font-normal">ID: {selectedOrg.id}</span>
                        </h3>

                        {orgDetails ? (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-1 md:col-span-1">
                              <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Organization Name</p>
                              <p className="text-sm font-bold text-slate-950">{orgDetails.name}</p>
                              {orgDetails.key && (
                                <p className="text-[10px] text-indigo-600 font-mono font-semibold bg-indigo-50 border border-indigo-100/50 px-2 py-0.5 rounded-full w-max mt-1">
                                  Key: {orgDetails.key}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2 md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Address Location</p>
                                <p className="text-xs font-medium text-slate-700">{orgDetails.line1 || '—'}</p>
                                {orgDetails.line2 && <p className="text-xs font-medium text-slate-700">{orgDetails.line2}</p>}
                                {orgDetails.line3 && <p className="text-xs font-medium text-slate-700">{orgDetails.line3}</p>}
                              </div>
                              <div className="space-y-1">
                                <p className="text-[10px] font-bold uppercase font-mono text-slate-400">City & Postal Code</p>
                                <p className="text-xs font-medium text-slate-700">
                                  {orgDetails.city || '—'} {orgDetails.postcode || ''}
                                </p>
                                <p className="text-[10px] text-emerald-600 font-mono font-semibold bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full w-max mt-1">
                                  Verified Database Record
                                </p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start space-x-3 bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <Info className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                            <div className="space-y-1">
                              <p className="text-xs font-bold text-slate-800">{selectedOrg.name}</p>
                              <p className="text-xs text-slate-500">
                                This organization exists in SQUAD network, but detailed database profile credentials (street address, postcode, keys) are not registered on the remote backend.
                              </p>
                              <p className="text-[10px] text-slate-400 font-mono mt-1">
                                Configure physical details under the "Organization" tab in the left navigation panel.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* SQUAD Statistics for Selected Organization */}
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <p className="text-[10px] font-bold uppercase font-mono text-slate-400">All Members</p>
                          <p className="text-xl font-bold text-indigo-600 mt-1">{orgUsersCount}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Students</p>
                          <p className="text-xl font-bold text-emerald-600 mt-1">{orgStudentsCount}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Instructors</p>
                          <p className="text-xl font-bold text-purple-600 mt-1">{orgTeachersCount}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Parents</p>
                          <p className="text-xl font-bold text-amber-600 mt-1">{orgParentsCount}</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-slate-200">
                          <p className="text-[10px] font-bold uppercase font-mono text-slate-400">Administrators</p>
                          <p className="text-xl font-bold text-rose-600 mt-1">{orgAdminsCount}</p>
                        </div>
                      </div>

                      {/* Filtered SQUAD Members List for this Organization */}
                      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                            {selectedOrg.name} SQUAD Members Roster
                          </h4>
                        </div>

                        <div className="divide-y divide-slate-100">
                          {selectedOrgUsers.length === 0 ? (
                            <div className="p-12 text-center space-y-3">
                              <Database className="h-8 w-8 text-slate-300 mx-auto" />
                              <h4 className="text-xs font-bold text-slate-700">No registered SQUAD members found under this organization</h4>
                              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                                Use the "Register Member" tab in the left navigation panel to add new SQUAD members and link them to {selectedOrg.name}.
                              </p>
                            </div>
                          ) : (
                            selectedOrgUsers.map(u => {
                              const isExpanded = selectedUserJson === u.id;
                              const userTypeMeta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === (u.user_type_id || '').toLowerCase());
                              const accessLvlMeta = accessLevelsList.find(l => l.id === u.access_level_id);

                              return (
                                <div key={u.id} className="p-4 sm:p-6 hover:bg-slate-50/40 transition">
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex items-start space-x-3">
                                      <div className="p-2 bg-slate-100 rounded-full text-slate-700 shrink-0 font-bold text-xs uppercase font-mono">
                                        {((u.first_name || "?")[0] || "?").toUpperCase()}{((u.last_name || "?")[0] || "?").toUpperCase()}
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                          <span>{u.title_id}. {u.first_name} {u.middle_name} {u.last_name}</span>
                                          <span className="text-[10px] text-slate-400 font-normal">(@{u.nic})</span>
                                        </h4>
                                        
                                        <div className="flex flex-wrap items-center gap-2 pt-1">
                                          <span className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded font-semibold font-mono">
                                            {userTypeMeta?.label || u.user_type_id}
                                          </span>
                                          <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold font-mono">
                                            {accessLvlMeta?.label || u.access_level_id}
                                          </span>
                                          <span className="text-[10px] text-slate-400 font-mono">
                                            DOB: {u.dob} | Sex: {u.sex}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                                      <button
                                        onClick={() => setSelectedUserJson(isExpanded ? null : u.id)}
                                        className="text-xs font-mono text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-2.5 py-1.5 rounded transition"
                                      >
                                        {isExpanded ? 'Hide Payload' : 'View Payload JSON'}
                                      </button>
                                      <button
                                        onClick={() => handleCopyJson(u)}
                                        className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded transition"
                                        title="Copy raw body parameters JSON"
                                      >
                                        {copiedId === u.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                      </button>
                                    </div>
                                  </div>

                                  {/* Expanded Payload Visualizer */}
                                  <AnimatePresence>
                                    {isExpanded && (
                                      <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 overflow-hidden"
                                      >
                                        <div className="p-4 bg-slate-900 rounded-xl font-mono text-[11px] text-slate-300 space-y-2 border border-slate-800 shadow-inner">
                                          <div className="flex items-center justify-between text-slate-500 border-b border-slate-800 pb-2 mb-2">
                                            <span>SQUAD BODY PARAMETERS PAYLOAD</span>
                                            <span className="text-[9px] bg-indigo-900 text-indigo-200 px-1.5 py-0.5 rounded uppercase font-bold">JSON</span>
                                          </div>
                                          <pre className="overflow-x-auto p-1 leading-relaxed selection:bg-indigo-500/30">
                                            {JSON.stringify({
                                              user_type_id: u.user_type_id,
                                              nic: u.nic,
                                              password: u.password,
                                              email: u.email,
                                              passport: u.passport,
                                              title_id: u.title_id,
                                              first_name: u.first_name,
                                              middle_name: u.middle_name,
                                              last_name: u.last_name,
                                              sex: u.sex,
                                              dob: u.dob,
                                              phone: u.phone,
                                              access_level_id: u.access_level_id,
                                              organization_id: u.organization_id || null
                                            }, null, 2)}
                                          </pre>
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center space-y-4">
                      <Building className="h-12 w-12 text-slate-300 mx-auto" />
                      <h3 className="text-sm font-bold text-slate-700">No Organization Selected</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Please select a SQUAD organization from the dropdown selector above to inspect its details and view registered members.
                      </p>
                    </div>
                  )}
                </motion.div>
              );
            })()}

            {activeTab === 'register' && (
              <motion.div
                key="register-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 2. REGISTER NEW MEMBER CARD */}
                {/* Note: In accordance with instructions, this card represents the top boundary (nothing above) */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Card Title */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                      <UserPlus className="h-5 w-5 text-indigo-600" />
                      <span>Register New Member</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Configure standard SQUAD body parameter records. Fields correspond exactly to API parameters.
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="p-6 sm:p-8 space-y-6">
                    
                    {/* SECTION A: Human Classification */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        1. Classification Parameters
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Dropdown User Type ID (Student, Teacher/Instructor, Administrator, Parent/Guardian) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>User Type (user_type_id) *</span>
                            <span className="text-[10px] font-mono text-slate-400">Dropdown Selection</span>
                          </label>
                          <div className="relative">
                            <select
                              id="user_type_id"
                              value={userTypeId}
                              onChange={e => setUserTypeId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {userTypesList.map(ut => (
                                <option key={ut.id} value={ut.id}>{ut.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        {/* Dropdown Access Level ID (Level 1 to Level 5) */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>Access Level (access_level_id) *</span>
                            <span className="text-[10px] font-mono text-slate-400">Dropdown Selection</span>
                          </label>
                          <div className="relative">
                            <select
                              id="access_level_id"
                              value={accessLevelId}
                              onChange={e => setAccessLevelId(Number(e.target.value))}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {accessLevelsList.map(al => (
                                <option key={al.id} value={al.id}>{al.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Institution / Organization mapping */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1.5"><Building className="h-3.5 w-3.5 text-indigo-500" /> Institution (organization_id)</span>
                          <span className="text-[10px] font-mono text-slate-400">{mOrgsLoading ? 'Loading...' : `${organizationsList.length} available`}</span>
                        </label>
                        <div className="relative">
                          <select
                            id="organization_id"
                            value={organizationId}
                            onChange={e => setOrganizationId(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                          >
                            <option value="">— No institution assigned —</option>
                            {(organizationsList || []).filter(org => org && org._id && org.name).map(org => (
                              <option key={org._id} value={org._id}>{org.name}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                            <ChevronDown className="h-4 w-4" />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">Maps this member to an institution from the m_organizations schema on the ABMS backend.</p>
                      </div>
                    </div>

                    {/* SECTION B: Identification Metrics */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        2. Personal & Identity Metrics
                      </h3>

                      {/* Title, Gender, DOB Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Title (title_id)
                          </label>
                          <div className="relative">
                            <select
                              id="title_id"
                              value={titleId}
                              onChange={e => setTitleId(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {(remoteTitlesList || []).filter(t => t).map(t => {
                                const titleStr = typeof t === 'string' ? t : (t.title || '');
                                return <option key={titleStr} value={titleStr}>{titleStr}</option>;
                              })}
                              {(titlesList || []).filter(t => t && !(remoteTitlesList || []).some(rt => rt && (typeof rt === 'string' ? rt : rt.title) === t)).map(title => (
                                <option key={title} value={title}>{title} (local)</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Gender (sex)
                          </label>
                          <div className="relative">
                            <select
                              id="sex"
                              value={sex}
                              onChange={e => setSex(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                            >
                              {(sexesList || []).filter(s => s && s.id && s.label).map(s => (
                                <option key={s.id} value={s.id}>{s.label}</option>
                              ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <ChevronDown className="h-4 w-4" />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Date of Birth (dob) *
                          </label>
                          <div className="relative">
                            <input
                              type="date"
                              id="dob"
                              value={dob}
                              onChange={e => setDob(e.target.value)}
                              className={`w-full bg-slate-50 border ${formErrors.dob ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                            />
                          </div>
                          {formErrors.dob && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.dob}</p>}
                        </div>
                      </div>

                      {/* Name Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">First Name (first_name) *</label>
                          <input
                            type="text"
                            id="first_name"
                            placeholder="e.g. Jenish"
                            value={firstName}
                            onChange={e => setFirstName(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.first_name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.first_name && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.first_name}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Middle Name (middle_name)</label>
                          <input
                            type="text"
                            id="middle_name"
                            placeholder="e.g. J"
                            value={middleName}
                            onChange={e => setMiddleName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Last Name (last_name) *</label>
                          <input
                            type="text"
                            id="last_name"
                            placeholder="e.g. D"
                            value={lastName}
                            onChange={e => setLastName(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.last_name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.last_name && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.last_name}</p>}
                        </div>
                      </div>
                    </div>

                    {/* SECTION C: Authentication & Credentials */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        3. Server Credentials & Routing parameters
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">NIC (nic) *</label>
                          <input
                            type="text"
                            id="nic"
                            placeholder="e.g. jackson"
                            value={nic}
                            onChange={e => setNic(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.nic ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.nic && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.nic}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                            <span>Password (password) *</span>
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-indigo-600 hover:text-indigo-800 text-[10px] font-mono"
                            >
                              {showPassword ? 'Hide Key' : 'Reveal Key'}
                            </button>
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              id="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={e => setPassword(e.target.value)}
                              className={`w-full bg-slate-50 border ${formErrors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg pl-3 pr-10 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                              <Lock className="h-3.5 w-3.5" />
                            </div>
                          </div>
                          {formErrors.password && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.password}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Email (email) *</label>
                          <input
                            type="email"
                            id="email"
                            placeholder="e.g. jacson@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.email && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.email}</p>}
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Passport Identifier (passport) *</label>
                          <input
                            type="text"
                            id="passport"
                            placeholder="e.g. abcsd"
                            value={passport}
                            onChange={e => setPassport(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.passport ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.passport && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.passport}</p>}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone Number (phone) *</label>
                          <input
                            type="text"
                            id="phone"
                            placeholder="e.g. 8837092370"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                            className={`w-full bg-slate-50 border ${formErrors.phone ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200'} rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all`}
                          />
                          {formErrors.phone && <p className="text-[10px] text-rose-500 mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" /> {formErrors.phone}</p>}
                        </div>

                        <div className="flex items-end pb-0.5">
                          <p className="text-[11px] text-slate-400 italic">
                            * All input properties are verified to construct a valid JSON body with no extra properties.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Real-time remote POST status banner */}
                    {registerPostStatus !== 'idle' && (
                      <div className="mt-6">
                        {registerPostStatus === 'success' ? (
                          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-800 text-xs font-semibold flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="flex h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                              <span className="text-sm font-bold uppercase tracking-wider">successful</span>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-mono font-bold">POST SUCCESS</span>
                          </div>
                        ) : (
                          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 text-rose-800 text-xs font-semibold flex items-center justify-between w-full">
                            <div className="flex items-center space-x-2">
                              <span className="flex h-3 w-3 rounded-full bg-rose-500 animate-pulse"></span>
                              <span className="text-sm font-bold uppercase tracking-wider">not able to register</span>
                            </div>
                            <span className="text-[10px] bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full font-mono font-bold">POST FAILED</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Live HTTP POST Console for Registration */}
                    {(registerPostLogs.length > 0 || isPostingRegister) && (
                      <div className="rounded-xl border border-slate-800 bg-slate-950 overflow-hidden shadow-lg mt-4">
                        <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                            <span className="font-bold text-slate-300">REGISTRATION HTTP POST TERMINAL</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isPostingRegister ? (
                              <span className="text-amber-400 flex items-center gap-1">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                <span>SENDING...</span>
                              </span>
                            ) : registerPostStatus === 'success' ? (
                              <span className="text-emerald-400 font-bold">● SUCCESS (200 OK)</span>
                            ) : registerPostStatus === 'error' ? (
                              <span className="text-rose-400 font-bold">● FAILED</span>
                            ) : (
                              <span>IDLE</span>
                            )}
                            <button 
                              type="button" 
                              onClick={() => setRegisterPostLogs([])} 
                              className="hover:text-slate-200 ml-2"
                            >
                              Clear Logs
                            </button>
                          </div>
                        </div>
                        <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                          {registerPostLogs.map((log, i) => {
                            let color = 'text-slate-300';
                            if (log.includes('SUCCESS') || log.includes('successful')) color = 'text-emerald-400 font-bold';
                            else if (log.includes('ERROR') || log.includes('failed') || log.includes('not able to register')) color = 'text-rose-400 font-bold';
                            else if (log.includes('Payload:')) color = 'text-amber-300';
                            else if (log.includes('Response status code:')) color = 'text-cyan-300';
                            return (
                              <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                {log}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Submit Register button */}
                    {/* Note: In accordance with instructions, this button is the absolute bottom boundary (nothing below) */}
                    <div className="pt-4 border-t border-slate-100 flex justify-end">
                      <button
                        type="submit"
                        id="btn-register-submit"
                        disabled={isPostingRegister}
                        className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 text-white text-xs font-bold px-6 py-3 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        {isPostingRegister ? (
                          <RefreshCw className="h-4.5 w-4.5 animate-spin" />
                        ) : (
                          <UserPlus className="h-4.5 w-4.5" />
                        )}
                        <span>{isPostingRegister ? 'Registering...' : 'Register SQUAD Member'}</span>
                      </button>
                    </div>

                  </form>
                </div>
              </motion.div>
            )}

            {activeTab === 'directory' && (
              <motion.div
                key="directory-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        <span>Registered SQUAD Members</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Active records saved locally. Click a member to review or copy their raw JSON body parameters payload.
                      </p>
                    </div>
                    
                    <button
                      onClick={() => {
                        showConfirm(
                          'Restore Seed Data',
                          'Are you sure you want to restore default seed members? This will reset your local directory listing to initial seed records.',
                          () => {
                            setUsers(INITIAL_USERS);
                            setSelectedUserJson(null);
                          }
                        );
                      }}
                      className="text-[10px] font-mono text-slate-500 hover:text-indigo-600 border border-slate-200 rounded px-2.5 py-1.5 bg-white hover:bg-slate-50 transition"
                    >
                      Restore Seed Data
                    </button>
                  </div>

                  {/* Filters Bar */}
                  <div className="px-6 py-4 bg-slate-50/50 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-end gap-4">
                    <div className="flex-1">
                      <label htmlFor="filter_org" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 select-none">
                        <Building className="h-3 w-3 text-indigo-500" /> Filter by Organization
                      </label>
                      <select
                        id="filter_org"
                        value={directoryOrgFilter}
                        onChange={(e) => setDirectoryOrgFilter(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="">All Organizations</option>
                        {distinctOrgs.map((org: any) => (
                          <option key={org.id} value={org.id}>
                            {org.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex-1">
                      <label htmlFor="filter_role" className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1 select-none">
                        <Shield className="h-3 w-3 text-indigo-500" /> Filter by Role (User Type)
                      </label>
                      <select
                        id="filter_role"
                        value={directoryRoleFilter}
                        onChange={(e) => setDirectoryRoleFilter(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
                      >
                        <option value="">All Roles</option>
                        {userTypesList.map((ut: any) => (
                          <option key={ut.id} value={ut.label}>
                            {ut.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {(directoryOrgFilter || directoryRoleFilter) && (
                      <div className="shrink-0">
                        <button
                          onClick={() => {
                            setDirectoryOrgFilter('');
                            setDirectoryRoleFilter('');
                          }}
                          className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center justify-center space-x-1 border border-slate-200"
                        >
                          <span>Clear Filters</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="divide-y divide-slate-100">
                    {(() => {
                      const filteredUsers = users.filter(u => {
                        // 1. Organization filtering
                        if (directoryOrgFilter) {
                          const matchOrg = distinctOrgs.find(org => 
                            org.id === directoryOrgFilter || 
                            org.name.toLowerCase() === directoryOrgFilter.toLowerCase()
                          );
                          if (matchOrg) {
                            if (!isUserInOrg(u.organization_id, matchOrg)) return false;
                          } else {
                            // fallback direct matching
                            const userOrgId = u.organization_id || '';
                            const isMatch = userOrgId === directoryOrgFilter ||
                                            userOrgId.toLowerCase() === directoryOrgFilter.toLowerCase();
                            if (!isMatch) return false;
                          }
                        }

                        // 2. Role filtering
                        if (directoryRoleFilter) {
                          // Get user's role ID (could be user_type_id field)
                          const userRoleId = u.user_type_id || u.role || u.type || '';
                          const roleIdLower = directoryRoleFilter.toLowerCase();
                          const userRoleLower = (userRoleId || '').toString().toLowerCase();
                          
                          // First try using the filter functions
                          let roleMatch = false;
                          
                          if (roleIdLower.includes('student')) {
                            roleMatch = isStudent(u);
                          } else if (roleIdLower.includes('teacher') || roleIdLower.includes('instruct')) {
                            roleMatch = isTeacher(u);
                          } else if (roleIdLower.includes('parent') || roleIdLower.includes('guard')) {
                            roleMatch = isParent(u);
                          } else if (roleIdLower.includes('admin')) {
                            roleMatch = isAdmin(u);
                          } else {
                            // Fallback: direct string comparison or inclusion
                            roleMatch = userRoleLower === roleIdLower || userRoleLower.includes(roleIdLower) || roleIdLower.includes(userRoleLower);
                            
                            // Also try to match against userTypesList
                            if (!roleMatch) {
                              const meta = userTypesList.find(t => 
                                t.id === directoryRoleFilter || 
                                t.label.toLowerCase() === roleIdLower ||
                                t.id.toLowerCase() === roleIdLower
                              );
                              if (meta) {
                                roleMatch = userRoleLower.includes(meta.label.toLowerCase()) || 
                                           userRoleLower.includes(meta.id.toLowerCase());
                              }
                            }
                          }
                          
                          if (!roleMatch) return false;
                        }

                        return true;
                      });

                      if (filteredUsers.length === 0) {
                        return (
                          <div className="p-12 text-center space-y-3">
                            <Database className="h-8 w-8 text-slate-300 mx-auto" />
                            <h4 className="text-xs font-bold text-slate-700">No registered members found</h4>
                            <p className="text-xs text-slate-400">
                              {users.length === 0 
                                ? 'Click "Register Member" in the left sidebar to add records.'
                                : 'No registered members match your active organization and role search filters.'}
                            </p>
                          </div>
                        );
                      }

                      return filteredUsers.map(u => {
                        const isExpanded = selectedUserJson === u.id;
                        const userTypeMeta = userTypesList.find(t => t.id === u.user_type_id || t.label.toLowerCase() === (u.user_type_id || '').toLowerCase());
                        const accessLvlMeta = accessLevelsList.find(l => l.id === u.access_level_id);

                        return (
                          <div key={u.id} className="p-4 sm:p-6 hover:bg-slate-50/40 transition">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-start space-x-3">
                                <div className="p-2 bg-slate-100 rounded-full text-slate-700 shrink-0 font-bold text-xs uppercase font-mono">
                                  {((u.first_name || "?")[0] || "?").toUpperCase()}{((u.last_name || "?")[0] || "?").toUpperCase()}
                                </div>
                                <div className="space-y-1">
                                  <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{u.title_id}. {u.first_name} {u.middle_name} {u.last_name}</span>
                                    <span className="text-[10px] text-slate-400 font-normal">(@{u.nic})</span>
                                  </h4>
                                  
                                  <div className="flex flex-wrap items-center gap-2 pt-1">
                                    <span className="text-[10px] bg-indigo-50 border border-indigo-100/50 text-indigo-700 px-2 py-0.5 rounded font-semibold font-mono">
                                      {userTypeMeta?.label || u.user_type_id}
                                    </span>
                                    <span className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-semibold font-mono">
                                      {accessLvlMeta?.label || u.access_level_id}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      DOB: {u.dob} | Sex: {u.sex}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 self-end sm:self-auto">
                                <button
                                  onClick={() => setSelectedUserJson(isExpanded ? null : u.id)}
                                  className="text-xs font-mono text-slate-600 hover:text-indigo-600 bg-slate-100 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-100 px-2.5 py-1.5 rounded transition"
                                >
                                  {isExpanded ? 'Hide Payload' : 'View Payload JSON'}
                                </button>
                                <button
                                  onClick={() => handleCopyJson(u)}
                                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 rounded transition"
                                  title="Copy raw body parameters JSON"
                                >
                                  {copiedId === u.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                                </button>
                                <button
                                  onClick={() => handleDelete(u.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 rounded transition"
                                  title="Delete record"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Collapsible JSON payload representation of requested body parameters */}
                            <AnimatePresence>
                              {isExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden mt-4 pt-4 border-t border-slate-100"
                                >
                                  <div className="relative bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300">
                                    <div className="absolute right-3 top-3 flex items-center space-x-2">
                                      <span className="text-[9px] text-slate-500 uppercase tracking-widest">BODY PARAMETERS PAYLOAD</span>
                                      <button
                                        onClick={() => handleCopyJson(u)}
                                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center space-x-1"
                                      >
                                        <Copy className="h-3 w-3" />
                                        <span>{copiedId === u.id ? 'Copied!' : 'Copy'}</span>
                                      </button>
                                    </div>
                                    <pre className="overflow-x-auto">
{`{
  "user_type_id": "${u.user_type_id}",
  "nic": "${u.nic}",
  "password": "${u.password}",
  "email": "${u.email}",
  "passport": "${u.passport}",
  "title_id": "${u.title_id}",
  "first_name": "${u.first_name}",
  "middle_name": "${u.middle_name}",
  "last_name": "${u.last_name}",
  "sex": "${u.sex}",
  "dob": "${u.dob}",
  "phone": "${u.phone}",
  "access_level_id": "${u.access_level_id}"
}`}
                                    </pre>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'gitsync' && (
              <motion.div
                key="gitsync-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
                  <div>
                    <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                      <Github className="h-5 w-5 text-indigo-600" />
                      <span>Sync SQUAD Changes with GitHub</span>
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Push your modified dropdown and body parameters schema commits directly to the SQUAD repository.
                    </p>
                  </div>

                  <form onSubmit={handleGitPush} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Repository Target URL</label>
                        <input
                          type="text"
                          value={gitRepo}
                          onChange={e => setGitRepo(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Branch</label>
                        <input
                          type="text"
                          value={gitBranch}
                          onChange={e => setGitBranch(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>Personal Access Token (PAT)</span>
                        <span className="text-[10px] text-indigo-600 font-mono">Will be provided to authorize write access</span>
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="ghp_************************************"
                          value={gitToken}
                          onChange={e => setGitToken(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Key className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">Commit Message</label>
                      <textarea
                        rows={2}
                        value={commitMessage}
                        onChange={e => setCommitMessage(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPushing}
                      className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
                    >
                      <GitCommit className="h-4 w-4" />
                      <span>{isPushing ? 'Syncing Repository...' : 'Commit & Push to GitHub'}</span>
                    </button>
                  </form>

                  {/* Terminal emulator logs */}
                  {pushLogs.length > 0 && (
                    <div className="bg-slate-900 rounded-xl p-4 font-mono text-[11px] text-slate-300 space-y-1">
                      <p className="text-slate-500 pb-1 border-b border-slate-800 mb-2 uppercase tracking-widest text-[9px]">TERMINAL OUTPUT LOGS</p>
                      {pushLogs.map((log, idx) => (
                        <p key={idx} className={log.startsWith('✔') ? 'text-emerald-400' : log.startsWith('$') ? 'text-indigo-400' : 'text-slate-300'}>
                          {log}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'institutions' && (
              <motion.div
                key="institutions-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Card Title */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Building className="h-5 w-5 text-indigo-600" />
                        <span>Manage Institutions</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Manage institutions that admins can be assigned to. Multiple institutions can be active simultaneously.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shrink-0 self-end sm:self-auto">
                      {(institutionsList || []).length} Institutions
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Available Institutions List */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>1. Available Institutions</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">{(institutionsList || []).length} Options</span>
                      </h3>

                      <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                        {(institutionsList || []).filter(inst => inst && inst.id && inst.name).map(inst => (
                          <div key={inst.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-slate-100/60 transition">
                            <div className="space-y-0.5">
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                                <span>{inst.name}</span>
                                {inst.is_active === 'true' && (
                                  <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                    Active
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-400 font-mono">ID: {inst.id}</div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleToggleInstitutionActive(inst.id)}
                                className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg border transition ${
                                  inst.is_active === 'true'
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                              >
                                {inst.is_active === 'true' ? 'Deactivate' : 'Activate'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteInstitution(inst.id)}
                                className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Add New Institution */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        2. Add New Institution
                      </h3>
                      
                      <form onSubmit={handleAddInstitution} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">Institution Name</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., St. Mary's School"
                            value={newInstName}
                            onChange={e => setNewInstName(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-2 py-1">
                          <input
                            type="checkbox"
                            id="inst_active"
                            checked={newInstIsActive === 'true'}
                            onChange={e => setNewInstIsActive(e.target.checked ? 'true' : 'false')}
                            className="rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
                          />
                          <label htmlFor="inst_active" className="text-xs font-medium text-slate-700 cursor-pointer">Set as active</label>
                        </div>
                        
                        <div className="flex justify-end pt-2 border-t border-slate-100">
                          <button
                            type="submit"
                            disabled={isPostingInst}
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:bg-slate-300 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            {isPostingInst ? (
                              <>
                                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                <span>Adding...</span>
                              </>
                            ) : (
                              <>
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add Institution</span>
                              </>
                            )}
                          </button>
                        </div>
                      </form>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}

                    {activeTab === 'configure' && (
              <motion.div
                key="configure-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* 1. SQUAD Server Configuration card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Settings className="h-5 w-5 text-indigo-600 animate-spin-slow" />
                        <span>SQUAD Portal Configuration</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Dynamically customize body parameters classification datasets, server metadata, and portal status.
                      </p>
                    </div>
                    <button
                      onClick={handleResetConfig}
                      className="text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/80 px-3 py-1.5 rounded-lg border border-rose-100 transition shrink-0 self-end sm:self-auto"
                    >
                      Reset to Defaults
                    </button>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Server Metadata Grid */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 font-mono flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                        Portal Server Settings
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            SQUAD Server Version Label
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={serverVersion}
                              onChange={e => setServerVersion(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                              placeholder="v1.0"
                            />
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-sans">Changes are shown in the left sidebar footer status badge.</p>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1.5">
                            Portal Server Runtime State
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {(['online', 'maintenance', 'offline'] as const).map(status => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => setServerStatus(status)}
                                className={`text-[10px] font-bold px-3 py-2 rounded-lg border uppercase tracking-wider transition ${
                                  serverStatus === status
                                    ? status === 'online'
                                      ? 'bg-emerald-550 border-emerald-200 text-emerald-700 font-bold bg-emerald-50'
                                      : status === 'maintenance'
                                        ? 'bg-amber-550 border-amber-200 text-amber-700 font-bold bg-amber-50'
                                        : 'bg-rose-550 border-rose-200 text-rose-700 font-bold bg-rose-50'
                                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 font-sans">Applies status indicator colors dynamically throughout the environment.</p>
                        </div>
                      </div>
                    </div>

                    {/* Classification Parameter lists management */}
                    <div className="space-y-6">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        Body Parameters & Dropdown Option Datasets
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* A. User Types */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">User Types (user_type_id)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {userTypesList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(userTypesList || []).filter(ut => ut && ut.id && ut.label).map(ut => (
                              <div key={ut.id} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{ut.label} <span className="text-[10px] font-mono font-normal text-slate-400">({ut.id})</span></span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUserType(ut.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddUserType} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="Label (e.g. Guest)"
                              value={newUserTypeLabel}
                              onChange={e => setNewUserTypeLabel(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* B. Access Levels */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Access Levels (access_level_id)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {accessLevelsList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(accessLevelsList || []).filter(al => al && al.id && al.label).map(al => (
                              <div key={al.id} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{al.label} <span className="text-[10px] font-mono font-normal text-slate-400">({al.id})</span></span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteAccessLevel(al.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddAccessLevel} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="ID (e.g. 1-6)"
                              value={newAccessLevelId}
                              onChange={e => setNewAccessLevelId(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Label (e.g. Level 10)"
                              value={newAccessLevelLabel}
                              onChange={e => setNewAccessLevelLabel(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* C. Titles */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Honorific Titles (title_id)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {titlesList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(titlesList || []).filter(title => typeof title === 'string' && title).map(title => (
                              <div key={title} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{title}</span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteTitle(title)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddTitle} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="e.g. Prof"
                              value={newTitle}
                              onChange={e => setNewTitle(e.target.value)}
                              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* D. Sexes / Genders */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800">Gender Choices (sex)</span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {sexesList.length} Options
                            </span>
                          </div>

                          <div className="max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(sexesList || []).filter(s => s && s.id && s.label).map(s => (
                              <div key={s.id} className="flex items-center justify-between py-1.5 text-xs">
                                <span className="font-semibold text-slate-800">{s.label} <span className="text-[10px] font-mono font-normal text-slate-400">({s.id})</span></span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSex(s.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                  title="Delete option"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddSex} className="flex gap-2">
                            <input
                              type="text"
                              required
                              placeholder="ID (e.g. other)"
                              value={newSexId}
                              onChange={e => setNewSexId(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <input
                              type="text"
                              required
                              placeholder="Label (e.g. Other)"
                              value={newSexLabel}
                              onChange={e => setNewSexLabel(e.target.value)}
                              className="w-1/2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <button
                              type="submit"
                              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg p-1.5 flex items-center justify-center transition shrink-0"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </form>
                        </div>

                        {/* E. Institutions */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Building className="h-4 w-4 text-indigo-600" />
                              <span>Institution (institution config)</span>
                            </span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {institutionsList.length} Options
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            Configure available institutions. Adding a new institution automatically executes a real-time HTTP POST request with the required body parameters to the remote API.
                          </p>

                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(institutionsList || []).filter(inst => inst && inst.id && inst.name).map(inst => (
                              <div key={inst.id} className="flex items-center justify-between py-2 text-xs">
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span>{inst.name}</span>
                                    {inst.is_active === 'true' && (
                                      <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                                    <span>ID: {inst.id}</span>
                                    <span>is_active: "{inst.is_active}"</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePostToRemoteManual(inst.name, inst.is_active)}
                                    disabled={isPostingInst}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded transition border border-indigo-200 disabled:opacity-50 flex items-center gap-1"
                                    title="Post payload to /df/institute/add"
                                  >
                                    <Send className="h-2.5 w-2.5" />
                                    <span>POST</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleInstitutionActive(inst.id)}
                                    className={`text-[10px] font-bold px-2 py-1 rounded transition border ${
                                      inst.is_active === 'true'
                                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                                    }`}
                                    title="Toggle active status"
                                  >
                                    {inst.is_active === 'true' ? 'Deactivate' : 'Activate'}
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteInstitution(inst.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                    title="Delete option"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Live REST API Terminal Logs */}
                          {instPostLogs.length > 0 && (
                            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                              <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                  <span className="font-bold text-slate-300">HTTP POST TERMINAL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isPostingInst ? (
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                      <span>SENDING...</span>
                                    </span>
                                  ) : instPostStatus === 'success' ? (
                                    <span className="text-emerald-400 font-bold">● SUCCESS (200 OK)</span>
                                  ) : instPostStatus === 'error' ? (
                                    <span className="text-rose-400 font-bold">● FAILED</span>
                                  ) : (
                                    <span>IDLE</span>
                                  )}
                                  <button 
                                    type="button" 
                                    onClick={() => setInstPostLogs([])} 
                                    className="hover:text-slate-200 ml-2"
                                  >
                                    Clear Logs
                                  </button>
                                </div>
                              </div>
                              <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                                {instPostLogs.map((log, i) => {
                                  let color = 'text-slate-300';
                                  if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                                  else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                                  else if (log.includes('Payload:')) color = 'text-amber-300';
                                  else if (log.includes('Response status code:')) color = 'text-cyan-300';
                                  return (
                                    <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <form onSubmit={handleAddInstitution} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                                Add New Institution Parameter & Send POST Request
                              </p>
                              <div className="text-[9px] text-indigo-600 bg-indigo-50 font-mono px-2 py-0.5 rounded font-semibold">
                                POST to /df/institute/add
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Institution Name (name)
                                </label>
                                <input
                                  type="text"
                                  required
                                  placeholder="e.g. SQUAD Academy"
                                  value={newInstName}
                                  onChange={e => setNewInstName(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                  Active State (is_active)
                                </label>
                                <select
                                  value={newInstIsActive}
                                  onChange={e => setNewInstIsActive(e.target.value)}
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                  <option value="true">"true" (Active)</option>
                                  <option value="false">"false" (Inactive)</option>
                                </select>
                              </div>
                            </div>

                            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono relative">
                              <span className="absolute top-2 right-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">
                                SCHEMA BODY PARAMETER
                              </span>
                              <pre className="text-emerald-400">
{`{
  "name": "${newInstName || 'SQUAD Partner'}",
  "is_active": "${newInstIsActive}"
}`}
                              </pre>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="submit"
                                disabled={isPostingInst}
                                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isPostingInst ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    <span>Adding...</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add Institution</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* F. Grade */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <GraduationCap className="h-4 w-4 text-indigo-600" />
                              <span>Grade Configuration (grade config)</span>
                            </span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {gradesList.length} Options
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            Configure available grades. Adding a new grade automatically executes a real-time HTTP POST request with the required body parameters to the remote API.
                          </p>

                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(gradesList || []).filter(g => g && g.id && g.grade).map(g => (
                              <div key={g.id} className="flex items-center justify-between py-2 text-xs">
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span>{g.grade}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono flex items-center gap-3">
                                    <span>ID: {g.id}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handlePostGradeToRemoteManual(g.grade)}
                                    disabled={isPostingGrade}
                                    className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded transition border border-indigo-200 disabled:opacity-50 flex items-center gap-1"
                                    title="Post payload to /df/grade/add"
                                  >
                                    <Send className="h-2.5 w-2.5" />
                                    <span>POST</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteGrade(g.id)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                    title="Delete option"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Live REST API Terminal Logs */}
                          {gradePostLogs.length > 0 && (
                            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                              <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                  <span className="font-bold text-slate-300">HTTP POST TERMINAL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  {isPostingGrade ? (
                                    <span className="text-amber-400 flex items-center gap-1">
                                      <RefreshCw className="h-3 w-3 animate-spin" />
                                      <span>SENDING...</span>
                                    </span>
                                  ) : gradePostStatus === 'success' ? (
                                    <span className="text-emerald-400 font-bold">● SUCCESS (200 OK)</span>
                                  ) : gradePostStatus === 'error' ? (
                                    <span className="text-rose-400 font-bold">● FAILED</span>
                                  ) : (
                                    <span>IDLE</span>
                                  )}
                                  <button 
                                    type="button" 
                                    onClick={() => setGradePostLogs([])} 
                                    className="hover:text-slate-200 ml-2"
                                  >
                                    Clear Logs
                                  </button>
                                </div>
                              </div>
                              <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                                {gradePostLogs.map((log, i) => {
                                  let color = 'text-slate-300';
                                  if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                                  else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                                  else if (log.includes('Payload:')) color = 'text-amber-300';
                                  else if (log.includes('Response status code:')) color = 'text-cyan-300';
                                  return (
                                    <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          <form onSubmit={handleAddGrade} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                                Add New Grade Parameter & Send POST Request
                              </p>
                              <div className="text-[9px] text-indigo-600 bg-indigo-50 font-mono px-2 py-0.5 rounded font-semibold">
                                POST to /df/grade/add
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                Grade / Class Name (grade)
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. Grade Name / Class Name"
                                value={newGradeName}
                                onChange={e => setNewGradeName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono relative">
                              <span className="absolute top-2 right-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">
                                SCHEMA BODY PARAMETER
                              </span>
                              <pre className="text-emerald-400">
{`{
  "grade": "${newGradeName || 'Grade Name / Class Name'}"
}`}
                              </pre>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="submit"
                                disabled={isPostingGrade}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm disabled:opacity-50"
                              >
                                {isPostingGrade ? (
                                  <>
                                    <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                    <span>Sending POST request...</span>
                                  </>
                                ) : (
                                  <>
                                    <Plus className="h-3.5 w-3.5" />
                                    <span>Add & Post Grade</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* G. Section Configuration */}
                        <div className="border border-slate-100 rounded-xl p-4 space-y-3 bg-white hover:shadow-sm transition col-span-1 md:col-span-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                              <Layers className="h-4 w-4 text-indigo-600" />
                              <span>Section Configuration (section config)</span>
                            </span>
                            <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                              {sectionsList.length} Options
                            </span>
                          </div>

                          <p className="text-xs text-slate-500">
                            Configure available school sections. Adding a new section automatically executes a real-time HTTP POST request with the required body parameters to the remote API.
                          </p>

                          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                            {(sectionsList || []).filter(sec => typeof sec === 'string' && sec).map(sec => (
                              <div key={sec} className="flex items-center justify-between py-2 text-xs">
                                <div className="space-y-0.5">
                                  <div className="font-semibold text-slate-800 flex items-center gap-2">
                                    <span>{sec}</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center space-x-2">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteSection(sec)}
                                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                                    title="Delete option"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <form onSubmit={handleAddSection} className="bg-slate-50 border border-slate-100 rounded-xl p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                                Add New Section Parameter & Send POST Request
                              </p>
                              <div className="text-[9px] text-indigo-600 bg-indigo-50 font-mono px-2 py-0.5 rounded font-semibold">
                                POST to /df/section/add
                              </div>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                Section Name (section)
                              </label>
                              <input
                                type="text"
                                required
                                placeholder="e.g. A, B, Science, Commerce"
                                value={newSectionName}
                                onChange={e => setNewSectionName(e.target.value)}
                                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>

                            <div className="bg-slate-900 text-slate-300 rounded-lg p-3 text-[10px] font-mono relative">
                              <span className="absolute top-2 right-2 text-[8px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800 px-1.5 py-0.5 rounded">
                                SCHEMA BODY PARAMETER
                              </span>
                              <pre className="text-emerald-400">
{`{
  "section": "${newSectionName || 'Section Name'}"
}`}
                              </pre>
                            </div>

                            <div className="flex justify-end pt-1">
                              <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                <span>Add & Post Section</span>
                              </button>
                            </div>
                          </form>
                        </div>

                        {/* H. Dynamic Field Schemas Configuration Dashboard */}
                        <div className="border border-slate-200 rounded-xl p-5 space-y-4 bg-slate-55/30 hover:shadow-sm transition col-span-1 md:col-span-2 mt-4 bg-slate-50/50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-3 gap-2">
                            <div>
                              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase tracking-wider font-mono">
                                <Database className="h-4 w-4 text-indigo-600" />
                                <span>Dynamic Fields (df) Schemas Present in Backend</span>
                              </span>
                              <p className="text-[11px] text-slate-500 mt-1">
                                Complete interface to add, retrieve, list, and delete custom classifications directly inside MongoDB collections.
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                fetchEdQualifications();
                                fetchEdSpecialities();
                                fetchMaritalStatuses();
                                fetchExtraActivityPositions();
                                fetchExtraActivityTypes();
                                fetchOccupationCategories();
                                fetchOccupations();
                                fetchRelationTypes();
                                fetchTeacherGrades();
                              }}
                              className="text-[10px] font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1.5 rounded-lg flex items-center gap-1 transition shrink-0"
                            >
                              <RefreshCw className="h-3 w-3" />
                              <span>Refresh All</span>
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            {/* 1. Educational Qualifications */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <GraduationCap className="h-4 w-4 text-indigo-600" />
                                    <span>Ed Qualifications</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                                    {edQualificationsList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {edQualificationsLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : edQualificationsList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    edQualificationsList.map((eq: any) => (
                                      <div key={eq._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate" title={eq.qualification}>
                                          {eq.qualification} <span className="text-[9px] font-mono text-slate-400">({eq.sort_order || 0})</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('edQualification', eq._id, fetchEdQualifications)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newEdQualName.trim()) return;
                                  handleAddDfOption(
                                    'edQualification',
                                    {
                                      qualification: newEdQualName.trim(),
                                      sort_order: Number(newEdQualSortOrder) || 0,
                                      is_active: newEdQualIsActive
                                    },
                                    fetchEdQualifications,
                                    () => {
                                      setNewEdQualName('');
                                      setNewEdQualSortOrder('0');
                                      setNewEdQualIsActive('true');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Qualification</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Master of Science"
                                    value={newEdQualName}
                                    onChange={(e) => setNewEdQualName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Sort Order</label>
                                    <input
                                      type="number"
                                      placeholder="0"
                                      value={newEdQualSortOrder}
                                      onChange={(e) => setNewEdQualSortOrder(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Is Active</label>
                                    <select
                                      value={newEdQualIsActive}
                                      onChange={(e) => setNewEdQualIsActive(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                    >
                                      <option value="true">Active</option>
                                      <option value="false">Inactive</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['edQualification']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50 animate-pulse-slow"
                                >
                                  {isDfPosting['edQualification'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 2. Educational Specializations (edSpeciality) */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                                    <span>Ed Specialities</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                                    {edSpecialitiesList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {edSpecialitiesLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : edSpecialitiesList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    edSpecialitiesList.map((es: any) => (
                                      <div key={es._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate" title={es.speciality}>
                                          {es.speciality}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('edSpeciality', es._id, fetchEdSpecialities)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newEdSpecName.trim()) return;
                                  handleAddDfOption(
                                    'edSpeciality',
                                    {
                                      speciality: newEdSpecName.trim(),
                                      is_active: newEdSpecIsActive
                                    },
                                    fetchEdSpecialities,
                                    () => {
                                      setNewEdSpecName('');
                                      setNewEdSpecIsActive('true');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Speciality / Specialization</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Computer Science"
                                    value={newEdSpecName}
                                    onChange={(e) => setNewEdSpecName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Is Active</label>
                                  <select
                                    value={newEdSpecIsActive}
                                    onChange={(e) => setNewEdSpecIsActive(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                  >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                  </select>
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['edSpeciality']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['edSpeciality'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 3. Marital Status (maritalStatus) */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-pink-600" />
                                    <span>Marital Status</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded">
                                    {maritalStatusesList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {maritalStatusesLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : maritalStatusesList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    maritalStatusesList.map((ms: any) => (
                                      <div key={ms._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate">
                                          {ms.status}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('maritalStatus', ms._id, fetchMaritalStatuses)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newMaritalStatusName.trim()) return;
                                  handleAddDfOption(
                                    'maritalStatus',
                                    {
                                      status: newMaritalStatusName.trim()
                                    },
                                    fetchMaritalStatuses,
                                    () => {
                                      setNewMaritalStatusName('');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Status Value</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Married, Single"
                                    value={newMaritalStatusName}
                                    onChange={(e) => setNewMaritalStatusName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['maritalStatus']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['maritalStatus'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 4. Extra Activity Positions */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Activity className="h-4 w-4 text-cyan-600" />
                                    <span>Extra Activity Positions</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded">
                                    {extraActivityPositionsList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {extraActivityPositionsLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : extraActivityPositionsList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    extraActivityPositionsList.map((eap: any) => (
                                      <div key={eap._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate">
                                          {eap.position}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('extraActivityPosition', eap._id, fetchExtraActivityPositions)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newEAPositionName.trim()) return;
                                  handleAddDfOption(
                                    'extraActivityPosition',
                                    {
                                      position: newEAPositionName.trim()
                                    },
                                    fetchExtraActivityPositions,
                                    () => {
                                      setNewEAPositionName('');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Position Title</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Captain, President"
                                    value={newEAPositionName}
                                    onChange={(e) => setNewEAPositionName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['extraActivityPosition']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['extraActivityPosition'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 5. Extra Activity Types */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Activity className="h-4 w-4 text-violet-600" />
                                    <span>Extra Activity Types</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-violet-600 bg-violet-50 px-1.5 py-0.5 rounded">
                                    {extraActivityTypesList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {extraActivityTypesLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : extraActivityTypesList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    extraActivityTypesList.map((eat: any) => (
                                      <div key={eat._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate">
                                          {eat.type}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('extraActivityType', eat._id, fetchExtraActivityTypes)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newEATypeName.trim()) return;
                                  handleAddDfOption(
                                    'extraActivityType',
                                    {
                                      type: newEATypeName.trim(),
                                      is_active: newEATypeIsActive
                                    },
                                    fetchExtraActivityTypes,
                                    () => {
                                      setNewEATypeName('');
                                      setNewEATypeIsActive('true');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Activity Type Name</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Sports, Music Club"
                                    value={newEATypeName}
                                    onChange={(e) => setNewEATypeName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Is Active</label>
                                  <select
                                    value={newEATypeIsActive}
                                    onChange={(e) => setNewEATypeIsActive(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                  >
                                    <option value="true">Active</option>
                                    <option value="false">Inactive</option>
                                  </select>
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['extraActivityType']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['extraActivityType'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 6. Occupation Category */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Building className="h-4 w-4 text-blue-600" />
                                    <span>Occ Categories</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">
                                    {occupationCategoriesList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {occupationCategoriesLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : occupationCategoriesList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    occupationCategoriesList.map((oc: any) => (
                                      <div key={oc._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate" title={`${oc.occupation_category} (${oc.category})`}>
                                          {oc.occupation_category} <span className="text-[9px] font-mono text-slate-400">({oc.category})</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('occupationCategory', oc._id, fetchOccupationCategories)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newOccCatName.trim()) return;
                                  handleAddDfOption(
                                    'occupationCategory',
                                    {
                                      occupation_category: newOccCatName.trim(),
                                      category: newOccCatCode.trim() || 'OTH',
                                      is_active: newOccCatIsActive
                                    },
                                    fetchOccupationCategories,
                                    () => {
                                      setNewOccCatName('');
                                      setNewOccCatCode('');
                                      setNewOccCatIsActive('true');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Category Name</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Government, Business"
                                    value={newOccCatName}
                                    onChange={(e) => setNewOccCatName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Code</label>
                                    <input
                                      type="text"
                                      required
                                      placeholder="GOV, BIZ"
                                      value={newOccCatCode}
                                      onChange={(e) => setNewOccCatCode(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Is Active</label>
                                    <select
                                      value={newOccCatIsActive}
                                      onChange={(e) => setNewOccCatIsActive(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                    >
                                      <option value="true">Active</option>
                                      <option value="false">Inactive</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['occupationCategory']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['occupationCategory'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 7. Occupations (occupation) */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Building className="h-4 w-4 text-amber-600" />
                                    <span>Occupations</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                    {occupationsList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {occupationsLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : occupationsList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    occupationsList.map((oc: any) => {
                                      const categoryLabel = occupationCategoriesList.find(c => c._id === oc.occupation_category_id)?.occupation_category || oc.occupation_category_id;
                                      return (
                                        <div key={oc._id} className="flex items-center justify-between py-1 text-[11px]">
                                          <div className="font-medium text-slate-800 truncate" title={`${oc.occupation} (${categoryLabel})`}>
                                            {oc.occupation} <span className="text-[8px] text-slate-400">({categoryLabel || 'None'})</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleDeleteDfOption('occupation', oc._id, fetchOccupations)}
                                            className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                            title="Delete from database"
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </button>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newOccName.trim()) return;
                                  handleAddDfOption(
                                    'occupation',
                                    {
                                      occupation: newOccName.trim(),
                                      occupation_category_id: newOccCatId || "None",
                                      is_active: newOccIsActive
                                    },
                                    fetchOccupations,
                                    () => {
                                      setNewOccName('');
                                      setNewOccCatId('');
                                      setNewOccIsActive('true');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Occupation Name</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Engineer, Doctor"
                                    value={newOccName}
                                    onChange={(e) => setNewOccName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Category</label>
                                    <select
                                      value={newOccCatId}
                                      onChange={(e) => setNewOccCatId(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-[11px] text-slate-800 focus:outline-none truncate"
                                    >
                                      <option value="">-- None --</option>
                                      {occupationCategoriesList.map((cat: any) => (
                                        <option key={cat._id} value={cat._id}>{cat.occupation_category}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Is Active</label>
                                    <select
                                      value={newOccIsActive}
                                      onChange={(e) => setNewOccIsActive(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                    >
                                      <option value="true">Active</option>
                                      <option value="false">Inactive</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['occupation']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['occupation'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 8. Relation Types */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Users className="h-4 w-4 text-indigo-500" />
                                    <span>Relation Types</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-indigo-500 bg-indigo-50 px-1.5 py-0.5 rounded">
                                    {relationTypesList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {relationTypesLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : relationTypesList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    relationTypesList.map((rt: any) => (
                                      <div key={rt._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate">
                                          {rt.relation} {rt.is_parent && <span className="text-[8px] bg-indigo-100 text-indigo-700 font-bold px-1 rounded">Parent</span>}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('relationType', rt._id, fetchRelationTypes)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newRelName.trim()) return;
                                  handleAddDfOption(
                                    'relationType',
                                    {
                                      relation: newRelName.trim(),
                                      is_parent: newRelIsParent,
                                      is_active: newRelIsActive
                                    },
                                    fetchRelationTypes,
                                    () => {
                                      setNewRelName('');
                                      setNewRelIsParent(false);
                                      setNewRelIsActive('true');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Relation Name</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Father, Uncle"
                                    value={newRelName}
                                    onChange={(e) => setNewRelName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-1.5">
                                  <div className="flex items-center gap-1.5 pt-4">
                                    <input
                                      type="checkbox"
                                      id="newRelIsParent"
                                      checked={newRelIsParent}
                                      onChange={(e) => setNewRelIsParent(e.target.checked)}
                                      className="rounded text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
                                    />
                                    <label htmlFor="newRelIsParent" className="text-[10px] font-bold text-slate-600 select-none cursor-pointer">Is Parent</label>
                                  </div>
                                  <div>
                                    <label className="block text-[9px] font-bold text-slate-500 uppercase">Is Active</label>
                                    <select
                                      value={newRelIsActive}
                                      onChange={(e) => setNewRelIsActive(e.target.value)}
                                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none"
                                    >
                                      <option value="true">Active</option>
                                      <option value="false">Inactive</option>
                                    </select>
                                  </div>
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['relationType']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['relationType'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>

                            {/* 9. Teacher Grades */}
                            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between">
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                    <Settings className="h-4 w-4 text-rose-600" />
                                    <span>Teacher Grades</span>
                                  </span>
                                  <span className="text-[9px] font-mono font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
                                    {teacherGradesList.length} Options
                                  </span>
                                </div>

                                <div className="max-h-36 overflow-y-auto divide-y divide-slate-100 border border-slate-100 rounded-lg p-1.5 bg-slate-50/50">
                                  {teacherGradesLoading ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">Loading...</div>
                                  ) : teacherGradesList.length === 0 ? (
                                    <div className="text-[10px] text-slate-400 p-2 text-center">No options stored</div>
                                  ) : (
                                    teacherGradesList.map((tg: any) => (
                                      <div key={tg._id} className="flex items-center justify-between py-1 text-[11px]">
                                        <div className="font-medium text-slate-800 truncate">
                                          {tg.level}
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => handleDeleteDfOption('teacherGrade', tg._id, fetchTeacherGrades)}
                                          className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition"
                                          title="Delete from database"
                                        >
                                          <Trash2 className="h-3 w-3" />
                                        </button>
                                      </div>
                                    ))
                                  )}
                                </div>
                              </div>

                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  if (!newTeacherGradeLevel.trim()) return;
                                  handleAddDfOption(
                                    'teacherGrade',
                                    {
                                      level: newTeacherGradeLevel.trim()
                                    },
                                    fetchTeacherGrades,
                                    () => {
                                      setNewTeacherGradeLevel('');
                                    }
                                  );
                                }}
                                className="space-y-2 mt-3 pt-3 border-t border-slate-100"
                              >
                                <div>
                                  <label className="block text-[9px] font-bold text-slate-500 uppercase">Grade Level</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="e.g. Senior Lecturer"
                                    value={newTeacherGradeLevel}
                                    onChange={(e) => setNewTeacherGradeLevel(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>
                                <button
                                  type="submit"
                                  disabled={isDfPosting['teacherGrade']}
                                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded py-1 text-[10px] transition disabled:opacity-50"
                                >
                                  {isDfPosting['teacherGrade'] ? 'Posting...' : '+ Add & Post'}
                                </button>
                              </form>
                            </div>
                          </div>

                          {/* Terminal Logs for Dynamic Fields */}
                          {dfLogs.length > 0 && (
                            <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner mt-4">
                              <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                                  <span className="font-bold text-slate-300">HTTP REST API DYNAMIC SCHEMAS TERMINAL</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    type="button" 
                                    onClick={() => setDfLogs([])} 
                                    className="hover:text-slate-200"
                                  >
                                    Clear Logs
                                  </button>
                                </div>
                              </div>
                              <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                                {dfLogs.map((log, i) => {
                                  let color = 'text-slate-300';
                                  if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                                  else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                                  else if (log.includes('Payload:')) color = 'text-amber-300';
                                  else if (log.includes('Response status:')) color = 'text-cyan-300';
                                  return (
                                    <div key={i} className={`${color} whitespace-pre-wrap leading-relaxed`}>
                                      {log}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'organization' && (
              <motion.div
                key="organization-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Organizations Card */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  
                  {/* Card Title */}
                  <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center space-x-2">
                        <Building className="h-5 w-5 text-indigo-600" />
                        <span>Organization Management</span>
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Manage institution organization details (m_organization).
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100 shrink-0 self-end sm:self-auto">
                      {organizationsList.length} Organizations
                    </span>
                  </div>

                  <div className="p-6 sm:p-8 space-y-6">
                    {/* Existing Organizations Section */}
                    <div className="space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100 flex items-center justify-between">
                        <span>1. Existing Organizations</span>
                        <span className="text-[10px] font-mono text-slate-400 font-normal">{organizationsList.length} Options</span>
                      </h3>

                      {organizationsList.length > 0 ? (
                        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                          {organizationsList.map((org: any) => (
                            <div key={org._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-sm transition bg-slate-50/50">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="text-xs font-bold text-slate-900">{org.name}</h4>
                                  <p className="text-[10px] text-slate-400 mt-1 font-mono">ID: {org._id}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteOrganization(org._id)}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition"
                                  title="Delete organization"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="grid grid-cols-2 gap-3 text-[11px]">
                                <div>
                                  <p className="text-slate-500 font-semibold">Street:</p>
                                  <p className="text-slate-700">{org.line1 || "N/A"}</p>
                                </div>
                                <div>
                                  <p className="text-slate-500 font-semibold">City:</p>
                                  <p className="text-slate-700">{org.city || "N/A"}</p>
                                </div>
                                <div className="col-span-2">
                                  <p className="text-slate-500 font-semibold">Address:</p>
                                  <p className="text-slate-700">
                                    {[org.line1, org.line2, org.line3, org.postcode].filter(Boolean).join(", ") || "N/A"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-500">
                          <Building className="h-12 w-12 mx-auto text-slate-300 mb-2" />
                          <p className="text-xs">No organizations created yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Organization Form Section */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        2. Add New Organization
                      </h3>
                      
                      <form onSubmit={handleAddOrganization} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Organization Name *</label>
                            <div className="relative">
                              <select
                                required
                                value={newOrgName}
                                onChange={e => setNewOrgName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                              >
                                <option value="">— Select Institution —</option>
                                {(institutionsList || []).filter(inst => inst && inst.name).map(inst => (
                                  <option key={inst.id} value={inst.name}>{inst.name}</option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <ChevronDown className="h-4 w-4" />
                              </div>
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Organization Key</label>
                            <input
                              type="text"
                              placeholder="e.g., school_key_01"
                              value={newOrgKey}
                              onChange={e => setNewOrgKey(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Street Address (Line 1)</label>
                            <input
                              type="text"
                              placeholder="e.g., 123 Main Street"
                              value={newOrgLine1}
                              onChange={e => setNewOrgLine1(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Building/Suite (Line 2)</label>
                            <input
                              type="text"
                              placeholder="e.g., Block A"
                              value={newOrgLine2}
                              onChange={e => setNewOrgLine2(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Additional Info (Line 3)</label>
                            <input
                              type="text"
                              placeholder="e.g., Floor 1"
                              value={newOrgLine3}
                              onChange={e => setNewOrgLine3(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">City</label>
                            <input
                              type="text"
                              placeholder="e.g., New York"
                              value={newOrgCity}
                              onChange={e => setNewOrgCity(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1.5">Postal Code</label>
                            <input
                              type="text"
                              placeholder="e.g., 10001"
                              value={newOrgPostcode}
                              onChange={e => setNewOrgPostcode(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                          </div>
                        </div>

                        <div className="flex gap-2 justify-end pt-2 border-t border-slate-100">
                          <button
                            type="button"
                            onClick={() => {
                              setNewOrgName('');
                              setNewOrgLine1('');
                              setNewOrgLine2('');
                              setNewOrgLine3('');
                              setNewOrgCity('');
                              setNewOrgPostcode('');
                              setNewOrgKey('');
                            }}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 px-4 py-2.5 rounded-lg border border-slate-200 transition"
                          >
                            Clear Form
                          </button>
                          <button
                            type="submit"
                            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-xs font-bold px-6 py-2.5 rounded-lg shadow-sm hover:shadow transition-all duration-150 flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Add Organization</span>
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'classes' && (
              <motion.div
                key="classes-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Header Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Class Sections</p>
                      <p className="text-xl font-extrabold text-slate-900 font-mono">{classSectionsList.length}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                      <GraduationCap className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Active Classes</p>
                      <p className="text-xl font-extrabold text-slate-900 font-mono">{classesList.length}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center">
                    <button
                      onClick={fetchClassesAndSections}
                      disabled={classesLoading || classSectionsLoading}
                      className="w-full h-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${(classesLoading || classSectionsLoading) ? 'animate-spin' : ''}`} />
                      <span>{ (classesLoading || classSectionsLoading) ? 'Refreshing...' : 'Refresh Database' }</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* --- 1. CLASS SECTIONS MANAGEMENT (m_class_sections) --- */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-50/50 border-b border-slate-200 p-5 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <Layers className="h-5 w-5 text-indigo-600" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Class Sections (m_class_sections)</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Define grades and corresponding sections</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                        {classSectionsList.length} Sections
                      </span>
                    </div>

                    <div className="p-6 space-y-6 flex-1">
                      {/* Class Sections List */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                          Existing Sections
                        </h4>

                        {classSectionsLoading ? (
                          <div className="text-center py-6 text-slate-400 flex items-center justify-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                            <span className="text-xs font-mono">Fetching sections from backend...</span>
                          </div>
                        ) : classSectionsList.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-xl bg-slate-50/20 p-2 space-y-1 bg-white">
                            {classSectionsList.map((item: any) => (
                              <div key={item._id} className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded-lg transition-all">
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    {item.grade && <span>Grade: {item.grade}</span>}
                                    <span className="text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded text-[10px] font-mono">
                                      Section: {item.__section || "N/A"}
                                    </span>
                                    {item.is_active && (
                                      <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono">
                                    ID: {item._id}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteClassSection(item._id)}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete class section"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                            <Layers className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-xs font-medium">No class sections created yet</p>
                          </div>
                        )}
                      </div>

                      {/* Add Class Section Form */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Add Class Section
                        </h4>
                        
                        <form onSubmit={handleAddClassSection} className="space-y-3">
                          <div className="grid grid-cols-1 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">Class Section (from df_class_section) *</label>
                              <div className="relative">
                                <select
                                  required
                                  value={csSection}
                                  onChange={e => setCsSection(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                >
                                  <option value="">— Select Section —</option>
                                  {sectionsList.map((sec, idx) => (
                                    <option key={idx} value={sec}>
                                      {sec}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-600">Active Status</span>
                            <button
                              type="button"
                              onClick={() => setCsIsActive(!csIsActive)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded transition border cursor-pointer ${
                                csIsActive
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {csIsActive ? 'Active' : 'Inactive'}
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={isPostingClass}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-all duration-150 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Create Class Section</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/* --- 2. CLASSES MANAGEMENT (m_classes) --- */}
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="bg-slate-50/50 border-b border-slate-200 p-5 flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                        <div>
                          <h3 className="text-sm font-bold text-slate-900">Classes (m_classes)</h3>
                          <p className="text-[10px] text-slate-500 font-medium">Link specific classes to defined sections</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100">
                        {classesList.length} Classes
                      </span>
                    </div>

                    <div className="p-6 space-y-6 flex-1">
                      {/* Classes List */}
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                          Existing Classes
                        </h4>

                        {classesLoading ? (
                          <div className="text-center py-6 text-slate-400 flex items-center justify-center space-x-2">
                            <RefreshCw className="h-4 w-4 animate-spin text-emerald-600" />
                            <span className="text-xs font-mono">Fetching classes from backend...</span>
                          </div>
                        ) : classesList.length > 0 ? (
                          <div className="max-h-60 overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-xl bg-slate-50/20 p-2 space-y-1 bg-white">
                            {classesList.map((item: any) => {
                              // Resolve section details
                              const linkedSection = classSectionsList.find(s => s._id === item.class_section_id);
                              const linkedOrg = organizationsList.find(o => o && (o._id === item.organization_id || o._id === item.organizationId));
                              return (
                                <div key={item._id} className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded-lg transition-all">
                                  <div className="space-y-1">
                                    <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                      <span>Class: {item.class_name || "N/A"}</span>
                                      {item.is_active && (
                                        <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                          Active
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[10px] text-slate-500 flex flex-wrap items-center gap-x-2 font-medium">
                                      <div className="flex items-center space-x-1">
                                        <span>Section:</span>
                                        {linkedSection ? (
                                          <span className="text-indigo-600 font-semibold">
                                            {linkedSection.grade ? `${linkedSection.grade} - ` : ''}Section {linkedSection.__section}
                                          </span>
                                        ) : (
                                          <span className="text-slate-400 font-mono">ID: {item.class_section_id || "Unlinked"}</span>
                                        )}
                                      </div>
                                      {linkedOrg && (
                                        <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                                          <span className="text-slate-400 font-normal">Org:</span>
                                          <span className="text-emerald-600 font-semibold">{linkedOrg.name}</span>
                                        </div>
                                      )}
                                    </div>
                                    <div className="text-[9px] text-slate-400 font-mono">
                                      ID: {item._id}
                                    </div>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteClass(item._id)}
                                    className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition cursor-pointer"
                                    title="Delete class"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                            <GraduationCap className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                            <p className="text-xs font-medium">No classes created yet</p>
                          </div>
                        )}
                      </div>

                      {/* Add Class Form */}
                      <div className="space-y-3 pt-4 border-t border-slate-100">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Add Class
                        </h4>
                        
                        <form onSubmit={handleAddClass} className="space-y-3">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">Class Name *</label>
                              <input
                                required
                                type="text"
                                placeholder="e.g. Science Class"
                                value={cName}
                                onChange={e => setCName(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">Class Section Link (from m_class_section) *</label>
                              <div className="relative">
                                <select
                                  required
                                  value={cSectionId}
                                  onChange={e => setCSectionId(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                >
                                  <option value="">— Select Section —</option>
                                  {classSectionsList.map(item => (
                                    <option key={item._id} value={item._id}>
                                      {item.grade ? `${item.grade} (Section ${item.__section})` : `Section ${item.__section}`}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            </div>
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">Organization *</label>
                              <div className="relative">
                                <select
                                  required
                                  value={cOrgId}
                                  onChange={e => setCOrgId(e.target.value)}
                                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                                >
                                  <option value="">— Select Organization —</option>
                                  {organizationsList.map(item => (
                                    <option key={item._id} value={item._id}>
                                      {item.name}
                                    </option>
                                  ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                  <ChevronDown className="h-3.5 w-3.5" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                            <span className="text-[10px] font-bold text-slate-600">Active Status</span>
                            <button
                              type="button"
                              onClick={() => setCIsActive(!cIsActive)}
                              className={`text-[10px] font-bold px-2.5 py-1 rounded transition border cursor-pointer ${
                                cIsActive
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                              }`}
                            >
                              {cIsActive ? 'Active' : 'Inactive'}
                            </button>
                          </div>

                          <button
                            type="submit"
                            disabled={isPostingClass}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2 rounded-lg transition-all duration-150 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            <span>Create Class</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Live REST API Terminal Logs */}
                {classPostLogs.length > 0 && (
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                    <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="font-bold text-slate-300 font-mono">CLASSES REST API TERMINAL</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setClassPostLogs([])}
                          className="hover:text-white transition duration-150 text-[9px] bg-slate-800 border border-slate-700 hover:border-slate-600 font-semibold px-2 py-0.5 rounded cursor-pointer"
                        >
                          Clear Logs
                        </button>
                      </div>
                    </div>
                    <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                      {classPostLogs.map((log, i) => {
                        let color = 'text-slate-300';
                        if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                        else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                        else if (log.includes('Payload:')) color = 'text-amber-300';
                        else if (log.includes('Response status code:')) color = 'text-cyan-300';
                        return (
                          <div key={i} className={`${color} break-all font-mono whitespace-pre-wrap leading-relaxed`}>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'subjects' && (
              <motion.div
                key="subjects-view"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-6"
              >
                {/* Header Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center space-x-4">
                    <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
                      <Bookmark className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Total Subjects</p>
                      <p className="text-xl font-extrabold text-slate-900 font-mono">{subjectsList.length}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center space-x-4">
                    <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600">
                      <Layers className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Class Sections</p>
                      <p className="text-xl font-extrabold text-slate-900 font-mono">{classSectionsList.length}</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col justify-center">
                    <button
                      onClick={fetchSubjects}
                      disabled={subjectsLoading}
                      className="w-full h-full flex items-center justify-center space-x-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-200 hover:border-slate-300 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${subjectsLoading ? 'animate-spin' : ''}`} />
                      <span>{ subjectsLoading ? 'Refreshing...' : 'Refresh Subjects' }</span>
                    </button>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="bg-slate-50/50 border-b border-slate-200 p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <Bookmark className="h-5 w-5 text-indigo-600" />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Subjects Management (m_subjects)</h3>
                        <p className="text-[10px] text-slate-500 font-medium">Link academic subjects to corresponding organizations</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100">
                      {subjectsList.length} Subjects
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Subjects List */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono pb-1 border-b border-slate-100">
                        Existing Subjects
                      </h4>

                      {subjectsLoading ? (
                        <div className="text-center py-6 text-slate-400 flex items-center justify-center space-x-2">
                          <RefreshCw className="h-4 w-4 animate-spin text-indigo-600" />
                          <span className="text-xs font-mono">Fetching subjects from backend...</span>
                        </div>
                      ) : subjectsList.length > 0 ? (
                        <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 border border-slate-150 rounded-xl bg-slate-50/20 p-2 space-y-1 bg-white">
                          {subjectsList.map((item: any) => {
                            const linkedOrg = organizationsList.find(o => o && (o._id === item.organization_id || o._id === item.organizationId));
                            return (
                              <div key={item._id} className="flex items-center justify-between py-2.5 px-3 hover:bg-slate-50 rounded-lg transition-all">
                                <div className="space-y-1">
                                  <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                                    <span>Subject: {item.subject || "N/A"}</span>
                                    {item.is_active && (
                                      <span className="text-[8px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                        Active
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500 flex items-center space-x-1 font-medium">
                                    <span>Organization:</span>
                                    {linkedOrg ? (
                                      <span className="text-indigo-600 font-semibold">
                                        {linkedOrg.name}
                                      </span>
                                    ) : (
                                      <span className="text-slate-400 font-mono">ID: {item.organization_id || "Unlinked"}</span>
                                    )}
                                  </div>
                                  <div className="text-[9px] text-slate-400 font-mono">
                                    ID: {item._id}
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleDeleteSubject(item._id)}
                                  className="text-slate-400 hover:text-rose-600 p-1.5 rounded hover:bg-rose-50 transition cursor-pointer"
                                  title="Delete subject"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-slate-400 border border-dashed border-slate-200 rounded-xl bg-slate-50/30">
                          <Bookmark className="h-8 w-8 mx-auto text-slate-300 mb-2" />
                          <p className="text-xs font-medium">No subjects created yet</p>
                        </div>
                      )}
                    </div>

                    {/* Add Subject Form */}
                    <div className="space-y-3 pt-4 border-t border-slate-100">
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                        Add New Subject
                      </h4>
                      
                      <form onSubmit={handleAddSubject} className="space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Subject Name *</label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Mathematics"
                              value={subName}
                              onChange={e => setSubName(e.target.value)}
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-600 mb-1">Organization Link (from m_organization) *</label>
                            <div className="relative">
                              <select
                                required
                                value={subOrgId}
                                onChange={e => setSubOrgId(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                              >
                                <option value="">— Select Organization —</option>
                                {organizationsList.filter(org => org && org._id && org.name).map(item => (
                                  <option key={item._id} value={item._id}>
                                    {item.name}
                                  </option>
                                ))}
                              </select>
                              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                                <ChevronDown className="h-3.5 w-3.5" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                          <span className="text-[10px] font-bold text-slate-600">Active Status</span>
                          <button
                            type="button"
                            onClick={() => setSubIsActive(!subIsActive)}
                            className={`text-[10px] font-bold px-2.5 py-1 rounded transition border cursor-pointer ${
                              subIsActive
                                ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            {subIsActive ? 'Active' : 'Inactive'}
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={isPostingSubject}
                          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded-lg transition-all duration-150 flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Plus className="h-3.5 w-3.5" />
                          <span>Create Subject</span>
                        </button>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Live REST API Terminal Logs */}
                {subjectPostLogs.length > 0 && (
                  <div className="border border-slate-900 rounded-xl overflow-hidden bg-slate-950 shadow-inner">
                    <div className="bg-slate-900 px-3 py-2 flex items-center justify-between border-b border-slate-800 text-[10px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
                        <span className="font-bold text-slate-300 font-mono">SUBJECTS REST API TERMINAL</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setSubjectPostLogs([])}
                          className="hover:text-white transition duration-150 text-[9px] bg-slate-800 border border-slate-700 hover:border-slate-600 font-semibold px-2 py-0.5 rounded cursor-pointer"
                        >
                          Clear Logs
                        </button>
                      </div>
                    </div>
                    <div className="p-3 text-[10px] font-mono text-slate-300 max-h-48 overflow-y-auto space-y-1 select-all scrollbar-thin">
                      {subjectPostLogs.map((log, i) => {
                        let color = 'text-slate-300';
                        if (log.includes('SUCCESS')) color = 'text-emerald-400 font-bold';
                        else if (log.includes('ERROR') || log.includes('failed')) color = 'text-rose-400 font-bold';
                        else if (log.includes('Payload:')) color = 'text-amber-300';
                        else if (log.includes('Response status code:')) color = 'text-cyan-300';
                        return (
                          <div key={i} className={`${color} break-all font-mono whitespace-pre-wrap leading-relaxed`}>
                            {log}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

    </div>
  );
}
