
// ============================================================================
// SERVICE BASE URLs
// ============================================================================
const AUTH_BASE_URL = "http://localhost:8080";
const STUDENT_BASE_URL = "http://localhost:3000";
const GRADE_SERVICE_URL = "http://localhost:8000";
const BILLING_BASE_URL = "http://localhost:8081";
const COURSE_BASE_URL = "http://localhost:8082";
const AI_SERVICE_URL = "http://localhost:8086/api/v1";

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
export interface UserDto {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "ADMIN" | "STUDENT" | "PROFESSOR" | string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: UserDto;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
  role?: string;
}

export interface Student {
  _id?: string;
  id?: string;
  matricule: string;
  firstName: string;
  lastName: string;
  email: string;
  program?: string;
  enrollmentDate?: string;
  status?: "active" | "inactive" | "pending";
  phoneNumber?: string;
  address?: string;
}

export interface Teacher {
  id?: string;
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  office?: string;
  department?: string;
  title?: string;
  specialization?: string;
  photoUrl?: string;
}

export interface Course {
  id?: string;
  code: string;
  name: string;
  description?: string;
  credits?: number;
  professorId?: string;
  professorName?: string;
  semester?: string;
  schedule?: ScheduleSlot[];
}

export interface ScheduleSlot {
  id?: string;
  courseId?: string;
  courseName?: string;
  professorName?: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  type: "cours" | "td" | "tp";
}

export interface Grade {
  id?: string;
  student_id: string;
  course_id: string;
  grade: number;
  feedback?: string;
  gradeType?: string;
  createdAt?: string;
}

export interface Invoice {
  id: string;
  studentId: string;
  amount: number;
  description: string;
  dueDate: string;
  status: "paid" | "pending" | "overdue";
  createdAt?: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  studentId: string;
  amount: number;
  paymentMethod: string;
  referenceNumber: string;
  paidAt: string;
}

export interface StudentRequest {
  id: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  program?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      if (data?.message) {
        message = data.message;
      } else if (data?.error) {
        message = data.error;
      }
    } catch {
      // ignore JSON parse errors
    }
    throw new Error(message);
  }
  return res.json() as Promise<T>;
}

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
  };
}

// ============================================================================
// AUTH SERVICE (Port 8080)
// ============================================================================
export async function registerRequest(data: RegisterRequest): Promise<UserDto> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return handleResponse<UserDto>(res);
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function fetchMe(accessToken: string): Promise<UserDto> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return handleResponse<UserDto>(res);
}

export async function validateToken(accessToken: string): Promise<boolean> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/validate`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return res.ok;
}

export async function fetchAllUsers(accessToken: string): Promise<UserDto[]> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/users`, {
    headers: authHeaders(accessToken),
  });
  return handleResponse<UserDto[]>(res);
}

export async function updateUserRole(userId: number, role: string, accessToken: string): Promise<UserDto> {
  const res = await fetch(`${AUTH_BASE_URL}/auth/users/${userId}/role`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify({ role }),
  });
  return handleResponse<UserDto>(res);
}

