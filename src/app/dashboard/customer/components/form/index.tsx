"use client";

import { Input } from "@/app/dashboard/components/input";
import { api } from "@/lib/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(1, "O campo nome é obrigatório"),
  email: z
    .string()
    .email("Digite um email válido.")
    .min(1, "O email é obrigatório."),
  phone: z.string().refine(
    (value) => {
      return (
        /^(?:\(\d{2}\)\s?)?\d{9}$/.test(value) ||
        /^\d{2}\s\d{9}$/.test(value) ||
        /^\d{11}$/.test(value)
      );
    },
    {
      message: "O número de telefone deve estar (DD) 999999999 ",
    }
  ),
  address: z.string(),
});

type FormData = z.infer<typeof schema>;

export function NewCustomerForm({ userId }: { userId: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const router = useRouter();

  async function handleRegisterCustomer(data: FormData) {
    await api.post("/api/customer", {
      name: data.name,
      phone: data.phone,
      email: data.email,
      address: data.address,
      userId: userId,
    });
    router.replace("/dashboard/customer");
  }

  return (
    <form
      className="flex flex-col mt-6"
      onSubmit={handleSubmit(handleRegisterCustomer)}
    >
      <label className="mb-1 text-lg font-medium">Nome completo</label>
      <Input
        placeholder="Digite o nome completo"
        type="text"
        name="name"
        register={register}
        error={errors.name?.message}
      />

      <section className="flex my-2 gap-2 flex-col sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 text-lg font-medium">E-mail</label>
          <Input
            placeholder="Digite o seu email"
            type="email"
            name="email"
            register={register}
            error={errors.email?.message}
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 text-lg font-medium">Número de telefone</label>
          <Input
            placeholder="(DD) 9-9999-9999"
            type="number"
            name="phone"
            register={register}
            error={errors.phone?.message}
          />
        </div>
      </section>
      <label className="mb-1 text-lg font-medium">Endereço completo</label>
      <Input
        placeholder="Digite o endereço do cliente"
        type="text"
        name="address"
        register={register}
        error={errors.address?.message}
      />

      <button
        type="submit"
        className="bg-blue-500 my-4 px-2 h-11 rounded text-white font-bold"
      >
        Cadastrar
      </button>
    </form>
  );
}
