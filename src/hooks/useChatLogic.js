import { useState } from "react";
import { getWeather, getLocalNews, askGemini } from "../services/api";
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
    if (typeof text === "string") safeText = text;
    else if (Array.isArray(text))
      safeText = text
        .map((item) =>
          typeof item === "string" ? item : JSON.stringify(item, null, 2)
        )
        .join("\n");
    else safeText = JSON.stringify(text, null, 2);

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
        "información",
        "actualidad",
        "noticias de hoy",
      ],
      notes: ["nota", "anotar", "apuntar", "guardar nota"],
      reminders: ["recordatorio", "recordarme", "agenda", "alarmar"],
      tasks: ["tarea", "pendiente", "hacer", "to-do"],
    };

    if (keywords.notes.some((w) => lowerMsg.includes(w))) {
      addMessage("milo", "📝 Claro, ¿cómo se va a llamar la nota?");
      setConversationStep("nota_titulo");
      return true;
    }
    if (keywords.reminders.some((w) => lowerMsg.includes(w))) {
      addMessage("milo", "📅 Perfecto, ¿cómo se va a llamar el recordatorio?");
      setConversationStep("recordatorio_titulo");
      return true;
    }
    if (keywords.tasks.some((w) => lowerMsg.includes(w))) {
      addMessage(
        "milo",
        "📝 ¡Perfecto! Comencemos. ¿Cuál es el título de tu tarea?"
      );
      setConversationStep("tarea_titulo");
      return true;
    }
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
          // ---------- NOTAS ----------
          case "nota_titulo":
            setTempData({ title: userMsg });
            addMessage(
              "milo",
              "Perfecto. ¿Qué contenido querés guardar en la nota?"
            );
            setConversationStep("nota_contenido");
            break;

          case "nota_contenido":
            const { title: nTitle } = tempData;
            const newNote = await createNote({
              title: nTitle,
              content: userMsg,
            });
            addMessage(
              "milo",
              newNote
                ? `¡Nota "${nTitle}" creada exitosamente! 📝`
                : "No se pudo guardar la nota.",
              false,
              newNote
                ? { label: "Ir a mis notas", route: "/panel/notas" }
                : null
            );
            resetFlow();
            break;

          // ---------- RECORDATORIOS ----------
          case "recordatorio_titulo":
            setTempData({ title: userMsg });
            addMessage(
              "milo",
              "Genial. ¿Cuándo querés que te lo recuerde? (ej: mañana a las 10)"
            );
            setConversationStep("recordatorio_fecha");
            break;

          case "recordatorio_fecha":
            const { title: rTitle } = tempData;
            const dateText = userMsg;

            // Guarda en localStorage
            const storedReminders = JSON.parse(
              localStorage.getItem("reminders") || "[]"
            );
            const newReminder = {
              id: Date.now(),
              title: rTitle,
              description: "",
              dateText,
            };
            localStorage.setItem(
              "reminders",
              JSON.stringify([...storedReminders, newReminder])
            );

            addMessage(
              "milo",
              `⏰ Recordatorio "${rTitle}" programado para ${dateText}.`,
              false,
              {
                label: "Ir a mis recordatorios",
                route: "/panel/recordatorios",
                state: { newReminder },
              }
            );

            resetFlow();
            break;

          // ---------- TAREAS ----------
          case "tarea_titulo":
            setTempData({ title: userMsg });
            addMessage("milo", "¿Quieres agregar una descripción?");
            setConversationStep("tarea_descripcion");
            break;

          case "tarea_descripcion":
            setTempData((prev) => ({ ...prev, description: userMsg }));
            addMessage(
              "milo",
              "Buenisimo!. La tarea estará disponible sin fecha límite."
            );
            setConversationStep("tarea_prioridad");
            break;

          case "tarea_prioridad":
            const { title: tTitle, description } = tempData;
            const newTask = await createTask({ title: tTitle, description });

            if (newTask) {
              addMessage(
                "milo",
                `✅ Tarea "${tTitle}" creada exitosamente.`,
                false,
                { label: "Ir a mis tareas", route: "/panel/tareas" }
              );
              resetFlow();
            } else {
              addMessage(
                "milo",
                "No se pudo crear la tarea. Intenta nuevamente.",
                "error"
              );
            }
            break;
        }
        setIsLoading(false);
        return;
      }

      const handledByKeywords = await handleDirectActions(userMsg);
      if (handledByKeywords) {
        setIsLoading(false);
        return;
      }

      const historyToSend = [
        ...messages,
        { sender: "user", text: userMsg },
      ].slice(-10);
      const response = await askGemini(userMsg, historyToSend);

      if (response.reply) addMessage("milo", response.reply);
      else
        addMessage("milo", "Lo siento, no pude obtener una respuesta válida.");
    } catch (err) {
      console.error("Error en handleSend:", err);
      addMessage(
        "milo",
        "Lo siento, hubo un problema. Por favor, inténtalo de nuevo."
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
      recordatorio: "Quiero crear un recordatorio",
      tareas: "Necesito organizar mis tareas",
      nota: "Quiero crear una nota",
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
