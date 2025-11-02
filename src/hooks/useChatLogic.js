import { useState } from "react";
import {
  getWeather,
  getLocalNews,
  askGemini,
  createCalendarEventFromChat,
} from "../services/api";
import { useNotes } from "./useNotes";
import { useTasks } from "./useTasks";
import { useNavigate } from "react-router-dom";

export function useChatLogic(setChatActive) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationStep, setConversationStep] = useState(null);
  const [tempData, setTempData] = useState({});
  const { createNote } = useNotes();
  const { createTask } = useTasks();
  const navigate = useNavigate();

  const addMessage = (sender, text, isHtml = false, buttons = null) => {
    let safeText = "";

    // Validacion para evitar [object Object]
    if (typeof text === "string") {
      safeText = text.trim();
    } else if (text && typeof text === "object") {
      if (text.reply && typeof text.reply === "string") {
        safeText = text.reply.trim();
      } else if (text.message && typeof text.message === "string") {
        safeText = text.message.trim();
      } else if (text.action) {
        safeText = `✅ Acción "${text.action}" procesada correctamente.`;
      } else {
        console.error("⚠️ Objeto recibido sin campo válido:", text);
        safeText =
          "⚠️ Recibí una respuesta sin formato correcto. Por favor, intentá nuevamente.";
      }
    } else if (text === null || text === undefined) {
      console.warn("⚠️ Texto nulo o indefinido recibido");
      safeText = "⚠️ No recibí respuesta del servidor.";
    } else {
      console.warn("⚠️ Tipo inesperado recibido:", typeof text, text);
      safeText = String(text).trim();
    }

    if (!safeText || safeText.includes("[object") || safeText === "") {
      safeText = "⚠️ Error al procesar la respuesta.";
    }

    setMessages((prev) => [
      ...prev,
      { sender, text: safeText, isHtml, buttons, time: Date.now() },
    ]);
  };

  const resetFlow = () => {
    setConversationStep(null);
    setTempData({});
  };

  const handleDirectActions = async (userMsg) => {
    const lowerMsg = userMsg.toLowerCase();
    const keywords = {
      weather: ["clima", "temperatura", "lluvia", "sol", "qué tiempo hace"],
      news: [
        "noticia",
        "novedad",
        "actualidad",
        "información",
        "noticias de hoy",
      ],
    };

    if (keywords.weather.some((w) => lowerMsg.includes(w))) {
      const weatherReply = await getWeather();
      addMessage("milo", weatherReply, true);
      return true;
    }

    if (keywords.news.some((w) => lowerMsg.includes(w))) {
      const newsReply = await getLocalNews();
      addMessage("milo", newsReply, true);
      return true;
    }

    return false;
  };

  const handleSend = async (userMsgFromCard = "") => {
    const userMsg = (userMsgFromCard || inputValue?.trim() || "").toString();
    if (!userMsg) return;

    setInputValue("");
    if (setChatActive) setChatActive(true);
    setIsLoading(true);

    addMessage("user", userMsg);

    try {
      if (conversationStep) {
        switch (conversationStep) {
          // --- Crear Nota
          case "nota_titulo":
            setTempData({ title: userMsg });
            addMessage("milo", "Perfecto. ¿Qué contenido querés guardar?");
            setConversationStep("nota_contenido");
            break;

          case "nota_contenido": {
            const { title: nTitle } = tempData;
            const newNote = await createNote({
              title: nTitle,
              content: userMsg,
            });
            addMessage(
              "milo",
              newNote
                ? `✅ Nota **"${nTitle}"** creada exitosamente.`
                : "❌ No se pudo guardar la nota.",
              false,
              newNote
                ? { label: "Ir a mis notas", route: "/panel/notas" }
                : null
            );
            resetFlow();
            break;
          }

          // --- Crear Tarea
          case "tarea_titulo":
            setTempData({ title: userMsg });
            addMessage(
              "milo",
              "¿Querés agregar una descripción? ('no' para omitir)"
            );
            setConversationStep("tarea_descripcion");
            break;

          case "tarea_descripcion": {
            const lowerMsg = userMsg.toLowerCase();
            const description = lowerMsg === "no" ? "" : userMsg;
            const { title: tTitle } = tempData;
            const newTask = await createTask({ title: tTitle, description });

            addMessage(
              "milo",
              newTask
                ? `✅ Tarea **"${tTitle}"** creada exitosamente.`
                : "❌ No se pudo crear la tarea.",
              false,
              newTask
                ? { label: "Ir a mis tareas", route: "/panel/tareas" }
                : null
            );
            resetFlow();
            break;
          }

          // --- Crear Evento
          case "evento_titulo":
            setTempData({ title: userMsg });
            addMessage("milo", "📅 Perfecto. ¿Cuándo querés agendarlo?");
            setConversationStep("evento_fecha");
            break;

          case "evento_fecha": {
            const { title: eTitle } = tempData;
            const eTime = userMsg;

            try {
              console.log("🧭 Intentando crear evento:", { eTitle, eTime });

              await createCalendarEventFromChat({
                title: eTitle,
                time: eTime,
                description: "",
              });

              addMessage(
                "milo",
                `📆 Evento **"${eTitle}"** agendado para *${eTime}*.`,
                false,
                { label: "Ir a mi calendario", route: "/panel/calendario" }
              );
            } catch (error) {
              console.error("Error al crear evento desde flujo:", error);
              addMessage(
                "milo",
                `❌ No pude agendar el evento: ${error.message}. Intenta ser más específico con la fecha.`
              );
            }

            resetFlow();
            break;
          }

          default:
            resetFlow();
            break;
        }

        setIsLoading(false);
        return;
      }

      // --- Acciones directas (clima, noticias, etc.)
      const handledByKeywords = await handleDirectActions(userMsg);
      if (handledByKeywords) {
        setIsLoading(false);
        return;
      }

      const historyToSend = messages.slice(-9).map((msg) => ({
        sender: msg.sender,
        text: typeof msg.text === "string" ? msg.text : msg.text?.reply || "",
      }));

      const response = await askGemini(userMsg, historyToSend);

      if (typeof response === "object") {
        // --- Evento ---
        if (response.action === "create_event") {
          const naturalTime =
            response.time ||
            response.date ||
            response.datetime ||
            response.when ||
            "";

          if (!naturalTime.trim()) {
            addMessage(
              "milo",
              "⚠️ No entendí la fecha u hora. Decime algo como 'mañana a las 19' o '20 de noviembre a las 13 hs'."
            );
            resetFlow();
            setIsLoading(false);
            return;
          }

          console.log("📤 Enviando evento a backend:", {
            summary: response.title,
            natural_time: naturalTime,
            description: response.description || "",
          });

          try {
            await createCalendarEventFromChat({
              title: response.title,
              time: naturalTime,
              description: response.description || "",
            });

            addMessage(
              "milo",
              response.reply || "✅ Evento creado con éxito.",
              false,
              {
                label: "Ir a mi calendario",
                route: "/panel/calendario",
              }
            );
          } catch (error) {
            console.error("Error al crear evento desde chat:", error);
            addMessage(
              "milo",
              `❌ No pude agendar el evento: ${error.message}.`
            );
          }

          resetFlow();
        }
        // --- Nota ---
        else if (response.action === "create_note") {
          if (response.title && response.content && response.reply) {
            const newNote = await createNote({
              title: response.title,
              content: response.content,
            });
            addMessage(
              "milo",
              response.reply,
              false,
              newNote
                ? { label: "Ir a mis notas", route: "/panel/notas" }
                : null
            );
          } else {
            addMessage("milo", "📝 Claro, ¿cómo se va a llamar la nota?");
            setConversationStep("nota_titulo");
          }
        }
        // --- Tarea ---
        else if (response.action === "create_task") {
          if (response.title && response.reply) {
            const newTask = await createTask({
              title: response.title,
              description: response.description || "",
            });
            addMessage(
              "milo",
              response.reply,
              false,
              newTask
                ? { label: "Ir a mis tareas", route: "/panel/tareas" }
                : null
            );
          } else {
            addMessage("milo", "🗒️ Perfecto. ¿Cuál es el título de tu tarea?");
            setConversationStep("tarea_titulo");
          }
        } else {
          let replyText = "⚠️ No entendí lo que quisiste hacer.";

          if (typeof response.reply === "string" && response.reply.trim()) {
            replyText = response.reply.trim();
          } else if (
            typeof response.message === "string" &&
            response.message.trim()
          ) {
            replyText = response.message.trim();
          } else if (typeof response === "string" && response.trim()) {
            replyText = response.trim();
          } else {
            console.error("⚠️ Respuesta sin formato válido:", response);
            replyText =
              "⚠️ Recibí una respuesta en formato incorrecto. Por favor, intentá nuevamente.";
          }

          addMessage("milo", replyText);
        }
      } else if (typeof response === "string") {
        addMessage("milo", response);
      } else {
        console.error("Respuesta inesperada de Gemini:", response);
        addMessage(
          "milo",
          "⚠️ Recibí una respuesta inesperada. Intentá reformular tu pregunta."
        );
      }
    } catch (err) {
      console.error("Error en handleSend:", err);
      addMessage(
        "milo",
        "⚠️ Ocurrió un error procesando tu mensaje. Intentá nuevamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (card) => {
    if (setChatActive) setChatActive(true);
    resetFlow();

    const cardMap = {
      clima: "¿Qué clima hace hoy?",
      noticias: "Dime las noticias de hoy",
      tareas: "Quiero crear una tarea",
      nota: "Quiero crear una nota",
      calendario: "Quiero agendar un evento",
    };

    await handleSend(cardMap[card]);
  };

  const handleMinimize = () => {
    if (setChatActive) setChatActive(false);
    setMessages([]);
    resetFlow();
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleSend,
    handleCardClick,
    handleMinimize,
  };
}
