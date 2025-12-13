// Importações de bibliotecas e componentes necessários
import { useState } from "react"; // Hook do React para gerenciar o estado do componente
import { X } from "lucide-react"; // Ícone de "fechar"
import { IoHeart } from "react-icons/io5"; // Ícone de coração para as vidas
import { useNavigate, useParams } from "react-router-dom"; // Hooks para navegação e para pegar parâmetros da URL
import { lessonsData } from "@/mocks/lessonsData"; // Dados mocados (falsos) das lições
import AnswerFeedbackPopUp from "@/components/AnswerFeedbackPopUp"; // Componente de pop-up para feedback
import { useAuth } from "@/contexts/AuthContext";
import { saveLessonsScore } from "@/services/saveLessonsScore";

// Definição do componente LessonScreen
const LessonScreen = () => {
  const { user } = useAuth();

  // --- HOOKS ---
  // Hook para navegar entre as páginas da aplicação
  const navigate = useNavigate();
  // Hook para pegar os parâmetros da URL. Neste caso, o 'lessonId'.
  // Ex: Se a URL for /lesson/1, lessonId será "1".
  const { lessonId } = useParams();

  // --- ESTADOS (States) ---
  // Estes são os "cérebros" do componente. Eles guardam informações que mudam com o tempo.
  const [selected, setSelected] = useState<number | null>(null); // Guarda o índice da opção que o usuário selecionou. Começa como nulo.
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Guarda se a resposta selecionada está correta (true) ou errada (false).
  const [showFeedbackPopUp, setShowFeedbackPopUp] = useState(false); // Controla a exibição do pop-up de feedback.
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Índice da pergunta atual na lição.

  const [correctAnswers, setCorrectAnswers] = useState<number>(0); // Guarda o índice da resposta correta.
  const [wrongAnswers, setWrongAnswers] = useState<number>(0); // Guarda o índice da resposta errada.
  const [lives, setLives] = useState<number>(3); // Guarda o número de vidas restantes do usuário.

  // --- LÓGICA DE DADOS ---
  // Procura no nosso array de lições (lessonsData) pela lição que tenha o 'id' igual ao 'lessonId' da URL.
  const lesson = lessonsData.find((lesson) => lesson.id === lessonId);

  // Se a lição não for encontrada, mostra uma mensagem e um botão para voltar.
  if (!lesson) {
    console.warn("[Lesson] lesson not found", { lessonId });
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lição não encontrada</p>
          <button
            onClick={() => navigate("/")}
            className="bg-[#58CC02] text-white px-6 py-2 rounded-xl cursor-pointer"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // --- VARIÁVEIS DA LIÇÃO ATUAL ---
  // ATENÇÃO: Por enquanto, estamos pegando apenas a PRIMEIRA pergunta da lição.
  const currentQuestion = lesson.questions[currentQuestionIndex];
  const totalQuestions = lesson.questions.length; // Total de perguntas na lição.
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // --- FUNÇÕES ---
  // Função chamada quando o usuário clica no botão "VERIFICAR".
  const handleCheck = async () => {
    // Se nenhuma opção foi selecionada, não faz nada.
    if (selected === null) return;

    // Verifica se o índice da resposta selecionada ('selected') é o mesmo da resposta correta ('correctAnswer').
    const isAnswerCorrect = selected === currentQuestion.correctAnswer;

    // Atualiza os estados com base no resultado.
    setIsCorrect(isAnswerCorrect); // Guarda se acertou ou errou.

    if (isAnswerCorrect) {
      const nextCorrect = correctAnswers + 1;
      setCorrectAnswers(nextCorrect);
      setShowFeedbackPopUp(true);
      return;
    }

    const nextWrong = wrongAnswers + 1;
    const nextLives = lives - 1;
    setWrongAnswers(nextWrong);
    setLives(nextLives);

    if (nextWrong >= 3 && nextLives <= 0) {
      setShowFeedbackPopUp(false);

      navigate("/lesson-failure/", {
        state: {
          lessonId: lesson.id,
          correctAnswers: correctAnswers,
          wrongAnswers: nextWrong,
          totalQuestions,
        },
      });
      return;
    }

    setShowFeedbackPopUp(true);
  };

  const handleContinue = async () => {
    console.log("[Lesson] handleContinue", {
      currentQuestionIndex,
      counters: { correctAnswers, wrongAnswers, lives },
      totalQuestions,
    });
    setShowFeedbackPopUp(false); // Fecha o pop-up de feedback.

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => {
        const next = prev + 1;
        console.log("[Lesson] next question", {
          nextIndex: next,
          totalQuestions,
        });
        return next;
      }); // Vai para a próxima pergunta.
      setSelected(null); // Reseta a seleção.
      setIsCorrect(null); // Reseta o resultado.
    } else {
      // respondeu todas as perguntas, salva a pontuação
      if (correctAnswers === totalQuestions) {
        if (user?.id) {
          try {
            const result = await saveLessonsScore({
              userId: user?.id,
              lessonId: lesson.id,
              correctAnswers: correctAnswers,
              wrongAnswers: wrongAnswers,
              xpEarned: lesson.xpReward,
            }); // Salva a pontuação da lição

            console.debug("[Lesson] saved score successfully", result);
          } catch (error) {
            console.error("[Lesson] error saving score/navigating:", error);
          }

          // Liçao finalizada, vai pra tela de sucesso
          console.debug("[Lesson] navigating to success", {
            lessonId: lesson.id,
            xpEarned: lesson.xpReward,
            accuracy: 100,
          });
          navigate("/lesson-success/", {
            state: {
              lessonId: lesson.id,
              xpEarned: lesson.xpReward,
              accuracy: 100,
            },
          });
        }
      } else {
        console.debug("[Lesson] navigating to failure", {
          lessonId: lesson.id,
          correctAnswers,
          wrongAnswers,
          totalQuestions,
        });

        // Liçao finalizada, vai pra tela de resumo com resultados
        navigate("/lesson-failure/", {
          state: {
            lessonId: lesson.id,
            correctAnswers: correctAnswers,
            wrongAnswers: wrongAnswers,
            totalQuestions,
          },
        });
      }
    }
  };

  // --- RENDERIZAÇÃO (O que aparece na tela) ---
  return (
    <div className="min-h-screen bg-white">
      {/* Barra Superior: botão de fechar, progresso e vidas */}
      <div className="sticky top-0 z-30 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Botão para fechar a lição e voltar para a página inicial */}
          <button
            className="text-gray-600 hover:text-gray-800 cursor-pointer"
            aria-label="Fechar"
            onClick={() => navigate("/")}
          >
            <X className="w-6 h-6" />
          </button>

          {/* Barra de Progresso */}
          <div className="flex-1 px-6">
            <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
              {/* A largura da barra interna é controlada pela variável 'progress' */}
              <div
                className={`h-full bg-[#7a0dbf]`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Contador de Vidas */}
          <div className="flex items-center gap-2 text-[#EF4444]">
            <IoHeart className="w-5 h-5" />
            <span className="text-gray-800">{lives}</span>
          </div>
        </div>
      </div>

      {/* Conteúdo Principal da Lição */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Título da Pergunta */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {currentQuestion.question}
        </h1>

        {/* Opções de Resposta */}
        <div className="space-y-4">
          {/* 
                      Usa a função 'map' para criar um botão para cada opção de resposta.
                      'label' é o texto da opção, 'idx' é o índice (0, 1, 2...).
                    */}
          {currentQuestion.options?.map((label, idx) => {
            const isSelected = selected === idx; // Verifica se esta é a opção selecionada pelo usuário.
            return (
              <button
                key={label} // Chave única para cada item da lista, importante para o React.
                onClick={() => {
                  console.debug("[Lesson] option selected", { idx, label });
                  setSelected(idx);
                }} // Ao clicar, atualiza o estado 'selected' com o índice do botão.
                // Classes de estilo dinâmicas baseadas na seleção do usuário.
                className={`w-full text-left rounded-2xl border transition shadow-sm p-4 flex items-center justify-between ${
                  isSelected
                    ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300" // Estilo se estiver selecionado.
                    : "bg-white border-gray-300 hover:bg-gray-50" // Estilo se não estiver selecionado.
                }`}
              >
                <span className="text-gray-900">{label}</span>
                <span className="text-gray-500 text-sm">{idx + 1}</span>
              </button>
            );
          })}
        </div>

        {/* Botões de Ação: Pular e Verificar */}
        <div className="mt-8 flex items-center justify-between">
          <button className="px-5 py-3 rounded-xl bg-gray-200 text-gray-800 font-semibold cursor-pointer">
            PULAR
          </button>

          <button
            // A classe de opacidade e o atributo 'disabled' dependem se algo foi selecionado.
            className={`px-6 py-3 rounded-xl bg-green-500 text-white font-bold cursor-pointer ${
              selected === null ? "opacity-50" : ""
            }`}
            disabled={selected === null} // Desabilita o botão se nenhuma opção foi escolhida.
            onClick={handleCheck} // Chama a função de verificação ao ser clicado.
          >
            VERIFICAR
          </button>
        </div>
      </div>

      {/* Componente do Pop-up de Feedback (sua visibilidade é controlada internamente ou por um contexto) */}
      <AnswerFeedbackPopUp
        open={showFeedbackPopUp}
        type={isCorrect ? "correct" : "incorrect"}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default LessonScreen;
