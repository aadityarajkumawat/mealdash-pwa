import { useState } from "react";
import { useNavigate } from "react-router-dom";
import z from "zod";
import supabase from "../supabase";
import { Button } from "../ui/Button";
import { Center } from "../ui/Center";
import { Input } from "../ui/Input";
import { VStack } from "../ui/VStack";

const UserType = z.enum(["HOS", "DAS"]);

const registerFormSchema = z.object({
  email: z.string().email({ message: "Invalid e-mail address" }),
  password: z.string().min(5).max(18),
  name: z.string().min(2),
  type: UserType,
});

interface RegisterForm {
  email: string;
  password: string;
  name: string;
  type: z.infer<typeof UserType>;
}

export function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState<RegisterForm>({
    email: "",
    password: "",
    name: "",
    type: UserType.enum.HOS,
  });

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const detailsAreValid = registerFormSchema.safeParse(form);

    if (!detailsAreValid.success) {
      // show a failure toast
      const errorMessage = detailsAreValid.error.message;
      return;
    }

    // sign in call
    const { data, error } = await supabase.auth.signUp({
      ...form,
      options: { data: { type: form.type, name: "aditya" } },
    });

    if (!data.session && data.user) {
      navigate("/verify-email");
    }
  }

  return (
    <Center className="h-full">
      <div>
        <VStack className="items-center">
          <div className="text-center mb-5">
            <h1 className="text-lg font-bold">MealDash</h1>
            <p>Register</p>
          </div>

          <form onSubmit={onSubmit}>
            <VStack className="gap-3">
              <Input
                className="w-72"
                type="text"
                placeholder="Name"
                value={form.name}
                name="name"
                onChange={onChange}
              />
              <Input
                className="w-72"
                type="email"
                placeholder="E-Mail"
                value={form.email}
                name="email"
                autoComplete="off"
                onChange={onChange}
              />
              <Input
                className="w-72"
                type="password"
                placeholder="Password"
                value={form.password}
                name="password"
                onChange={onChange}
              />
              <Input
                className="w-72"
                type="text"
                placeholder="Type"
                value={form.type}
                name="type"
                onChange={onChange}
              />
            </VStack>

            <Button className="w-full mt-5 py-2" type="submit">
              Register
            </Button>
          </form>
          <p className="mt-3">
            Already a user?{" "}
            <span className="text-blue-500" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </VStack>
      </div>
    </Center>
  );
}
