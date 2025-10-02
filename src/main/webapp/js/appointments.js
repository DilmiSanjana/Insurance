const API_URL = "http://localhost:8081/api/appointments";
let appointments = [];
let editingId = null;

// Generate time slots from 9 AM to 5 PM
const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

// Strict validation patterns and helpers
const patterns = {
  patientName: /^[A-Za-z][A-Za-z\s'.-]{1,49}$/,
  contactNumber: /^\+?\d{10,15}$/,
  email: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
  date: /^\d{4}-\d{2}-\d{2}$/,
  time: /^(?:[01]\d|2[0-3]):[0-5]\d$/,
};

const allowedDoctors = [
  "Dr. Smith",
  "Dr. Johnson",
  "Dr. Williams",
  "Dr. Brown",
  "Dr. Davis",
];

function isTodayOrFuture(dateStr) {
  if (!patterns.date.test(dateStr)) return false;
  const input = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return input >= today;
}

function validateAppointment(data) {
  if (!patterns.patientName.test(data.patientName)) {
    showToast(
      "Invalid patient name. Use letters/spaces .'- (2–50 chars).",
      "error"
    );
    return false;
  }
  if (!patterns.contactNumber.test(data.contactNumber)) {
    showToast(
      "Invalid contact number. Use 10–15 digits, optional leading +.",
      "error"
    );
    return false;
  }
  if (!patterns.email.test(data.email)) {
    showToast("Invalid email format.", "error");
    return false;
  }
  if (!patterns.date.test(data.date) || !isTodayOrFuture(data.date)) {
    showToast("Invalid date. Use YYYY-MM-DD and not in the past.", "error");
    return false;
  }
  if (!patterns.time.test(data.time)) {
    showToast("Invalid time format. Use HH:MM (24h).", "error");
    return false;
  }
  if (!allowedDoctors.includes(data.doctorName)) {
    showToast("Invalid doctor selection.", "error");
    return false;
  }
  if (!timeSlots.includes(data.time)) {
    showToast("Selected time is not an available slot.", "error");
    return false;
  }
  const normalizeTime = t => t.slice(0, 5);
  // Prevent same doctor from having two appointments at the same time
  const conflict = appointments.some(apt =>
    apt.doctorName === data.doctorName &&
    apt.date.split('T')[0] === data.date.split('T')[0] &&
    normalizeTime(apt.time) === normalizeTime(data.time) &&
    apt.id !== editingId
);

  console.log("Conflict found?", conflict);

  if (conflict) {
    showToast("This doctor already has an appointment at this time.", "error");
    return false;
  }
  return true;
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadAppointments();
  generateTimeSlots();

  const today = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("min", today);

  document
    .getElementById("searchInput")
    .addEventListener("input", filterAppointments);
  document
    .getElementById("appointmentForm")
    .addEventListener("submit", handleSubmit);
});

function generateTimeSlots() {
  const container = document.getElementById("timeSlots");
  container.innerHTML = timeSlots
    .map(
      (time) => `
        <div class="time-slot border-2 border-gray-300 rounded-lg p-3 text-center hover:border-blue-500" 
             data-time="${time}" onclick="selectTimeSlot('${time}')">
            <i class="fas fa-clock text-blue-600"></i>
            <div class="font-semibold">${formatTime(time)}</div>
        </div>
    `
    )
    .join("");
}