// ============================================================================
// STUDENT SERVICE (Port 3000)
// ============================================================================
export async function fetchStudentList(accessToken: string): Promise<Student[]> {
  try {
    const res = await fetch(`${STUDENT_BASE_URL}/api/students`, {
      headers: authHeaders(accessToken),
    });
    const data = await handleResponse<Student[]>(res);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchStudentById(studentId: string, accessToken: string): Promise<Student> {
  const res = await fetch(`${STUDENT_BASE_URL}/api/students/${studentId}`, {
    headers: authHeaders(accessToken),
  });
  return handleResponse<Student>(res);
}

export async function createStudent(data: Partial<Student>, accessToken: string): Promise<Student> {
  const res = await fetch(`${STUDENT_BASE_URL}/api/students`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse<Student>(res);
}

export async function updateStudent(studentId: string, data: Partial<Student>, accessToken: string): Promise<Student> {
  const res = await fetch(`${STUDENT_BASE_URL}/api/students/${studentId}`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse<Student>(res);
}

export async function deleteStudent(studentId: string, accessToken: string): Promise<void> {
  const res = await fetch(`${STUDENT_BASE_URL}/api/students/${studentId}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  });
  if (!res.ok) throw new Error("Failed to delete student");
}

// ============================================================================
// GRADE SERVICE (Port 8000)
// ============================================================================
export async function fetchAllGrades(accessToken: string): Promise<Grade[]> {
  try {
    const res = await fetch(`${GRADE_BASE_URL}/api/grades`, {
      headers: authHeaders(accessToken),
    });
    const data = await handleResponse<Grade[]>(res);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchStudentGrades(studentId: string | number, accessToken: string): Promise<Grade[]> {
  try {
    const res = await fetch(`${GRADE_BASE_URL}/api/grades/student/${studentId}`, {
      headers: authHeaders(accessToken),
    });
    const data = await handleResponse<Grade[]>(res);
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchStudentAverage(studentId: string | number, accessToken: string): Promise<{ average: number; total_courses: number }> {
  const res = await fetch(`${GRADE_BASE_URL}/api/grades/student/${studentId}/average`, {
    headers: authHeaders(accessToken),
  });
  return handleResponse<{ average: number; total_courses: number }>(res);
}

export async function createGrade(data: Partial<Grade>, accessToken: string): Promise<Grade> {
  const res = await fetch(`${GRADE_BASE_URL}/api/grades`, {
    method: "POST",
    headers: authHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse<Grade>(res);
}

export async function updateGrade(gradeId: string, data: Partial<Grade>, accessToken: string): Promise<Grade> {
  const res = await fetch(`${GRADE_BASE_URL}/api/grades/${gradeId}`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: JSON.stringify(data),
  });
  return handleResponse<Grade>(res);
}

export async function deleteGrade(gradeId: string, accessToken: string): Promise<void> {
  const res = await fetch(`${GRADE_BASE_URL}/api/grades/${gradeId}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  });
  if (!res.ok) throw new Error("Failed to delete grade");
}

// ============================================================================
// BILLING SERVICE (Port 8081 - SOAP via REST wrapper)
// ============================================================================
async function callBillingSoap(operation: string, params: Record<string, string>, accessToken?: string) {
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:bil="http://billing.nexis.com">
   <soapenv:Header/>
   <soapenv:Body>
      <bil:${operation}>
         ${Object.entries(params).map(([k, v]) => `<${k}>${v}</${k}>`).join("\n         ")}
      </bil:${operation}>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers: Record<string, string> = { "Content-Type": "text/xml" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${BILLING_BASE_URL}/services/billing`, {
    method: "POST",
    headers,
    body: soapEnvelope,
  });

  if (!res.ok) throw new Error(`SOAP call failed: ${res.status}`);
  return res.text();
}

export async function fetchInvoices(studentId: string, accessToken: string): Promise<Invoice[]> {
  try {
    const xml = await callBillingSoap("getInvoices", { studentId }, accessToken);
    // Parse XML response - simplified parsing
    return parseInvoicesFromXml(xml);
  } catch {
    return [];
  }
}

export async function fetchAllInvoices(accessToken: string): Promise<Invoice[]> {
  try {
    // Fetch all invoices (no studentId filter)
    const xml = await callBillingSoap("getInvoices", {}, accessToken);
    return parseInvoicesFromXml(xml);
  } catch {
    return [];
  }
}

export async function createInvoice(
  studentId: string,
  amount: number,
  description: string,
  dueDate: string,
  accessToken: string
): Promise<Invoice | null> {
  try {
    const xml = await callBillingSoap(
      "createInvoice",
      { studentId, amount: amount.toString(), description, dueDate },
      accessToken
    );
    return parseInvoiceFromXml(xml);
  } catch {
    return null;
  }
}

export async function fetchPayments(studentId: string, accessToken: string): Promise<Payment[]> {
  try {
    const xml = await callBillingSoap("getPayments", { studentId }, accessToken);
    return parsePaymentsFromXml(xml);
  } catch {
    return [];
  }
}

export async function recordPayment(
  invoiceId: string,
  studentId: string,
  amount: number,
  paymentMethod: string,
  referenceNumber: string,
  accessToken: string
): Promise<Payment | null> {
  try {
    const xml = await callBillingSoap(
      "recordPayment",
      { invoiceId, studentId, amount: amount.toString(), paymentMethod, referenceNumber },
      accessToken
    );
    return parsePaymentFromXml(xml);
  } catch {
    return null;
  }
}

export async function fetchBalance(studentId: string, accessToken: string): Promise<{ balance: number; totalDue: number; totalPaid: number }> {
  try {
    const xml = await callBillingSoap("getBalance", { studentId }, accessToken);
    return parseBalanceFromXml(xml);
  } catch {
    return { balance: 0, totalDue: 0, totalPaid: 0 };
  }
}

// Simple XML parsers for SOAP responses
function parseInvoicesFromXml(xml: string): Invoice[] {
  const invoices: Invoice[] = [];
  const invoiceMatches = xml.match(/<invoice>([\s\S]*?)<\/invoice>/gi) || [];
  invoiceMatches.forEach((match) => {
    const id = match.match(/<id>(.*?)<\/id>/)?.[1] || "";
    const studentId = match.match(/<studentId>(.*?)<\/studentId>/)?.[1] || "";
    const amount = parseFloat(match.match(/<amount>(.*?)<\/amount>/)?.[1] || "0");
    const description = match.match(/<description>(.*?)<\/description>/)?.[1] || "";
    const dueDate = match.match(/<dueDate>(.*?)<\/dueDate>/)?.[1] || "";
    const status = (match.match(/<status>(.*?)<\/status>/)?.[1] || "pending") as Invoice["status"];
    invoices.push({ id, studentId, amount, description, dueDate, status });
  });
  return invoices;
}

function parseInvoiceFromXml(xml: string): Invoice | null {
  const invoices = parseInvoicesFromXml(xml);
  return invoices[0] || null;
}

function parsePaymentsFromXml(xml: string): Payment[] {
  const payments: Payment[] = [];
  const paymentMatches = xml.match(/<payment>([\s\S]*?)<\/payment>/gi) || [];
  paymentMatches.forEach((match) => {
    const id = match.match(/<id>(.*?)<\/id>/)?.[1] || "";
    const invoiceId = match.match(/<invoiceId>(.*?)<\/invoiceId>/)?.[1] || "";
    const studentId = match.match(/<studentId>(.*?)<\/studentId>/)?.[1] || "";
    const amount = parseFloat(match.match(/<amount>(.*?)<\/amount>/)?.[1] || "0");
    const paymentMethod = match.match(/<paymentMethod>(.*?)<\/paymentMethod>/)?.[1] || "";
    const referenceNumber = match.match(/<referenceNumber>(.*?)<\/referenceNumber>/)?.[1] || "";
    const paidAt = match.match(/<paidAt>(.*?)<\/paidAt>/)?.[1] || "";
    payments.push({ id, invoiceId, studentId, amount, paymentMethod, referenceNumber, paidAt });
  });
  return payments;
}

function parsePaymentFromXml(xml: string): Payment | null {
  const payments = parsePaymentsFromXml(xml);
  return payments[0] || null;
}

function parseBalanceFromXml(xml: string): { balance: number; totalDue: number; totalPaid: number } {
  const balance = parseFloat(xml.match(/<balance>(.*?)<\/balance>/)?.[1] || "0");
  const totalDue = parseFloat(xml.match(/<totalDue>(.*?)<\/totalDue>/)?.[1] || "0");
  const totalPaid = parseFloat(xml.match(/<totalPaid>(.*?)<\/totalPaid>/)?.[1] || "0");
  return { balance, totalDue, totalPaid };
}

// ============================================================================
// COURSE SERVICE (Port 8082 - SOAP via Apache CXF)
// ============================================================================
async function callCourseSoap(operation: string, params: Record<string, string | number> = {}, accessToken?: string) {
  const soapEnvelope = `<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                   xmlns:soap="http://soap.course_service.nexis.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <soap:${operation}>
         ${Object.entries(params).map(([k, v]) => `<arg0>${v}</arg0>`).join("\n         ")}
      </soap:${operation}>
   </soapenv:Body>
</soapenv:Envelope>`;

  const headers: Record<string, string> = { 
    "Content-Type": "text/xml;charset=UTF-8",
    "SOAPAction": `"${operation}"`
  };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const res = await fetch(`${COURSE_BASE_URL}/api/ws/course`, {
    method: "POST",
    headers,
    body: soapEnvelope,
  });

  if (!res.ok) throw new Error(`SOAP call failed: ${res.status}`);
  return res.text();
}

export async function fetchAllCourses(accessToken?: string): Promise<Course[]> {
  try {
    const xml = await callCourseSoap("listAllCourses", {}, accessToken);
    return parseCoursesFromXml(xml);
  } catch {
    // Fallback to sample data if service not available
    return [
      { id: "1", code: "INF301", name: "Architecture des Ordinateurs", description: "Étude de l'architecture des systèmes informatiques", credits: 4, professorId: "1", professorName: "Dr. Ahmed Ben Salem" },
      { id: "2", code: "INF302", name: "Génie Logiciel", description: "Principes et pratiques du génie logiciel", credits: 4, professorId: "2", professorName: "Dr. Fatma Gharbi" },
      { id: "3", code: "INF303", name: "Bases de Données Avancées", description: "Systèmes de bases de données avancés", credits: 3, professorId: "4", professorName: "Dr. Sonia Mejri" },
      { id: "4", code: "INF304", name: "Réseaux Informatiques", description: "Protocoles et architectures réseaux", credits: 3, professorId: "5", professorName: "Dr. Karim Bouaziz" },
      { id: "5", code: "INF305", name: "Intelligence Artificielle", description: "Introduction à l'IA et Machine Learning", credits: 4, professorId: "6", professorName: "Dr. Leila Hamdi" },
    ];
  }
}

export async function fetchCourseById(courseId: string, accessToken?: string): Promise<Course | null> {
  try {
    const xml = await callCourseSoap("getCourseById", { id: courseId }, accessToken);
    const courses = parseCoursesFromXml(xml);
    return courses[0] || null;
  } catch {
    return null;
  }
}

export async function createCourse(data: Partial<Course>, accessToken: string): Promise<Course | null> {
  try {
    const xml = await callCourseSoap(
      "addCourse",
      {
        code: data.code || "",
        title: data.name || "",
        description: data.description || "",
        instructorId: data.professorId || "1",
        credits: data.credits || 3,
        semester: "S1-2024",
        maxStudents: 30,
      },
      accessToken
    );
    const courses = parseCoursesFromXml(xml);
    return courses[0] || null;
  } catch {
    return null;
  }
}

export async function updateCourse(courseId: string, data: Partial<Course>, accessToken: string): Promise<Course | null> {
  try {
    const xml = await callCourseSoap(
      "updateCourse",
      {
        id: courseId,
        title: data.name || "",
        instructorId: data.professorId || "1",
        credits: data.credits || 3,
      },
      accessToken
    );
    const courses = parseCoursesFromXml(xml);
    return courses[0] || null;
  } catch {
    return null;
  }
}

export async function deleteCourse(courseId: string, accessToken: string): Promise<boolean> {
  try {
    await callCourseSoap("deleteCourse", { id: courseId }, accessToken);
    return true;
  } catch {
    return false;
  }
}

export async function enrollInCourse(courseId: string, studentId: string, accessToken: string): Promise<boolean> {
  try {
    await callCourseSoap("enrollStudent", { courseId, studentId }, accessToken);
    return true;
  } catch {
    return false;
  }
}

export async function getCoursesByInstructor(instructorId: string, accessToken?: string): Promise<Course[]> {
  try {
    const xml = await callCourseSoap("getCoursesByInstructor", { instructorId }, accessToken);
    return parseCoursesFromXml(xml);
  } catch {
    return [];
  }
}

function parseCoursesFromXml(xml: string): Course[] {
  const courses: Course[] = [];
  const courseMatches = xml.match(/<course>([\s\S]*?)<\/course>/gi) || [];
  courseMatches.forEach((match) => {
    const id = match.match(/<id>(.*?)<\/id>/)?.[1] || "";
    const code = match.match(/<code>(.*?)<\/code>/)?.[1] || "";
    const name = match.match(/<name>(.*?)<\/name>/)?.[1] || "";
    const description = match.match(/<description>(.*?)<\/description>/)?.[1] || "";
    const credits = parseInt(match.match(/<credits>(.*?)<\/credits>/)?.[1] || "3");
    const professorId = match.match(/<professorId>(.*?)<\/professorId>/)?.[1] || "";
    const professorName = match.match(/<professorName>(.*?)<\/professorName>/)?.[1] || "";
    courses.push({ id, code, name, description, credits, professorId, professorName });
  });
  return courses;
}

// ============================================================================
// TEACHER SERVICE (public access for list)
// ============================================================================
export async function fetchTeachers(): Promise<Teacher[]> {
  // Teachers can be fetched from auth service (users with PROFESSOR role) or a dedicated endpoint
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/teachers`);
    if (res.ok) {
      return handleResponse<Teacher[]>(res);
    }
  } catch {
    // Fallback handled below
  }
  // Return empty if service not available
  return [];
}

export async function createTeacher(data: Partial<Teacher>, accessToken: string): Promise<Teacher | null> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/teachers`, {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify(data),
    });
    return handleResponse<Teacher>(res);
  } catch {
    return null;
  }
}

export async function updateTeacher(teacherId: string, data: Partial<Teacher>, accessToken: string): Promise<Teacher | null> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/teachers/${teacherId}`, {
      method: "PUT",
      headers: authHeaders(accessToken),
      body: JSON.stringify(data),
    });
    return handleResponse<Teacher>(res);
  } catch {
    return null;
  }
}

