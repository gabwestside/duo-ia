import { X } from "lucide-react";
import Owl from "@/assets/images/devlingo-char.png";
import { lessonsData } from "@/mocks/lessonsData";
import { useNavigate } from "react-router-dom";

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedUnitId?: number;
}

const LessonModal = ({ isOpen, onClose, selectedUnitId }: LessonModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const unitLessons = lessonsData.filter(
    (lesson) => lesson.unitId === selectedUnitId
  );

  const handleStartLesson = (lessonId: string) => {
    navigate(`/lesson/${lessonId}`);

    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Card modal */}
      <div className="relative z-50 w-full max-w-2xl mx-4">
        <div className="rounded-3xl bg-[#7a0dbf] text-white shadow-2xl">
          {/* Cabeçalho */}
          <div className="px-8 pt-8 pb-4 flex items-start justify-between">
            <div className="w-full">
              <h3 className="text-2xl font-bold tracking-wide text-center">
                Escolha uma lição
              </h3>
              <p className="mt-2 text-center text-white/90">Unidade {selectedUnitId}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="ml-4 text-white/90 hover:text-white transition cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="px-8 pb-10">
            {unitLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => handleStartLesson(lesson.id)}
                type="button"
                className="w-full text-left bg-white/10 hover:bg-white/15 transition rounded-2xl p-5 border shadow-md cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-xl font-semibold">{lesson.title}</h4>
                    <p className="mt-1 text-sm text-white/90">{lesson.description}</p>
                    <p className="mt-2 text-sm text-white/90">+{lesson.xpReward} XP</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Coruja no canto inferior direito, fora do card */}
        <div className="absolute -bottom-8 -right-6 w-24 h-24 sm:w-28 sm:h-28">
          <img
            src={Owl}
            alt="Mascote Devlingo"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default LessonModal;