function formatTime(time) {
  const [hours, minutes] = time.split(":");
  const hour = parseInt(hours);
  const period = hour >= 12 ? "PM" : "AM";
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${minutes} ${period}`;
}

function selectTimeSlot(time) {
  const slot = document.querySelector(`[data-time="${time}"]`);
  if (slot.classList.contains("occupied")) {
    showToast(
      "This time slot is already booked for the selected doctor",
      "error"
    );
    return;
  }

  document
    .querySelectorAll(".time-slot")
    .forEach((s) => s.classList.remove("selected"));
  slot.classList.add("selected");
  document.getElementById("time").value = time;
}

function checkTimeSlots() {
  const date = document.getElementById("date").value;
  const doctor = document.getElementById("doctorName").value;

  if (!date || !doctor) {
    document.querySelectorAll(".time-slot").forEach((s) => {
      s.classList.remove("occupied", "selected");
    });
    return;
  }

  const occupiedSlots = appointments
    .filter(
      (apt) =>
        apt.date === date && apt.doctorName === doctor && apt.id !== editingId
    )
    .map((apt) => apt.time);

  document.querySelectorAll(".time-slot").forEach((slot) => {
    const time = slot.getAttribute("data-time");
    if (occupiedSlots.includes(time)) {
      slot.classList.add("occupied");
      slot.classList.remove("selected");
    } else {
      slot.classList.remove("occupied");
    }
  });
}

async function loadAppointments() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (result.success) {
      appointments = result.data;
      displayAppointments(appointments);
    } else {
      showToast(result.message, "error");
    }
  } catch (error) {
    showToast("Failed to load appointments", "error");
    console.error(error);
  }
}

function displayAppointments(data) {
  const container = document.getElementById("appointmentsList");

  if (data.length === 0) {
    container.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-calendar-times text-6xl mb-4"></i>
                <p class="text-xl">No appointments found</p>
            </div>
        `;
    return;
  }

  container.innerHTML = data
    .map(
      (apt) => `
        <div class="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-xl font-bold text-gray-800">
                            <i class="fas fa-user-circle text-blue-600"></i> ${
                              apt.patientName
                            }
                        </h3>
                        <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                            <i class="fas fa-user-md"></i> ${apt.doctorName}
                        </span>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-gray-600">
                        <div><i class="fas fa-phone text-green-600"></i> ${
                          apt.contactNumber
                        }</div>
                        <div><i class="fas fa-envelope text-red-600"></i> ${
                          apt.email
                        }</div>
                        <div><i class="fas fa-calendar text-purple-600"></i> ${formatDate(
                          apt.date
                        )}</div>
                    </div>
                    <div class="mt-2">
                        <span class="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                            <i class="fas fa-clock"></i> ${formatTime(apt.time)}
                        </span>
                    </div>
                </div>
                <div class="flex gap-2">
                    <button onclick="editAppointment(${apt.id})" 
                        class="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button onclick="deleteAppointment(${apt.id})" 
                        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function filterAppointments() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const filtered = appointments.filter(
    (apt) =>
      apt.patientName.toLowerCase().includes(search) ||
      apt.doctorName.toLowerCase().includes(search) ||
      apt.email.toLowerCase().includes(search)
  );
  displayAppointments(filtered);
}

function openCreateModal() {
  editingId = null;
  document.getElementById("modalTitle").textContent = "New Appointment";
  document.getElementById("appointmentForm").reset();
  document.getElementById("appointmentId").value = "";
  generateTimeSlots();
  document.getElementById("appointmentModal").classList.add("active");
}

function closeModal() {
  document.getElementById("appointmentModal").classList.remove("active");
  editingId = null;
}

async function editAppointment(id) {
  const apt = appointments.find((a) => a.id === id);
  if (!apt) return;

  editingId = id;
  document.getElementById("modalTitle").textContent = "Edit Appointment";
  document.getElementById("appointmentId").value = apt.id;
  document.getElementById("patientName").value = apt.patientName;
  document.getElementById("contactNumber").value = apt.contactNumber;
  document.getElementById("email").value = apt.email;
  document.getElementById("date").value = apt.date;
  document.getElementById("doctorName").value = apt.doctorName;
  document.getElementById("time").value = apt.time;

  generateTimeSlots();
  checkTimeSlots();

  setTimeout(() => {
    const slot = document.querySelector(`[data-time="${apt.time}"]`);
    if (slot) slot.classList.add("selected");
  }, 100);

  document.getElementById("appointmentModal").classList.add("active");
}

async function handleSubmit(e) {
  e.preventDefault();

  const id = document.getElementById("appointmentId").value;
  const data = {
    patientName: document.getElementById("patientName").value,
    contactNumber: document.getElementById("contactNumber").value,
    email: document.getElementById("email").value,
    date: document.getElementById("date").value,
    time: document.getElementById("time").value,
    doctorName: document.getElementById("doctorName").value,
  };

  if (!validateAppointment(data)) return;

  try {
    const url = id ? `${API_URL}/${id}` : API_URL;
    const method = id ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (result.success) {
      showToast(result.message, "success");
      closeModal();
      loadAppointments();
    } else {
      showToast(result.message, "error");
    }
  } catch (error) {
    showToast("Operation failed", "error");
    console.error(error);
  }
}

async function deleteAppointment(id) {
  if (!confirm("Are you sure you want to delete this appointment?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    const result = await response.json();

    if (result.success) {
      showToast(result.message, "success");
      loadAppointments();
    } else {
      showToast(result.message, "error");
    }
  } catch (error) {
    showToast("Delete failed", "error");
    console.error(error);
  }
}

function showToast(message, type) {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fas fa-${
    type === "success"
      ? "check-circle"
      : type === "error"
      ? "exclamation-circle"
      : "info-circle"
  }"></i> ${message}`;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}
