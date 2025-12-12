// Application storage utility for tracking submitted requests

export interface ApplicationRecord {
  id: string;
  type: string;
  status: "pending" | "processing" | "approved" | "rejected";
  date: string;
  steps: { label: string; completed: boolean }[];
  formData: Record<string, any>;
  submittedAt: string;
  paymentStatus?: "pending" | "completed" | "failed";
  transactionId?: string;
  paymentAmount?: number;
}

const STORAGE_KEY = "canconnect_applications";

/**
 * Generate a unique application ID based on service type and timestamp
 */
export const generateApplicationId = (serviceType: string): string => {
  const typeCode = serviceType
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 3);
  
  const timestamp = Date.now().toString().slice(-5);
  const random = Math.floor(Math.random() * 100)
    .toString()
    .padStart(2, "0");
  
  return `${typeCode}-${new Date().getFullYear()}-${timestamp}${random}`;
};

/**
 * Get initial application steps based on service type
 */
export const getInitialSteps = (serviceType: string) => {
  const baseSteps = [
    { label: "Submitted", completed: true },
    { label: "Under Review", completed: false },
    { label: "Processing", completed: false },
    { label: "Ready for Pickup", completed: false },
  ];
  return baseSteps;
};

/**
 * Add a new application to storage
 */
export const addApplication = (
  serviceType: string,
  formData: Record<string, any>
): ApplicationRecord => {
  const applications = getAllApplications();
  
  const newApplication: ApplicationRecord = {
    id: generateApplicationId(serviceType),
    type: serviceType,
    status: "pending",
    date: new Date().toISOString().split("T")[0],
    steps: getInitialSteps(serviceType),
    formData,
    submittedAt: new Date().toISOString(),
  };

  applications.push(newApplication);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  
  return newApplication;
};

/**
 * Get all applications from storage
 */
export const getAllApplications = (): ApplicationRecord[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

/**
 * Get application by ID
 */
export const getApplicationById = (id: string): ApplicationRecord | null => {
  const applications = getAllApplications();
  return applications.find((app) => app.id === id) || null;
};

/**
 * Alias for getApplicationById
 */
export const getApplication = (id: string): ApplicationRecord | null => {
  return getApplicationById(id);
};

/**
 * Search applications by ID or type
 */
export const searchApplications = (query: string): ApplicationRecord[] => {
  const applications = getAllApplications();
  return applications.filter(
    (app) =>
      app.id.toLowerCase().includes(query.toLowerCase()) ||
      app.type.toLowerCase().includes(query.toLowerCase())
  );
};

/**
 * Update application status (for staff dashboard)
 */
export const updateApplicationStatus = (
  id: string,
  status: "pending" | "processing" | "approved" | "rejected",
  steps?: { label: string; completed: boolean }[]
): ApplicationRecord | null => {
  const applications = getAllApplications();
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) return null;

  applications[index].status = status;
  if (steps) applications[index].steps = steps;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  return applications[index];
};

/**
 * Update application with partial data (for payment and other updates)
 */
export const updateApplication = (
  id: string,
  updates: Partial<ApplicationRecord>
): ApplicationRecord | null => {
  const applications = getAllApplications();
  const index = applications.findIndex((app) => app.id === id);

  if (index === -1) return null;

  applications[index] = { ...applications[index], ...updates };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  return applications[index];
};

/**
 * Delete application
 */
export const deleteApplication = (id: string): boolean => {
  const applications = getAllApplications();
  const filtered = applications.filter((app) => app.id !== id);

  if (filtered.length === applications.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * Get application statistics
 */
export const getApplicationStats = () => {
  const applications = getAllApplications();
  return {
    total: applications.length,
    pending: applications.filter((app) => app.status === "pending").length,
    processing: applications.filter((app) => app.status === "processing").length,
    approved: applications.filter((app) => app.status === "approved").length,
    rejected: applications.filter((app) => app.status === "rejected").length,
  };
};
