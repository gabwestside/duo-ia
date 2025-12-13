import { Check, X } from "lucide-react";

type FeedbackType = "correct" | "incorrect";

interface AnswerFeedbackPopUpProps {
    open: boolean;
    type?: FeedbackType;
    onContinue?: () => void;
}

const AnswerFeedbackPopUp = ({
    open,
    type,
    onContinue,
}: AnswerFeedbackPopUpProps) => {
    if (!open) return null;

    const isSuccess = type === "correct";

    const bg = isSuccess ? "bg-green-100" : "bg-red-100";
    const border = isSuccess ? "border-green-300" : "border-red-300";
    const text = isSuccess ? "text-green-900" : "text-red-900";
    const btn = isSuccess
        ? "bg-green-500 hover:bg-green-600"
        : "bg-red-500 hover:bg-red-600";
    const Icon = isSuccess ? Check : X;

    return (
        <div className="fixed inset-x-0 bottom-0 z-50" role="status" aria-live="polite">
            <div className="mx-auto max-w-6xl px-4 pb-4">
                <div
                    className={`w-full ${bg} ${text} border ${border} rounded-2xl shadow-xl px-6 py-4 flex items-center justify-between gap-6`}
                >
                    {/* Left: Icon + text */}
                    <div className="flex items-center gap-4">
                        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow">
                            <Icon className={`${isSuccess ? "text-green-500" : "text-red-500"}`} size={36} />
                        </span>
                        <span className="font-semibold text-2xl">{isSuccess ? "Na mosca!" : "Incorreto!"}</span>
                    </div>

                    {/* Right: Continue button */}
                    <button
                        type="button"
                        onClick={onContinue}
                        className={`shrink-0 px-6 sm:px-8 py-3 rounded-xl text-white font-semibold ${btn} shadow`}
                    >
                        Continuar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnswerFeedbackPopUp;