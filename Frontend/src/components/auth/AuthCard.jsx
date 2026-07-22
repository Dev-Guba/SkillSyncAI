import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function AuthCard({ mode }) {
  const navigate = useNavigate();

  const isLogin = mode === "login";

  return (
    <motion.div
      layout
      initial={{
        opacity: 0,
        y: 30,
        scale: 0.98,
      }}
      animate={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      transition={{
        duration: 0.35,
        layout: {
          type: "spring",
          stiffness: 260,
          damping: 25,
        },
      }}
className="
w-full
max-w-[440px]
rounded-[32px]
border
border-border
bg-surface
p-6
sm:p-8
shadow-soft-lg
"
    >

      {/* Switch */}
      <div className="mb-8">

        <div
          className="
            relative
            flex
            rounded-2xl
            bg-surface-alt
            p-1
          "
        >

          <motion.div
            layoutId="auth-switch"
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
            className={`
              absolute
              inset-y-1
              w-[calc(50%-4px)]
              rounded-xl
              bg-surface
              shadow-soft
              ${
                isLogin
                  ? "left-1"
                  : "left-[calc(50%+2px)]"
              }
            `}
          />


          <button
            type="button"
            onClick={() => navigate("/login")}
            className={`
              relative
              z-10
              flex-1
              rounded-xl
              py-3
              text-sm
              font-semibold
              transition-colors
              ${
                isLogin
                  ? "text-primary"
                  : "text-muted"
              }
            `}
          >
            Log In
          </button>


          <button
            type="button"
            onClick={() => navigate("/register")}
            className={`
              relative
              z-10
              flex-1
              rounded-xl
              py-3
              text-sm
              font-semibold
              transition-colors
              ${
                !isLogin
                  ? "text-primary"
                  : "text-muted"
              }
            `}
          >
            Register
          </button>

        </div>

      </div>


      {/* Heading */}
      <AnimatePresence mode="wait">

        <motion.div
          key={mode}
          initial={{
            opacity: 0,
            y: 15,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          exit={{
            opacity: 0,
            y: -15,
          }}
          transition={{
            duration: 0.25,
          }}
        >

          <h1
            className="
              text-3xl
              font-extrabold
              tracking-tight
              text-ink
              sm:text-4xl
            "
          >
            {isLogin
              ? "Welcome back"
              : "Create your account"}
          </h1>




        </motion.div>

      </AnimatePresence>


      {/* Form */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 30,
        }}
      >

        {isLogin
          ? <LoginForm />
          : <RegisterForm />}

      </motion.div>


    </motion.div>
  );
}