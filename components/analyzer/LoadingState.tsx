"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Sparkles, Database, Brain, BarChart2, Coffee } from "lucide-react"
import { Progress } from "@/components/ui/progress"

const steps = [
  { id: 1, text: "유튜브 데이터 수집 및 전처리 중...", icon: Database, duration: 1500 },
  { id: 2, text: "Gemini AI 모델이 감정 맥락을 분석 중...", icon: Brain, duration: 3500 },
  { id: 3, text: "고빈도 키워드와 핵심 주제 도출 중...", icon: Sparkles, duration: 2500 },
  { id: 4, text: "시각화 데이터 및 분석 리포트 생성 중...", icon: BarChart2, duration: 2000 },
  { id: 5, text: "AI가 최종 인사이트를 다듬고 있습니다...", icon: Coffee, duration: 15000 }, // Long tail step
];

export function LoadingState() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentStepIdx = 0;
    let stepStartTime = Date.now();
    let interval: NodeJS.Timeout;

    const update = () => {
      const elapsed = Date.now() - stepStartTime;
      const currentStepDuration = steps[currentStepIdx].duration;
      
      // Calculate step-specific progress
      const stepPct = Math.min((elapsed / currentStepDuration) * 100, 100);
      
      // Calculate overall progress (each step is 20%)
      const overall = (currentStepIdx * 20) + (stepPct / 5);
      setProgress(overall);

      if (elapsed >= currentStepDuration && currentStepIdx < steps.length - 1) {
        currentStepIdx++;
        setCurrentStep(currentStepIdx);
        stepStartTime = Date.now();
      }
    };

    interval = setInterval(update, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-24 max-w-lg mx-auto text-center">
      <div className="relative mb-12">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="absolute inset-x-[-4rem] inset-y-[-4rem] bg-blue-500 rounded-full blur-[80px]"
        ></motion.div>
        
        <div className="relative h-28 w-28 rounded-[2rem] bg-white dark:bg-slate-900 border shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ y: 30, opacity: 0, scale: 0.5 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -30, opacity: 0, scale: 0.5 }}
              className="absolute"
            >
              {steps[currentStep] && (() => {
                const StepIcon = steps[currentStep].icon;
                return <StepIcon className="h-12 w-12 text-blue-600 dark:text-blue-400" />;
              })()}
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-0 left-0 h-1.5 bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(progress % 20) * 5}%` }}></div>
        </div>
      </div>

      <div className="space-y-8 w-full px-6">
        <div className="h-20 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.h3 
              key={currentStep}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-2xl font-black tracking-tight text-slate-800 dark:text-slate-100 italic"
            >
              {steps[currentStep]?.text}
            </motion.h3>
          </AnimatePresence>
        </div>
        
        <div className="space-y-4">
          <div className="h-6 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-1 shadow-inner relative">
            {/* Background animated shimmer */}
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent z-10 skew-x-12"
            />
            
            {/* Progress indicator */}
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 shadow-lg relative overflow-hidden"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            >
              {/* Internal stripe animation */}
              <motion.div 
                animate={{ x: [0, 40] }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: "linear-gradient(45deg, white 25%, transparent 25%, transparent 50%, white 50%, white 75%, transparent 75%, transparent)",
                  backgroundSize: "40px 40px"
                }}
              />
            </motion.div>
          </div>
          <div className="grid grid-cols-4 gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
            <span className={progress >= 20 ? "text-blue-500" : ""}>데이터 추출</span>
            <span className={progress >= 40 ? "text-blue-500" : ""}>AI 맥락분석</span>
            <span className={progress >= 80 ? "text-blue-500" : ""}>인사이트 도출</span>
            <span className={progress >= 98 ? "text-blue-500" : ""}>완료 대기</span>
          </div>
        </div>

        <div className="pt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 font-medium bg-slate-50 dark:bg-slate-900/50 px-6 py-3 rounded-full border border-slate-100 dark:border-slate-800 shadow-inner">
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            <span>최대 30초 정도 소요될 수 있습니다.</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-[280px]">
            AI가 유튜브 영상 댓글 텍스트 정보를 심층 분석하여 정밀한 리포트를 생성하고 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
