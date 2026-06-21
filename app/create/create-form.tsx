"use client";

import Link from "next/link";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createTicketAction } from "./actions";

const MAX_MESSAGE_LENGTH = 300;

type SubmitButtonProps = {
  isTextEmpty: boolean;
};

function SubmitButton({ isTextEmpty }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={isTextEmpty || pending}
      className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:text-zinc-500 disabled:shadow-none"
    >
      {pending ? "Отправляем..." : "Отправить заявку"}
    </button>
  );
}

export function CreateForm() {
  const [message, setMessage] = useState("");
  const remainingCharacters = MAX_MESSAGE_LENGTH - message.length;
  const isTextEmpty = message.trim().length === 0;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-8 text-zinc-950">
      <div className="mx-auto w-full max-w-md">
        <Link
          href="/"
          className="inline-flex rounded-xl px-1 py-2 text-sm font-medium text-zinc-600 transition hover:text-zinc-950 focus:outline-none focus:ring-4 focus:ring-zinc-200"
        >
          Назад
        </Link>

        <form
          action={createTicketAction}
          className="mt-8 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm"
        >
          <h1 className="text-3xl font-semibold">Новое обращение</h1>

          <label htmlFor="message" className="mt-8 block text-sm font-medium">
            Описание запроса
          </label>
          <textarea
            id="message"
            name="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={MAX_MESSAGE_LENGTH}
            placeholder="Опишите ваш запрос детально..."
            className="mt-3 min-h-44 w-full resize-none rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-base leading-7 text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <div className="mt-2 text-right text-sm text-zinc-500">
            Осталось: {remainingCharacters}
          </div>

          <SubmitButton isTextEmpty={isTextEmpty} />
        </form>
      </div>
    </main>
  );
}
