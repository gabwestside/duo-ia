import Owl from "@/assets/images/devlingo-char.png";
import { Gem, Target } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface LessonSuccessState {
  xpEarned?: number;
  accuracy?: number;
} 

const LessonSuccessScreen = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const { xpEarned, accuracy } = (location.state as LessonSuccessState) || {};

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex flex-col items-center">
        {/* Mascote */}
        <div>
        <img
          src={Owl}
          alt="Mascote Devlingo"
          className="w-28 h-28 sm:w-32 sm:h-32 object-contain"
        />
        </div>

      {/* Título */}
      <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold text-[#f7b500] text-center">
        Lição concluída!
      </h1>

      {/* Cards de resumo */}
      <div className="mt-10 flex items-stretch gap-6">
        {/* XP total */}
        <div className="rounded-2xl border-2 border-[#f7eaa6] bg-[#fff8cc] px-6 py-5 min-w-[220px]">
          <p className="text-gray-700 text-sm">TOTAL DE XP</p>
          <div className="mt-3 flex items-center gap-3">
            <Gem className="w-6 h-6 text-[#0EA5E9]" />
            <span className="text-2xl font-bold text-[#f59e0b]">{xpEarned}</span>
          </div>
        </div>

        {/* Precisão */}
        <div className="rounded-2xl border-2 border-[#b7f1c8] bg-[#eafff2] px-6 py-5 min-w-[220px]">
          <p className="text-gray-700 text-sm">BOA</p>
          <div className="mt-3 flex items-center gap-3">
            <Target className="w-6 h-6 text-[#22c55e]" />
            <span className="text-2xl font-bold text-[#16a34a]">{accuracy}%</span>
          </div>
        </div>
      </div>

      {/* Botão continuar */}
      <div className="mt-12">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="px-10 py-4 rounded-2xl bg-[#32CD32] hover:bg-[#2fb32f] text-white font-extrabold shadow-md cursor-pointer"
        >
          CONTINUAR
        </button>
      </div>
      </div>
    </div>
  );
};

export default LessonSuccessScreen;