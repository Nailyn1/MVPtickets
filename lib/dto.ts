// lib/dto.ts

// ==========================================
// 1. БАЗОВЫЕ ТИПЫ (СУЩНОСТИ)
// ==========================================

export type Role = "CLIENT" | "ADMIN";
export type Status = "IN_PROGRESS" | "ANSWERED";

export interface UserDTO {
  id: string;
  name: string;
  role: Role;
}

export interface TicketDTO {
  id: string;
  text: string;
  status: Status;
  managerComment?: string | null;

  // Опциональные поля от AI
  aiSummary?: string | null;
  aiCategory?: string | null;
  aiPriority?: string | null;
  aiNextStep?: string | null;

  userId: string;
  createdAt: string; // ISO string
}

// ==========================================
// 2. DTO ДЛЯ ЗАПРОСОВ И ОТВЕТОВ (ENDPOINTS)
// ==========================================

// --- Авторизация / Регистрация (POST /api/users) ---

export interface UserLoginRequestDTO {
  name: string;
  isAdmin?: boolean;
}

export interface UserLoginResponseDTO {
  user: UserDTO;
}

// --- Создание заявки (POST /api/tickets) ---

export interface CreateTicketRequestDTO {
  text: string;
  userId: string;
}

export interface CreateTicketResponseDTO {
  ticket: TicketDTO;
}

// --- Получение заявок (GET /api/tickets) ---
// GET-запросы не имеют тела (RequestDTO)

export interface GetTicketsResponseDTO {
  tickets: TicketDTO[];
}

// --- Ответ менеджера / Обновление заявки (PATCH /api/tickets) ---

export interface UpdateTicketRequestDTO {
  ticketId: string;
  status?: Status;
  managerComment?: string;
}

export interface UpdateTicketResponseDTO {
  ticket: TicketDTO;
}
