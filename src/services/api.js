import { API_URL } from "../utils/config";

export async function askGemini(message, chatHistory = []) {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = new Date().toLocaleString("es-AR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });

  try {
    const res = await fetch(`${API_URL}/gemini`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
      body: JSON.stringify({
        message,
        history: chatHistory,
        timezone,
        localTime,
      }),
    });

    if (!res.ok) {
      console.error("Error en la respuesta del servidor:", res.status);
      return {
        action: "general_response",
        reply: "❌ Error al comunicar con Milo. Por favor, intenta de nuevo.",
      };
    }

    const data = await res.json();

    // Verificar que data es un objeto válido
    if (!data || typeof data !== "object") {
      console.error("⚠️ Respuesta inválida:", data);
      return {
        action: "general_response",
        reply: "⚠️ Recibí una respuesta sin formato válido.",
      };
    }
    if (data.action) {
      return data;
    }
    if (data.reply) {
      return {
        action: "general_response",
        reply:
          typeof data.reply === "string" && data.reply.trim()
            ? data.reply.trim()
            : "⚠️ No pude interpretar la respuesta del asistente.",
      };
    }

    // Si es un string directamente
    if (typeof data === "string" && data.trim()) {
      return {
        action: "general_response",
        reply: data.trim(),
      };
    }

    // Fallback para otras respuestas
    console.warn("⚠️ Respuesta sin formato reconocido:", data);
    return {
      action: "general_response",
      reply: "⚠️ No pude interpretar la respuesta.",
    };
  } catch (err) {
    console.error("❌ Error en askGemini:", err);
    return {
      action: "general_response",
      reply: "❌ Error al comunicar con Milo. Verifica tu conexión.",
    };
  }
}

// Google Calendar
export function connectGoogleCalendar() {
  window.location.href = `${API_URL}/google/connect`;
}

