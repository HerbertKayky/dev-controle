"use client";

import { z } from "zod";
import { Input } from "../dashboard/components/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FiSearch, FiX } from "react-icons/fi";
import { useState } from "react";
import { FormTicket } from "./components/FormTicket";
import { api } from "@/lib/api";

const schema = z.object({
  email: z
    .string()
    .email("Digite o email do cliente para localizar")
    .min(1, "O campo email é obrigatório"),
});
type FormData = z.infer<typeof schema>;

export interface CustomerDataInfo {
  id: string;
  name: string;
}

export default function OpenTicket() {
  const [customer, setCustomer] = useState<CustomerDataInfo | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function handleClearCustomer() {
    setCustomer(null);
    setValue("email", "");
  }

  async function handleSearchCustomer(data: FormData) {
    const response = await api.get("/api/customer", {
      params: {
        email: data.email,
      },
    });

    if (response.data === null) {
      setError("email", {
        type: "custom",
        message: "Cliente não foi encontrado",
      });
      return;
    }

    setCustomer({
      id: response.data.id,
      name: response.data.name,
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-2">
      <h1 className="font-bold text-3xl  text-center mt-24">Abrir chamado</h1>

      <main className="flex flex-col mt-4 mb-2">
        {customer ? (
          <div className="flex items-center justify-between bg-slate-200 py-6 px-4 rounded border-2">
            <p className="text-lg ">
              <strong>Cliente selecionado:</strong> {customer.name}
            </p>
            <button
              onClick={handleClearCustomer}
              className="h-10 px-2 flex items-center justify-center rounded "
            >
              <FiX size={30} color="#FF2929" />
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(handleSearchCustomer)}
            className="bg-slate-200 py-6 px-2 rounded border-2"
          >
            <div className="flex flex-col gap-3">
              <Input
                name="email"
                placeholder="Digite o email do cliente"
                type="text"
                error={errors.email?.message}
                register={register}
              />
              <button
                type="submit"
                className="w-full flex flex-row h-11 items-center justify-center rounded text-lg
               gap-2 bg-blue-500 text-white font-bold"
              >
                Procurar clientes <FiSearch size={24} color="#FFF" />{" "}
              </button>
            </div>
          </form>
        )}

        {customer !== null && <FormTicket customer={customer} />}
      </main>
    </div>
  );
}
