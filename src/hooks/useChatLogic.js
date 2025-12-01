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
    // Manejo de objetos especiales (clima y noticias)
    if (text && typeof text === "object") {
      if (text.isWeather && text.weatherData) {
        setMessages((prev) => [
          ...prev,
          { sender, text, isHtml, buttons, time: Date.now() },
        ]);
        return;
      }

      if (text.isNews && text.articles !== undefined) {
        setMessages((prev) => [
          ...prev,
          { sender, text, isHtml, buttons, time: Date.now() },
        ]);
        return;
      }
    }

    let safeText = "";

    // Validacion para evitar object
    if (typeof text === "string") {
      safeText = text.trim();
    } else if (text && typeof text === "object") {
      if (text.reply && typeof text.reply === "string") {
        safeText = text.reply.trim();
      } else if (text.message && typeof text.message === "string") {
        safeText = text.message.trim();
      } else if (text.text && typeof text.text === "string") {
        safeText = text.text.trim();
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
      // Intentar extraer ubicación específica de la consulta
      // Solo si se usa "en" o "de" seguido de una palabra que NO sea temporal
      const temporalWords = [
        "hoy",
        "mañana",
        "ayer",
        "ahora",
        "tarde",
        "noche",
        "día",
      ];
      const stopWords = [
        "que",
        "como",
        "esta",
        "está",
        "hace",
        "clima",
        "tiempo",
        "el",
        "la",
      ];

      const locationPatterns = [
        /(?:clima|tiempo)\s+(?:en|de)\s+([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+)?)/i,
        /(?:en|de)\s+([a-záéíóúñü]+(?:\s+[a-záéíóúñü]+)?)\s+(?:que|como|qué|cómo)/i,
      ];

      let location = null;
      for (const pattern of locationPatterns) {
        const match = userMsg.match(pattern);
        if (match && match[1]) {
          let candidate = match[1].trim();

          // Limpiar palabras de parada al final
          stopWords.forEach((word) => {
            const regex = new RegExp(`\\s+${word}$`, "i");
            candidate = candidate.replace(regex, "");
          });

          const candidateLower = candidate.toLowerCase();

          // Solo aceptar si NO es una palabra temporal y tiene contenido válido
          if (!temporalWords.includes(candidateLower) && candidate.length > 2) {
            location = candidate;
            break;
          }
        }
      }

      const weatherReply = await getWeather(location);
      if (weatherReply.isWeather && weatherReply.weatherData) {
        addMessage("milo", weatherReply);
      } else {
        addMessage("milo", weatherReply.text || weatherReply, true);
      }
      return true;
    }

    if (keywords.news.some((w) => lowerMsg.includes(w))) {
      const newsReply = await getLocalNews();
      if (newsReply.isNews) {
        addMessage("milo", newsReply);
      } else {
        addMessage("milo", newsReply.text || newsReply, true);
      }
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

            try {
              const newNote = await createNote({
                title: nTitle,
                content: userMsg,
              });

              if (newNote) {
                addMessage(
                  "milo",
                  `✅ Nota **"${nTitle}"** creada exitosamente.`,
                  false,
                  { label: "Ir a mis notas", route: "/panel/notas" }
                );
              } else {
                addMessage("milo", " No se pudo guardar la nota.");
              }
            } catch (error) {
              console.error("Error al crear nota:", error);
              addMessage("milo", " Ocurrió un error al crear la nota.");
            }

            resetFlow();
            break;
          }

          // --- Crear Tarea
          case "tarea_titulo":
            setTempData({ title: userMsg });
            addMessage(
              "milo",
              "¿Querés agregar una descripción? (escribí 'no' para omitir)"
            );
            setConversationStep("tarea_descripcion");
            break;

          case "tarea_descripcion": {
            const lowerMsg = userMsg.toLowerCase();
            const description = lowerMsg === "no" ? "" : userMsg;
            const { title: tTitle } = tempData;

            try {
              const newTask = await createTask({ title: tTitle, description });

              if (newTask) {
                addMessage(
                  "milo",
                  `✅ Tarea **"${tTitle}"** creada exitosamente.`,
                  false,
                  { label: "Ir a mis tareas", route: "/panel/tareas" }
                );
              } else {
                addMessage("milo", " No se pudo crear la tarea.");
              }
            } catch (error) {
              console.error("Error al crear tarea:", error);
              addMessage("milo", " Ocurrió un error al crear la tarea.");
            }

            resetFlow();
            break;
          }

          // --- Crear Evento
          case "evento_titulo":
            setTempData({ title: userMsg });
            addMessage(
              "milo",
              '📅 Perfecto. ¿Cuándo querés agendarlo?\n\nPodés decir cosas como:\n• "mañana a las 15"\n• "el viernes 6 a las 18hs"\n• "el jueves a las 7 de la tarde"\n• "el 10 de diciembre a las 9:30"'
            );
            setConversationStep("evento_fecha");
            break;

          case "evento_fecha": {
            const { title: eTitle } = tempData;
            const eTime = userMsg;

            try {
              await createCalendarEventFromChat({
                title: eTitle,
                time: eTime,
                description: "",
              });

              addMessage(
                "milo",
                `📆 Evento **"${eTitle}"** agendado exitosamente.`,
                false,
                { label: "Ir a mi calendario", route: "/panel/calendario" }
              );
              resetFlow();
            } catch (error) {
              console.error("Error al crear evento desde flujo:", error);

              addMessage(
                "milo",
                ` No pude entender esa fecha/hora.\n\n¿Podrías intentar de nuevo con más detalles?\n\nEjemplos:\n• \"mañana a las 15\"\n• \"el viernes 6 a las 18hs\"\n• \"el jueves a las 7 de la tarde\"\n• \"el 10 de diciembre a las 9\"\n\nO escribí \"cancelar\" para salir.`
              );
            }
            break;
          }

          case "evento_fecha_retry":
            if (userMsg.toLowerCase() === "cancelar") {
              addMessage(
                "milo",
                "Evento cancelado. ¿En qué más puedo ayudarte?"
              );
              resetFlow();
            } else {
              setConversationStep("evento_fecha");
            }
            break;

          default:
            resetFlow();
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

      const historyToSend = messages.slice(-9).map((msg) => ({
        sender: msg.sender,
        text: typeof msg.text === "string" ? msg.text : msg.text?.reply || "",
      }));

      const response = await askGemini(userMsg, historyToSend);

      if (!response || typeof response !== "object") {
        console.error("⚠️ Respuesta inválida recibida:", response);
        addMessage(
          "milo",
          "⚠️ Recibí una respuesta en formato incorrecto. Por favor, intentá nuevamente."
        );
        setIsLoading(false);
        return;
      }

      if (typeof response === "object") {
        if (response.action === "ask_event_details") {
          addMessage(
            "milo",
            response.reply || "📅 Perfecto, ¿cómo se va a llamar el evento?"
          );
          setConversationStep("evento_titulo");
        } else if (response.action === "get_weather_location") {
          try {
            const weatherReply = await getWeather(response.location);
            if (weatherReply.isWeather && weatherReply.weatherData) {
              addMessage("milo", weatherReply);
            } else {
              addMessage("milo", weatherReply.text || weatherReply, true);
            }
          } catch (error) {
            console.error("Error al obtener clima:", error);
            addMessage(
              "milo",
              `No pude obtener el clima de ${response.location} 😥`
            );
          }
        } else if (response.action === "get_weather") {
          try {
            const weatherReply = await getWeather();
            if (weatherReply.isWeather && weatherReply.weatherData) {
              addMessage("milo", weatherReply);
            } else {
              addMessage("milo", weatherReply.text || weatherReply, true);
            }
          } catch (error) {
            console.error("Error al obtener clima:", error);
            addMessage("milo", "No pude obtener el clima ");
          }
        } else if (response.action === "create_event") {
          const naturalTime =
            response.time ||
            response.date ||
            response.datetime ||
            response.when ||
            "";

          if (!naturalTime.trim()) {
            addMessage(
              "milo",
              " No entendí la fecha u hora. Decime algo como 'mañana a las 19' o '20 de noviembre a las 13 hs'. ¿Querés intentar de nuevo?"
            );

            setTempData({ title: response.title });
            setConversationStep("evento_fecha");
            setIsLoading(false);
            return;
          }

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
          const hasRealData =
            response.title &&
            response.content &&
            response.title.toLowerCase() !== "nueva nota" &&
            response.title.toLowerCase() !== "nota" &&
            !response.reply.includes("se va a llamar") &&
            !response.reply.includes("título");

          if (hasRealData) {
            try {
              const newNote = await createNote({
                title: response.title,
                content: response.content,
              });

              if (newNote) {
                addMessage("milo", response.reply, false, {
                  label: "Ir a mis notas",
                  route: "/panel/notas",
                });
              } else {
                addMessage("milo", "❌ No se pudo guardar la nota.");
              }
            } catch (error) {
              console.error(
                "Error al crear nota desde respuesta directa:",
                error
              );
              addMessage("milo", "❌ Ocurrió un error al crear la nota.");
            }
          } else {
            addMessage(
              "milo",
              response.reply || "📝 Claro, ¿cómo se va a llamar la nota?"
            );
            setConversationStep("nota_titulo");
          }
        }
        // --- Tarea ---
        else if (response.action === "create_task") {
          const hasRealData =
            response.title &&
            response.title.toLowerCase() !== "nueva tarea" &&
            !response.reply.includes("gustaría crear") &&
            !response.reply.includes("título") &&
            !response.reply.includes("necesitas que te recuerde");

          if (hasRealData) {
            try {
              const newTask = await createTask({
                title: response.title,
                description: response.description || "",
              });

              if (newTask) {
                addMessage("milo", response.reply, false, {
                  label: "Ir a mis tareas",
                  route: "/panel/tareas",
                });
              } else {
                addMessage("milo", "❌ No se pudo crear la tarea.");
              }
            } catch (error) {
              console.error(
                "Error al crear tarea desde respuesta directa:",
                error
              );
              addMessage("milo", "❌ Ocurrió un error al crear la tarea.");
            }
          } else {
            addMessage(
              "milo",
              response.reply ||
                "¡Perfecto! Crear una tarea es mi especialidad. ¿Qué necesitas que te recuerde hacer?"
            );
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
            console.error(" Respuesta sin formato válido:", response);
            replyText =
              " Recibí una respuesta en formato incorrecto. Por favor, intentá nuevamente.";
          }

          addMessage("milo", replyText);
        }
      } else if (typeof response === "string") {
        addMessage("milo", response);
      } else {
        console.error("Respuesta inesperada de Gemini:", response);
        addMessage(
          "milo",
          " Recibí una respuesta inesperada. Intentá reformular tu pregunta."
        );
      }
    } catch (err) {
      console.error("Error en handleSend:", err);
      addMessage(
        "milo",
        " Ocurrió un error procesando tu mensaje. Intentá nuevamente."
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
