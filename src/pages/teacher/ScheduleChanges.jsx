import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, ChevronDown, CheckCircle, X } from "lucide-react";
import "./ScheduleChanges.css";

const ScheduleChanges = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    const [schedule, setSchedule] = useState([]);
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [loading, setLoading] = useState(true);
    const [activeActionId, setActiveActionId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalDetails, setModalDetails] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [tempDate, setTempDate] = useState(todayStr);
    const [activeItem, setActiveItem] = useState(null);
    const [operationType, setOperationType] = useState("");

    const teacherId = localStorage.getItem("userId");
    const teacherName = localStorage.getItem("userName");

    useEffect(() => {
        fetchSchedule();
    }, [selectedDate]);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `http://localhost:8000/teacher/schedule-status/${teacherId}?selected_date=${selectedDate}`
            );
            setSchedule(response.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleActionMenu = (id) => {
        setActiveActionId(activeActionId === id ? null : id);
    };

    const openDatePicker = (item, type) => {
        setActiveItem(item);
        setOperationType(type);
        setTempDate(todayStr);
        setShowDatePickerModal(true);
        setActiveActionId(null);
    };

    const handleConfirm = async () => {
        if (!activeItem) return;

        const dateObj = new Date(tempDate);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        const payload = {
            teacherName: teacherName || "Teacher",
            courseName: activeItem["Course Name"],
            discipline: activeItem.Discipline,
            semester: activeItem.Semester,
            section: activeItem.Section,
            old_Day: activeItem.Day,
            old_class_start_time: activeItem.Class_Start_Time,
            old_class_end_time: activeItem.Class_End_Time,
            new_Day: dayName,
            schedule_id: activeItem.Schedule,
            new_date: tempDate
        };

        const endpoint = operationType === "reschedule" 
            ? "http://localhost:8000/teacher/RescheduleClass" 
            : "http://localhost:8000/teacher/prescheduleClass";

        try {
            setShowDatePickerModal(false);
            setLoading(true);
            const response = await axios.post(endpoint, payload);
            if (response.data.status === "Success") {
                setModalDetails(response.data.details);
                setModalMessage(response.data.message);
                setShowSuccessModal(true);
                fetchSchedule();
            }
        } catch (error) {
            alert(error.response?.data?.detail || "Operation failed");
        } finally {
            setLoading(false);
            setActiveItem(null);
        }
    };

    const getMaxDate = () => {
        if (operationType === "preschedule" && activeItem) {
            return activeItem.Date || todayStr;
        }
        return "";
    };

    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <h1>Schedule</h1>
                <div className="date-picker-wrapper" onClick={() => openDatePicker(null, "filter")}>
                    <div className="date-info">
                        <span className="day-name">
                            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        <span className="full-date">
                            {new Date(selectedDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                        </span>
                    </div>
                    <div className="calendar-icon-btn">
                        <Calendar size={20} />
                    </div>
                </div>
            </div>

            <div className="schedule-list">
                {loading ? (
                    <div className="loader-box"><div className="spinner"></div></div>
                ) : schedule.length > 0 ? (
                    schedule.map((item) => (
                        <div key={item.Schedule} className={`schedule-card ${item.Status === 'Not Held' ? 'border-red' : 'border-blue'}`}>
                            <div className="card-top">
                                <div className="course-info">
                                    <h3>{item["Course Name"]}</h3>
                                    <p className="class-detail">{`${item.Discipline}-${item.Semester}${item.Section}`}</p>
                                </div>
                                <div className={`status-badge ${item.Status === 'Not Held' ? 'badge-red' : 'badge-blue'}`}>
                                    <span className="dot"></span>
                                    {item.Status}
                                </div>
                            </div>

                            <div className="card-bottom">
                                <div className="time-venue">
                                    <div className="info-row">
                                        <Clock size={16} />
                                        <span>{`${item.Class_Start_Time}-${item.Class_End_Time}`}</span>
                                    </div>
                                    <div className="info-row">
                                        <MapPin size={16} />
                                        <span>{item.Venue}</span>
                                    </div>
                                </div>

                                <div className="action-area">
                                    {item.Status === "Not Held" ? (
                                        <button className="btn-reschedule" onClick={() => openDatePicker(item, "reschedule")}>Reschedule</button>
                                    ) : (
                                        <div className="popover-wrapper">
                                            <button className="btn-action" onClick={(e) => { e.stopPropagation(); toggleActionMenu(item.Schedule); }}>
                                                Action <ChevronDown size={16} />
                                            </button>
                                            {activeActionId === item.Schedule && (
                                                <div className="action-menu">
                                                    <button onClick={() => console.log("Swap")}>Swap Class</button>
                                                    <button onClick={() => openDatePicker(item, "preschedule")}>Pre-Schedule Class</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No classes scheduled for this day.</div>
                )}
            </div>

            {showDatePickerModal && (
                <div className="modal-overlay">
                    <div className="date-picker-modal">
                        <div className="modal-header-simple">
                            <h3>Select Date</h3>
                            <button onClick={() => setShowDatePickerModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body-simple">
                            <input 
                                type="date" 
                                min={todayStr}
                                max={getMaxDate()}
                                value={activeItem ? tempDate : selectedDate}
                                onChange={(e) => activeItem ? setTempDate(e.target.value) : setSelectedDate(e.target.value)}
                                className="styled-date-input"
                            />
                        </div>
                        <div className="modal-footer-simple">
                            {activeItem ? (
                                <button className="confirm-btn" onClick={handleConfirm}>
                                    Confirm {operationType === "reschedule" ? "Reschedule" : "Pre-Schedule"}
                                </button>
                            ) : (
                                <button className="confirm-btn" onClick={() => setShowDatePickerModal(false)}>Apply Filter</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && modalDetails && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <div className="success-header">
                            <div className="success-icon-circle"><CheckCircle size={32} color="white" /></div>
                            <h2>Success</h2>
                        </div>
                        <p className="success-msg">{modalMessage}</p>
                        <div className="success-details">
                            <div className="detail-item"><MapPin size={18} color="#ff4d4d" /><span>New Venue: {modalDetails.new_venue}</span></div>
                            <div className="detail-item"><Calendar size={18} color="#ff4d4d" /><span>Date: {modalDetails.date}</span></div>
                            <div className="detail-item"><Clock size={18} color="#ff4d4d" /><span>Time: {modalDetails.start_time} - {modalDetails.end_time}</span></div>
                            <div className="detail-item"><Calendar size={18} color="#ff4d4d" /><span>Day: {modalDetails.day}</span></div>
                        </div>
                        <button className="modal-ok-btn" onClick={() => setShowSuccessModal(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleChanges;