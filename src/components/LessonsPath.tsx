import Owl from "@/assets/images/devlingo-char.png";
import LessonNode from "./LessonNode";
import { useState } from "react";
import LessonModal from "./LessonModal";
import { useCompletedLessons } from "@/hooks/useCompletedLessons";
import { lessonsData } from "@/mocks/lessonsData";

// Renderiza uma coluna de estrelas com leve offset e sombra suave
const LessonsPath = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { completedLessons } = useCompletedLessons();

  console.debug("[LessonsPath] completedLessons", completedLessons);

  const mapUnitToLessonId = (unitId: number): string | null => {
    const lesson = lessonsData.find((l) => l.unitId === unitId);
    const id = lesson?.id ?? null;
    console.log("[LessonsPath] mapUnitToLessonId", { unitId, lessonId: id });
    return id;
  };

  const handleUnitClick = (
    unitId: number,
    status: "available" | "completed" | "locked"
  ) => {
    if (status === "available" || status === "completed") {
      setSelectedUnitId(unitId);
      setIsModalOpen(true);
    }

    console.log(`Clicou na unidade ${unitId}`);
  };

  const getUnitStatus = (unitId: number) : 'available' | 'completed' | 'locked' => {
    const lessonId = mapUnitToLessonId(unitId);
    const prevLessonId = mapUnitToLessonId(unitId - 1);

    const isCompleted = !!lessonId && completedLessons.includes(lessonId);
    console.log("[LessonsPath] getUnitStatus", { unitId, lessonId, isCompleted, prevLessonId });
    if (isCompleted) {
      return "completed";
    }

    if(unitId === 1) {
      return "available";
    }

    // unidade anterior foi completada
    if(prevLessonId && completedLessons.includes(prevLessonId)) {
      return "available";
    }

    // Logic to determine if the unit is available or locked can be added here
    return "locked";
  }

  return (
    <div className="relative w-full flex justify-center py-8">
      <div className="flex flex-col">
        <LessonNode
          status={getUnitStatus(1)}
          onClick={() => handleUnitClick(1, getUnitStatus(1))}
        />

        <div style={{ transform: "translateX(-40px)" }}>
          <LessonNode
            status={getUnitStatus(2)}
            onClick={() => handleUnitClick(2, getUnitStatus(2))}
          />
        </div>

        <div
          className="relative w-full flex justify-center"
          style={{ transform: "translateX(-60px)" }}
        >
          <LessonNode
            status={getUnitStatus(3)}
            onClick={() => handleUnitClick(3, getUnitStatus(3))}
          />

          {/* Mascote ao lado do caminho */}
          <div className="absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-24">
            <div className="w-32 h-32 animate-float">
              <img
                src={Owl}
                alt="Mascote Devlingo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>

        <div style={{ transform: "translateX(-60px)" }}>
          <LessonNode
            status={getUnitStatus(4)}
            onClick={() => handleUnitClick(4, getUnitStatus(4))}
          />
        </div>

        <div style={{ transform: "translateX(-40px)" }}>
          <LessonNode
            status={getUnitStatus(5)}
            onClick={() => handleUnitClick(5, getUnitStatus(5))}
          />
        </div>
      </div>

      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedUnitId={selectedUnitId ?? undefined}
      />
    </div>
  );
};

export default LessonsPath;
