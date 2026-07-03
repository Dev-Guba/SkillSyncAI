import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";

export default function FloatingGlobe({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -10, 0],
        rotate: [0, 6, -6, 0],
      }}
      transition={{
        opacity: { duration: 0.5 },
        scale: { duration: 0.5 },
        y: {
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        },
        rotate: {
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        },
      }}
      whileHover={{
        scale: 1.1,
      }}
      whileTap={{
        scale: 0.95,
      }}
      className="
      fixed
      bottom-8
      right-8
      z-50
      h-20
      w-20
      rounded-full
      bg-linear-to-br
      from-violet-500
      to-indigo-600
      shadow-2xl
      shadow-violet-500/30
      border
      border-white/20
      backdrop-blur-xl
      flex
      items-center
      justify-center
      overflow-hidden
      "
    >
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        <Globe2
          size={38}
          className="text-white"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 rounded-full bg-violet-400/20"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.7, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
        }}
      />
    </motion.button>
  );
}