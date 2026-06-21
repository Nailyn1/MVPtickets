"use client";

import { Fragment } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormStatus } from "react-dom";
import type { TicketDTO } from "@/lib/dto";
import { answerTicketAction } from "./actions";

type HistoryTableProps = {
  tickets: TicketDTO[];
  isAdmin: boolean;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500"
    >
      {pending ? "Сохраняем..." : "Ответить"}
    </button>
  );
}

function formatDate(value: string) {
  const [date = "", time = ""] = value.split("T");
  return `${date} ${time.slice(0, 5)}`;
}

function getStatusLabel(status: TicketDTO["status"]) {
  return status === "ANSWERED" ? "Отвечено" : "В работе";
}

export function HistoryTable({ tickets, isAdmin }: HistoryTableProps) {
  const router = useRouter();
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  if (tickets.length === 0) {
    return (
      <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center text-zinc-500">
        Заявок пока нет
      </div>
    );
  }

  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-zinc-100 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-500">
            <tr>
              <th className="px-5 py-4">Дата</th>
              <th className="px-5 py-4">Текст</th>
              <th className="px-5 py-4">Статус</th>
              <th className="px-5 py-4">Ответ</th>
              {isAdmin ? <th className="px-5 py-4">Категория</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {tickets.map((ticket) => {
              const isSelected = selectedTicketId === ticket.id;
              const isAnswered = ticket.status === "ANSWERED";

              async function handleAnswer(formData: FormData) {
                await answerTicketAction(formData);
                setSelectedTicketId(null);
                router.refresh();
              }

              return (
                <Fragment key={ticket.id}>
                  <tr
                    onClick={() =>
                      isAdmin
                        ? setSelectedTicketId(isSelected ? null : ticket.id)
                        : undefined
                    }
                    className={
                      isAdmin
                        ? "cursor-pointer transition hover:bg-blue-50/50"
                        : undefined
                    }
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-zinc-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="max-w-xs px-5 py-4 font-medium text-zinc-900">
                      {ticket.text}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700">
                        {getStatusLabel(ticket.status)}
                      </span>
                    </td>
                    <td className="max-w-xs px-5 py-4 text-zinc-600">
                      {ticket.managerComment || "Пока нет ответа"}
                    </td>
                    {isAdmin ? (
                      <td className="px-5 py-4 text-zinc-600">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {ticket.aiCategory || "Без категории"}
                        </span>
                      </td>
                    ) : null}
                  </tr>

                  {isAdmin && isSelected ? (
                    <tr className="bg-blue-50/40">
                      <td colSpan={5} className="px-5 py-5">
                        <div className="mb-4 grid gap-3 md:grid-cols-3">
                          <div className="rounded-2xl border border-blue-100 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
                              AI резюме
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-700">
                              {ticket.aiSummary || "Резюме пока не заполнено"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-blue-100 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
                              Категория
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-700">
                              {ticket.aiCategory || "Категория не определена"}
                            </p>
                          </div>
                          <div className="rounded-2xl border border-blue-100 bg-white p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-zinc-400">
                              Следующий шаг
                            </p>
                            <p className="mt-2 text-sm leading-6 text-zinc-700">
                              {ticket.aiNextStep || "Следующий шаг не задан"}
                            </p>
                          </div>
                        </div>

                        {isAnswered ? (
                          <div className="rounded-2xl border border-blue-100 bg-white px-4 py-3 text-sm text-zinc-700">
                            {ticket.managerComment || "Ответ не заполнен"}
                          </div>
                        ) : (
                          <form
                            action={handleAnswer}
                            className="grid gap-3 sm:grid-cols-[1fr_auto]"
                          >
                            <input
                              type="hidden"
                              name="ticketId"
                              value={ticket.id}
                            />
                            <input
                              name="managerComment"
                              defaultValue={ticket.managerComment ?? ""}
                              placeholder="Введите ответ на заявку"
                              className="w-full rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                            />
                            <SubmitButton />
                          </form>
                        )}
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
