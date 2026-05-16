import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "navbar": {
        "home": "Home",
        "dashboard": "Dashboard",
        "resources": "Resources",
        "logout": "Log Out",
        "join": "Join Quiz",
        "create": "Create",
        "login": "Professor Login"
      },
      "landing": {
        "hero_title": "Learn and Compete in Real-Time",
        "hero_desc": "Experience a flow state in learning. Join interactive quizzes instantly, test your knowledge against peers, or create engaging assessments tailored to your curriculum.",
        "join_btn": "Join a Quiz",
        "create_btn": "Create a Quiz",
        "experience_badge": "The Quriousity Experience",
        "experience_title": "Education that feels like a Game",
        "experience_desc": "We've stripped away the complexity of traditional LMS platforms to give you a distraction-free environment optimized for focus and fun.",
        "stats": {
          "students": "Signups for Students",
          "sync": "Real-Time Sync",
          "export": "One-Click Export",
          "access": "Instant Access"
        },
        "steps_title": "Empowered Learning in Three Steps",
        "steps": [
          {
            "title": "1. Enter Code",
            "desc": "No complicated sign-ups. Simply enter the unique 6-digit quiz code provided by your instructor to join the session instantly."
          },
          {
            "title": "2. Answer Real-Time",
            "desc": "Experience smooth, distraction-free interfaces as you answer questions. Watch the progress bar grow as you advance."
          },
          {
            "title": "3. Review Results",
            "desc": "Get immediate feedback. Review correct answers, understand mistakes, and track your overall performance metrics instantly."
          }
        ]
      },
      "common": {
        "loading": "Loading...",
        "error": "Error",
        "save": "Save",
        "back": "Back",
        "next": "Next",
        "finish": "Finish",
        "skip": "Skip Question",
        "score": "Score",
        "points": "points",
        "email": "Email Address",
        "password": "Password",
        "confirm_password": "Confirm Password",
        "submit": "Submit",
        "cancel": "Cancel",
        "continue": "Continue",
        "or": "or",
        "welcome": "Welcome",
        "search": "Search",
        "results": "Results"
      },
      "auth": {
        "welcome_back": "Welcome Back",
        "create_account": "Create Account",
        "prof_login_desc": "Professors, login to manage your quizzes.",
        "join_desc": "Join Quriousity to start creating interactive quizzes.",
        "google_login": "Continue with Google",
        "google_login_btn": "Login with Google",
        "google_register_btn": "Register with Google",
        "or_email": "or email",
        "forgot_password": "Forgot Password?",
        "login_btn": "Login",
        "signup_btn": "Sign Up",
        "no_account": "Don't have an account?",
        "has_account": "Already have an account?",
        "register_prof": "Register as a Professor",
        "back_to_login": "Back to Login",
        "reset_password": "Reset Password",
        "reset_desc": "Enter your email address and we'll send you a link to reset your password.",
        "send_reset_link": "Send Reset Link",
        "check_email": "Check Your Email",
        "reset_sent_desc": "We've sent a password reset link to",
        "new_password": "New Password",
        "new_password_desc": "Please enter your new password below.",
        "update_password": "Update Password",
        "password_updated": "Password Updated",
        "password_updated_desc": "Your password has been reset successfully. You can now log in with your new credentials.",
        "login_now": "Log In Now",
        "passwords_not_match": "Passwords don't match."
      },
      "dashboard": {
        "title": "Professor Dashboard",
        "quiz_history": "Quiz History",
        "create_new": "Create New Quiz",
        "no_quizzes": "No quizzes yet",
        "no_quizzes_desc": "Your created quizzes will appear here.",
        "create_first": "Create First Quiz",
        "select_quiz": "Select a Quiz",
        "select_quiz_desc": "Click on a quiz from your history to view detailed performance insights and student scores.",
        "export_csv": "Export CSV",
        "session_code": "Insights for session code:",
        "students_stat": "Students",
        "avg_score_stat": "Avg Score",
        "questions_stat": "Questions",
        "most_missed": "Most Missed Questions",
        "avg_time": "Avg. Time per Question (s)",
        "leaderboard": "Leaderboard",
        "no_participants": "No participants yet.",
        "question_breakdown": "Question Breakdown",
        "end_session": "End Session",
        "restart_session": "Restart Session",
        "enter_lobby": "Enter Lobby",
        "view_lobby": "View Lobby"
      },
      "studentDashboard": {
        "title": "Student Dashboard",
        "loading_achievements": "Loading your achievements...",
        "hey": "Hey",
        "track_progress": "Track your progress and celebrate your learning journey.",
        "join_new": "Join New Quiz",
        "total_points": "Total Points",
        "quizzes_taken": "Quizzes Taken",
        "avg_score": "Average Score",
        "your_history": "Your Quiz History",
        "no_quizzes": "You haven't taken any quizzes yet. Ready to start?",
        "enter_code_begin": "Enter a room code to begin"
      },
      "createQuiz": {
        "title": "Create Quiz",
        "topic_label": "Quiz Topic / Title",
        "topic_placeholder": "e.g., Intro to Physics, Pop Culture Trivia",
        "question_label": "Question",
        "multiple_choice": "Multiple Choice",
        "true_false": "True / False",
        "question_placeholder": "Enter your question here...",
        "image_url": "Image URL (optional)",
        "option_label": "Option",
        "mark_correct": "Mark as Correct",
        "correct_answer": "Correct Answer",
        "add_question": "Add Another Question",
        "save_generate": "Save and Generate Code",
        "creating": "Creating Quiz...",
        "created_title": "Quiz Created!",
        "created_desc": "Share this code with your students to start the session.",
        "access_code": "Access Code",
        "copy_success": "Code copied to clipboard!",
        "return_home": "Return to Home",
        "fill_all_fields": "Please fill in all fields."
      },
      "joinQuiz": {
        "title": "Join Quiz",
        "ready_play": "Ready to Play?",
        "enter_code_desc": "Enter the 6-digit access code provided by your instructor to join the quiz session.",
        "invalid_code": "Invalid access code. Please try again.",
        "creator_no_join": "You cannot join a quiz you created as a participant.",
        "quiz_completed": "This quiz session has already ended.",
        "join_game": "Join Game",
        "join_link": "Join via Link"
      },
      "setupPlayer": {
        "title": "Identify Yourself",
        "desc": "Enter your name or generate a random one to join the leaderboard.",
        "nickname_placeholder": "Enter your nickname...",
        "random_name": "Random Name",
        "start_quiz": "Start Quiz"
      },
      "lobby": {
        "room_code": "Room Code",
        "share_desc": "Share this code with your students to join the session.",
        "start_quiz": "Start Quiz",
        "waiting_prof": "Waiting for professor...",
        "players_joined": "Players Joined",
        "waiting_room": "Waiting Room",
        "nobody_here": "Nobody's here yet. Waiting for players..."
      },
      "badges": {
        "title": "Achievements & Badges",
        "no_badges": "No badges yet. Keep playing to earn them!",
        "new_badge": "New Badge Earned: {{name}}!"
      },
      "liveQuiz": {
        "question_of": "Question {{current}} of {{total}}",
        "no_questions": "No questions found for this quiz.",
        "saving_score": "Saving score...",
        "finish_quiz": "Finish Quiz"
      },
      "results": {
        "congratulations": "Congratulations!",
        "completed_desc": "{{name}}, you've completed the quiz!",
        "total_points": "Total Points",
        "top_performances": "Top Performances",
        "no_scores": "No scores yet. Be the first!",
        "play_again": "Play Again"
      },
      "legal": {
        "privacy_title": "Privacy Policy",
        "terms_title": "Terms of Service",
        "p_1_collect": "1. Information We Collect",
        "p_1_desc": "We collect minimal information required to provide our service. This includes professor email addresses for account management and nickname choices for students during quiz sessions.",
        "p_2_use": "2. How We Use Data",
        "p_2_desc": "Emails are used for authentication and account recovery. Nicknames and scores are used solely for the duration of a quiz session and for professors to review classroom performance.",
        "p_3_retention": "3. Data Retention",
        "p_3_desc": "Quiz data and scores are stored until a professor chooses to delete them. We do not sell or share any user data with third parties.",
        "p_4_security": "4. Security",
        "p_4_desc": "We use industry-standard security measures provided by Supabase to protect your data, including end-to-end encryption for authentication.",
        "t_1_acceptance": "1. Acceptance of Terms",
        "t_1_desc": "By using Quriousity, you agree to comply with and be bound by these terms. If you do not agree, please do not use the service.",
        "t_2_accounts": "2. User Accounts",
        "t_2_desc": "Professors are responsible for maintaining the confidentiality of their accounts. Any activity under your account is your responsibility.",
        "t_3_use": "3. Acceptable Use",
        "t_3_desc": "Users may not use Quriousity for any illegal purposes or to distribute inappropriate content. We reserve the right to terminate accounts that violate these guidelines.",
        "t_4_liability": "4. Limitation of Liability",
        "t_4_desc": "Quriousity is provided 'as is' without warranties of any kind. We are not liable for any damages arising from the use or inability to use the service."
      },
      "helpCenter": {
        "title": "Help Center",
        "how_help": "How can we help?",
        "search_placeholder": "Search for articles, guides...",
        "getting_started": "Getting Started",
        "getting_started_desc": "New to Quriousity? Start here for the basics.",
        "guides": "Guides",
        "guides_desc": "Step-by-step instructions for all features.",
        "contact": "Contact Support",
        "contact_desc": "Can't find an answer? Talk to our team.",
        "faq": "Frequently Asked Questions",
        "q1": "How do students join a quiz?",
        "a1": "Students simply go to the 'Join Quiz' page and enter the 6-digit code provided by their professor.",
        "q2": "Can I edit a quiz after creating it?",
        "a2": "Currently, quizzes are final once created. We are working on an edit feature for the near future.",
        "q3": "How do I export results?",
        "a3": "Go to your Dashboard, select a quiz from your history, and click 'Export CSV'.",
        "q4": "Is there a limit on participants?",
        "a4": "Quriousity is designed to handle hundreds of students simultaneously in real-time."
      },
      "resources": {
        "title": "Resources",
        "learn_more": "Learn More",
        "desc": "Explore guides, documentation, and tips to get the most out of your interactive learning experience.",
        "for_professors": "For Professors",
        "for_students": "For Students",
        "open_source": "Open Source & Security",
        "build_with_us": "Build with Us",
        "build_desc": "Quriousity is an open-source project. Check out the code, report bugs, or add new features on GitHub.",
        "view_github": "View on GitHub"
      },
      "feedback": {
        "title": "Feedback",
        "love_hear": "We'd love to hear from you",
        "desc": "Have a suggestion, found a bug, or just want to say hi?",
        "satisfied_label": "How satisfied are you?",
        "message_label": "Your Message",
        "message_placeholder": "Tell us what's on your mind...",
        "send_btn": "Send Feedback",
        "sending": "Sending...",
        "thank_you": "Thank You!",
        "thanks_desc": "Your feedback helps us make Quriousity better for everyone. We've received your submission.",
        "submit_another": "Submit another response"
      },
      "footer": {
        "tagline": "Empowering learners everywhere."
      }
    }
  },
  es: {
    translation: {
      "navbar": {
        "home": "Inicio",
        "dashboard": "Panel",
        "resources": "Recursos",
        "logout": "Cerrar Sesión",
        "join": "Unirse",
        "create": "Crear",
        "login": "Acceso Profesor"
      },
      "landing": {
        "hero_title": "Aprende y Compite en Tiempo Real",
        "hero_desc": "Experimenta un estado de fluidez en el aprendizaje. Únete a cuestionarios interactivos al instante, pon a prueba tus conocimientos frente a tus compañeros o crea evaluaciones atractivas adaptadas a tu plan de estudios.",
        "join_btn": "Unirse a un Quiz",
        "create_btn": "Crear un Quiz",
        "experience_badge": "La Experiencia Quriousity",
        "experience_title": "Educación que se siente como un Juego",
        "experience_desc": "Hemos eliminado la complejidad de las plataformas LMS tradicionales para ofrecerte un entorno sin distracciones optimizado para la concentración y la diversión.",
        "stats": {
          "students": "Registros para Estudiantes",
          "sync": "Sincronización en Tiempo Real",
          "export": "Exportación en un Clic",
          "access": "Acceso Instantáneo"
        },
        "steps_title": "Aprendizaje Potenciado en Tres Pasos",
        "steps": [
          {
            "title": "1. Ingresa el Código",
            "desc": "Sin registros complicados. Simplemente ingresa el código único de 6 dígitos proporcionado por tu instructor para unirte al instante."
          },
          {
            "title": "2. Responde en Tiempo Real",
            "desc": "Experimenta interfaces fluidas y sin distracciones mientras respondes. Mira cómo crece la barra de progreso a medida que avanzas."
          },
          {
            "title": "3. Revisa los Resultados",
            "desc": "Obtén retroalimentación inmediata. Revisa las respuestas correctas, comprende los errores y sigue tus métricas de desempeño."
          }
        ]
      },
      "common": {
        "loading": "Cargando...",
        "error": "Error",
        "save": "Guardar",
        "back": "Volver",
        "next": "Siguiente",
        "finish": "Finalizar",
        "skip": "Saltar Pregunta",
        "score": "Puntuación",
        "points": "puntos",
        "email": "Correo Electrónico",
        "password": "Contraseña",
        "confirm_password": "Confirmar Contraseña",
        "submit": "Enviar",
        "cancel": "Cancelar",
        "continue": "Continuar",
        "or": "o",
        "welcome": "Bienvenido",
        "search": "Buscar",
        "results": "Resultados"
      },
      "auth": {
        "welcome_back": "Bienvenido de nuevo",
        "create_account": "Crear cuenta",
        "prof_login_desc": "Profesores, inicien sesión para gestionar sus cuestionarios.",
        "join_desc": "Únete a Quriousity para empezar a crear cuestionarios interactivos.",
        "google_login": "Continuar con Google",
        "google_login_btn": "Iniciar sesión con Google",
        "google_register_btn": "Registrarse con Google",
        "or_email": "o correo electrónico",
        "forgot_password": "¿Olvidaste tu contraseña?",
        "login_btn": "Iniciar Sesión",
        "signup_btn": "Registrarse",
        "no_account": "¿No tienes una cuenta?",
        "has_account": "¿Ya tienes una cuenta?",
        "register_prof": "Registrarse como Profesor",
        "back_to_login": "Volver al inicio de sesión",
        "reset_password": "Restablecer Contraseña",
        "reset_desc": "Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.",
        "send_reset_link": "Enviar enlace de restablecimiento",
        "check_email": "Revisa tu correo",
        "reset_sent_desc": "Hemos enviado un enlace de restablecimiento a",
        "new_password": "Nueva Contraseña",
        "new_password_desc": "Por favor, ingresa tu nueva contraseña abajo.",
        "update_password": "Actualizar Contraseña",
        "password_updated": "Contraseña Actualizada",
        "password_updated_desc": "Tu contraseña ha sido restablecida con éxito. Ahora puedes iniciar sesión.",
        "login_now": "Inicia sesión ahora",
        "passwords_not_match": "Las contraseñas no coinciden."
      },
      "dashboard": {
        "title": "Panel del Profesor",
        "quiz_history": "Historial de Cuestionarios",
        "create_new": "Crear Nuevo Cuestionario",
        "no_quizzes": "Sin cuestionarios aún",
        "no_quizzes_desc": "Tus cuestionarios creados aparecerán aquí.",
        "create_first": "Crear primer cuestionario",
        "select_quiz": "Selecciona un Cuestionario",
        "select_quiz_desc": "Haz clic en un cuestionario para ver los detalles de desempeño y puntuaciones.",
        "export_csv": "Exportar CSV",
        "session_code": "Análisis para el código:",
        "students_stat": "Estudiantes",
        "avg_score_stat": "Promedio",
        "questions_stat": "Preguntas",
        "most_missed": "Preguntas más falladas",
        "avg_time": "Tiempo prom. por pregunta (s)",
        "leaderboard": "Tabla de clasificación",
        "no_participants": "Sin participantes aún.",
        "question_breakdown": "Desglose de preguntas"
      },
      "studentDashboard": {
        "title": "Panel del Estudiante",
        "loading_achievements": "Cargando tus logros...",
        "hey": "¡Hola",
        "track_progress": "Sigue tu progreso y celebra tu aprendizaje.",
        "join_new": "Unirse a un nuevo Quiz",
        "total_points": "Puntos Totales",
        "quizzes_taken": "Quizzes realizados",
        "avg_score": "Puntuación Promedio",
        "your_history": "Tu Historial",
        "no_quizzes": "Aún no has participado en ningún quiz. ¿Listo para empezar?",
        "enter_code_begin": "Ingresa un código para empezar"
      },
      "createQuiz": {
        "title": "Crear Cuestionario",
        "topic_label": "Tema / Título del Quiz",
        "topic_placeholder": "ej., Intro a la Física, Trivia de Cultura Pop",
        "question_label": "Pregunta",
        "multiple_choice": "Opción Múltiple",
        "true_false": "Verdadero / Falso",
        "question_placeholder": "Escribe tu pregunta aquí...",
        "image_url": "URL de Imagen (opcional)",
        "option_label": "Opción",
        "mark_correct": "Marcar como correcta",
        "correct_answer": "Respuesta Correcta",
        "add_question": "Añadir otra pregunta",
        "save_generate": "Guardar y Generar Código",
        "creating": "Creando cuestionario...",
        "created_title": "¡Cuestionario Creado!",
        "created_desc": "Comparte este código con tus estudiantes.",
        "access_code": "Código de Acceso",
        "copy_success": "¡Código copiado!",
        "return_home": "Volver al Inicio",
        "fill_all_fields": "Por favor completa todos los campos."
      },
      "joinQuiz": {
        "title": "Unirse al Quiz",
        "ready_play": "¿Listo para Jugar?",
        "enter_code_desc": "Ingresa el código de 6 dígitos proporcionado por tu instructor.",
        "invalid_code": "Código inválido. Inténtalo de nuevo.",
        "creator_no_join": "No puedes unirte a un cuestionario que creaste como participante.",
        "quiz_completed": "Esta sesión de cuestionario ya ha terminado.",
        "join_game": "Unirse al Juego",
        "join_link": "Unirse vía Enlace"
      },
      "setupPlayer": {
        "title": "Identifícate",
        "desc": "Ingresa tu nombre o genera uno aleatorio para unirte.",
        "nickname_placeholder": "Ingresa tu apodo...",
        "random_name": "Nombre Aleatorio",
        "start_quiz": "Empezar Quiz"
      },
      "lobby": {
        "room_code": "Código",
        "share_desc": "Comparte este código con tus estudiantes.",
        "start_quiz": "Empezar",
        "waiting_prof": "Esperando al profesor...",
        "players_joined": "Jugadores conectados",
        "waiting_room": "Sala de espera",
        "nobody_here": "Nadie por aquí aún..."
      },
      "badges": {
        "title": "Logros y Medallas",
        "no_badges": "Sin medallas aún. ¡Sigue jugando!",
        "new_badge": "¡Nueva medalla: {{name}}!"
      },
      "liveQuiz": {
        "question_of": "Pregunta {{current}} de {{total}}",
        "no_questions": "No se encontraron preguntas para este quiz.",
        "saving_score": "Guardando puntuación...",
        "finish_quiz": "Finalizar Quiz"
      },
      "results": {
        "congratulations": "¡Felicidades!",
        "completed_desc": "¡{{name}}, has completado el quiz!",
        "total_points": "Puntos Totales",
        "top_performances": "Mejores Resultados",
        "no_scores": "Sin puntuaciones aún. ¡Sé el primero!",
        "play_again": "Jugar de nuevo"
      },
      "legal": {
        "privacy_title": "Política de Privacidad",
        "terms_title": "Términos de Servicio",
        "p_1_collect": "1. Información que Recopilamos",
        "p_1_desc": "Recopilamos información mínima para proveer el servicio, como correos de profesores y apodos de estudiantes.",
        "p_2_use": "2. Uso de Datos",
        "p_2_desc": "Los correos son para autenticación. Los apodos y puntajes son solo para la duración del quiz y revisión del profesor.",
        "p_3_retention": "3. Retención de Datos",
        "p_3_desc": "Los datos se guardan hasta que el profesor decida borrarlos. No vendemos datos a terceros.",
        "p_4_security": "4. Seguridad",
        "p_4_desc": "Usamos medidas estándar de seguridad provistas por Supabase, incluyendo cifrado.",
        "t_1_acceptance": "1. Aceptación de Términos",
        "t_1_desc": "Al usar Quriousity, aceptas cumplir con estos términos.",
        "t_2_accounts": "2. Cuentas de Usuario",
        "t_2_desc": "Los profesores son responsables de la confidencialidad de sus cuentas.",
        "t_3_use": "3. Uso Aceptable",
        "t_3_desc": "No se permite el uso para fines ilegales o contenido inapropiado.",
        "t_4_liability": "4. Limitation of Liability",
        "t_4_desc": "Quriousity se provee 'tal cual'. No nos hacemos responsables por daños derivados del uso."
      },
      "helpCenter": {
        "title": "Centro de Ayuda",
        "how_help": "¿Cómo podemos ayudarte?",
        "search_placeholder": "Buscar artículos, guías...",
        "getting_started": "Primeros Pasos",
        "getting_started_desc": "¿Nuevo en Quriousity? Empieza por aquí.",
        "guides": "Guías",
        "guides_desc": "Instrucciones paso a paso.",
        "contact": "Contacto",
        "contact_desc": "¿No encuentras respuesta? Habla con nosotros.",
        "faq": "Preguntas Frecuentes",
        "q1": "¿Cómo se unen los estudiantes?",
        "a1": "Simplemente van a 'Unirse' e ingresan el código de 6 dígitos.",
        "q2": "¿Puedo editar un quiz?",
        "a2": "Por ahora son finales al crearse. Estamos trabajando en la edición.",
        "q3": "¿Cómo exporto resultados?",
        "a3": "En tu Panel, selecciona un quiz y haz clic en 'Exportar CSV'.",
        "q4": "¿Hay límite de participantes?",
        "a4": "Está diseñado para manejar cientos de estudiantes simultáneamente."
      },
      "resources": {
        "title": "Recursos",
        "learn_more": "Aprende Más",
        "desc": "Explora guías y documentación para aprovechar al máximo la experiencia.",
        "for_professors": "Para Profesores",
        "for_students": "Para Estudiantes",
        "open_source": "Código Abierto",
        "build_with_us": "Construye con Nosotros",
        "build_desc": "Quriousity es código abierto. Mira el código en GitHub.",
        "view_github": "Ver en GitHub"
      },
      "feedback": {
        "title": "Comentarios",
        "love_hear": "Nos encantaría escucharte",
        "desc": "¿Sugerencias o errores? Cuéntanos.",
        "satisfied_label": "¿Qué tan satisfecho estás?",
        "message_label": "Tu Mensaje",
        "message_placeholder": "Cuéntanos lo que piensas...",
        "send_btn": "Enviar Comentarios",
        "sending": "Enviando...",
        "thank_you": "¡Gracias!",
        "thanks_desc": "Tus comentarios nos ayudan a mejorar.",
        "submit_another": "Enviar otra respuesta"
      },
      "footer": {
        "tagline": "Potenciando a los estudiantes en todas partes."
      }
    }
  },
  tl: {
    translation: {
      "navbar": {
        "home": "Home",
        "dashboard": "Dashboard",
        "resources": "Resources",
        "logout": "Log Out",
        "join": "Sumali",
        "create": "Gumawa",
        "login": "Professor Login"
      },
      "landing": {
        "hero_title": "Matuto at Makipagkumpitensya sa Real-Time",
        "hero_desc": "Damhin ang 'flow state' sa pag-aaral. Sumali sa mga interactive na pagsusulit agad, subukan ang iyong kaalaman laban sa iba, o gumawa ng mga nakakaaliw na pagsusulit para sa iyong kurikulum.",
        "join_btn": "Sumali sa Quiz",
        "create_btn": "Gumawa ng Quiz",
        "experience_badge": "Ang Karanasang Quriousity",
        "experience_title": "Edukasyon na Parang Laro",
        "experience_desc": "Inalis namin ang pagiging kumplikado ng tradisyonal na mga platform ng LMS para bigyan ka ng kapaligirang walang abala at naka-optimize para sa focus at saya.",
        "stats": {
          "students": "Para sa mga Estudyante",
          "sync": "Real-Time Sync",
          "export": "One-Click Export",
          "access": "Mabilis na Access"
        },
        "steps_title": "Matuto sa Tatlong Hakbang",
        "steps": [
          {
            "title": "1. Ilagay ang Code",
            "desc": "Walang kumplikadong sign-up. Ilagay lang ang natatanging 6-digit code mula sa iyong guro para makasali agad."
          },
          {
            "title": "2. Sumagot sa Real-Time",
            "desc": "Damhin ang maayos na interface habang sumasagot. Panoorin ang pag-unlad ng iyong bar habang sumasagot ka."
          },
          {
            "title": "3. Tingnan ang Resulta",
            "desc": "Kumuha ng agarang feedback. Tingnan ang mga tamang sagot, intindihin ang mga mali, at i-track ang iyong performance."
          }
        ]
      },
      "common": {
        "loading": "Naglo-load...",
        "error": "Error",
        "save": "I-save",
        "back": "Bumalik",
        "next": "Susunod",
        "finish": "Tapusin",
        "skip": "Laktawan",
        "score": "Score",
        "points": "puntos",
        "email": "Email Address",
        "password": "Password",
        "confirm_password": "I-confirm ang Password",
        "submit": "I-submit",
        "cancel": "Kanselahin",
        "continue": "Magpatuloy",
        "or": "o",
        "welcome": "Welcome",
        "search": "Maghanap",
        "results": "Mga Resulta"
      },
      "auth": {
        "welcome_back": "Welcome Back",
        "create_account": "Gumawa ng Account",
        "prof_login_desc": "Para sa mga Professor, mag-login para sa iyong mga quiz.",
        "join_desc": "Sumali sa Quriousity para makagawa ng mga interactive quiz.",
        "google_login": "Ituloy gamit ang Google",
        "google_login_btn": "Mag-login gamit ang Google",
        "google_register_btn": "Mag-register gamit ang Google",
        "or_email": "o gamit ang email",
        "forgot_password": "Nakalimutan ang Password?",
        "login_btn": "Mag-login",
        "signup_btn": "Mag-sign Up",
        "no_account": "Wala pang account?",
        "has_account": "May account na?",
        "register_prof": "Mag-register bilang Professor",
        "back_to_login": "Bumalik sa Login",
        "reset_password": "I-reset ang Password",
        "reset_desc": "Ilagay ang iyong email at padadalhan ka namin ng link para sa password.",
        "send_reset_link": "Ipadala ang Reset Link",
        "check_email": "Tingnan ang iyong Email",
        "reset_sent_desc": "Nagpadala kami ng reset link sa",
        "new_password": "Bagong Password",
        "new_password_desc": "Ilagay ang iyong bagong password sa ibaba.",
        "update_password": "I-update ang Password",
        "password_updated": "Na-update na ang Password",
        "password_updated_desc": "Matagumpay na na-reset ang iyong password. Maaari ka nang mag-login.",
        "login_now": "Mag-login na",
        "passwords_not_match": "Hindi tugma ang mga password."
      },
      "dashboard": {
        "title": "Professor Dashboard",
        "quiz_history": "Kasaysayan ng Quiz",
        "create_new": "Gumawa ng Bagong Quiz",
        "no_quizzes": "Wala pang quiz",
        "no_quizzes_desc": "Dito lalabas ang mga ginawa mong quiz.",
        "create_first": "Gumawa ng Unang Quiz",
        "select_quiz": "Pumili ng Quiz",
        "select_quiz_desc": "Pumili ng quiz para makita ang performance at scores.",
        "export_csv": "I-export sa CSV",
        "session_code": "Insights para sa code:",
        "students_stat": "Mga Estudyante",
        "avg_score_stat": "Average Score",
        "questions_stat": "Mga Tanong",
        "most_missed": "Madalas na Mamaling Tanong",
        "avg_time": "Average na Oras bawat Tanong (s)",
        "leaderboard": "Leaderboard",
        "no_participants": "Wala pang sumasali.",
        "question_breakdown": "Breakdown ng Tanong"
      },
      "studentDashboard": {
        "title": "Student Dashboard",
        "loading_achievements": "Kinukuha ang iyong mga achievement...",
        "hey": "Hoy",
        "track_progress": "I-track ang iyong pag-unlad at ipagdiwang ang pag-aaral.",
        "join_new": "Sumali sa Bagong Quiz",
        "total_points": "Kabuuang Puntos",
        "quizzes_taken": "Mga Quiz na Nasalihan",
        "avg_score": "Average na Score",
        "your_history": "Iyong Kasaysayan",
        "no_quizzes": "Wala ka pang nasalihang quiz. Handa ka na ba?",
        "enter_code_begin": "Ilagay ang code para magsimula"
      },
      "createQuiz": {
        "title": "Gumawa ng Quiz",
        "topic_label": "Paksa / Pamagat ng Quiz",
        "topic_placeholder": "hal., Intro sa Physics, Pop Culture Trivia",
        "question_label": "Tanong",
        "multiple_choice": "Multiple Choice",
        "true_false": "True / False",
        "question_placeholder": "Ilagay ang iyong tanong dito...",
        "image_url": "Image URL (optional)",
        "option_label": "Opsyon",
        "mark_correct": "I-marka bilang Tama",
        "correct_answer": "Tamang Sagot",
        "add_question": "Magdagdag ng Tanong",
        "save_generate": "I-save at Gumawa ng Code",
        "creating": "Ginagawa ang Quiz...",
        "created_title": "Gawa na ang Quiz!",
        "created_desc": "I-share ang code na ito sa iyong mga estudyante.",
        "access_code": "Access Code",
        "copy_success": "Na-copy na ang code!",
        "return_home": "Bumalik sa Home",
        "fill_all_fields": "Pakisagutan ang lahat ng field."
      },
      "joinQuiz": {
        "title": "Sumali sa Quiz",
        "ready_play": "Handa ka na bang Maglaro?",
        "enter_code_desc": "Ilagay ang 6-digit code mula sa iyong guro.",
        "invalid_code": "Maling code. Subukan muli.",
        "creator_no_join": "Hindi ka maaaring sumali sa quiz na ikaw ang gumawa bilang participant.",
        "join_game": "Sumali sa Laro",
        "join_link": "Sumali gamit ang Link"
      },
      "setupPlayer": {
        "title": "Sino Ka?",
        "desc": "Ilagay ang iyong pangalan o gumawa ng random name.",
        "nickname_placeholder": "Ilagay ang iyong palayaw...",
        "random_name": "Random na Pangalan",
        "start_quiz": "Simulan ang Quiz"
      },
      "lobby": {
        "room_code": "Code",
        "share_desc": "I-share ang code na ito sa mga estudyante.",
        "start_quiz": "Simulan ang Quiz",
        "waiting_prof": "Naghihintay sa professor...",
        "players_joined": "Mga Sumali",
        "waiting_room": "Waiting Room",
        "nobody_here": "Wala pang sumasali..."
      },
      "badges": {
        "title": "Mga Achievement",
        "no_badges": "Wala pang badge. Maglaro pa!",
        "new_badge": "Bagong Badge: {{name}}!"
      },
      "liveQuiz": {
        "question_of": "Tanong {{current}} ng {{total}}",
        "no_questions": "Walang tanong para sa quiz na ito.",
        "saving_score": "Inililigtas ang score...",
        "finish_quiz": "Tapusin ang Quiz"
      },
      "results": {
        "congratulations": "Congratulations!",
        "completed_desc": "{{name}}, tapos mo na ang quiz!",
        "total_points": "Kabuuang Puntos",
        "top_performances": "Pinakamahusay",
        "no_scores": "Wala pang scores. Mauna ka na!",
        "play_again": "Maglaro Muli"
      },
      "legal": {
        "privacy_title": "Privacy Policy",
        "terms_title": "Terms of Service",
        "p_1_collect": "1. Impormasyong Kinukuha Namin",
        "p_1_desc": "Kumukuha kami ng kaunting impormasyon para sa serbisyo, tulad ng email at palayaw.",
        "p_2_use": "2. Paano Ginagamit ang Data",
        "p_2_desc": "Ang email ay para sa login. Ang palayaw at score ay para lamang sa quiz session.",
        "p_3_retention": "3. Pagtatago ng Data",
        "p_3_desc": "Ang data ay nakatago hanggang burahin ng professor. Hindi kami nagbebenta ng data.",
        "p_4_security": "4. Seguridad",
        "p_4_desc": "Gumagamit kami ng standard na seguridad mula sa Supabase."
      },
      "helpCenter": {
        "title": "Help Center",
        "how_help": "Paano kami makakatulong?",
        "search_placeholder": "Maghanap ng artikulo o gabay...",
        "getting_started": "Pagsisimula",
        "getting_started_desc": "Bago sa Quriousity? Magsimula rito.",
        "guides": "Mga Gabay",
        "guides_desc": "Sunod-sunod na gabay para sa lahat.",
        "contact": "Kontakin ang Support",
        "contact_desc": "Walang mahanap na sagot? Kausapin kami.",
        "faq": "Mga Madalas Itanong",
        "q1": "Paano sumasali ang estudyante?",
        "a1": "Pumunta lang sa 'Join Quiz' at ilagay ang 6-digit code.",
        "q2": "Maaari bang i-edit ang quiz?",
        "a2": "Sa ngayon, pinal na ito kapag ginawa. Gagawa kami ng edit feature sa hinaharap.",
        "q3": "Paano i-export ang resulta?",
        "a3": "Sa Dashboard, piliin ang quiz at i-click ang 'Export CSV'.",
        "q4": "May limit ba sa sasali?",
        "a4": "Kaya ng Quriousity ang daan-daang estudyante nang sabay-sabay."
      },
      "resources": {
        "title": "Resources",
        "learn_more": "Matuto pa",
        "desc": "Tingnan ang mga gabay para sa mas magandang karanasan.",
        "for_professors": "Para sa mga Professor",
        "for_students": "Para sa mga Estudyante",
        "open_source": "Open Source at Seguridad",
        "build_with_us": "Tumulong sa Pagbuo",
        "build_desc": "Ang Quriousity ay open-source. Tingnan ang code sa GitHub.",
        "view_github": "Tingnan sa GitHub"
      },
      "feedback": {
        "title": "Feedback",
        "love_hear": "Gusto ka naming marinig",
        "desc": "May suhestyon o bug? Sabihin sa amin.",
        "satisfied_label": "Gaano ka nasiyahan?",
        "message_label": "Iyong Mensahe",
        "message_placeholder": "Ano ang nasa isip mo...",
        "send_btn": "Ipadala ang Feedback",
        "sending": "Ipinapadala...",
        "thank_you": "Salamat!",
        "thanks_desc": "Ang iyong feedback ay nakakatulong sa amin.",
        "submit_another": "Mag-submit muli"
      },
      "footer": {
        "tagline": "Binibigyang-lakas ang mga mag-aaral kahit saan."
      }
    }
  },
  fr: {
    translation: {
      "navbar": {
        "home": "Accueil",
        "dashboard": "Tableau de bord",
        "resources": "Ressources",
        "logout": "Déconnexion",
        "join": "Rejoindre",
        "create": "Créer",
        "login": "Connexion Prof"
      },
      "landing": {
        "hero_title": "Apprenez et Concourez en Temps Réel",
        "hero_desc": "Vivez un état de flow dans l'apprentissage. Rejoignez instantanément des quiz interactifs, testez vos connaissances par rapport à vos pairs ou créez des évaluations attrayantes adaptées à votre programme.",
        "join_btn": "Rejoindre un Quiz",
        "create_btn": "Créer un Quiz",
        "experience_badge": "L'Expérience Quriousity",
        "experience_title": "L'éducation qui ressemble à un jeu",
        "experience_desc": "Nous avons supprimé la complexité des plateformes LMS traditionnelles pour vous offrir un environnement sans distraction optimisé pour la concentration et le plaisir.",
        "stats": {
          "students": "Inscriptions Étudiants",
          "sync": "Sync en temps réel",
          "export": "Export en un clic",
          "access": "Accès Instantané"
        },
        "steps_title": "Apprentissage en Trois Étapes",
        "steps": [
          {
            "title": "1. Entrez le Code",
            "desc": "Pas d'inscriptions compliquées. Entrez simplement le code unique à 6 chiffres fourni par votre instructeur pour rejoindre instantanément."
          },
          {
            "title": "2. Répondez en Direct",
            "desc": "Vivez une expérience fluide et sans distraction pendant que vous répondez. Regardez la barre de progression avancer."
          },
          {
            "title": "3. Voir les Résultats",
            "desc": "Obtenez un retour immédiat. Examinez les bonnes réponses, comprenez vos erreurs et suivez vos performances."
          }
        ]
      },
      "common": {
        "loading": "Chargement...",
        "error": "Erreur",
        "save": "Enregistrer",
        "back": "Retour",
        "next": "Suivant",
        "finish": "Terminer",
        "skip": "Passer",
        "score": "Score",
        "points": "points",
        "email": "Adresse E-mail",
        "password": "Mot de passe",
        "confirm_password": "Confirmer le mot de passe",
        "submit": "Envoyer",
        "cancel": "Annuler",
        "continue": "Continuer",
        "or": "ou",
        "welcome": "Bienvenue",
        "search": "Rechercher",
        "results": "Résultats"
      },
      "auth": {
        "welcome_back": "Bon retour",
        "create_account": "Créer un compte",
        "prof_login_desc": "Professeurs, connectez-vous pour gérer vos quiz.",
        "join_desc": "Rejoignez Quriousity pour commencer à créer des quiz interactifs.",
        "google_login": "Continuer avec Google",
        "google_login_btn": "Se connecter avec Google",
        "google_register_btn": "S'inscrire avec Google",
        "or_email": "ou e-mail",
        "forgot_password": "Mot de passe oublié ?",
        "login_btn": "Connexion",
        "signup_btn": "S'inscrire",
        "no_account": "Pas de compte ?",
        "has_account": "Déjà un compte ?",
        "register_prof": "S'inscrire comme Professeur",
        "back_to_login": "Retour à la connexion",
        "reset_password": "Réinitialiser le mot de passe",
        "reset_desc": "Entrez votre e-mail et nous vous enverrons un lien de réinitialisation.",
        "send_reset_link": "Envoyer le lien",
        "check_email": "Vérifiez vos e-mails",
        "reset_sent_desc": "Lien envoyé à",
        "new_password": "Nouveau mot de passe",
        "new_password_desc": "Entrez votre nouveau mot de passe ci-dessous.",
        "update_password": "Mettre à jour",
        "password_updated": "Mot de passe mis à jour",
        "password_updated_desc": "Réinitialisation réussie. Vous pouvez vous connecter.",
        "login_now": "Se connecter maintenant",
        "passwords_not_match": "Les mots de passe ne correspondent pas."
      },
      "dashboard": {
        "title": "Tableau de bord Prof",
        "quiz_history": "Historique des Quiz",
        "create_new": "Créer un nouveau Quiz",
        "no_quizzes": "Aucun quiz pour le moment",
        "no_quizzes_desc": "Vos quiz creados apparaîtront ici.",
        "create_first": "Créer votre premier quiz",
        "select_quiz": "Sélectionner un Quiz",
        "select_quiz_desc": "Cliquez sur un quiz pour voir les performances et les scores.",
        "export_csv": "Exporter en CSV",
        "session_code": "Analyses pour le code :",
        "students_stat": "Étudiants",
        "avg_score_stat": "Score moyen",
        "questions_stat": "Questions",
        "most_missed": "Questions les plus manquées",
        "avg_time": "Temps moyen par question (s)",
        "leaderboard": "Classement",
        "no_participants": "Aucun participant.",
        "question_breakdown": "Détail des questions"
      },
      "studentDashboard": {
        "title": "Tableau de bord Étudiant",
        "loading_achievements": "Chargement de vos succès...",
        "hey": "Salut",
        "track_progress": "Suivez vos progrès et célébrez votre parcours.",
        "join_new": "Rejoindre un Quiz",
        "total_points": "Points Totaux",
        "quizzes_taken": "Quiz effectués",
        "avg_score": "Score moyen",
        "your_history": "Votre Historique",
        "no_quizzes": "Aucun quiz pour le moment. Prêt à commencer ?",
        "enter_code_begin": "Entrez un code pour commencer"
      },
      "createQuiz": {
        "title": "Créer un Quiz",
        "topic_label": "Sujet / Titre du Quiz",
        "topic_placeholder": "ex: Intro à la Physique, Quiz Culture G",
        "question_label": "Question",
        "multiple_choice": "QCM",
        "true_false": "Vrai / Faux",
        "question_placeholder": "Entrez votre question ici...",
        "image_url": "URL de l'image (optionnel)",
        "option_label": "Option",
        "mark_correct": "Marquer comme correcte",
        "correct_answer": "Bonne réponse",
        "add_question": "Ajouter une question",
        "save_generate": "Enregistrer et Générer le Code",
        "creating": "Création du quiz...",
        "created_title": "Quiz Créé !",
        "created_desc": "Partagez ce code avec vos étudiants.",
        "access_code": "Code d'accès",
        "copy_success": "Code copié !",
        "return_home": "Retour à l'accueil",
        "fill_all_fields": "Veuillez remplir tous les champs."
      },
      "joinQuiz": {
        "title": "Rejoindre un Quiz",
        "ready_play": "Prêt à Jouer ?",
        "enter_code_desc": "Entrez le code à 6 chiffres fourni par votre professeur.",
        "invalid_code": "Code invalide. Réessayez.",
        "join_game": "Jouer",
        "join_link": "Rejoindre via un lien"
      },
      "setupPlayer": {
        "title": "Identifiez-vous",
        "desc": "Entrez votre nom ou générez-en un aléatoire.",
        "nickname_placeholder": "Pseudo...",
        "random_name": "Aléatoire",
        "start_quiz": "Démarrer"
      },
      "lobby": {
        "room_code": "Code",
        "share_desc": "Partagez ce code avec vos étudiants.",
        "start_quiz": "Démarrer le Quiz",
        "waiting_prof": "En attente du professeur...",
        "players_joined": "Joueurs connectés",
        "waiting_room": "Salle d'attente",
        "nobody_here": "Personne ici pour le moment..."
      },
      "badges": {
        "title": "Succès et Badges",
        "no_badges": "Aucun badge. Jouez pour en gagner !",
        "new_badge": "Nouveau Badge : {{name}} !"
      },
      "liveQuiz": {
        "question_of": "Question {{current}} sur {{total}}",
        "no_questions": "Aucune question trouvée.",
        "saving_score": "Enregistrement du score...",
        "finish_quiz": "Terminer le Quiz"
      },
      "results": {
        "congratulations": "Félicitations !",
        "completed_desc": "{{name}}, vous avez terminé le quiz !",
        "total_points": "Points Totaux",
        "top_performances": "Meilleures Performances",
        "no_scores": "Pas encore de scores. Soyez le premier !",
        "play_again": "Rejouer"
      },
      "legal": {
        "privacy_title": "Politique de Confidentialité",
        "terms_title": "Conditions d'Utilisation",
        "p_1_collect": "1. Collecte des Données",
        "p_1_desc": "Nous collectons le minimum nécessaire, comme les e-mails des profs et les pseudos des élèves.",
        "p_2_use": "2. Utilisation des Données",
        "p_2_desc": "Les e-mails servent à l'authentification. Pseudos et scores durent le temps du quiz.",
        "p_3_retention": "3. Rétention des Données",
        "p_3_desc": "Données conservées jusqu'à suppression par le prof. Pas de vente à des tiers.",
        "p_4_security": "4. Sécurité",
        "p_4_desc": "Nous utilisons les mesures de sécurité de Supabase."
      },
      "helpCenter": {
        "title": "Centre d'Aide",
        "how_help": "Comment pouvons-nous vous aider ?",
        "search_placeholder": "Rechercher des articles...",
        "getting_started": "Démarrage",
        "getting_started_desc": "Nouveau sur Quriousity ? Commencez ici.",
        "guides": "Guides",
        "guides_desc": "Instructions étape par étape.",
        "contact": "Contact",
        "contact_desc": "Pas de réponse ? Contactez-nous.",
        "faq": "Foire Aux Questions",
        "q1": "Comment rejoindre un quiz ?",
        "a1": "Allez sur 'Rejoindre' et entrez le code à 6 chiffres.",
        "q2": "Puis-je modifier un quiz ?",
        "a2": "Pour l'instant non. L'édition arrive bientôt.",
        "q3": "Comment exporter les résultats ?",
        "a3": "Dans votre Tableau de bord, cliquez sur 'Exporter CSV'.",
        "q4": "Limite de participants ?",
        "a4": "Conçu pour des centaines d'étudiants en simultané."
      },
      "resources": {
        "title": "Ressources",
        "learn_more": "En savoir plus",
        "desc": "Explorez nos guides pour profiter au mieux de l'expérience.",
        "for_professors": "Pour les Professeurs",
        "for_students": "Pour les Étudiants",
        "open_source": "Open Source & Sécurité",
        "build_with_us": "Contribuez",
        "build_desc": "Quriousity est open-source. Voir le code sur GitHub.",
        "view_github": "Voir sur GitHub"
      },
      "feedback": {
        "title": "Commentaires",
        "love_hear": "Donnez votre avis",
        "desc": "Une suggestion ou un bug ? Dites-le nous.",
        "satisfied_label": "Êtes-vous satisfait ?",
        "message_label": "Votre Message",
        "message_placeholder": "Dites-nous ce que vous en pensez...",
        "send_btn": "Envoyer",
        "sending": "Envoi...",
        "thank_you": "Merci !",
        "thanks_desc": "Vos retours nous aident à nous améliorer.",
        "submit_another": "Envoyer un autre avis"
      },
      "footer": {
        "tagline": "Encourager les apprenants partout dans le monde."
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