export async function deleteTeacher(teacherId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/teachers/${teacherId}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// SCHEDULE SERVICE
// ============================================================================
export async function fetchSchedule(accessToken?: string): Promise<ScheduleSlot[]> {
  try {
    const headers: Record<string, string> = {};
    if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;
    
    const res = await fetch(`${COURSE_BASE_URL}/api/schedule`, { headers });
    if (res.ok) {
      return handleResponse<ScheduleSlot[]>(res);
    }
  } catch {
    // Fallback handled below
  }
  return [];
}

export async function createScheduleSlot(data: Partial<ScheduleSlot>, accessToken: string): Promise<ScheduleSlot | null> {
  try {
    const res = await fetch(`${COURSE_BASE_URL}/api/schedule`, {
      method: "POST",
      headers: authHeaders(accessToken),
      body: JSON.stringify(data),
    });
    return handleResponse<ScheduleSlot>(res);
  } catch {
    return null;
  }
}

export async function updateScheduleSlot(slotId: string, data: Partial<ScheduleSlot>, accessToken: string): Promise<ScheduleSlot | null> {
  try {
    const res = await fetch(`${COURSE_BASE_URL}/api/schedule/${slotId}`, {
      method: "PUT",
      headers: authHeaders(accessToken),
      body: JSON.stringify(data),
    });
    return handleResponse<ScheduleSlot>(res);
  } catch {
    return null;
  }
}

export async function deleteScheduleSlot(slotId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${COURSE_BASE_URL}/api/schedule/${slotId}`, {
      method: "DELETE",
      headers: authHeaders(accessToken),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// STUDENT REQUESTS (for Admin)
// ============================================================================
export async function fetchStudentRequests(accessToken: string): Promise<StudentRequest[]> {
  // This endpoint doesn't exist yet - return empty array
  // TODO: Implement /auth/student-requests in auth-service if needed
  return [];
}

export async function approveStudentRequest(requestId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/student-requests/${requestId}/approve`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function rejectStudentRequest(requestId: string, accessToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/student-requests/${requestId}/reject`, {
      method: "POST",
      headers: authHeaders(accessToken),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// HEALTH CHECKS
// ============================================================================
export async function fetchBillingHealth() {
  const res = await fetch(`${BILLING_BASE_URL}/actuator/health`).catch(() => null);
  if (!res) return { status: "DOWN" };
  try {
    return await res.json();
  } catch {
    return { status: res.ok ? "UP" : "DOWN" };
  }
}

export async function fetchCourseWsdl() {
  // Check Apache CXF WSDL endpoint
  const res = await fetch(`${COURSE_BASE_URL}/api/ws/course?wsdl`).catch(() => null);
  return { status: res && res.ok ? "UP" : "DOWN" };
}

export async function fetchCourseHealth() {
  // Simple health check - try to reach the CXF info endpoint
  try {
    const res = await fetch(`${COURSE_BASE_URL}/api/ws/info`).catch(() => null);
    if (res) return { status: "UP" };
    return { status: "DOWN" };
  } catch {
    return { status: "DOWN" };
  }
}

export async function fetchAuthHealth() {
  // Auth service doesn't have /actuator/health, so we check if server responds
  // by sending a simple request - even a 401/403 means service is UP
  try {
    const res = await fetch(`${AUTH_BASE_URL}/auth/health`, { method: "GET" }).catch(() => null);
    // If we get any response (even 404 or 403), the server is up
    if (res) return { status: "UP" };
    return { status: "DOWN" };
  } catch {
    return { status: "DOWN" };
  }
}

export async function fetchStudentHealth() {
  const res = await fetch(`${STUDENT_BASE_URL}/health`).catch(() => null);
  return { status: res && res.ok ? "UP" : "DOWN" };
}

export async function fetchGradeHealth() {
  const res = await fetch(`${GRADE_BASE_URL}/health`).catch(() => null);
  return { status: res && res.ok ? "UP" : "DOWN" };
}


// ============================================================================
// CONSOLIDATED API EXPORT (including AI)
// ============================================================================

export const api = {
  ai: {
    chat: async (message: string, userId: string): Promise<string> => {
      try {
        const response = await fetch(`${AI_SERVICE_URL}/agent/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, user_id: userId }),
        });
        const data = await response.json();
        return data.response;
      } catch (error) {
        console.error("AI Chat Error:", error);
        return "Sorry, I am having trouble connecting to the AI brain right now.";
      }
    },
    
    courseChat: async (courseId: string, query: string): Promise<string> => {
      try {
        const response = await fetch(`${AI_SERVICE_URL}/course-ai/rag/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: courseId, query }),
        });
        const data = await response.json();
        return data.response;
      } catch (error) {
         console.error("Course AI Error:", error);
         return "I couldn't analyze the course materials at this moment.";
      }
    },

    generateQuiz: async (courseId: string): Promise<string> => {
      try {
        const response = await fetch(`${AI_SERVICE_URL}/course-ai/rag/quiz`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ course_id: courseId, num_questions: 5 }),
        });
        const data = await response.json();
        return data.response;
      } catch (error) {
        console.error("Quiz Gen Error:", error);
        return "Failed to generate quiz.";
      }
    }
  }
};


