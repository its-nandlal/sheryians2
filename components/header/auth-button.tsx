import { motion } from "framer-motion";
import { Github } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const item = {
  hidden: { y: -50, opacity: 0 },
  visible: { y: 0, opacity: 1 }
};

const buttonClass = "w-8 h-8 scale-[.9] flex items-center justify-center bg-[#00ffbf]/70 text-black rounded-full cursor-pointer hover:bg-[#00ffbf]/50";

export default function AuthButton({active}: {active?: boolean}) {
  return (
    <motion.div 
      className="absolute top-full left-0 mt-2 w-full flex justify-center gap-2"
      initial="hidden"
      animate={active ? "visible" : "hidden"}
      variants={container}
    >
      <motion.button 
        variants={item}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className={`${buttonClass} font-[Helvetica]`}
      >
        G
      </motion.button>
      
      <motion.button 
        variants={item}
        transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
        className={buttonClass}
      >
        <Github className="w-4 h-4"/>
      </motion.button>
    </motion.div>
  );
}
