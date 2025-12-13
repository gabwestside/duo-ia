import { useAuth } from "@/contexts/AuthContext";
import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: FormEvent) => {
   e.preventDefault();

    try {
       const { error } = await login(email, senha);   
        
        if (error) {
          console.log("Erro no login:", error);
          return;
        }

        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
    }

  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-[#9225D4] to-[#6c19a0] p-4">
      <div className="bg-white/95 w-full max-w-md rounded-2xl shadow-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Bem-vindo de volta!
        </h1>
        <p className="text-center text-gray-500 mt-1">
          Entre na sua conta para continuar
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Email</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700">Senha</label>
            <input
              type="password"
              placeholder="********"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            className="w-full py-3 bg-[#9225D4] hover:bg-[#7a1fb3] transition rounded-lg text-white font-semibold text-center cursor-pointer"
          >
            Entrar
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <span className="flex-1 h-px bg-gray-300" />
          <span className="text-gray-500 text-sm">ou</span>
          <span className="flex-1 h-px bg-gray-300" />
        </div>

        <p className="mt-6 text-center text-gray-600">
          Não tem uma conta?{" "}
          <Link
            to="/signup"
            className="text-[#9225D4] font-medium hover:underline"
          >
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