export async function getCalendarEvents() {
  const token = localStorage.getItem("token");
  if (!token)
    throw new Error("Necesitas iniciar sesión para ver el calendario.");

  try {
    const res = await fetch(`${API_URL}/google/events`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await res.json();

    if (!res.ok)
      throw new Error(
        data.message ||
          "Error al obtener eventos. Por favor, reconecta tu cuenta de Google."
      );

    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

//  CREAR EVENTO DESDE EL CHAT
export async function createCalendarEventFromChat({
  title,
  time,
  description = "",
}) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Necesitas iniciar sesión para agendar eventos.");

  const chatEventData = {
    summary: title,
    description: description,
    natural_time: time,
  };

  try {
    const res = await fetch(`${API_URL}/google/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(chatEventData),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(
        data.message ||
          "Error al intentar agendar. Verifica tu conexión con Google."
      );
    }
    return data;
  } catch (err) {
    console.error("Error en createCalendarEventFromChat:", err);

    // Proporcionar mensajes de error más útiles
    if (err.message.includes("No pude entender la fecha")) {
      throw new Error(
        "No pude interpretar esa fecha. Intenta con más detalles como día y hora."
      );
    } else if (
      err.message.includes("no está conectada") ||
      err.message.includes("conecta tu cuenta")
    ) {
      throw new Error(
        "Tu cuenta de Google Calendar no está conectada. Ve a tu perfil para conectarla."
      );
    } else if (
      err.message.includes("conexión") ||
      err.message.includes("Google")
    ) {
      throw new Error(
        "Problema de conexión con Google Calendar. Verifica tu cuenta."
      );
    } else {
      throw new Error(err.message || "Error al crear el evento");
    }
  }
}

// Autenticación y Perfil
export async function getProfile() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      localStorage.removeItem("token");
      return null;
    }
    return res.json();
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return null;
  }
}

export function loginWithGoogle() {
  window.location.href = `${API_URL}/google/auth`;
}

// Funciones auxiliares (Clima, Noticias, Notas)
export async function getWeather(location = null) {
  const API_KEY = "361221015a8e10e6cd9a6d4725732fe4";
  try {
    let url;

    if (location) {
      // Normalizar el nombre de la ubicación
      const normalizedLocation = location.trim();

      // Intentar primero con el nombre de la ciudad y código de país (Argentina)
      let searchQuery = `${normalizedLocation},AR`;
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
        searchQuery
      )}&appid=${API_KEY}&units=metric&lang=es`;

      let res = await fetch(url);
      let data = await res.json();

      // Si no funciona con AR, intentar sin código de país
      if (!res.ok && data.cod === "404") {
        url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          normalizedLocation
        )}&appid=${API_KEY}&units=metric&lang=es`;
        res = await fetch(url);
        data = await res.json();
      }

      if (!res.ok) throw new Error(data.message || "Ciudad no encontrada");

      const temp = data.main.temp.toFixed(0);
      const feelsLike = data.main.feels_like.toFixed(0);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = (data.wind.speed * 3.6).toFixed(1);

      return {
        isWeather: true,
        weatherData: {
          location: data.name,
          temperature: temp,
          feelsLike: feelsLike,
          description: description,
          humidity: humidity,
          windSpeed: windSpeed,
          icon: data.weather[0].icon,
        },
        text: `🌤️ En ${data.name}: ${temp}°C (Sensación: ${feelsLike}°C), ${description}. Humedad: ${humidity}%, Viento: ${windSpeed} km/h.`,
      };
    } else {
      // Si no hay ubicación, usar geolocalización del navegador
      const pos = await new Promise((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject)
      );
      const { latitude: lat, longitude: lon } = pos.coords;
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=es`;

      const res = await fetch(url);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      const temp = data.main.temp.toFixed(0);
      const feelsLike = data.main.feels_like.toFixed(0);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const windSpeed = (data.wind.speed * 3.6).toFixed(1);

      return {
        isWeather: true,
        weatherData: {
          location: data.name,
          temperature: temp,
          feelsLike: feelsLike,
          description: description,
          humidity: humidity,
          windSpeed: windSpeed,
          icon: data.weather[0].icon,
        },
        text: `🌤️ En ${data.name}: ${temp}°C (Sensación: ${feelsLike}°C), ${description}. Humedad: ${humidity}%, Viento: ${windSpeed} km/h.`,
      };
    }
  } catch (err) {
    return {
      isWeather: false,
      text: `No pude obtener el clima${location ? ` de ${location}` : ""} 😥. ${
        err.message === "ciudad no encontrada" ||
        err.message === "city not found"
          ? "Verifica que el nombre de la ciudad esté bien escrito."
          : `Razón: ${err.message}`
      }`,
    };
  }
}

export async function getLocalNews() {
  try {
    const token = localStorage.getItem("token");
    const headers = {
      "Content-Type": "application/json",
    };

    // Agregar token si existe
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${API_URL}/news/local`;
    const res = await fetch(url, { headers });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Error al obtener noticias");
    if (!data.articles?.length) {
      return {
        isNews: true,
        articles: [],
        text: "No encontré noticias 😅.",
      };
    }

    // Devolver objeto con datos estructurados
    return {
      isNews: true,
      articles: data.articles.slice(0, 2),
      text: `📰 Aquí tienes las últimas noticias de hoy`,
    };
  } catch (err) {
    console.error("Error fetching news:", err);
    return {
      isNews: false,
      text: `Error al traer noticias 😥 (${err.message})`,
    };
  }
}

export async function saveNoteFromChat(content) {
  const token = localStorage.getItem("token");
  if (!token)
    return {
      success: false,
      message: "Necesitas iniciar sesión para guardar notas.",
    };

  try {
    const res = await fetch(`${API_URL}/api/notes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ title: "Nota desde Milo", content }),
    });
    const data = await res.json();

    if (res.ok)
      return { success: true, message: "¡Nota guardada correctamente! 📝" };
    else
      return {
        success: false,
        message: data.message || "Error al guardar la nota.",
      };
  } catch (err) {
    console.error(err);
    return { success: false, message: "Error de conexión con el servidor." };
  }
}
