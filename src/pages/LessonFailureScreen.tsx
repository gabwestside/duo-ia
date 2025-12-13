import Owl from "@/assets/images/devlingo-char.png";
import { Check, X } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface LessonFailureState {
  lessonId: string;
  correctAnswers: number;
  wrongAnswers: number;
  totalQuestions: number;
}

const LessonFailureScreen = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { lessonId, correctAnswers, wrongAnswers, totalQuestions } = (location.state as LessonFailureState) || {};

  const accuracyPercent = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;


  const handleTryAgain = () => {
    if (lessonId) {
      navigate(`/lesson/${lessonId}`, { replace: true });
    } else {
      navigate('/');
    }
  }


  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-2xl px-4 sm:px-0">
        {/* Mascote */}
        <div className="flex justify-center">
          <img
            src={Owl}
            alt="Mascote Devlingo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
        </div>

        {/* Título e subtítulo */}
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900 text-center">
          Você quase conseguiu!
        </h1>
        <p className="mt-2 text-center text-gray-500">
          Continue praticando para melhorar
        </p>

        {/* Card de resultados */}
        <div className="mt-8 rounded-3xl bg-white border border-gray-200 shadow-sm p-6">
          {/* Correta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-100">
                <Check className="w-5 h-5 text-green-600" />
              </span>
              <span className="text-gray-800">Respostas corretas</span>
            </div>
            <span className="text-green-600 font-bold text-lg">{correctAnswers}</span>
          </div>

          {/* Incorreta */}
          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                <X className="w-5 h-5 text-red-600" />
              </span>
              <span className="text-gray-800">Respostas incorretas</span>
            </div>
            <span className="text-red-600 font-bold text-lg">{wrongAnswers}</span>
          </div>

          {/* Divider */}
          <div className="my-6 h-px w-full bg-gray-200" />

          {/* Precisão */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Precisão</span>
            <span className="text-gray-900 font-bold">{accuracyPercent}%</span>
          </div>
        </div>

        {/* Ações */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-2xl bg-gray-200 text-gray-800 font-bold cursor-pointer"
          >
            VOLTAR
          </button>
          <button
            type="button"
            onClick={handleTryAgain}
            className="px-8 py-3 rounded-2xl bg-[#32CD32] hover:bg-[#2fb32f] text-white font-extrabold cursor-pointer"
          >
            TENTAR NOVAMENTE
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonFailureScreen;
